import I18N from '@src/lang/I18N';
// import { compact } from 'lodash-es';

import { xRenderSeachSchema } from '@/components/x-render/TableRender/utils/xRender';
// import { Org } from '@/sdks/systemV2ApiDocs';

export const searchSchema = () => ({
  type: 'object',
  properties: {
    likeProductName: xRenderSeachSchema({
      type: 'string',
      placeholder: I18N.Factors.productName,
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
  },
});
