/**
 * @description: 核算模型/创建核算模型基本信息
 */
import { ISchema } from '@formily/react';
import I18N from '@src/lang/I18N';

import {
  renderFormItemSchema,
  renderFromGridSchema,
} from '@/components/formily/utils';
import { publishYear } from '@/views/Factors/utils';

import { QUANTITATIVE_METHOD_TYPE } from '../config';

/** 核算模型/创建核算模型基本信息-表单配置内容  */
export const schema = (): ISchema => {
  return {
    type: 'object',
    properties: {
      layout: {
        type: 'void',
        'x-component': 'FormLayout',
        'x-component-props': {
          layout: 'vertical',
          style: { maxWidth: 700 },
        },
        properties: {
          grid: {
            ...renderFromGridSchema({ columns: 2 }),
            properties: {
              orgCode: renderFormItemSchema({
                title: '核算组织',
                type: 'string',
                'x-component': 'TreeSelect',
                'x-component-props': {
                  placeholder: I18N.Factors.pleaseSelect,
                  showSearch: true,
                  allowClear: true,
                  treeNodeFilterProp: 'label',
                  treeDefaultExpandAll: true,
                },
              }),
              year: renderFormItemSchema({
                title: '核算年份',
                type: 'string',
                'x-component': 'Select',
                'x-component-props': {
                  placeholder: I18N.Factors.pleaseSelect,
                  showSearch: true,
                  allowClear: true,
                },
                enum: publishYear(),
              }),
              modelName: renderFormItemSchema({
                type: 'string',
                title: I18N.carbonFootPrintLCA.modelName,
                required: true,
                'x-decorator': 'FormItem',
                'x-component': 'Input',
                'x-component-props': {
                  maxLength: 100,
                },
                'x-decorator-props': {
                  gridSpan: 2,
                },
              }),
              quantitativeMethod: renderFormItemSchema({
                type: 'string',
                title: I18N.eca.quantitativeMethods,
                required: true,
                'x-disabled': true,
                'x-decorator': 'FormItem',
                'x-component': 'Select',
                enum: [
                  {
                    label: I18N.eca.emissionFactorMethod2,
                    value: QUANTITATIVE_METHOD_TYPE.EMISSION_FACTOR_METHOD,
                  },
                ],
                default: QUANTITATIVE_METHOD_TYPE.EMISSION_FACTOR_METHOD,
                'x-decorator-props': {
                  gridSpan: 2,
                },
              }),
              intro: renderFormItemSchema({
                'x-decorator': 'FormItem',
                'x-component': 'Input.TextArea',
                type: 'string',
                title: I18N.eca.modelDescription,
                required: true,
                'x-component-props': {
                  maxLength: 1000,
                  rows: 4,
                },
                'x-decorator-props': {
                  gridSpan: 2,
                },
              }),
            },
          },
        },
      },
    },
  };
};
