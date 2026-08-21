import { ISchema } from '@formily/react';
import I18N from '@src/lang/I18N';
import { TreeProps } from 'antd';
import { TreeNodeNormal } from 'antd/lib/tree/Tree';

import { OrgTree } from '@/sdks_v2/new/computationV2ApiDocs';
import { changeTableColumnsNoText } from '@/utils';
import { publishYear } from '@/views/Factors/utils';

export type CheckInfo<T extends TreeNodeNormal = any> = Parameters<
  NonNullable<TreeProps<T>['onCheck']>
>[1];

export const schema = (dataSource?: OrgTree[]): ISchema => {
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
              rowGap: 10,
              columnGap: 24,
              maxColumns: 3,
              minColumns: 3,
            },
            properties: {
              computationName: {
                type: 'string',
                title: I18N.eca.accountingName,
                'x-validator': [
                  { required: true, message: I18N.base.pleaseEnter },
                  // (value: string) => {
                  //   if (value.length > 50) {
                  //     return I18N.eca.inputCharacters;
                  //   }
                  //   return '';
                  // },
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
                title: I18N.eca.accountingOrganization,
                'x-validator': [
                  { required: true, message: I18N.Factors.pleaseSelect },
                ],
                'x-decorator': 'FormItem',
                'x-component': 'Select',
                'x-component-props': {
                  placeholder: I18N.Factors.pleaseSelect,
                  showSearch: true,
                  filterOption: (input: string, option: any) =>
                    (option?.label ?? '')
                      .toLowerCase()
                      .includes(input.toLowerCase()),
                },
              },
              year: {
                type: 'string',
                title: I18N.carbonData.accountingYear,
                'x-validator': [
                  { required: true, message: I18N.Factors.pleaseSelect },
                ],
                'x-decorator': 'FormItem',
                'x-component': 'Select',
                'x-component-props': {
                  placeholder: I18N.Factors.pleaseSelect,
                  options: publishYear().map(item => {
                    return {
                      label: item,
                      value: item,
                    };
                  }),
                },
              },
              dataPeriod: {
                type: 'string',
                title: I18N.eca.dataCollectionWeek,
                enum: [
                  {
                    label: I18N.eca.yearly,
                    value: '1',
                  },
                  {
                    label: I18N.eca.quarterly,
                    value: '2',
                  },
                  {
                    label: I18N.eca.monthly,
                    value: '3',
                  },
                ],
                'x-validator': [
                  { required: true, message: I18N.Factors.pleaseSelect },
                ],
                'x-decorator': 'FormItem',
                'x-component': 'Radio.Group',
                'x-component-props': {
                  placeholder: I18N.Factors.pleaseSelect,
                },
              },
              gwpVersion: {
                type: 'string',
                title: I18N.supplyChainCarbonManagement.gwpVersion,
                'x-validator': [
                  { required: true, message: I18N.Factors.pleaseSelect },
                ],
                'x-decorator': 'FormItem',
                'x-component': 'Select',
                'x-component-props': {
                  placeholder: I18N.Factors.pleaseSelect,
                },
              },
              modelId: {
                type: 'string',
                title: I18N.Factors.accountingModel,
                // 'x-validator': [
                //   { required: true, message: I18N.Factors.pleaseSelect },
                // ],
                'x-decorator': 'FormItem',
                'x-component': 'Select',
                'x-component-props': {
                  placeholder: I18N.Factors.pleaseSelect,
                  allowClear: true,
                },
              },

              allCheckedList: {
                type: 'Array',
                title: I18N.eca.organizationalScope,

                'x-decorator-props': {
                  gridSpan: 4,
                  strictAutoFit: true,
                  tooltip: <div>{I18N.eca.optionalSubordinates}</div>,
                },
                'x-validator': [
                  {
                    required: true,
                    message: I18N.eca.pleaseSelectAnOrganization,
                  },
                ],
                'x-decorator': 'FormItem',
                'x-component': 'CustomTable',
                'x-component-props': {
                  pagination: false,
                  rowKey: 'orgName',
                  colums: changeTableColumnsNoText(
                    [
                      {
                        title: I18N.carbonData.organizationName,
                        dataIndex: 'name',
                        width: '100%',
                      },
                      // {
                      //   title: I18N.Factors.accountingModel,
                      //   dataIndex: 'modelName',
                      //   width: '50%',
                      // },
                    ],
                    '-',
                  ),
                  dataSource,
                  style: { width: '100%' },
                  scroll: { x: 1200 },
                },
              },
            },
          },
        },
      },
    },
  };
};
