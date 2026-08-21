import I18N from '@src/lang/I18N';

import {
  renderFormItemSchema,
  renderFromGridSchema,
  renderSchemaWithLayout,
} from '@/components/formily/utils';
import { SearchSchemaSelectUtils } from '@/utils/schema';

import { InputTextLength100, InputTextLength1000 } from './reg';

const initModelCaseDisabledAndRequired = {
  required: false,
  'x-disabled': true,
  'x-component-props': {
    placeholder: '-',
  },
};
/** 环境足迹报告模型方案-schemas */
export const modelCaseSchema = () => {
  return renderSchemaWithLayout(
    {},
    {
      grid: {
        ...renderFromGridSchema({
          columns: 2,
        }),
        properties: {
          modelName: renderFormItemSchema({
            type: 'string',
            title: I18N.carbonFootPrintLCA.modelName,
            'x-decorator': 'FormItem',
            'x-component': 'Input',
            ...initModelCaseDisabledAndRequired,
          }),
          modelCode: renderFormItemSchema({
            type: 'string',
            title: I18N.certificationReviewCenter.modelCoding,
            'x-decorator': 'FormItem',
            'x-component': 'Input',
            ...initModelCaseDisabledAndRequired,
          }),
          funcUnit: renderFormItemSchema({
            type: 'string',
            title: I18N.carbonFootPrintLCA.functionalUnits,
            'x-decorator': 'FormItem',
            'x-component': 'Input',
            ...initModelCaseDisabledAndRequired,
          }),
          planName: renderFormItemSchema({
            type: 'string',
            title: I18N.certificationReviewCenter.planName,
            ...initModelCaseDisabledAndRequired,
            'x-decorator': 'FormItem',
            'x-component': 'Input',
          }),
          assessmentMethodName: renderFormItemSchema({
            type: 'string',
            title: I18N.certificationReviewCenter.evaluationMethods,
            ...initModelCaseDisabledAndRequired,
            'x-decorator': 'FormItem',
            'x-component': 'Input',
            'x-decorator-props': {
              gridSpan: 2,
            },
          }),
          assessmentTargetNames: renderFormItemSchema({
            type: 'string',
            title: I18N.certificationReviewCenter.evaluatingIndicator,
            ...initModelCaseDisabledAndRequired,
            'x-decorator': 'FormItem',
            'x-decorator-props': {
              gridSpan: 2,
            },
            'x-component': 'TextArea',
            'x-component-props': {
              placeholder: '-',
              maxLength: 1000,
              style: {
                height: 100,
                alignItems: 'flex-start',
              },
            },
          }),
        },
      },
    },
  );
};

/** 环境足迹报告报告信息-schemas */
export const reportInfoSchema = () =>
  renderSchemaWithLayout(
    {},
    {
      grid: {
        ...renderFromGridSchema({
          columns: 2,
        }),
        properties: {
          reportName: renderFormItemSchema({
            type: 'string',
            title: I18N.carbonFootPrintLCA.reportName,
            'x-decorator': 'FormItem',
            'x-component': 'Input',
            'x-component-props': {
              maxLength: InputTextLength100,
            },
          }),
          orgId: renderFormItemSchema({
            type: 'string',
            title: I18N.carbonData.affiliatedOrganization,
            'x-decorator': 'FormItem',
            'x-component': 'Select',
            'x-component-props': {
              ...SearchSchemaSelectUtils,
            },
          }),
          projectName: renderFormItemSchema({
            type: 'string',
            title: I18N.carbonFootPrintLCA.inTheProjectName,
            'x-decorator': 'FormItem',
            'x-component': 'Input',
            'x-component-props': {
              maxLength: InputTextLength100,
            },
          }),
          projectNameEn: renderFormItemSchema({
            type: 'string',
            title: I18N.carbonFootPrintLCA.projectNameInEnglish,
            'x-decorator': 'FormItem',
            'x-component': 'Input',
            'x-component-props': {
              maxLength: InputTextLength1000,
            },
          }),
          clientName: renderFormItemSchema({
            type: 'string',
            title: I18N.carbonFootPrintLCA.clientChinese,
            'x-decorator': 'FormItem',
            'x-component': 'Input',
            'x-component-props': {
              maxLength: InputTextLength100,
            },
          }),
          clientNameEn: renderFormItemSchema({
            type: 'string',
            title: I18N.carbonFootPrintLCA.clientEnglish,
            'x-decorator': 'FormItem',
            'x-component': 'Input',
            'x-component-props': {
              maxLength: InputTextLength1000,
            },
          }),
          companyAddr: renderFormItemSchema({
            type: 'string',
            title: I18N.carbonFootPrintLCA.inTheCompanyAddress,
            'x-decorator': 'FormItem',
            'x-component': 'Input',
            'x-component-props': {
              maxLength: InputTextLength100,
            },
          }),
          companyAddrEn: renderFormItemSchema({
            type: 'string',
            title: I18N.carbonFootPrintLCA.companyAddressInEnglish,
            'x-decorator': 'FormItem',
            'x-component': 'Input',
            'x-component-props': {
              maxLength: InputTextLength1000,
            },
          }),
        },
      },
    },
  );
