import I18N from '@src/lang/I18N';

import {
  renderEmptySchema,
  renderFormilyTableAction,
  renderFormItemSchema,
  renderFromGridSchema,
  renderSchemaWithLayout,
} from '@/components/formily/utils';
import { getApprovalNodeLevel } from '@/utils';

import { ADUDIT_REQUIRED_OPTIONS, ADUDIT_REQUIRED_TYPE } from './constant';

const { REQUIRED } = ADUDIT_REQUIRED_TYPE;

export const schema = (
  isDetail: boolean,
  changeTableRow: (index: any, value: any) => void,
) =>
  renderSchemaWithLayout(
    {},
    {
      grid: {
        ...renderFromGridSchema(),
        properties: {
          auditRequired: renderFormItemSchema({
            title: I18N.dashborad.approvalConfiguration,
            'x-component': 'Radio.Group',
            enum: ADUDIT_REQUIRED_OPTIONS,
            default: REQUIRED,
            'x-decorator-props': {
              gridSpan: 3,
              className: 'testStyleLayout',
            },
          }),
          nodeList: {
            type: 'array',
            title: '',
            'x-component': 'ArrayTable',
            'x-decorator': 'FormItem',
            'x-decorator-props': {
              gridSpan: 3,
              className: 'testStyleLayout',
            },
            'x-component-props': {
              pagination: false,
              scroll: { x: 1200 },
            },
            'x-reactions': {
              dependencies: ['auditRequired'],
              fulfill: {
                schema: {
                  'x-visible': `{{$deps[0] === ${REQUIRED} }}`,
                },
              },
            },
            // columns
            items: {
              type: 'object',
              properties: {
                column1: {
                  type: 'void',
                  'x-component': 'ArrayTable.Column',
                  'x-component-props': {
                    title: I18N.dashborad.approvalNodes,
                    width: 160,
                    fixed: 'left',
                  },
                  properties: {
                    nodeLevel: renderEmptySchema(
                      { type: 'string' },
                      {
                        showVal: (_, index) =>
                          getApprovalNodeLevel(Number(index) || 0),
                      },
                    ),
                  },
                },
                column2: {
                  type: 'void',
                  'x-component': 'ArrayTable.Column',
                  'x-component-props': { title: I18N.dashborad.approvalNodes },
                  properties: {
                    nodeName: renderFormItemSchema({
                      validateTitle: I18N.dashborad.nodeName,
                      'x-component': 'Input',
                      'x-component-props': {
                        maxLength: 50,
                      },
                    }),
                  },
                },
                column3: {
                  type: 'void',
                  'x-component': 'ArrayTable.Column',
                  'x-component-props': {
                    title: I18N.dashborad.approvalConfigurationClass,
                  },
                  properties: {
                    configType: renderFormItemSchema({
                      validateTitle: I18N.dashborad.approvalConfiguration,
                      'x-component': 'Select',
                    }),
                  },
                },
                column4: {
                  type: 'void',
                  'x-component': 'ArrayTable.Column',
                  'x-component-props': {
                    title: I18N.dashborad.approvalConfiguration,
                  },
                  properties: {
                    configGrid: {
                      ...renderFromGridSchema({ columns: 2 }),
                      properties: {
                        targetIds: renderFormItemSchema({
                          'x-decorator-props': { gridSpan: 2 },
                          validateTitle: I18N.dashborad.user,
                          'x-component': 'Select',
                          'x-component-props': {
                            mode: 'multiple',
                            showSearch: true,
                            filterOption: (input: string, option: any) =>
                              (option?.label ?? '')
                                .toLowerCase()
                                .includes(input.toLowerCase()),
                          },
                        }),
                        auditOrgId: renderFormItemSchema({
                          validateTitle: I18N.dashborad.organization,
                          required: false,
                          'x-component': 'Select',
                          'x-visible': false,
                        }),
                        targetRoleId: renderFormItemSchema({
                          validateTitle: I18N.dashborad.role,
                          'x-component': 'Select',
                          'x-visible': false,
                        }),
                      },
                    },
                  },
                },
                column5: renderFormilyTableAction({
                  actionBtns: ({ index, array }) => [
                    {
                      label: I18N.Factors.newAddition,
                      key: 'Add',
                      disabled:
                        isDetail ||
                        index < array.field.value.length - 1 ||
                        index === 9,
                      onClick: async () => {
                        const { value } = array.field;
                        array.field.push({
                          nodeLevel: value[value.length - 1].nodeLevel + 1,
                          configType: null,
                        });
                        changeTableRow(index + 1, 0);
                      },
                    },
                    {
                      label: I18N.Factors.delete,
                      key: 'del',
                      disabled: isDetail || index === 0,
                      onClick: async () => {
                        array.field.remove(index);
                      },
                    },
                  ],
                  // width: 120,
                  wrapperProps: {
                    'x-component-props': {
                      fixed: 'right',
                    },
                  },
                }),
              },
            },
          },
        },
      },
    },
  );
