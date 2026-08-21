import { ISchema } from '@formily/react';
import I18N from '@src/lang/I18N';

import {
  renderEmptySchema,
  renderFromGridSchema,
} from '@/components/formily/utils';
import { FormLabelWithNote } from '@/components/ModifyNote';
import { checkAuth } from '@/layout/utills';
import { emailReg } from '@/utils/regs';
import { changePwdSchemas } from '@/views/base/ChangePWD/utils';
import { InputTextLength100 } from '@/views/eca/util/type';

import style from './index.module.less';

/** 内部用户信息详情-schema */
export const internalSchema = (): ISchema => ({
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
          ...renderFromGridSchema(),
          properties: {
            realName: {
              type: 'string',
              title: '姓名',
              'x-decorator': 'FormItem',
              'x-component': 'Input',
              'x-component-props': {
                placeholder: I18N.base.pleaseEnter,
              },
            },
            a0190: {
              type: 'string',
              title: '工号',
              'x-decorator': 'FormItem',
              'x-component': 'Input',
              'x-component-props': {
                placeholder: I18N.base.pleaseEnter,
              },
            },
            emptyOne: renderEmptySchema(),
            orgCodeList: {
              type: 'string',
              title: '核算组织',
              'x-validator': [
                {
                  required: true,
                  message: '请选择核算组织',
                },
              ],
              'x-decorator-props': {
                gridSpan: 2,
              },
              'x-decorator': 'FormItem',
              'x-component': 'TreeSelect',
              'x-component-props': {
                placeholder: I18N.Factors.pleaseSelect,
                showSearch: true,
                allowClear: true,
                treeNodeFilterProp: 'label',
                treeDefaultExpandAll: true,
                multiple: true,
              },
            },
            empty1: renderEmptySchema(),
            deletedOrgCodeList: {
              type: 'string',
              'x-decorator-props': {
                gridSpan: 2,
              },
              'x-decorator': 'FormItem',
              'x-component': 'Select',
              'x-component-props': {
                placeholder: '历史版本的组织',
                showSearch: true,
                allowClear: true,
                optionFilterProp: 'label',
                mode: 'multiple',
              },
            },
            empty11: renderEmptySchema(),
            leadera0190v: {
              type: 'string',
              title: '直接上级工号',
              'x-decorator': 'FormItem',
              'x-component': 'Input',
              'x-component-props': {
                placeholder: I18N.base.pleaseEnter,
              },
            },
            leadera0101v: {
              type: 'string',
              title: '直接上级姓名',
              'x-decorator': 'FormItem',
              'x-component': 'Input',
              'x-component-props': {
                placeholder: I18N.base.pleaseEnter,
              },
            },
            empty2: renderEmptySchema(),
            deptpath: {
              type: 'string',
              title: '部门全称',
              'x-decorator': 'FormItem',
              'x-component': 'Input',
              'x-component-props': {
                placeholder: I18N.base.pleaseEnter,
              },
            },
            gscompany: {
              type: 'string',
              title: '所属单位',
              'x-decorator': 'FormItem',
              'x-component': 'Input',
              'x-component-props': {
                placeholder: I18N.base.pleaseEnter,
              },
            },
            dingdingid: {
              type: 'string',
              title: '钉钉ID',
              'x-decorator': 'FormItem',
              'x-component': 'Input',
              'x-component-props': {
                placeholder: I18N.base.pleaseEnter,
              },
            },
            roles: {
              type: 'array',
              title: '角色',
              'x-validator': [
                {
                  required: true,
                  message: I18N.dashborad.pleaseSelectAtLeast,
                },
              ],
              'x-decorator-props': {
                gridSpan: 3,
              },
              'x-decorator': 'FormItem',
              'x-component': 'Checkbox.Group',
            },
            userSource_name: {
              type: 'string',
              title: '说明',
              'x-decorator': 'FormItem',
              'x-component': 'Input',
              'x-disabled': true,
              'x-component-props': {
                placeholder: '-',
              },
            },
          },
        },
      },
    },
  },
});

/** 外部用户信息详情-schema */
export const externalSchema = ({
  onChangePwd,
  showChangePwd,
  isUserProfilePage,
}: {
  showChangePwd: boolean;
  isUserProfilePage: boolean;
  onChangePwd: () => Promise<any>;
}): ISchema => ({
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
          ...renderFromGridSchema(),
          properties: {
            username: {
              type: 'string',
              'x-decorator': 'FormItem',
              'x-decorator-props': {
                label: (
                  <FormLabelWithNote
                    label='账号'
                    note='供应商全程前增加字段：账号，文本框，必填，不超过100个字符；外部用户使用账号密码登录。'
                  />
                ),
              },
              'x-validator': [
                {
                  required: true,
                  message: '请输入账号',
                },
              ],
              'x-component': 'Input',
              'x-component-props': {
                placeholder: I18N.base.pleaseEnter,
                maxLength: 100,
              },
            },
            supplierName: {
              type: 'string',
              title: '供应商全称',
              required: true,
              'x-validator': [
                {
                  required: true,
                  message: '请输入供应商全称',
                },
              ],
              'x-decorator': 'FormItem',
              'x-component': 'Input',
              'x-component-props': {
                placeholder: I18N.base.pleaseEnter,
              },
            },
            btn:
              showChangePwd &&
              // 权限检测
              ((checkAuth('/sys/user/resetPassword', true) &&
                !isUserProfilePage) ||
                isUserProfilePage)
                ? {
                    type: 'void',
                    title: '',
                    'x-decorator': 'FormItem',
                    'x-decorator-props': {
                      gridSpan: 2,
                      className: style.grid,
                      style: {
                        alignSelf: 'end',
                      },
                    },
                    'x-component-props': {
                      onClick: async () => {
                        onChangePwd();
                      },
                      children: isUserProfilePage
                        ? I18N.base.changePassword
                        : I18N.dashborad.resetPassword,
                      type: 'link',
                      className: style.changePwd,
                    },
                    'x-component': 'Button',
                  }
                : {},
            supplierCode: {
              type: 'string',
              title: '供应商编码',
              required: true,
              'x-validator': [
                {
                  required: true,
                  message: '请输入供应商编码',
                },
              ],
              'x-decorator': 'FormItem',
              'x-component': 'Input',
              'x-component-props': {
                placeholder: I18N.base.pleaseEnter,
              },
            },
            email: {
              type: 'string',
              title: '邮箱',
              'x-decorator-props': {
                gridSpan: 2,
              },
              'x-validator': [
                {
                  required: true,
                  message: I18N.dashborad.pleaseEnterYourEmailAddress2,
                },
                (val: string) => {
                  if (!val) return '';
                  if (emailReg(val)) return '';
                  return I18N.dashborad.emailFormatIsIncorrect;
                },
              ],
              'x-decorator': 'FormItem',
              'x-component': 'Input',
              'x-component-props': {
                maxLength: 100,
                placeholder: I18N.base.pleaseEnter,
              },
            },
            orgCodeList: {
              title: '核算组织',
              'x-validator': [
                {
                  required: true,
                  message: '请选择核算组织',
                },
              ],
              'x-decorator-props': {
                gridSpan: 3,
              },
              'x-decorator': 'FormItem',
              'x-component': 'TreeSelect',
              'x-component-props': {
                placeholder: I18N.Factors.pleaseSelect,
                showSearch: true,
                allowClear: true,
                treeNodeFilterProp: 'label',
                treeDefaultExpandAll: true,
                multiple: true,
              },
            },
            deletedOrgCodeList: {
              'x-decorator-props': {
                gridSpan: 3,
              },
              'x-decorator': 'FormItem',
              'x-component': 'Select',
              'x-component-props': {
                placeholder: '历史版本的组织',
                showSearch: true,
                allowClear: true,
                optionFilterProp: 'label',
                mode: 'multiple',
              },
            },
            roles: {
              type: 'array',
              title: I18N.dashborad.userRole,
              'x-validator': [
                { required: true, message: I18N.dashborad.pleaseSelectAtLeast },
              ],
              'x-decorator-props': {
                gridSpan: 3,
              },
              'x-decorator': 'FormItem',
              'x-component': 'Checkbox.Group',
            },
          },
        },
      },
    },
  },
});

/** 修改密码 */
export const changePwdSchema = (): ISchema => ({
  type: 'object',
  properties: {
    layout: {
      type: 'void',
      'x-component': 'FormLayout',
      'x-component-props': {
        layout: 'vertical',
      },
      properties: {
        oldPassword: {
          type: 'string',
          title: I18N.dashborad.oldPassword,
          'x-decorator': 'FormItem',
          'x-validator': [
            {
              required: true,
              message: I18N.dashborad.pleaseEnterTheOldPassword,
            },
          ],
          'x-component': 'Password',
          'x-component-props': {
            placeholder: I18N.base.pleaseEnter,
            maxLength: InputTextLength100,
          },
        },
        ...changePwdSchemas(),
      },
    },
  },
});
