import { ISchema } from '@formily/react';
import I18N from '@src/lang/I18N';

import {
  renderFormItemSchema,
  renderSchemaWithLayout,
  renderFromGridSchema,
} from '@/components/formily/utils';
import { InputTextLength100 } from '@/views/eca/util/type';

// 枚举值定义 - 可单独提取到常量文件中维护
export const IndexDimensionOptions = [
  // { label: I18N.eca.total, value: 1 },
  { label: '各组织', value: 2 },
  // { label: I18N.eca.typesOfPositions, value: 3 },
];

export const IndexDataPeriodOptions = [
  { label: I18N.eca.yearly, value: 1 },
  { label: I18N.eca.quarterly, value: 2 },
  { label: I18N.eca.monthly, value: 3 },
];

export const IndexStatisticalOptions = [
  { label: I18N.eca.actualValue, value: 1 },
  { label: I18N.eca.cumulativeValue, value: 2 },
  { label: I18N.carbonFootPrintLCA.averageValue, value: 3 },
];

// 指标表单Schema
export const indexFormSchema: ISchema = renderSchemaWithLayout(
  {},
  {
    grid: {
      ...renderFromGridSchema({
        columns: 2,
      }),
      properties: {
        indexName: renderFormItemSchema({
          type: 'string',
          title: I18N.prodManagement.indicatorName,
          required: true,
          'x-component': 'Input',
          'x-component-props': {
            maxLength: InputTextLength100,
          },
        }),
        compoundUnit: {
          type: 'void',
          title: I18N.Factors.unit,
          'x-decorator': 'FormItem',
          'x-component': 'FormGrid',
          'x-component-props': {},
          'x-reactions': [
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
            unit: renderFormItemSchema({
              'x-component': 'Cascader',
              'x-component-props': {
                placeholder: I18N.Factors.pleaseSelect,
                displayRender: (label: string[]) => {
                  if (!label) return '';
                  return label.slice(-1);
                },
                showSearch: true,
              },
            }),
          },
        },
        year: renderFormItemSchema({
          type: 'number',
          title: I18N.prodManagement.year,
          required: true,
          'x-component': 'DatePicker',
          'x-decorator-props': {
            gridSpan: 2,
          },
          'x-component-props': {
            picker: 'year',
            style: {
              width: '50%',
            },
          },
        }),
        /** 涉及类别 */
        // scopeType: renderFormItemSchema({
        //   type: 'string',
        //   title: I18N.eca.involvingCategories,
        //   required: false,
        //   'x-component': 'Radio.Group',
        //   'x-decorator-props': {
        //     gridSpan: 2,
        //   },
        //   'x-component-props': {},
        // }),
        indexDimension: renderFormItemSchema({
          type: 'number',
          title: I18N.eca.dimension,
          'x-component': 'Radio.Group',
          'x-decorator-props': {
            gridSpan: 2,
          },
          'x-component-props': {
            options: IndexDimensionOptions,
          },
        }),
        indexDataPeriod: renderFormItemSchema({
          type: 'number',
          title: I18N.eca.dataEntryWeek,
          'x-component': 'Radio.Group',
          'x-decorator-props': {
            gridSpan: 2,
          },
          'x-component-props': {
            options: IndexDataPeriodOptions,
          },
        }),
        indexStatistical: renderFormItemSchema({
          type: 'number',
          title: I18N.eca.statisticalDimension,
          'x-component': 'Radio.Group',
          'x-component-props': {
            options: IndexStatisticalOptions,
          },
        }),
      },
    },
  },
);
