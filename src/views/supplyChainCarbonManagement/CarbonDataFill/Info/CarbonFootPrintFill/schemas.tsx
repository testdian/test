import I18N from '@src/lang/I18N';
import moment, { Moment } from 'moment';

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
            'x-component-props': {
              maxLength: 100,
            },
          }),
          productUnit: renderFormItemSchema({
            title: I18N.carbonFootPrint.accountingUnit,
            required: false,
            'x-component': 'Cascader',
            'x-component-props': {
              showSearch: true,
            },
          }),
          specification: renderFormItemSchema({
            title: I18N.carbonFootPrintLCA.specificationAndModel,
            required: false,
            'x-component': 'Input',
            'x-component-props': {
              maxLength: 100,
            },
          }),
          productCycle: renderFormItemSchema({
            title: I18N.carbonFootPrintLCA.productionCycle,
            required: false,
            'x-component': 'DatePicker.RangePicker',
            'x-component-props': {
              placeholder: [
                I18N.carbonFootPrintLCA.startDate,
                I18N.carbonFootPrintLCA.endDate,
              ],
              disabledDate: (current: Moment) => {
                return (
                  (current && current < moment('1990')) ||
                  (current && current > moment())
                );
              },
            },
          }),
          applusAuditStatus_name: renderFormItemSchema({
            title: I18N.supplyChainCarbonManagement.reviewStatus,
            required: false,
            'x-component': 'Input',
            'x-disabled': true,
          }),
          funcUnit: renderFormItemSchema({
            title: I18N.carbonFootPrintLCA.functionalUnits,
            customValidate:
              I18N.supplyChainCarbonManagement.pleaseFillInTheAccountingForm,
            'x-component': 'Input',
            'x-component-props': {
              maxLength: 100,
              placeholder: I18N.supplyChainCarbonManagement.pleaseEnterText,
            },
          }),
        },
      },
    },
  );
};

/** 填报要求 */
export const fillSchema = () => {
  return renderSchemaWithLayout(
    {},
    {
      grid: {
        ...renderFromGridSchema(),
        properties: {
          fillApplyData: {
            type: 'object',
            properties: {
              productName: renderFormItemSchema({
                title: I18N.supplyChainCarbonManagement.purchaseProductName,
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
              productModel: renderFormItemSchema({
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
              assessmentMethodName: renderFormItemSchema({
                title: I18N.certificationReviewCenter.evaluationMethods,
                required: false,
                'x-component': 'Input',
                'x-disabled': true,
              }),
              systemBoundaryType_name: renderFormItemSchema({
                title:
                  I18N.supplyChainCarbonManagement.theSystemBoundaryNeedsTo,
                required: false,
                'x-component': 'Input',
                'x-disabled': true,
              }),
            },
          },
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
