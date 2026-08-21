import { ISchema } from '@formily/react';
import I18N from '@src/lang/I18N';

import {
  renderFormItemSchema,
  renderFromGridSchema,
} from '@/components/formily/utils';
import { SearchSchemaSelectUtils } from '@/utils/schema';

export const accountSchema = (): ISchema => {
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
            ...renderFromGridSchema({ columns: 1 }),
            properties: {
              year: renderFormItemSchema({
                type: 'string',
                title: I18N.components.accountingYear,
                'x-component': 'Input',
                'x-disabled': true,
              }),
              orgVersion: renderFormItemSchema({
                title: '核算组织范围',
                'x-component': 'Select',
              }),
              orgCodeList: renderFormItemSchema({
                validateTitle: '核算组织',
                'x-component': 'FormilyTree',
                'x-component-props': {
                  defaultExpandAll: true,
                  multiple: true,
                  checkable: true,
                  checkStrictly: true,
                  blockNode: true,
                  selectable: false,
                  fieldNames: {
                    title: 'label',
                    key: 'value',
                  },
                },
                'x-reactions': '{{useAsyncOrgDataSource()}}',
              }),
              gwpVersion: renderFormItemSchema({
                title: I18N.eca.gwpInformation,
                'x-component': 'Select',
                'x-component-props': {
                  ...SearchSchemaSelectUtils,
                },
              }),
              emissionUnit: renderFormItemSchema({
                title: '排放量单位',
                'x-component': 'Radio.Group',
                // TODOCYH 换枚举接口 EmissionUnit
                enum: [
                  { label: 'tCO₂e', value: 2 },
                  { label: 'kgCO₂e', value: 1 },
                ],
              }),
              emissionPoint: renderFormItemSchema({
                title: '排放量保留小数位',
                'x-component': 'NumberPicker',
                'x-component-props': {
                  min: 0,
                  max: 10,
                  precision: 0,
                },
              }),
            },
          },
        },
      },
    },
  };
};
