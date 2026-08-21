import I18N from '@src/lang/I18N';
import { compact } from 'lodash-es';

import { xRenderSeachSchema } from '@/components/x-render/TableRender/utils/xRender';
// import { Org } from '@/sdks/systemV2ApiDocs';
import { EnumResp } from '@/sdks_v2/new/supplychainV2ApiDocs';
import { AssessmentMapOptions } from '@/utils';

export const searchSchema = ({
  // orgList,
  assessmentMethodOptions,
  applyTypeOptions,
  applyStatusOptions,
  applusAuditStatusOptions,
}: {
  // orgList: Org[];
  assessmentMethodOptions?: AssessmentMapOptions[];
  applyTypeOptions?: EnumResp[];
  applyStatusOptions?: EnumResp[];
  applusAuditStatusOptions?: EnumResp[];
}) => ({
  type: 'object',
  properties: {
    likeProductName: xRenderSeachSchema({
      type: 'string',
      placeholder: I18N.supplyChainCarbonManagement.purchaseProductName,
      widget: 'input',
    }),
    likeSupplierName: xRenderSeachSchema({
      type: 'string',
      placeholder: I18N.carbonFootPrint.supplierName,
      widget: 'input',
    }),
    // orgId: xRenderSeachSchema({
    //   type: 'string',
    //   placeholder: I18N.carbonData.affiliatedOrganization,
    //   enum: compact(orgList.map(u => String(u.id))),
    //   enumNames: compact(orgList.map(u => u.orgName)),
    //   widget: 'select',
    //   props: {
    //     showSearch: true,
    //     optionFilterProp: 'label',
    //     allowClear: true,
    //   },
    // }),
    applyType: xRenderSeachSchema({
      type: 'string',
      placeholder: I18N.supplyChainCarbonManagement.dataRequestClass,
      widget: 'select',
      enum: compact(applyTypeOptions?.map(v => String(v.code))),
      enumNames: compact(applyTypeOptions?.map(v => v.name)),
      props: {
        showSearch: true,
        optionFilterProp: 'label',
        allowClear: true,
      },
    }),
    assessmentMethod: xRenderSeachSchema({
      type: 'string',
      placeholder: I18N.certificationReviewCenter.evaluationMethods,
      widget: 'select',
      enum: compact(assessmentMethodOptions?.map(v => v.value)),
      enumNames: compact(assessmentMethodOptions?.map(v => v.label)),
      props: {
        showSearch: true,
        optionFilterProp: 'label',
        allowClear: true,
      },
    }),
    applyStatus: xRenderSeachSchema({
      type: 'string',
      placeholder: I18N.supplyChainCarbonManagement.fillInTheApprovalForm,
      widget: 'select',
      enum: compact(applyStatusOptions?.map(v => String(v.code))),
      enumNames: compact(applyStatusOptions?.map(v => v.name)),
      props: {
        showSearch: true,
        optionFilterProp: 'label',
        allowClear: true,
      },
    }),
    applusAuditStatus: xRenderSeachSchema({
      type: 'string',
      placeholder: I18N.supplyChainCarbonManagement.dataReview,
      widget: 'select',
      enum: compact(applusAuditStatusOptions?.map(v => String(v.code))),
      enumNames: compact(applusAuditStatusOptions?.map(v => v.name)),
      props: {
        showSearch: true,
        optionFilterProp: 'label',
        allowClear: true,
      },
    }),
  },
});
