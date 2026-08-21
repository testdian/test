/*
 * @@description:
 * @Author: qifeng qifeng@carbonstop.net
 * @Date: 2023-01-16 09:48:53
 * @LastEditors: ljh255 jinhai@carbonstop.net
 * @LastEditTime: 2023-04-13 18:19:23
 */
import { ISchema } from '@formily/react';
import I18N from '@src/lang/I18N';
import { TreeProps } from 'antd';
import { DefaultOptionType } from 'antd/lib/select';
import { TreeNodeNormal } from 'antd/lib/tree/Tree';

import { renderFormItemSchema } from '@/components/formily/utils';
import { PageTypeInfo } from '@/router/utils/enums';
import {
  InputTextLength50,
  RegNumber,
  RegUnitNumber,
  TextAreaMaxLength3000,
} from '@/views/eca/util/type';
import { initFormilyShema } from '@/views/eca/util/util';

export type CheckInfo<T extends TreeNodeNormal = any> = Parameters<
  NonNullable<TreeProps<T>['onCheck']>
>[1];

export const schema = (pageTypeInfo?: PageTypeInfo): ISchema => {
  return {
    type: 'object',
    properties: {
      layout: {
        type: 'void',
        'x-component': 'FormLayout',
        'x-component-props': {
          layout: 'vertical',
        },
        properties: {
          grid: {
            type: 'void',
            'x-component': 'FormGrid',
            'x-component-props': {
              rowGap: 2,
              columnGap: 24,
              maxColumns: 3,
              minColumns: 1,
            },
            properties: {
              sceneName: renderFormItemSchema({
                type: 'string',
                title: I18N.eca.emissionReductionScenarioName3,
                'x-decorator': 'FormItem',
                'x-component': 'Input',
                'x-component-props': {
                  placeholder: I18N.base.pleaseEnter,
                  maxLength: InputTextLength50,
                },
              }),
              sceneNameEn: renderFormItemSchema({
                type: 'string',
                title: I18N.eca.emissionReductionScenarioName2,
                'x-decorator': 'FormItem',
                'x-component': 'Input',
                'x-component-props': {
                  placeholder: I18N.base.pleaseEnter,
                  maxLength: InputTextLength50,
                },
              }),
              orgId: renderFormItemSchema({
                type: 'string',
                title: I18N.carbonData.affiliatedOrganization,
                'x-decorator': 'FormItem',
                'x-component': 'Select',
                'x-component-props': {
                  disabled: pageTypeInfo !== PageTypeInfo.add,
                  placeholder: I18N.Factors.pleaseSelect,
                  showSearch: true,
                  filterOption: (input: string, option: any) =>
                    (option?.label ?? '')
                      .toLowerCase()
                      .includes(input.toLowerCase()),
                },
              }),
              sceneType: renderFormItemSchema({
                type: 'array',
                title: I18N.eca.quantificationOfEmissionReduction,
                enum: [
                  {
                    label: I18N.eca.totalEmissionReduction,
                    value: '1',
                  },
                  {
                    label: I18N.eca.unitEmissionReduction,
                    value: '2',
                  },
                ],
                'x-decorator': 'FormItem',
                'x-decorator-props': { gridSpan: 3 },
                'x-component': 'CousCheckBox',
                'x-component-props': {
                  options: [
                    {
                      label: I18N.eca.totalEmissionReduction,
                      value: '1',
                    },
                    {
                      label: I18N.eca.unitEmissionReduction,
                      value: '2',
                    },
                  ],
                },
              }),
              sceneDesc: renderFormItemSchema({
                type: 'string',
                title: I18N.eca.descriptionOfEmissionReductionScenarios3,
                'x-decorator': 'FormItem',
                'x-component': 'TextArea',
                'x-decorator-props': { gridSpan: 3 },
                'x-component-props': {
                  placeholder: I18N.base.pleaseEnter,
                  maxLength: TextAreaMaxLength3000,
                  style: {
                    height: 200,
                    alignItems: 'flex-start',
                  },
                },
              }),
              sceneDescEn: renderFormItemSchema({
                type: 'string',
                title: I18N.eca.descriptionOfEmissionReductionScenarios2,
                'x-decorator': 'FormItem',
                'x-component': 'TextArea',
                'x-decorator-props': { gridSpan: 3 },
                'x-component-props': {
                  placeholder: I18N.base.pleaseEnter,
                  maxLength: TextAreaMaxLength3000,
                  style: {
                    height: 200,
                    alignItems: 'flex-start',
                  },
                },
              }),
            },
          },
        },
      },
    },
  };
};
export const totalSchema = (): ISchema => {
  return {
    type: 'object',
    properties: {
      layout: {
        type: 'void',
        'x-component': 'FormLayout',
        'x-component-props': {
          layout: 'vertical',
        },
        properties: {
          grid: {
            type: 'void',
            'x-component': 'FormGrid',
            'x-component-props': {
              rowGap: 2,
              columnGap: 24,
              maxColumns: 3,
              minColumns: 1,
            },
            properties: {
              totalDesc: renderFormItemSchema({
                type: 'string',
                title: I18N.eca.descriptionOfOverallEmissionReduction2,
                'x-decorator': 'FormItem',
                'x-component': 'Input',
                'x-component-props': {
                  placeholder: I18N.base.pleaseEnter,
                  maxLength: InputTextLength50,
                },
              }),
              totalDescEn: renderFormItemSchema({
                type: 'string',
                title: I18N.eca.descriptionOfOverallEmissionReduction,
                'x-decorator': 'FormItem',
                'x-component': 'Input',
                'x-component-props': {
                  placeholder: I18N.base.pleaseEnter,
                  maxLength: InputTextLength50,
                },
              }),
              totalLessenType: renderFormItemSchema({
                type: 'string',
                title: I18N.eca.totalEmissionReductionCategory,
                enum: [
                  {
                    label: I18N.eca.determineValue,
                    value: '0',
                  },
                  {
                    label: I18N.eca.intervalValue,
                    value: '1',
                  },
                ],
                'x-decorator': 'FormItem',
                'x-component': 'CousRadio',
                'x-decorator-props': { gridSpan: 3 },
                'x-component-props': {
                  placeholder: I18N.base.pleaseEnter,
                  style: { width: '50%' },
                  options: [
                    {
                      label: I18N.eca.determineValue,
                      value: '0',
                    },
                    {
                      label: I18N.eca.intervalValue,
                      value: '1',
                    },
                  ],
                },
              }),
              totalStartValue: renderFormItemSchema({
                type: 'string',
                title: I18N.eca.totalEmissionReduction,
                'x-decorator': 'FormItem',
                'x-component': 'NumberPicker',
                'x-validator': [...RegNumber],
                'x-decorator-props': { gridSpan: 1 },
                'x-component-props': {
                  placeholder: I18N.base.pleaseEnter,
                  maxLength: InputTextLength50,
                  style: { width: '100%' },
                },
                'x-reactions': {
                  dependencies: ['totalLessenType'],
                  fulfill: {
                    state: {
                      display: `{{$deps[0]==='0'?'visible':'hidden'}}`,
                    },
                  },
                },
              }),
              totalStartValueTwo: renderFormItemSchema({
                type: 'void',
                title: I18N.eca.totalEmissionReduction,
                'x-decorator': 'FormItem',
                'x-component': 'FormGrid',
                'x-decorator-props': {
                  asterisk: true,
                  feedbackLayout: 'none',
                },
                'x-component-props': {
                  rowGap: 0,
                  maxColumns: 2,
                  minColumns: 2,
                },
                'x-reactions': [
                  {
                    dependencies: ['totalLessenType'],
                    fulfill: {
                      state: {
                        display: `{{$deps[0]==='1'?'visible':'hidden'}}`,
                      },
                    },
                  },
                  {
                    fulfill: {
                      schema: {
                        'x-decorator-props': {
                          asterisk: `{{!$form.readPretty}}`,
                        },
                      },
                    },
                  },
                ],
                properties: {
                  totalStartValue: renderFormItemSchema({
                    type: 'string',
                    ...initFormilyShema(
                      I18N.eca.startingAndEndingValues,
                      'NumberPicker',
                      true,
                      {},
                      true,
                    ),
                    'x-validator': [...RegNumber],
                    'x-decorator-props': {
                      addonAfter: '-',
                    },
                    'x-component-props': {
                      min: 0,
                      placeholder: I18N.eca.startingAndEndingValues,
                    },
                  }),
                  totalEndValue: renderFormItemSchema({
                    type: 'string',
                    ...initFormilyShema(
                      I18N.base.pleaseEnter,
                      'NumberPicker',
                      true,
                      {},
                      true,
                    ),
                    'x-validator': [...RegNumber],
                    'x-component-props': {
                      min: 0,
                      placeholder: I18N.base.pleaseEnter,
                    },
                    'x-reactions': {
                      dependencies: ['totalStartValue'],
                      fulfill: {
                        state: {
                          selfErrors: I18N.eca.depss,
                        },
                      },
                    },
                  }),
                },
              }),
              totalUnit: renderFormItemSchema({
                type: 'string',
                title: I18N.eca.totalEmissionReductionOrder,
                'x-decorator': 'FormItem',
                'x-component': 'Select',
                'x-decorator-props': { gridSpan: 2 },
                'x-component-props': {
                  placeholder: I18N.base.pleaseEnter,
                  style: {
                    width: '50%',
                  },
                  showSearch: true,
                  filterOption: (input: string, option: any) =>
                    (option?.label ?? '')
                      .toLowerCase()
                      .includes(input.toLowerCase()),
                },
              }),
            },
          },
        },
      },
    },
  };
};
export const unitSchema = (pageTypeInfo?: PageTypeInfo): ISchema => {
  return {
    type: 'object',
    properties: {
      layout: {
        type: 'void',
        'x-component': 'FormLayout',
        'x-component-props': {
          layout: 'vertical',
        },
        properties: {
          grid: {
            type: 'void',
            'x-component': 'FormGrid',
            'x-component-props': {
              rowGap: 2,
              columnGap: 24,
              maxColumns: 3,
              minColumns: 1,
            },
            properties: {
              unitDesc: renderFormItemSchema({
                type: 'string',
                title: I18N.eca.unitEmissionReductionDescription2,
                'x-decorator': 'FormItem',
                'x-component': 'Input',
                'x-component-props': {
                  placeholder: I18N.base.pleaseEnter,
                  maxLength: InputTextLength50,
                },
              }),
              unitDescEn: renderFormItemSchema({
                type: 'string',
                title: I18N.eca.unitEmissionReductionDescription,
                'x-decorator': 'FormItem',
                'x-component': 'Input',
                'x-component-props': {
                  placeholder: I18N.base.pleaseEnter,
                  maxLength: InputTextLength50,
                },
              }),
              unitLessenType: renderFormItemSchema({
                type: 'string',
                title: I18N.eca.unitEmissionReduction3,
                enum: [
                  {
                    label: I18N.eca.determineValue,
                    value: '0',
                  },
                  {
                    label: I18N.eca.intervalValue,
                    value: '1',
                  },
                ],
                'x-decorator': 'FormItem',
                'x-component': 'CousRadio',
                'x-decorator-props': { gridSpan: 3 },
                'x-component-props': {
                  placeholder: I18N.base.pleaseEnter,
                  style: { width: '50%' },
                  options: [
                    {
                      label: I18N.eca.determineValue,
                      value: '0',
                    },
                    {
                      label: I18N.eca.intervalValue,
                      value: '1',
                    },
                  ],
                },
              }),
              unitStartValue: renderFormItemSchema({
                type: 'string',
                title: I18N.eca.unitEmissionReduction,
                'x-validator': [...RegUnitNumber],
                'x-decorator': 'FormItem',
                'x-component': 'NumberPicker',
                'x-decorator-props': { gridSpan: 1 },
                'x-component-props': {
                  placeholder: I18N.base.pleaseEnter,
                },
                'x-reactions': {
                  dependencies: ['unitLessenType'],
                  fulfill: {
                    state: {
                      display: `{{$deps[0]==='0'?'visible':'hidden'}}`,
                    },
                  },
                },
              }),
              unitStartValueTwo: renderFormItemSchema({
                type: 'void',
                title: I18N.eca.unitEmissionReduction,
                'x-decorator': 'FormItem',
                'x-component': 'FormGrid',
                'x-decorator-props': {
                  asterisk: true,
                  feedbackLayout: 'none',
                },

                'x-component-props': {
                  rowGap: 0,
                  maxColumns: 2,
                  minColumns: 2,
                },
                'x-reactions': [
                  {
                    dependencies: ['unitLessenType'],
                    fulfill: {
                      state: {
                        display: `{{$deps[0]==='1'?'visible':'hidden'}}`,
                      },
                    },
                  },
                  {
                    fulfill: {
                      schema: {
                        'x-decorator-props': {
                          asterisk: `{{!$form.readPretty}}`,
                        },
                      },
                    },
                  },
                ],
                properties: {
                  unitStartValue: renderFormItemSchema({
                    type: 'string',
                    ...initFormilyShema('', 'NumberPicker', true, {}, true),
                    'x-validator': [...RegNumber],
                    'x-decorator-props': {
                      addonAfter: '-',
                    },
                    'x-component-props': {
                      min: 0,
                      placeholder: I18N.base.pleaseEnter,
                    },
                  }),
                  unitEndValue: renderFormItemSchema({
                    type: 'string',
                    ...initFormilyShema(
                      I18N.eca.reducedDisplacement,
                      'NumberPicker',
                      true,
                      {},
                      true,
                    ),
                    'x-validator': [...RegNumber],
                    'x-component-props': {
                      min: 0,
                      placeholder: I18N.base.pleaseEnter,
                    },
                    'x-reactions': {
                      dependencies: ['unitStartValue'],
                      fulfill: {
                        state: {
                          selfErrors: I18N.eca.depss,
                        },
                      },
                    },
                  }),
                },
              }),
              unit: renderFormItemSchema({
                type: 'void',
                required: true,
                title: I18N.eca.unitEmissionReduction2,
                'x-decorator': 'FormItem',
                'x-component': 'FormGrid',
                'x-decorator-props': {
                  asterisk: `{{!$form.readPretty}}`,
                  feedbackLayout: 'none',
                },
                'x-component-props': {
                  rowGap: 0,
                  maxColumns: 2,
                  minColumns: 2,
                },
                properties: {
                  unitNumeratorUnit: renderFormItemSchema({
                    type: 'string',
                    'x-decorator-props': {
                      addonAfter: '/',
                    },
                    validateTitle: I18N.Factors.molecularUnit,
                    'x-validator': [
                      {
                        require: true,
                        message: I18N.eca.pleaseSelectTheNumerator,
                      },
                    ],
                    'x-component': 'Select',
                    'x-component-props': {
                      placeholder: I18N.Factors.molecularUnit,
                      showSearch: true,
                      filterOption: (input: string, option: any) =>
                        (option?.label ?? '')
                          .toLowerCase()
                          .includes(input.toLowerCase()),
                    },
                  }),
                  unitDenominatorUnit: renderFormItemSchema({
                    validateTitle: I18N.Factors.denominatorUnit,
                    type: 'string',
                    'x-component':
                      pageTypeInfo === PageTypeInfo.show
                        ? 'Cascader'
                        : 'Cascader',
                    'x-validator': [
                      {
                        require: true,
                        message: I18N.eca.pleaseSelectTheDenominator,
                      },
                    ],
                    'x-component-props': {
                      placeholder: I18N.Factors.denominatorUnit,
                      displayRender: (label: string[]) => {
                        if (!label) return '';
                        return label.slice(-1);
                      },
                      showSearch: (
                        inputValue: string,
                        path: DefaultOptionType[],
                      ) =>
                        path.some(
                          option =>
                            (option.label as string)
                              .toLowerCase()
                              .indexOf(inputValue.toLowerCase()) > -1,
                        ),
                    },
                  }),
                },
              }),
            },
          },
        },
      },
    },
  };
};
