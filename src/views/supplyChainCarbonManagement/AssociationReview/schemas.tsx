import I18N from '@src/lang/I18N';
import { compact } from 'lodash-es';

import { xRenderSeachSchema } from '@/components/x-render/TableRender/utils/xRender';
import { EnumResp } from '@/sdks_v2/new/supplychainV2ApiDocs';

export const searchSchema = (
  supplyTypeOptions?: EnumResp[],
  linkStatusOptions?: EnumResp[],
) => ({
  type: 'object',
  properties: {
    linkLinkCompanyName: xRenderSeachSchema({
      type: 'string',
      placeholder: I18N.supplyChainCarbonManagement.associatedMerchantName,
      widget: 'input',
    }),
    linkUniqueCode: xRenderSeachSchema({
      type: 'string',
      placeholder:
        I18N.supplyChainCarbonManagement.theSoleRepresentativeOfTheEnterprise,
      widget: 'input',
    }),
    supplierType: xRenderSeachSchema({
      type: 'string',
      placeholder: I18N.supplyChainCarbonManagement.relatedMerchantCategory,
      enum: compact(supplyTypeOptions?.map(s => String(s.code))),
      enumNames: compact(supplyTypeOptions?.map(s => s.name)),
      widget: 'select',
      props: {
        showSearch: true,
        optionFilterProp: 'label',
        allowClear: true,
      },
    }),
    supplierLinkStatus: xRenderSeachSchema({
      type: 'string',
      placeholder: I18N.Factors.state,
      widget: 'select',
      enum: compact(linkStatusOptions?.map(v => String(v.code))),
      enumNames: compact(linkStatusOptions?.map(v => v.name)),
      props: {
        showSearch: true,
        optionFilterProp: 'label',
        allowClear: true,
      },
    }),
  },
});
