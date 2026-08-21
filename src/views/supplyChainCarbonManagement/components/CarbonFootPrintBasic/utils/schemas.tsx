/*
 * @@description:
 * @Author: liuxinxin xinxin@carbonstop.net
 * @Date: 2023-06-06 10:08:45
 * @LastEditors: liuxinxin xinxin@carbonstop.net
 * @LastEditTime: 2023-06-19 13:16:20
 */
import I18N from '@src/lang/I18N';

import {
  renderFormItemSchema,
  renderSchemaWithLayout,
  renderFromGridSchema,
} from '@/components/formily/utils';

export const Schema = () =>
  renderSchemaWithLayout(
    {},
    {
      grid: {
        ...renderFromGridSchema({
          columns: 2,
        }),
        properties: {
          productionName: renderFormItemSchema({
            title: I18N.carbonFootPrint.accountingProducts,
            type: 'number',
            'x-component': 'Select',
            'x-component-props': {
              showSearch: true,
              optionFilterProp: 'label',
            },
          }),
          checkContent: {
            type: 'void',
            title: I18N.carbonFootPrint.accountingQuantity,
            'x-decorator': 'FormItem',
            'x-component': 'FormGrid',
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
              checkCount: renderFormItemSchema({
                validateTitle: I18N.carbonFootPrint.accountingQuantity,
                type: 'number',
                'x-component': 'NumberPicker',
                'x-component-props': {
                  placeholder: I18N.base.pleaseEnter,
                },
              }),
              checkUnit: renderFormItemSchema({
                validateTitle: I18N.carbonFootPrint.accountingUnit,
                'x-component': 'Cascader',
                'x-component-props': {
                  placeholder: I18N.carbonFootPrint.pleaseSelectAUnit,
                },
              }),
            },
          },
          functionalUnit: renderFormItemSchema({
            title: I18N.carbonFootPrintLCA.functionalUnits,
            'x-component': 'Input',
            'x-component-props': {
              maxLength: 100,
            },
          }),
          '[beginDate, endTime]': renderFormItemSchema({
            title: I18N.carbonFootPrint.accountingCycle,
            'x-component': 'DatePicker.RangePicker',
            'x-component-props': {
              placeholder: [
                I18N.carbonFootPrintLCA.startDate,
                I18N.carbonFootPrintLCA.endDate,
              ],
              placement: 'bottomLeft',
              getPopupContainer: (el: HTMLElement) => {
                return el;
              },
            },
          }),
          type: renderFormItemSchema({
            title: I18N.Factors.systemBoundary,
            'x-decorator-props': {
              gridSpan: 2,
            },
            'x-component': 'Radio.Group',
          }),
        },
      },
    },
  );
