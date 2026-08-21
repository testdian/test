import { ISchema } from '@formily/react';
import I18N from '@src/lang/I18N';

import {
  renderFormItemSchema,
  renderFromGridSchema,
} from '@/components/formily/utils';

export const schema = (): ISchema => {
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
              roleName: renderFormItemSchema({
                type: 'number',
                title: I18N.eca.dataLabel,
                required: true,
                enum: [{ label: I18N.eca.dataLabel, value: 1 }],
              }),
              roleInfo: renderFormItemSchema({
                type: 'string',
                title: I18N.eca.dataTable,
                required: true,
                'x-component-props': {
                  maxLength: 100,
                  style: { maxWidth: 400 },
                },
              }),
              roleInfo1: renderFormItemSchema({
                type: 'string',
                title: I18N.eca.grid,
                required: true,
                enum: [{ label: I18N.eca.grid, value: 1 }],
              }),
            },
          },
        },
      },
    },
  };
};
