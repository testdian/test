/**
 * @description 过程描述详情抽屉
 */
import { DownOutlined, UpOutlined } from '@ant-design/icons';
import {
  DatePicker,
  Form,
  FormGrid,
  FormItem,
  FormLayout,
  Input,
  Radio,
  Select,
} from '@formily/antd-v5';
import { createForm } from '@formily/core';
import { createSchemaField } from '@formily/react';
import I18N from '@src/lang/I18N';
import { Button, Drawer } from 'antd';
import { useEffect, useMemo, useState } from 'react';

import { IconFont } from '@/components/IconFont';
import { PageTypeInfo } from '@/router/utils/enums';
import { Toast } from '@/utils';
import { useAllEnumsBatch } from '@/views/dashborad/Dicts/hooks';
import { TextArea } from '@/views/eca/component/TextArea';

import { DRAWER_TITLE } from './constant';
import style from './index.module.less';
import { processSchema, otherSchema } from './schemas';
import { OptionsType } from '../../CarbonFootprintModel/type';
import { useLcaEnums } from '../../hook';

const { show, add } = PageTypeInfo;

const SchemaField = createSchemaField({
  components: {
    Input,
    Select,
    TextArea,
    Radio,
    DatePicker,
    Form,
    FormItem,
    FormGrid,
    FormLayout,
  },
});

interface ProcessDescribeProps<T extends object> {
  /** 生命周期枚举 */
  lifeCycleList?: OptionsType[];
  /** 操作按钮的类型 */
  actionBtnType?: string;
  /** 控制抽屉的显隐 */
  open: boolean;
  /** 过程描述详情 */
  processDescDataSource?: T & {
    timeRepresentStart?: number;
    timeRepresentEnd?: number;
    areaRepresent?: string;
  };
  /** 过程描述详情 */
  defaultProcessDescData?: T & {
    timeRepresentStart?: number;
    timeRepresentEnd?: number;
    areaRepresent?: string;
  };
  /** 保存方法 */
  onSave: (
    /** 表单要保存的数据 */
    values: T,
    /** 成功回调 */
    successCallBack: () => void,
    /** 失败回调 */
    failCallBack: () => void,
  ) => void;
  /** 关闭抽屉的方法 */
  onClose: () => void;
}

const ProcessDescribeDrawer = <T extends object = any>({
  lifeCycleList,
  actionBtnType,
  open,
  processDescDataSource,
  defaultProcessDescData,
  onSave,
  onClose,
}: ProcessDescribeProps<T>) => {
  /** 是否是详情 */
  const isDetail = actionBtnType === show;

  /** 是否是新增 */
  const isAdd = actionBtnType === add;

  /** 展开/收起其他非必填项 */
  const [expandOther, setExpandOther] = useState(false);

  /** 抽屉标题 */
  const title = DRAWER_TITLE[actionBtnType as keyof typeof DRAWER_TITLE];

  /** 地理代表性枚举 */
  const areaRepresentOptions = useAllEnumsBatch('productOrigin')?.productOrigin;

  /** 多输出分配方式 */
  const multiOutputTypeOptions = useLcaEnums('MultiOutputType');

  /** 数据类型 */
  const processDataTypeOptions = useLcaEnums('ProcessDataType');

  /** 保存按钮的loading */
  const [btnLoading, setBtnLoading] = useState(false);

  const form = useMemo(
    () =>
      createForm({
        readPretty: isDetail,
      }),
    [isDetail],
  );

  useEffect(() => {
    /** 0724新增逻辑 新增过程变更位置 并携带默认阶段 */
    if (isAdd) {
      form.setValues(defaultProcessDescData || {});
    }
  }, [actionBtnType, defaultProcessDescData]);

  /** 详情展示 */
  useEffect(() => {
    if (!actionBtnType || !processDescDataSource || isAdd) {
      return;
    }
    const { timeRepresentStart, timeRepresentEnd, areaRepresent } =
      processDescDataSource;
    form.setValues({
      ...processDescDataSource,
      timeRepresentStart: timeRepresentStart || undefined,
      timeRepresentEnd: timeRepresentEnd || undefined,
      areaRepresent: areaRepresent || undefined,
    });
    if (isDetail && !timeRepresentStart && !timeRepresentEnd) {
      form.setValuesIn('timeRepresentStart', '-');
    }
  }, [processDescDataSource, actionBtnType]);

  /** 表单枚举 */
  useEffect(() => {
    if (!actionBtnType) {
      return;
    }

    if (lifeCycleList) {
      /** 生命周期阶段 */
      form.setFieldState('lifeCycleId', {
        dataSource: lifeCycleList,
      });
    }

    /** 地理代表性 */
    if (areaRepresentOptions) {
      form.setFieldState('areaRepresent', {
        dataSource: areaRepresentOptions.map(item => ({
          label: item.dictLabel,
          value: item.dictValue,
        })),
      });
    }

    /** 多输出分配方式 */
    if (multiOutputTypeOptions) {
      form.setFieldState('multiOutputType', {
        dataSource: multiOutputTypeOptions.map(item => ({
          label: item.name,
          value: item.code,
        })),
      });
    }

    /** 数据类型 */
    if (processDataTypeOptions) {
      form.setFieldState('processDataType', {
        dataSource: processDataTypeOptions.map(item => ({
          label: item.name,
          value: item.code,
        })),
      });
    }
  }, [
    areaRepresentOptions,
    actionBtnType,
    lifeCycleList,
    multiOutputTypeOptions,
    processDataTypeOptions,
  ]);

  /** 抽屉关闭 */
  const onDrawerClose = () => {
    form.reset();
    setExpandOther(false);
    onClose();
  };

  return (
    <Drawer
      rootClassName={`${style.wrapper}`}
      title={title}
      open={open}
      closeIcon={false}
      maskClosable={false}
      destroyOnClose
      placement='right'
      size='large'
      width='55%'
      extra={
        <div className={style.closeIcon} onClick={() => onDrawerClose()}>
          <IconFont icon='icon-icon-guanbi' />
        </div>
      }
      onClose={() => onDrawerClose()}
      footer={[
        <Button onClick={() => onDrawerClose()}>
          {isDetail ? I18N.carbonFootPrintLCA.close : I18N.Factors.cancel}
        </Button>,
        !isDetail && (
          <Button
            type='primary'
            loading={btnLoading}
            onClick={async () => {
              const values = await form.submit<T>();
              setBtnLoading(true);
              onSave(
                values,
                () => {
                  Toast('success', I18N.Factors.saveSuccessful);
                  form.reset();
                  setExpandOther(false);
                  setBtnLoading(false);
                },
                () => {
                  setBtnLoading(false);
                },
              );
            }}
          >
            {I18N.Factors.preserve}
          </Button>
        ),
      ]}
    >
      <Form form={form} previewTextPlaceholder='-'>
        <SchemaField schema={processSchema()} />
        <Button
          className={style.expandBtn}
          type='link'
          onClick={() => {
            setExpandOther(!expandOther);
          }}
        >
          {expandOther ? (
            <div>
              {I18N.carbonFootPrintLCA.putAwayOtherNon}
              <UpOutlined />
            </div>
          ) : (
            <div>
              {I18N.carbonFootPrintLCA.expandOtherNon}
              <DownOutlined />
            </div>
          )}
        </Button>
        <div hidden={!expandOther}>
          <SchemaField schema={otherSchema()} />
        </div>
      </Form>
    </Drawer>
  );
};
export default ProcessDescribeDrawer;
