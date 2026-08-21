import I18N from '@src/lang/I18N';
import { compact } from 'lodash-es';

import { xRenderSeachSchema } from '@/components/x-render/TableRender/utils/xRender';
import { EnumResp } from '@/sdks/systemV2ApiDocs';

export const searchSchema = ({
  applyStatusOptions,
}: {
  applyStatusOptions?: EnumResp[];
}) => ({
  type: 'object',
  properties: {
    likeCompanyName: xRenderSeachSchema({
      type: 'string',
      placeholder: I18N.supplyChainCarbonManagement.customerName,
      widget: 'input',
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
  },
});
