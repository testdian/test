/**
 * @file 截止时间弹窗
 */
import { ArrayItems, Form, FormItem, Select, Space } from '@formily/antd-v5';
import { createForm } from '@formily/core';
import { createSchemaField } from '@formily/react';
import I18N, { LocaleType } from '@src/lang/I18N';
import { Cascader, Modal } from 'antd';
import dayjs from 'dayjs';
import React, { useContext, useEffect, useMemo, useState } from 'react';

import { LocaleContext } from '@/components/LocaleProvider';
import { CustomTableRender } from '@/components/x-render/TableRender';
import { useTableRef } from '@/components/x-render/TableRender/hook/useTableRef';
import { Toast } from '@/utils';

import { fillDataColumns } from './columns';
import { EXCEED_FLAG } from './constant';
import styles from './index.module.less';
import { searchSchema, schema } from './schemas';
import {
  getDeadlineRemindApi,
  getEmissionSourceListApi,
  setDeadlineRemindApi,
  updateDeadlineApi,
} from './service';
import {
  DeadlineRemindItem,
  DeadlineRemindResponse,
  EmissionSourceListRequest,
  EmissionSourceListResponse,
} from './type';

const SchemaField = createSchemaField({
  components: {
    FormItem,
    Space,
    Select,
    ArrayItems,
  },
});

interface FillingDeadlineModalProps {
  /** 核算id */
  computationId: number;
  /** 组织编码 */
  orgCode: string;
  visible: boolean;
  onClose: () => void;
  onSuccess: () => void;
}

const FillingDeadlineModal: React.FC<FillingDeadlineModalProps> = ({
  computationId,
  orgCode,
  visible,
  onClose,
  onSuccess,
}) => {
  const form = useMemo(
    () =>
      createForm({
        initialValues: {
          fillingReminders: [{ dateValue: undefined, timeValue: undefined }],
          overdueReminders: [{ dateValue: undefined, timeValue: undefined }],
        },
      }),
    [visible],
  );

  /** 当前语言 */
  const { locale } = useContext(LocaleContext);

  /** 是否是英文 */
  const isEn = locale === LocaleType.enUS;

  const { tableRef } = useTableRef();
  const [selectedRowKeys, setSelectedRowKeys] = useState<React.Key[]>([]);

  /** 加载提醒配置数据 */
  useEffect(() => {
    const loadRemindData = async () => {
      if (visible) {
        try {
          const { data } = await getDeadlineRemindApi({
            computationId,
            orgCode,
          });
          const remindList: DeadlineRemindResponse[] = data?.data || [];

          if (remindList.length > 0) {
            // 区分填报提醒和超期提醒
            const fillingReminders = remindList
              .filter(
                (item: DeadlineRemindResponse) =>
                  item.exceedFlag === EXCEED_FLAG.BEFORE,
              )
              .map((item: DeadlineRemindResponse) => ({
                ...item,
                dateValue: item.dateValue,
                timeValue: item.timeValue,
              }));

            const overdueReminders = remindList
              .filter(
                (item: DeadlineRemindResponse) =>
                  item.exceedFlag === EXCEED_FLAG.AFTER,
              )
              .map((item: DeadlineRemindResponse) => ({
                ...item,
                dateValue: item.dateValue,
                timeValue: item.timeValue,
              }));

            // 设置表单值
            form.setValues({
              fillingReminders:
                fillingReminders.length > 0
                  ? fillingReminders
                  : [{ dateValue: undefined, timeValue: undefined }],
              overdueReminders:
                overdueReminders.length > 0
                  ? overdueReminders
                  : [{ dateValue: undefined, timeValue: undefined }],
            });
          }
        } catch (err) {
          // eslint-disable-next-line no-console
          console.error('加载提醒配置失败:', err);
        }
      }
    };

    loadRemindData();
  }, [visible, computationId, orgCode, form]);

  const searchApi = (args: EmissionSourceListRequest) => {
    const dataPeriod = args?.dataPeriod?.[0] || undefined;
    const idx = args?.dataPeriod?.[1] || undefined;

    return getEmissionSourceListApi({
      ...args,
      computationId,
      orgCode,
      dataPeriod,
      idx,
      deadlineFlag: true,
    }).then(({ data }) => {
      return data;
    });
  };

  const handleDateChange = async (
    date: dayjs.Dayjs | null, // 明确允许 date 为 null
    record: EmissionSourceListResponse,
  ) => {
    let deadline: string | null = null;

    // 处理日期选择和清除两种情况
    if (date) {
      // 有日期选择时格式化为字符串
      deadline = date.format('YYYY-MM-DD HH:mm:ss');
    } else {
      // 日期被清除时的处理
      // 方式一：将 deadline 设为 null 传给后端，表示清除截止日期
      deadline = null;

      // 方式二：如果你需要向后端传空字符串而非 null，取消下面的注释
      // deadline = '';

      // 方式三：如果你不希望清除日期，可以添加提示并提前返回
      // message.warning('请选择有效的截止日期');
      // return;
    }
    if (selectedRowKeys.length > 0) {
      // 多条数据修改
      const idList = selectedRowKeys as number[];
      await updateDeadlineApi({
        computationId,
        deadline, // 现在 deadline 可能是 null 或字符串
        idList,
      });
    } else {
      // 单条数据修改
      await updateDeadlineApi({
        computationId,
        deadline,
        idList: [record.id],
      });
    }

    // 刷新表格数据
    tableRef?.current?.doSearch?.({});
    Toast('success', I18N.dashborad.modifiedSuccessfully);
  };

  /** 处理确定按钮，提交提醒设置 */
  const handleOk = async () => {
    try {
      const values = await form.submit<{
        fillingReminders?: {
          dateValue: number;
          timeValue: number;
        }[];
        overdueReminders?: {
          dateValue: number;
          timeValue: number;
        }[];
      }>();

      const { fillingReminders, overdueReminders } = values;

      const remindList: DeadlineRemindItem[] = [];

      // 处理填报提醒（超期前）
      if (fillingReminders && Array.isArray(fillingReminders)) {
        fillingReminders.forEach(
          (item: { dateValue?: number; timeValue?: number }) => {
            if (item.dateValue !== undefined && item.timeValue !== undefined) {
              remindList.push({
                computationId,
                orgCode,
                exceedFlag: EXCEED_FLAG.BEFORE,
                dateValue: item.dateValue,
                timeValue: item.timeValue,
              });
            }
          },
        );
      }

      // 处理超期提醒（超期后）
      if (overdueReminders && Array.isArray(overdueReminders)) {
        overdueReminders.forEach(
          (item: { dateValue?: number; timeValue?: number }) => {
            if (item.dateValue !== undefined && item.timeValue !== undefined) {
              remindList.push({
                computationId,
                orgCode,
                exceedFlag: EXCEED_FLAG.AFTER,
                dateValue: item.dateValue,
                timeValue: item.timeValue,
              });
            }
          },
        );
      }

      if (remindList.length > 0) {
        await setDeadlineRemindApi(remindList);
        Toast('success', I18N.dashborad.modifiedSuccessfully);
      }

      setSelectedRowKeys([]);
      onClose();
      onSuccess();
    } catch (error) {
      // 表单验证失败
      // eslint-disable-next-line no-console
      console.error('表单验证失败:', error);
    }
  };

  return (
    <Modal
      title={I18N.eca.setDeadline}
      open={visible}
      onCancel={() => {
        setSelectedRowKeys([]);
        onClose();
      }}
      onOk={handleOk}
      width='70%'
      centered
      maskClosable={false}
      destroyOnClose
    >
      <div className={styles.tip}>
        如排放源为未填报或填报中状态，将在各排放源截止时间前向填报人发送消息提醒。
      </div>
      <CustomTableRender
        tableRef={tableRef}
        searchProps={{
          schema: searchSchema(),
          api: searchApi,
          searchOnMount: false,
          widgets: {
            cascader: Cascader,
          },
        }}
        tableProps={{
          columns: fillDataColumns(handleDateChange, isEn),
          rowSelection: {
            selectedRowKeys,
            onChange: setSelectedRowKeys,
          },
          pagination: false,
          scroll: { y: 55 * 6 },
          size: 'small',
        }}
      />

      <div className={styles.formWrapper}>
        <h3>设置截止提醒</h3>
        <Form form={form} previewTextPlaceholder='-'>
          <SchemaField schema={schema()} />
        </Form>
      </div>
    </Modal>
  );
};

export default FillingDeadlineModal;
