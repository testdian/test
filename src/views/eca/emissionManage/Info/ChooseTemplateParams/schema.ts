import { ISchema } from '@formily/react';
import I18N from '@src/lang/I18N';

import {
  renderFormItemSchema,
  renderFromGridSchema,
} from '@/components/formily/utils';

/** 选择参数表单：主要参数、关联参数 */
export const chooseParamsSchema = (): ISchema => {
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
            ...renderFromGridSchema({ columns: 2 }),
            properties: {
              paramMain: renderFormItemSchema({
                type: 'string',
                title: I18N.eca.parameters,
                'x-decorator': 'FormItem',
                'x-component': 'Select',
                'x-decorator-props': {
                  gridSpan: 1,
                },
                'x-component-props': {},
              }),
              paramRelation: renderFormItemSchema({
                type: 'string',
                title: I18N.eca.associationParameter,
                'x-decorator': 'FormItem',
                'x-component': 'Select',
                'x-decorator-props': {
                  gridSpan: 1,
                },
                'x-component-props': {
                  mode: 'multiple',
                },
              }),
            },
          },
        },
      },
    },
  };
};
