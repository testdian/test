import I18N from '@src/lang/I18N';
import { compact } from 'lodash-es';

import { xRenderSeachSchema } from '@/components/x-render/TableRender/utils/xRender';
// import { Org } from '@/sdks/systemV2ApiDocs';
import { EnumResp } from '@/sdks_v2/new/supplychainV2ApiDocs';

export const searchSchema = (
  // orgList: Org[],
  supplyStatusOptions?: EnumResp[],
  supplyTypeOptions?: EnumResp[],
) => ({
  type: 'object',
  properties: {
    likeSupplierName: xRenderSeachSchema({
      type: 'string',
      placeholder: I18N.supplyChainCarbonManagement.merchantName,
      widget: 'input',
    }),
    supplierType: xRenderSeachSchema({
      type: 'string',
      placeholder: I18N.supplyChainCarbonManagement.merchantType,
      enum: compact(supplyTypeOptions?.map(s => String(s.code))),
      enumNames: compact(supplyTypeOptions?.map(s => s.name)),
      widget: 'select',
      props: {
        showSearch: true,
        optionFilterProp: 'label',
        allowClear: true,
      },
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
    likeSupplierCode: xRenderSeachSchema({
      type: 'string',
      placeholder: I18N.supplyChainCarbonManagement.merchantCode,
      widget: 'input',
    }),
    supplierStatus: xRenderSeachSchema({
      type: 'string',
      placeholder: I18N.Factors.state,
      widget: 'select',
      enum: compact(supplyStatusOptions?.map(v => String(v.code))),
      enumNames: compact(supplyStatusOptions?.map(v => v.name)),
      props: {
        showSearch: true,
        optionFilterProp: 'label',
        allowClear: true,
      },
    }),
  },
});
