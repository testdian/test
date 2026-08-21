/*
 * @@description:
 * @Author: qifeng qifeng@carbonstop.net
 * @Date: 2023-01-16 09:48:53
 * @LastEditors: ljh255 jinhai@carbonstop.net
 * @LastEditTime: 2023-04-14 16:18:27
 */
import { ISchema } from '@formily/react';
import I18N from '@src/lang/I18N';
import { TreeProps } from 'antd';
import { TreeNodeNormal } from 'antd/lib/tree/Tree';

import { InputTextLength200 } from '@/views/eca/util/type';

export type CheckInfo<T extends TreeNodeNormal = any> = Parameters<
  NonNullable<TreeProps<T>['onCheck']>
>[1];

export const schema = (
  status?: 'ADD' | 'EDIT' | 'COPY' | 'SHOW' | 'DEL',
): ISchema => {
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
              maxColumns: 1,
              minColumns: 1,
            },
            properties: {
              modelName: {
                type: 'string',
                title: I18N.carbonFootPrintLCA.modelName,
                'x-validator': [
                  { required: true, message: I18N.eca.pleaseInputTheModel },
                  (value: string) => {
                    if (value === '-') {
                      return I18N.eca.modelNameNotApplicable;
                    }
                    return '';
                  },
                  (value: string) => {
                    if (value?.length > 50) {
                      return I18N.eca.inputCharacters;
                    }
                    return '';
                  },
                ],
                'x-decorator': 'FormItem',
                'x-component': 'Input',
                'x-component-props': {
                  placeholder: I18N.base.pleaseEnter,
                  maxLength: 50,
                },
              },
              orgId: {
                type: 'string',
                title: I18N.carbonData.affiliatedOrganization,
                'x-validator': [
                  {
                    required: true,
                    message: I18N.eca.pleaseSelectTheAffiliation,
                  },
                ],
                'x-decorator': 'FormItem',
                'x-component': 'Select',
                'x-component-props': {
                  disabled: status === 'EDIT',
                  placeholder: I18N.Factors.pleaseSelect,
                  showSearch: true,
                  filterOption: (input: string, option: any) =>
                    (option?.label ?? '')
                      .toLowerCase()
                      .includes(input.toLowerCase()),
                },
              },
              intro: {
                type: 'string',
                title: I18N.eca.modelIntroduction,
                // 'x-validator': [{ required: true, message: '请输入模型简介' }],
                'x-decorator': 'FormItem',
                'x-component': 'TextArea',
                'x-component-props': {
                  placeholder: I18N.base.pleaseEnter,
                  maxLength: InputTextLength200,
                  alignItems: 'flex-start',
                },
              },
            },
          },
        },
      },
    },
  };
};
