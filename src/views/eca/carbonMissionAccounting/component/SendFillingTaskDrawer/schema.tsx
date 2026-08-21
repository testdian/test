import { TreeProps } from 'antd';
import { TreeNodeNormal } from 'antd/lib/tree/Tree';
import { uniqueId } from 'lodash-es';

import {
  renderFormItemSchema,
  renderSchemaWithLayout,
  renderFromGridSchema,
  renderFormilyTableAction,
} from '@/components/formily/utils';
import I18N from '@/lang/I18N';
import { PageTypeInfo } from '@/router/utils/enums';
import { shakingObj } from '@/utils';
import { emailReg } from '@/utils/regs';
import { SearchSchemaSelectUtils } from '@/utils/schema';
import { UserInfoListType } from '@/views/dashborad/EmailTemplate/type';
import {
  InputTextLength200,
  TextAreaMaxLength5000,
} from '@/views/eca/util/type';

import {
  copyTypeOptions,
  ToConfigType,
  CcConfigType,
  emailTypeOptions,
  mailSendTypeOptions,
} from './config';

export type CheckInfo<T extends TreeNodeNormal = any> = Parameters<
  NonNullable<TreeProps<T>['onCheck']>
>[1];

/** 邮件标题 */
const subjectTooltipText = I18N.dashborad.supportDynamicParameters2;

/** 邮件内容 */
const contentTooltipText = I18N.dashborad.supportDynamicParameters2;

/** 邮件发送管理表单 */
export const sendEmailSchema = ({
  actionType,
  isDetail,
  ccConfigType,
  toConfigType,
  onMailTemplateIdChange,
  onUpdateRemovedUser,
  onRolesIdChange,
  onToConfigChange,
  onCconfigChange,
  onToConfigRolesIdChange,
  onToConfigUpdateRemovedUser,
  onCreateUserOptionsChange,
  onCreateCcConfigUserOptionsChange,
}: {
  /** 抽屉类型 */
  actionType: PageTypeInfo;
  /** 是否是详情 */
  isDetail: boolean;
  /**  抄送人类型 */
  ccConfigType: CcConfigType;
  /** 收件人类型 */
  toConfigType: ToConfigType;
  /** 邮件模版下拉列表选择 */
  onMailTemplateIdChange: (value: number, option: any) => void;

  /** 抄送人切换  */
  onCconfigChange: (e: { target: { value: number } }) => void;
  /** 收件人切换 */
  onToConfigChange: (e: { target: { value: number } }) => void;

  /** 抄送人下拉列表选择 */
  onRolesIdChange: (value: number[], option: any) => void;
  /** 收件人下拉列表选择 */
  onToConfigRolesIdChange: (value: number[], option: any) => void;

  /** 收件人表格删除 */
  onToConfigUpdateRemovedUser: (row: UserInfoListType) => void;
  /** 抄送人表格删除 */
  onUpdateRemovedUser: (row: UserInfoListType) => void;

  /** 收件人添加用户 */
  onCreateUserOptionsChange?: (userOptions: UserInfoListType[]) => void;
  /** 抄送人添加用户 */
  onCreateCcConfigUserOptionsChange?: (userOptions: UserInfoListType[]) => void;
}) =>
  renderSchemaWithLayout(
    {},
    {
      grid: {
        ...renderFromGridSchema({
          columns: 2,
        }),
        properties: {
          /** 邮件模版 */
          ...(actionType === PageTypeInfo.add
            ? {
                mailType: renderFormItemSchema({
                  type: 'string',
                  title: I18N.eca.emailTemplateClass,
                  'x-component': 'Radio.Group',
                  'x-decorator-props': { gridSpan: 2 },
                  enum: [
                    { label: I18N.eca.usingTemplates, value: 1 },
                    { label: I18N.eca.manualInput, value: 2 },
                  ],
                  default: 1,
                }),
                templateName: renderFormItemSchema({
                  title: I18N.eca.emailTemplate,
                  'x-component': 'Input',
                  'x-component-props': { maxLength: InputTextLength200 },
                  'x-reactions': {
                    dependencies: ['mailType'],
                    fulfill: {
                      schema: {
                        'x-visible': '{{$deps[0] === 2}}', // 手动录入时显示
                      },
                    },
                  },
                }),
                mailTemplateId: renderFormItemSchema({
                  title: I18N.eca.emailTemplate,
                  'x-component': 'Select',
                  'x-component-props': {
                    ...SearchSchemaSelectUtils,
                    onChange: onMailTemplateIdChange,
                  },
                  'x-reactions': {
                    dependencies: ['mailType'],
                    fulfill: {
                      schema: {
                        'x-visible': '{{$deps[0] === 1}}', // 使用模板时显示
                      },
                    },
                  },
                }),
              }
            : {
                mailTemplateId: renderFormItemSchema({
                  title: I18N.eca.emailTemplate,
                  'x-component': 'Select',
                  'x-component-props': {
                    ...SearchSchemaSelectUtils,
                    onChange: onMailTemplateIdChange,
                  },
                }),
              }),
          subject: renderFormItemSchema({
            title: I18N.dashborad.subject,
            'x-component': 'Input',
            'x-decorator-props': {
              labelWidth: 300,
              tooltip: subjectTooltipText,
              labelWrap: true,
            },
            'x-component-props': {
              maxLength: InputTextLength200,
            },
          }),
          content: renderFormItemSchema({
            title: I18N.dashborad.emailContent,
            'x-component': 'Input.TextArea',
            'x-decorator-props': {
              gridSpan: 2,
              labelWidth: 300,
              tooltip: contentTooltipText,
              labelWrap: true,
            },
            'x-component-props': {
              maxLength: TextAreaMaxLength5000,
              style: { minHeight: 300 },
            },
          }),
          attachments: renderFormItemSchema({
            type: 'array',
            required: false,
            'x-component': 'FormilyFileUpload',
            'x-decorator-props': {
              gridSpan: 2,
            },
          }),

          // 收件人逻辑
          toConfig: renderFormItemSchema({
            title: I18N.dashborad.recipient,
            enum: emailTypeOptions?.map(item => ({
              label: item.label,
              value: item.value,
              disabled: item.value === ToConfigType.PERSON,
            })),
            default: ToConfigType.ROLE,
            required: true,
            'x-component': 'Radio.Group',
            'x-decorator-props': {
              gridSpan: 2,
            },
            'x-component-props': {
              onChange: onToConfigChange,
            },
          }),
          // 收件人角色/用户展示下拉框
          copyRolesId: renderFormItemSchema({
            'x-component': 'FormilyUserSelect',
            'x-decorator-props': {
              gridSpan: 2,
            },
            'x-component-props': {
              filedType: 'toConfig',
              mode: 'multiple',
              onChange: onToConfigRolesIdChange,
              onCreateUserOptions: onCreateUserOptionsChange,
              ...SearchSchemaSelectUtils,
            },
            'x-reactions': {
              dependencies: ['toConfig', 'toList'],
              fulfill: {
                schema: {
                  'x-visible': `{{$deps[0] === ${ToConfigType.ROLE} || $deps[0] === ${ToConfigType.PERSON} }}`,
                  required: `{{!($deps[1]?.length > 0)}}`,
                },
              },
            },
          }),
          // 收件人如果选择角色后 展示用户列表
          toList: {
            type: 'array',
            'x-component': 'ArrayTable',
            'x-decorator': 'FormItem',
            'x-decorator-props': {
              gridSpan: 2,
            },
            'x-component-props': {
              pagination: false,
              size: 'small',
              key: uniqueId(),
            },
            'x-reactions': {
              dependencies: ['copyRolesId'],
              fulfill: {
                schema: {
                  'x-visible': `{{$deps[0]?.length > 0 || $self?.value?.length > 0 }}`,
                },
              },
            },
            default: [],
            required: false,
            items: shakingObj({
              type: 'object',
              properties: {
                columns1: {
                  type: 'void',
                  'x-component': 'ArrayTable.Column',
                  'x-component-props': {
                    title: I18N.eca.name,
                  },
                  properties: {
                    username: renderFormItemSchema({
                      validateTitle: I18N.eca.name,
                      'x-component': 'Input',
                      required: false,
                      'x-disabled': true,
                    }),
                  },
                },
                columns2: {
                  type: 'void',
                  'x-component': 'ArrayTable.Column',
                  'x-component-props': {
                    title: I18N.dashborad.emailNumber,
                  },
                  properties: {
                    email: renderFormItemSchema({
                      validateTitle: I18N.dashborad.emailNumber,
                      required: true,
                      readOnly: isDetail,
                      'x-validator': [
                        (val: string) => {
                          if (!val) return '';
                          if (emailReg(val)) return '';
                          return I18N.dashborad.emailFormatIsIncorrect;
                        },
                      ],
                      'x-component': 'Input',
                      'x-reactions': {
                        dependencies: ['toConfig'],
                        fulfill: {
                          schema: {
                            'x-disabled': `{{$deps[0] === ${ToConfigType.ROLE} || ${isDetail}}}`,
                          },
                        },
                      },
                    }),
                  },
                },
                column3:
                  toConfigType === ToConfigType.PERSON &&
                  !isDetail &&
                  renderFormilyTableAction({
                    actionBtns: ({ row, index, array }) => [
                      {
                        label: I18N.Factors.delete,
                        key: 'del',
                        onClick: async () => {
                          array.field.remove(index);
                          onToConfigUpdateRemovedUser(row);
                        },
                      },
                    ],
                    wrapperProps: {
                      'x-component-props': {
                        fixed: 'right',
                      },
                    },
                  }),
              },
            }),
          },

          mailSendType: renderFormItemSchema({
            title: '发送方式',
            enum: mailSendTypeOptions,
            'x-component': 'Radio.Group',
            'x-decorator-props': {
              gridSpan: 2,
            },
          }),

          /** =============================抄送人部分=========================================== */
          ccConfig: renderFormItemSchema({
            title: I18N.dashborad.ccTo,
            enum: copyTypeOptions,
            required: false,
            'x-component': 'Radio.Group',
            'x-decorator-props': {
              gridSpan: 2,
            },
            'x-component-props': {
              onChange: onCconfigChange,
            },
          }),
          // 抄送人如果是角色展示下拉框
          rolesId: renderFormItemSchema({
            required: false,
            'x-component': 'FormilyUserSelect',
            'x-decorator-props': {
              gridSpan: 2,
            },
            'x-component-props': {
              mode: 'multiple',
              filedType: 'ccConfig',
              onChange: onRolesIdChange,
              onCreateUserOptions: onCreateCcConfigUserOptionsChange,
              ...SearchSchemaSelectUtils,
            },
            'x-reactions': {
              dependencies: ['ccConfig', 'ccList'],
              fulfill: {
                schema: {
                  'x-visible': `{{$deps[0] === ${CcConfigType.ROLE} || $deps[0] === ${CcConfigType.PERSON} }}`,
                },
              },
            },
          }),
          // 抄送人如果选择角色后 展示用户列表
          ccList: {
            type: 'array',
            'x-component': 'ArrayTable',
            'x-decorator': 'FormItem',
            'x-decorator-props': {
              gridSpan: 2,
            },
            'x-component-props': {
              pagination: false,
              size: 'small',
              key: uniqueId(),
            },
            'x-reactions': {
              dependencies: ['rolesId'],
              fulfill: {
                schema: {
                  'x-visible': `{{$deps[0]?.length > 0 || $self?.value?.length > 0 }}`,
                },
              },
            },
            default: [],
            required: false,
            items: shakingObj({
              type: 'object',
              properties: {
                columns1: {
                  type: 'void',
                  'x-component': 'ArrayTable.Column',
                  'x-component-props': {
                    title: I18N.eca.name,
                  },
                  properties: {
                    username: renderFormItemSchema({
                      validateTitle: I18N.eca.name,
                      'x-component': 'Input',
                      required: false,
                      'x-disabled': true,
                    }),
                  },
                },
                columns2: {
                  type: 'void',
                  'x-component': 'ArrayTable.Column',
                  'x-component-props': {
                    title: I18N.dashborad.emailNumber,
                  },
                  properties: {
                    email: renderFormItemSchema({
                      validateTitle: I18N.dashborad.emailNumber,
                      required: true,
                      'x-validator': [
                        (val: string) => {
                          if (!val) return '';
                          if (emailReg(val)) return '';
                          return I18N.dashborad.emailFormatIsIncorrect;
                        },
                      ],
                      'x-component': 'Input',
                      'x-reactions': {
                        dependencies: ['ccConfig'],
                        fulfill: {
                          schema: {
                            'x-disabled': `{{$deps[0] === ${CcConfigType.ROLE} || ${isDetail}}}`,
                          },
                        },
                      },
                    }),
                  },
                },
                column3:
                  ccConfigType === CcConfigType.PERSON &&
                  !isDetail &&
                  renderFormilyTableAction({
                    actionBtns: ({ row, index, array }) => [
                      {
                        label: I18N.Factors.delete,
                        key: 'del',
                        onClick: async () => {
                          array.field.remove(index);
                          onUpdateRemovedUser(row);
                        },
                      },
                    ],
                    wrapperProps: {
                      'x-component-props': {
                        fixed: 'right',
                      },
                    },
                  }),
              },
            }),
          },

          // 日历
          sendTimeList: renderFormItemSchema({
            title: I18N.dashborad.sendingTime,
            required: true,
            type: 'string',
            'x-component': 'FormilyCalendar',
            'x-component-props': {},
          }),
        },
      },
    },
  );
