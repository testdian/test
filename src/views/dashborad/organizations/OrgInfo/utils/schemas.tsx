/*
 * @@description:
 * @Author: qifeng qifeng@carbonstop.net
 * @Date: 2023-01-16 09:48:53
 * @LastEditors: ljh255 jinhai@carbonstop.net
 * @LastEditTime: 2023-03-22 16:28:31
 */
import { ISchema } from '@formily/react';
import I18N from '@src/lang/I18N';

import {
  renderEmptySchema,
  renderFromGridSchema,
} from '@/components/formily/utils';

import style from '../index.module.less';

export const schema = (): ISchema => {
  return {
    type: 'object',
    properties: {
      layout: {
        type: 'void',
        'x-component': 'FormLayout',
        'x-component-props': {
          layout: 'vertical',
          // className: style.gridWrapper,
        },
        properties: {
          grid: {
            ...renderFromGridSchema(),
            properties: {
              orgName: {
                type: 'string',
                title: I18N.dashborad.inTheNameOfTheOrganization,
                required: true,
                'x-decorator': 'FormItem',
                'x-decorator-props': {
                  gridSpan: 1,
                },
                'x-validator': [
                  {
                    required: true,
                    message: I18N.base.pleaseEnter,
                  },
                ],
                'x-component': 'Input',
                'x-component-props': {
                  placeholder: I18N.base.pleaseEnter,
                  maxLength: 100,
                },
              },
              orgNameEn: {
                type: 'string',
                title: I18N.dashborad.organizationNameInEnglish,
                required: true,
                'x-decorator': 'FormItem',
                'x-decorator-props': {
                  gridSpan: 1,
                },
                'x-validator': [
                  {
                    required: true,
                    message: I18N.base.pleaseEnter,
                  },
                ],
                'x-component': 'Input',
                'x-component-props': {
                  placeholder: I18N.base.pleaseEnter,
                  maxLength: 100,
                },
              },
              orgAbbr: {
                type: 'string',
                title: I18N.dashborad.organizationalAbbreviation,
                required: true,
                'x-validator': [
                  {
                    required: true,
                    message: I18N.dashborad.pleaseEnterTheOrganization2,
                  },
                ],
                'x-decorator': 'FormItem',
                'x-decorator-props': {
                  gridSpan: 1,
                },
                'x-component': 'Input',
                'x-component-props': {
                  placeholder: I18N.base.pleaseEnter,
                  maxLength: 50,
                },
              },
              orgCode: {
                type: 'string',
                title: I18N.dashborad.organizationalCode,
                'x-decorator': 'FormItem',
                'x-decorator-props': {
                  gridSpan: 1,
                },
                // 'x-validator': [
                //   // eslint-disable-next-line consistent-return
                //   (value: string) => {
                //     if (!value) return Promise.resolve('请输入组织编码');

                //     if (!/^[a-zA-Z0-9]+$/.test(value))
                //       return Promise.resolve('组织编码格式不正确');
                //   },
                // ],
                'x-validator': [
                  {
                    required: true,
                    message: I18N.dashborad.pleaseEnterTheOrganization,
                  },
                  {
                    pattern: /^[a-zA-Z0-9]+$/,
                    message: I18N.dashborad.organizationalCodingGrid,
                  },
                ],
                'x-component': 'Input',
                'x-component-props': {
                  placeholder: I18N.base.pleaseEnter,
                  maxLength: 50,
                },
              },
              orgType: {
                type: 'string',
                title: I18N.dashborad.organizationalType,
                required: true,
                'x-decorator': 'FormItem',
                'x-decorator-props': {
                  gridSpan: 1,
                },
                'x-component': 'Select',
                'x-component-props': {
                  disabled: true,
                  placeholder: I18N.base.pleaseEnter,
                },
                enum: [
                  { label: I18N.dashborad.monomerOrganization, value: '0' },
                  { label: I18N.dashborad.group, value: '1' },
                  { label: I18N.dashborad.suborganization, value: '2' },
                  { label: I18N.dashborad.department, value: '3' },
                ],
              },
              empty: renderEmptySchema({
                'x-decorator-props': {
                  gridSpan: 3,
                },
              }),
              pid: {
                type: 'string',
                title: I18N.dashborad.superiorOrganization,
                required: true,
                'x-decorator': 'FormItem',
                'x-component': 'TreeSelect',
                'x-decorator-props': {
                  gridSpan: 2,
                  className: style.grid1Row,
                },
                'x-component-props': {
                  placeholder: I18N.Factors.pleaseSelect,
                  fieldNames: { label: 'name', value: 'code' },
                  showSearch: true,
                  allowClear: true,
                  treeDefaultExpandAll: true,
                  filterTreeNode: (input: string, option: any) => {
                    return (option?.name ?? '').includes(input);
                  },
                },
                'x-reactions': [
                  {
                    dependencies: ['orgType'],
                    fulfill: {
                      state: {
                        visible: `{{Number($deps[0]) > 1 }}`,
                      },
                    },
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
