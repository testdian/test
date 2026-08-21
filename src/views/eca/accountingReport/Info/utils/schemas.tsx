import { ISchema } from '@formily/react';

import {
  renderFormItemSchema,
  renderEmptySchema,
} from '@/components/formily/utils';

// 报告信息
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
            type: 'void',
            'x-component': 'FormGrid',
            'x-component-props': {
              rowGap: 2,
              columnGap: 24,
              maxColumns: 3,
              minColumns: 3,
            },
            properties: {
              // 报告名称
              reportName: renderFormItemSchema({
                type: 'string',
                title: '报告名称',
                'x-component': 'Input',
                'x-component-props': {
                  maxLength: 100,
                },
              }),
              // 核算年度
              year: renderFormItemSchema({
                type: 'number',
                title: '核算年度',
                'x-component': 'Select',
                'x-component-props': {
                  showSearch: true,
                  allowClear: true,
                  optionFilterProp: 'label',
                },
              }),
              emptyTwo: renderEmptySchema({
                'x-decorator-props': {
                  gridSpan: 2,
                },
              }),
              // 核算组织
              orgCodes: renderFormItemSchema({
                type: 'array',
                title: '核算组织',
                'x-decorator-props': {
                  gridSpan: 2,
                },
                'x-component': 'Select',
                'x-component-props': {
                  showSearch: true,
                  allowClear: true,
                  optionFilterProp: 'label',
                  mode: 'multiple',
                },
                'x-reactions': [`{{ useAsyncOrgDataSource() }}`],
              }),
            },
          },
        },
      },
    },
  };
};
