/*
 * @@description:
 * @Author: qifeng qifeng@carbonstop.net
 * @Date: 2023-01-16 09:48:53
 * @LastEditors: ljh255 jinhai@carbonstop.net
 * @LastEditTime: 2023-06-14 11:13:43
 */
import { ISchema } from '@formily/react';
import I18N from '@src/lang/I18N';
import { TreeProps } from 'antd';
import { TreeNodeNormal } from 'antd/lib/tree/Tree';

import { renderFromGridSchema } from '@/components/formily/utils';
import { 树 } from '@/sdks/systemV2ApiDocs';

export type CheckInfo<T extends TreeNodeNormal = any> = Parameters<
  NonNullable<TreeProps<T>['onCheck']>
>[1];

export const schema = ({
  permissionTree,
  onTreeChange,
}: {
  permissionTree?: 树;
  onTreeChange?: <T extends TreeNodeNormal = any>(ev: CheckInfo<T>) => void;
}): ISchema => {
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
              roleName: {
                type: 'string',
                title: I18N.dashborad.roleName,
                'x-validator': [
                  {
                    required: true,
                    message: I18N.dashborad.pleaseEnterTheRole2,
                  },
                ],
                'x-decorator': 'FormItem',
                'x-component': 'Input',
                'x-component-props': {
                  placeholder: I18N.base.pleaseEnter,
                  maxLength: 50,
                  style: { maxWidth: 400 },
                },
              },
              roleInfo: {
                type: 'string',
                title: I18N.dashborad.characterDescription,
                'x-validator': [
                  {
                    required: true,
                    message: I18N.dashborad.pleaseEnterTheRole,
                  },
                ],
                'x-decorator': 'FormItem',
                'x-component': 'Input.TextArea',
                'x-component-props': {
                  placeholder: I18N.base.pleaseEnter,
                  maxLength: 100,
                  style: { maxWidth: 800, height: 100 },
                },
              },
              allCheckedList: {
                type: 'string',
                title: I18N.dashborad.functionalPermissions,
                // 'x-validator': [{ required: true, message: '请选择功能权限' }],
                'x-decorator': 'FormItem',
                'x-component': 'Tree',
                'x-component-props': {
                  checkable: true,
                  defaultExpandAll: true,
                  onCheck: onTreeChange,
                  dataSource: permissionTree?.tree,
                  selectable: false,
                  fieldNames: {
                    title: 'name',
                    key: 'code',
                  },
                },
              },
            },
          },
        },
      },
    },
  };
};
