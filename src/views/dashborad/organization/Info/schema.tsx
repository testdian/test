import { ISchema } from '@formily/react';

import {
  renderFormItemSchema,
  renderFromGridSchema,
} from '@/components/formily/utils';

/** 基本信息Schema */
export const schema = (): ISchema => ({
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
          ...renderFromGridSchema(),
          properties: {
            orgName: renderFormItemSchema({
              title: '组织名称',
              'x-component': 'Input',
              'x-decorator-props': {
                gridSpan: 3,
              },
            }),
            orgCode: renderFormItemSchema({
              title: '组织ID',
              'x-component': 'Input',
              'x-decorator-props': {
                gridSpan: 3,
              },
            }),
            pcode: renderFormItemSchema({
              title: '上级组织',
              'x-component': 'TreeSelect',
              'x-component-props': {
                showSearch: true,
                allowClear: true,
                treeDefaultExpandAll: true,
                optionFilterProp: 'label',
              },
              'x-decorator-props': {
                gridSpan: 3,
              },
            }),
            prate: renderFormItemSchema({
              title: '上级组织所占股权比（%）',
              'x-component': 'NumberPicker',
              'x-component-props': {
                min: 0,
                max: 100,
              },
              'x-decorator-props': {
                gridSpan: 3,
              },
            }),
          },
        },
      },
    },
  },
});
