/*
 * @@description: 核算报告详情
 */
import {
  DatePicker,
  Form,
  FormGrid,
  FormItem,
  FormLayout,
  Input,
  Select,
  TreeSelect,
} from '@formily/antd-v5';
import { createForm, onFieldValueChange } from '@formily/core';
import { createSchemaField } from '@formily/react';
import I18N from '@src/lang/I18N';
import { compact } from 'lodash-es';
import { useEffect, useMemo, useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';

import { FormActions } from '@/components/FormActions';
import { EcaRouteMaps } from '@/router/utils/ecaEmums';
import { PageTypeInfo } from '@/router/utils/enums';
import { getComputationReportId } from '@/sdks/Newcomputation/computationV2ApiDocs';
import { omitInfoFn, Toast } from '@/utils';

import style from './index.module.less';
import {
  addAccountingReportApi,
  editAccountingReportApi,
  getAuditYearListApi,
  getComputationComputationOrgListApi,
} from '../service';
import { schema } from './utils/schemas';

const SchemaField = createSchemaField({
  components: {
    FormItem,
    FormGrid,
    FormLayout,
    DatePicker,
    Input,
    Select,
    TreeSelect,
  },
});
const AccountReportInfo = () => {
  const navigate = useNavigate();

  const { id, pageTypeInfo } = useParams<{
    id: string;
    pageTypeInfo: PageTypeInfo;
  }>();

  const isShow = pageTypeInfo === PageTypeInfo.show;
  const isAdd = pageTypeInfo === PageTypeInfo.add;
  const isEdit = pageTypeInfo === PageTypeInfo.edit;

  const [btnLoading, setBtnLoading] = useState(false);

  const form = useMemo(
    () =>
      createForm({
        readPretty: isShow,
        effects: currentForm => {
          /** 核算组织选择互斥逻辑 - 第一个选项与其他选项互斥 */
          let prevOrgValue: string[] = [];

          onFieldValueChange('orgCodes', field => {
            const currentValue = field.value || [];
            const dataSource = field.dataSource || [];

            // 如果没有数据源或没有选中值，直接返回
            if (dataSource.length === 0 || currentValue.length === 0) {
              prevOrgValue = currentValue;
              return;
            }

            // 第一个选项的值（代表全部）
            const firstOptionValue = dataSource[0]?.value;

            // 如果只有一个值，不需要处理
            if (currentValue.length === 1) {
              prevOrgValue = currentValue;
              return;
            }

            // 判断是否包含第一个选项
            const hasFirstOption = currentValue.includes(firstOptionValue);
            const hadFirstOption = prevOrgValue.includes(firstOptionValue);

            if (hasFirstOption) {
              // 如果包含第一个选项且还有其他选项
              if (!hadFirstOption) {
                // 刚刚选中第一个选项，清空其他选项，只保留第一个
                field.setValue([firstOptionValue]);
                prevOrgValue = [firstOptionValue];
              } else {
                // 之前就有第一个选项，现在又选了其他的，移除第一个选项
                const otherValues = currentValue.filter(
                  (val: string) => val !== firstOptionValue,
                );
                field.setValue(otherValues);
                prevOrgValue = otherValues;
              }
            } else {
              // 没有第一个选项，正常更新
              prevOrgValue = currentValue;
            }
          });

          onFieldValueChange('year', field => {
            const { selfModified } = field;
            if (selfModified) {
              // 切换核算年度时，清空核算组织的值
              currentForm.setValuesIn('orgCodes', []);
            }
          });
        },
      }),
    [],
  );

  /** 根据选中的核算年度设置核算组织数据源 */
  const useAsyncOrgDataSource = () => async (field: any) => {
    /** 当前选中的核算年度 */
    const currentYear = field?.form?.getValuesIn('year');

    if (!currentYear) {
      field.setDataSource([]);
      // 清空核算组织的值
      field.setValue([]);
      return;
    }

    /** 查询对应的组织树数据 */
    const { data } = await getComputationComputationOrgListApi({
      year: currentYear,
    });

    const orgList = data?.data?.map(item => {
      return {
        label: item?.orgName,
        value: item?.orgCode,
      };
    });

    const dataSource = orgList;

    field.setDataSource(dataSource);
  };

  /** 设置核算年度数据 */
  const [yearArr, setYearArr] = useState<{ year: number; id: number }[]>([]);

  /** 获取核算年度下拉框数据 */
  const getAccountYearList = async () => {
    const { data } = await getAuditYearListApi();
    setYearArr(data?.data);
  };

  useEffect(() => {
    form.setFieldState('year', {
      dataSource: yearArr?.map(item => {
        return {
          label: item?.year,
          value: item?.year,
        };
      }),
    });
  }, [yearArr]);

  /** 查看详情 */
  const getDetailFn = async () => {
    if (Number(id)) {
      if (isEdit) {
        /** 核算年度、核算组织不允许编辑 */
        form.setFieldState('*(year)', {
          disabled: true,
          required: false,
        });
        form.setFieldState('*(orgCodes)', {
          disabled: true,
          readPretty: true,
          required: false,
        });
      }

      const { data } = await getComputationReportId({
        id: Number(id),
      });

      const orgCodes = data?.data?.orgCodes?.split(',') || [];

      form.setValues({
        ...data?.data,
        orgCodes,
      });
    }
  };

  useEffect(() => {
    getDetailFn();
    getAccountYearList();
  }, [id]);

  /** 保存时的api接口 */
  const postApi = isAdd ? addAccountingReportApi : editAccountingReportApi;

  return (
    <div className={style.wrapper}>
      <Form form={form} previewTextPlaceholder='-'>
        <section className={style.card}>
          <SchemaField schema={schema()} scope={{ useAsyncOrgDataSource }} />
        </section>
      </Form>
      <FormActions
        place='center'
        buttons={compact([
          !isShow && {
            title: I18N.Factors.preserve,
            type: 'primary',
            loading: btnLoading,
            onClick: async () => {
              const values = await form.submit<{
                year: number;
                orgCodes: string[];
                reportName: string;
              }>();

              const result = omitInfoFn({ ...values });

              try {
                setBtnLoading(true);
                await postApi(result);
                Toast('success', I18N.Factors.saveSuccessful);
                navigate(EcaRouteMaps.accountingReport);
                setBtnLoading(false);
              } catch (e) {
                setBtnLoading(false);
                throw e;
              }
            },
          },
          {
            title: !isShow ? I18N.Factors.cancel : I18N.Factors.return,
            onClick: async () => {
              navigate(EcaRouteMaps.accountingReport);
            },
          },
        ])}
      />
    </div>
  );
};

export default AccountReportInfo;
