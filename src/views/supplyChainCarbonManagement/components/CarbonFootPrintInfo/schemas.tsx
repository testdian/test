import I18N from '@src/lang/I18N';

import {
  renderFormItemSchema,
  renderSchemaWithLayout,
  renderFromGridSchema,
} from '@/components/formily/utils';

export const schema = () => {
  return renderSchemaWithLayout(
    {},
    {
      grid: {
        ...renderFromGridSchema(),
        properties: {
          productName: renderFormItemSchema({
            title: I18N.Factors.productName,
            required: false,
            'x-component': 'Input',
            'x-disabled': true,
          }),
          productUnit: renderFormItemSchema({
            title: I18N.carbonFootPrint.accountingUnit,
            required: false,
            'x-disabled': true,
            'x-component': 'Cascader',
            'x-component-props': {
              showSearch: true,
            },
          }),
          supplierName: renderFormItemSchema({
            title: I18N.carbonFootPrint.supplierName,
            required: false,
            'x-component': 'Input',
            'x-disabled': true,
          }),
          specification: renderFormItemSchema({
            title: I18N.carbonFootPrintLCA.specificationAndModel,
            required: false,
            'x-component': 'Input',
            'x-disabled': true,
          }),
          applyType_name: renderFormItemSchema({
            title: I18N.supplyChainCarbonManagement.dataRequestClass,
            required: false,
            'x-component': 'Input',
            'x-disabled': true,
          }),
          productCycle: renderFormItemSchema({
            title: I18N.carbonFootPrintLCA.productionCycle,
            required: false,
            'x-component': 'Input',
            'x-disabled': true,
          }),
          systemBoundaryType_name: renderFormItemSchema({
            title: I18N.supplyChainCarbonManagement.theSystemBoundaryNeedsTo,
            required: false,
            'x-component': 'Input',
            'x-disabled': true,
            'x-decorator-props': {
              gridSpan: 3,
            },
          }),
          assessmentMethodName: renderFormItemSchema({
            title: I18N.certificationReviewCenter.evaluationMethods,
            required: false,
            'x-component': 'Input',
            'x-disabled': true,
          }),
          funcUnit: renderFormItemSchema({
            title: I18N.carbonFootPrintLCA.functionalUnits,
            required: false,
            'x-component': 'Input',
            'x-disabled': true,
          }),
          applusAuditStatus_name: renderFormItemSchema({
            title: I18N.supplyChainCarbonManagement.reviewStatus,
            required: false,
            'x-component': 'Input',
            'x-disabled': true,
          }),
        },
      },
    },
  );
};

/** 证据材料 */
export const fileSchema = () => {
  return renderSchemaWithLayout(
    {},
    {
      grid: {
        ...renderFromGridSchema({
          columns: 2,
        }),
        properties: {
          supportFile: renderFormItemSchema({
            required: false,
            type: 'array',
            'x-decorator-props': {
              gridSpan: 2,
            },
            'x-component': 'FormilyFileUpload',
          }),
        },
      },
    },
  );
};
