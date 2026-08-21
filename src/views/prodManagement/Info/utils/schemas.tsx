/*
 * @@description: 运营数据 schemas
 */
import { ISchema } from '@formily/react';
import I18N from '@src/lang/I18N';
import { TreeProps } from 'antd';
import { TreeNodeNormal } from 'antd/lib/tree/Tree';

import { renderFormItemSchema } from '@/components/formily/utils';
import { PageTypeInfo } from '@/router/utils/enums';

export type CheckInfo<T extends TreeNodeNormal = any> = Parameters<
  NonNullable<TreeProps<T>['onCheck']>
>[1];

export const Schema = (pageTypeInfo?: PageTypeInfo): ISchema => {
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
              year: renderFormItemSchema({
                title: I18N.prodManagement.year,
                required: true,
                type: 'string',
                'x-component': 'Select',
                'x-component-props': {
                  disabled: pageTypeInfo !== PageTypeInfo.add,
                  style: {
                    width: '100%',
                  },
                  showSearch: true,
                  filterOption: (input: string, option: any) =>
                    (option?.label ?? '')
                      .toLowerCase()
                      .includes(input.toLowerCase()),
                },
              }),
              orgId: renderFormItemSchema({
                title: I18N.carbonData.affiliatedOrganization,
                required: true,
                type: 'string',
                'x-component': 'Select',
                'x-decorator-props': { gridSpan: 3 },
                'x-component-props': {
                  disabled: pageTypeInfo !== PageTypeInfo.add,
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
              metricsList: {
                type: 'string',
                title: '',
                'x-decorator': 'FormItem',
                'x-component': 'ComTable',
                'x-decorator-props': { gridSpan: 3 },
                'x-validator': [
                  {
                    require: true,
                    message: I18N.prodManagement.pleaseAddOperations,
                  },
                ],
              },
            },
          },
        },
      },
    },
  };
};
