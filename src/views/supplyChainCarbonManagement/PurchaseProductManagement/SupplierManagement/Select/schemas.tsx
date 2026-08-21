import I18N from '@src/lang/I18N';

import { xRenderSeachSchema } from '@/components/x-render/TableRender/utils/xRender';

export const searchSchema = () => ({
  type: 'object',
  properties: {
    likeSupplierName: xRenderSeachSchema({
      type: 'string',
      placeholder: I18N.carbonFootPrint.supplierName,
      widget: 'input',
    }),
    likeSupplierCode: xRenderSeachSchema({
      type: 'string',
      placeholder: I18N.supplyChainCarbonManagement.merchantCode,
      widget: 'input',
    }),
  },
});
