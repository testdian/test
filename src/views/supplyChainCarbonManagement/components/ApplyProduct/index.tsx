/**
 * @description: 申请产品碳足迹 （采购产品管理-供应商管理）
 */
import {
  Cascader,
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
import { compact, omit } from 'lodash-es';
import { useEffect, useMemo, useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';

import { FormActions } from '@/components/FormActions';
import { FormilyFileUpload } from '@/components/FormilyFileUpload';
import { FormilyCustomTitle } from '@/components/formily/ComTitle';
import { FormilySelectableTable } from '@/components/formily/SelectableTable';
import { virtualLinkTransform } from '@/router/utils/enums';
import { SccmRouteMaps } from '@/router/utils/sccmEnums';
import { Toast, handleAssessmentProposalOptions } from '@/utils';
import { changeFactorM2cascaderOptions } from '@/views/Factors/Info/utils';
import { useAllEnumsBatch } from '@/views/dashborad/Dicts/hooks';
import { TextArea } from '@/views/eca/component/TextArea';

import { infoSchema } from './schemas';
import { postProductApply } from './service';
import { ApplyRequest } from './type';
import { ProductInfo } from '../../PurchaseProductManagement/type';
import style from '../../SupplierManagement/Info/index.module.less';
import { useSupplyChainEnums } from '../../hooks/useEnums';

const SchemaField = createSchemaField({
  components: {
    Input,
    Select,
    TextArea,
    DatePicker,
    Radio,
    Cascader,
    Form,
    FormItem,
    FormGrid,
    FormLayout,
    FormilyCustomTitle,
    FormilyFileUpload,
    FormilySelectableTable,
  },
});

function ApplyProduct({
  supplierId,
  productId,
  cathRecord,
}: {
  /** 供应商id */
  supplierId?: number;
  /** 采购产品id */
  productId?: number;
  /** 默认带过来的数据信息 */
  cathRecord?: ProductInfo;
}) {
  const navigate = useNavigate();

  const { id } = useParams<{
    id: string;
  }>();

  const enumOptions = useAllEnumsBatch('AssessmentProposal');

  /** lca评价方法 */
  const assessmentMethodOptions = enumOptions?.AssessmentProposal;

  const form = useMemo(
    () =>
      createForm({
        initialValues: {
          dataCode: `GMX${new Date().getTime()}`,
        },
        effects: () => {
          /** 切换评价方法处理评价指标 */
          onFieldValueChange('assessmentMethod', field => {
            /** 切换评价方法时清空评价指标的值 */
            form.reset('assessmentTargetList');

            const { value, dataSource } = field;

            /** 评价指标 */
            const targetOption =
              dataSource?.filter(d => d.value === value)?.[0]?.children || [];

            /** 重新赋评价指标dataSource */
            form.setFieldState('assessmentTargetList', {
              dataSource: targetOption,
            });
          });
        },
      }),
    [],
  );

  /** 核算数量单位的枚举值 */
  const accountsUnitsList = useAllEnumsBatch('factorUnitM');

  /** 数据请求类型枚举值 */
  const applyTypeEnums = useSupplyChainEnums('ApplyType');

  /** 系统边界要求枚举值  */
  const periodTypeEnums = useSupplyChainEnums('PeriodType');

  /** 提交申请按钮loading */
  const [applyLoading, setApplyLoading] = useState(false);

  /** 设置枚举值 */
  useEffect(() => {
    /** 默认带过来展示的值 */
    if (cathRecord && accountsUnitsList) {
      form.setValues({
        ...cathRecord,
      });
    }
    /** 数据请求类型 */
    if (applyTypeEnums) {
      form.setFieldState('applyType', {
        dataSource: applyTypeEnums.map(item => ({
          label: item.name,
          value: item.code,
        })),
      });
    }
    /** 系统边界要求  */
    if (periodTypeEnums) {
      form.setFieldState('systemBoundaryType', {
        dataSource: periodTypeEnums.map(item => ({
          label: item.name,
          value: item.code,
        })),
      });
    }
    /** 核算单位 */
    if (accountsUnitsList) {
      const accountUnitsDicts = accountsUnitsList.factorUnitM;
      form.setFieldState('.productUnit', {
        dataSource: changeFactorM2cascaderOptions(accountUnitsDicts),
      });
    }
    /** 评价方法 */
    if (assessmentMethodOptions) {
      form.setFieldState('assessmentMethod', {
        dataSource: handleAssessmentProposalOptions(
          enumOptions?.AssessmentProposal,
        ),
      });
    }
  }, [applyTypeEnums, periodTypeEnums, cathRecord, accountsUnitsList]);

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
            loading: applyLoading,
            onClick: async () => {
              const values = await form.submit<ApplyRequest>();
              setApplyLoading(true);
              const {
                applyType,
                assessmentMethod,
                assessmentTargetList,
                dataCode,
                deadline,
                remark,
                supportFile,
                systemBoundaryType,
              } = values;

              /** 支撑材料的处理 */
              const supportMaterialsList =
                supportFile?.map((file: any) => {
                  const { name: fileName, uid, url } = file || {};
                  return omit(
                    {
                      ...file,
                      fileId: uid,
                      fileName,
                      fileUrl: url,
                    },
                    ['name', 'uid', 'url'],
                  );
                }) || [];
              /** 支撑材料 */
              const supportFiles = supportMaterialsList?.length
                ? JSON.stringify(supportMaterialsList)
                : undefined;

              const result = {
                applyType,
                assessmentMethod,
                assessmentTargetList,
                dataCode,
                deadline: dayjs(deadline).format('YYYY-MM-DD HH:mm:ss'),
                productId,
                remark,
                supplierId,
                supportFile: supportFiles,
                systemBoundaryType,
              };

              try {
                await postProductApply(result);
                Toast(
                  'success',
                  I18N.supplyChainCarbonManagement.appliedPleaseCheckInThe2,
                );
                navigate(
                  virtualLinkTransform(
                    SccmRouteMaps.sccmProdctSupplierManagement,
                    [':id'],
                    [id],
                  ),
                );
              } finally {
                setApplyLoading(false);
              }
            },
          },
          {
            title: I18N.Factors.cancel,
            onClick: async () => {
              navigate(
                virtualLinkTransform(
                  SccmRouteMaps.sccmProdctSupplierManagement,
                  [':id'],
                  [id],
                ),
              );
            },
          },
        ])}
      />
    </div>
  );
}
export default ApplyProduct;
