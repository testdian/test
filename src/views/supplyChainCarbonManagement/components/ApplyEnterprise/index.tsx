/*
 * @@description: 申请企业碳核算 （供应商管理）
 */
import {
  Checkbox,
  DatePicker,
  Form,
  FormGrid,
  FormItem,
  FormLayout,
  Input,
  Radio,
  Select,
} from '@formily/antd-v5';
import { createForm, onFieldValueChange } from '@formily/core';
import { createSchemaField } from '@formily/react';
import I18N from '@src/lang/I18N';
import dayjs from 'dayjs';
import { compact } from 'lodash-es';
import { useEffect, useMemo, useState } from 'react';

import { FormActions } from '@/components/FormActions';
import {
  ApplyComputationReq,
  ApplyInfoResp,
  postSupplychainApplyComputationApply,
} from '@/sdks_v2/new/supplychainV2ApiDocs';
import { Toast } from '@/utils';
import { publishYear } from '@/views/Factors/utils';
import { TextArea } from '@/views/eca/component/TextArea';
import { ComputationEnums } from '@/views/eca/hooks';

import { infoSchema } from './utils/schemas';
import style from '../../SupplierManagement/Info/index.module.less';
import { useSupplyChainEnums } from '../../hooks/useEnums';

function ApplyEnterprise({
  id,
  cathRecord,
}: {
  /** 点击的数据id */
  id?: string;
  /** 带过来的数据信息 */
  cathRecord?: ApplyInfoResp;
}) {
  const SchemaField = createSchemaField({
    components: {
      Input,
      Select,
      TextArea,
      DatePicker,
      Radio,
      Checkbox,
      Form,
      FormItem,
      FormGrid,
      FormLayout,
    },
  });
  /** 数据请求类型枚举值 */
  const applyTypeEnums = useSupplyChainEnums('ApplyType');

  /** 企业碳核算标准枚举值  */
  const standardTypeEnums = ComputationEnums('StandardType');

  /** GHG核算范围枚举值 */
  const ghgCategoriesEnums = ComputationEnums('GHGCategory');

  /** ISO核算范围枚举值 */
  const isoCategoriesEnums = ComputationEnums('ISOCategory');

  /** 获取企业碳核算标准 */
  const [standardTypes, setStandardTypes] = useState<number[]>();

  const form = useMemo(
    () =>
      createForm({
        effects() {
          /** 切换企业碳核算标准 */
          onFieldValueChange('standardTypes', field => {
            setStandardTypes(field.value);
          });
        },
      }),
    [],
  );

  /** 设置枚举值 */
  useEffect(() => {
    /** 核算年份 */
    form.setFieldState('year', {
      dataSource: publishYear().map(v => ({ label: v, value: v })),
    });
    /** 数据请求类型 */
    if (applyTypeEnums) {
      form.setFieldState('applyType', {
        dataSource: applyTypeEnums.map(item => ({
          label: I18N.template(
            I18N.supplyChainCarbonManagement.enterpriseCarbonIt,
            { val1: item.name },
          ),
          value: item.code,
        })),
      });
    }
    /** 企业碳核算标准  */
    if (standardTypeEnums) {
      form.setFieldState('standardTypes', {
        dataSource: standardTypeEnums.map(item => ({
          ...item,
          label: item.value === 1 ? 'GHG Protocol' : 'ISO 14064-1:2018',
        })),
      });
    }
    /** 供应商名称 */
    if (cathRecord) {
      form.setValues({
        ...cathRecord,
      });
    }
  }, [applyTypeEnums, standardTypeEnums, cathRecord]);

  /** 切换企业碳核算标准 */
  useEffect(() => {
    if (standardTypes && ghgCategoriesEnums && isoCategoriesEnums) {
      /** 核算范围（GHG Protocol）*/
      if (standardTypes.includes(1)) {
        form.setFieldState('ghgCategories', {
          dataSource: ghgCategoriesEnums,
        });
      }
      /** 核算范围（ISO 14064-1:2018）*/
      if (standardTypes.includes(2)) {
        form.setFieldState('isoCategories', {
          dataSource: isoCategoriesEnums,
        });
      }
    }
  }, [standardTypes, ghgCategoriesEnums, isoCategoriesEnums]);

  return (
    <div className={style.supplyManagementInfoWrapper}>
      <Form form={form} previewTextPlaceholder='-'>
        <SchemaField schema={infoSchema()} />
      </Form>
      <FormActions
        place='center'
        buttons={compact([
          {
            title: I18N.supplyChainCarbonManagement.submitApplication,
            type: 'primary',
            onClick: async () => {
              form.submit((values: ApplyComputationReq) => {
                const {
                  standardTypes,
                  ghgCategories,
                  isoCategories,
                  deadline,
                } = values || {};

                const result = {
                  ...values,
                  id: id ? Number(id) : undefined,
                  supplierId: id ? Number(id) : undefined,
                  standardTypes: String(standardTypes),
                  ghgCategories: ghgCategories
                    ? String(ghgCategories)
                    : undefined,
                  isoCategories: isoCategories
                    ? String(isoCategories)
                    : undefined,
                  deadline: dayjs(deadline).format('YYYY-MM-DD HH:mm:ss'),
                };
                return postSupplychainApplyComputationApply({
                  req: result as unknown as ApplyComputationReq,
                }).then(({ data }) => {
                  if (data.code === 200) {
                    Toast(
                      'success',
                      I18N.supplyChainCarbonManagement.appliedPleaseCheckInThe,
                    );
                    history.back();
                  }
                });
              });
            },
          },
          {
            title: I18N.Factors.cancel,
            onClick: async () => {
              history.back();
            },
          },
        ])}
      />
    </div>
  );
}
export default ApplyEnterprise;
