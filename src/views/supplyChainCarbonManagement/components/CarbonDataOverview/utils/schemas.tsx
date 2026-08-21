import I18N from '@src/lang/I18N';

import {
  renderFormItemSchema,
  renderSchemaWithLayout,
  renderFromGridSchema,
} from '@/components/formily/utils';

export const infoSchema = () =>
  renderSchemaWithLayout(
    {},
    {
      grid: {
        ...renderFromGridSchema(),

        properties: {
          supplierName: renderFormItemSchema({
            title: I18N.carbonFootPrint.supplierName,
            required: false,
            'x-component': 'Input',
          }),
          // orgName: renderFormItemSchema({
          //   title: I18N.carbonData.affiliatedOrganization,
          //   'x-component': 'Input',
          // }),
          submitTime: renderFormItemSchema({
            title: I18N.eca.submissionTime,
            'x-component': 'Input',
          }),
          applyStatus_name: renderFormItemSchema({
            title: I18N.supplyChainCarbonManagement.approvalStatus,
            'x-component': 'Input',
          }),
        },
      },
    },
  );
