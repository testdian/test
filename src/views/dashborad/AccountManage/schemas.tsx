import { ISchema } from '@formily/react';
import I18N from '@src/lang/I18N';
import loginStyle from '@views/base/Login/index.module.less';
import classNames from 'classnames';

import {
  renderFormItemSchema,
  renderFromGridSchema,
  renderEmptySchema,
} from '@/components/formily/utils';
import { emailReg } from '@/utils/regs';
import { changePwdSchemas } from '@/views/base/ChangePWD/utils';

import style from './index.module.less';

export const schema = ({
  onChangePwd,
}: {
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
            title: {
              type: 'void',
              'x-decorator': 'FormItem',
              'x-component': 'FormilyCustomTitle',
              'x-decorator-props': {
                gridSpan: 3,
              },
              'x-component-props': {
                title: I18N.carbonAccount.userInformation,
                level: 5,
                classNames: 'classFormilyCustomTitle',
              },
            },
            username: renderFormItemSchema({
              title: I18N.base.userName,
              'x-component': 'Input',
            }),
            btn: renderFormItemSchema({
              title: '',
              'x-disabled': false,
              'x-decorator-props': {
                gridSpan: 2,
                style: {
                  alignSelf: 'end',
                },
              },
              'x-component-props': {
                onClick: async () => {
                  onChangePwd();
                },
                children: I18N.base.changePassword,
                type: 'link',
              },
              'x-component': 'Button',
            }),
            realName: renderFormItemSchema({
              title: I18N.dashborad.name,
              'x-component': 'Input',
            }),
            mobile: renderFormItemSchema({
              title: I18N.dashborad.mobilePhoneNumber,
              'x-component': 'Input',
            }),
            email: renderFormItemSchema({
              title: I18N.dashborad.mailbox,
              'x-component': 'Input',
            }),
            orgs: renderFormItemSchema({
              title: I18N.carbonData.affiliatedOrganization,
              'x-component': 'Input',
            }),
            roles: renderFormItemSchema({
              title: I18N.dashborad.userRole,
              'x-component': 'Input',
            }),
            empty: renderEmptySchema({
              'x-decorator-props': {
                gridSpan: 2,
              },
            }),
            title1: {
              type: 'void',
              'x-decorator': 'FormItem',
              'x-component': 'FormilyCustomTitle',
              'x-decorator-props': {
                gridSpan: 3,
              },
              'x-component-props': {
                title: I18N.dashborad.merchantInformation,
                level: 5,
                classNames: 'classFormilyCustomTitle',
              },
            },
            uniqueCode: {
              type: 'string',
              title:
                I18N.supplyChainCarbonManagement
                  .theSoleRepresentativeOfTheEnterprise,
              'x-validator': [
                {
                  required: true,
                  message: I18N.dashborad.pleaseEnterTheSociety,
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
                disabled: true,
              },
            },
            companyRoleName: {
              type: 'string',
              title: I18N.supplyChainCarbonManagement.merchantType,
              required: true,
              'x-decorator': 'FormItem',
              'x-decorator-props': {
                gridSpan: 1,
              },
              'x-component': 'Input',
            },
            limitOpen: {
              type: 'string',
              title: I18N.dashborad.allowUsers,
              'x-decorator-props': {
                gridSpan: 1,
              },
              'x-decorator': 'FormItem',
              'x-component': 'Input',
              'x-component-props': {
                min: 0, // 设置最小值是0
                max: 100000,
                placeholder: I18N.base.pleaseEnter,
              },
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
            maxLength: 100,
          },
        },
        ...changePwdSchemas(),
      },
    },
  },
});
/** 首页修改密码 */
export const changeLoginPwdSchema = (props: { onClick: any }): ISchema => {
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
          username: {
            type: 'string',
            title: '',
            'x-decorator-props': {
              gridSpan: 1,
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
              placeholder: I18N.dashborad.emailNumber,
              className: classNames(style.emailInfo, loginStyle.inputLabel5),
            },
          },
          basicStream: {
            type: 'void',
            'x-decorator': 'FormItem',
            'x-component': 'FormGrid',
            'x-decorator-props': {
              style: {
                marginBottom: 0,
              },
            },
            'x-component-props': {
              style: {
                display: 'flex',
                'justify-content': 'space-between',
                'align-items': 'center',
                width: '372px',
              },
            },
            title: '',
            required: false,
            properties: {
              code: renderFormItemSchema({
                validateTitle: I18N.base.verificationCode,
                type: 'string',
                required: true,
                'x-component': 'Input',
                'x-component-props': {
                  placeholder: I18N.base.verificationCode,
                  className: classNames(loginStyle.inputLabel5),
                  style: {
                    width: '100%',
                  },
                },
                'x-decorator-props': {
                  style: {
                    width: '100%',
                  },
                },
              }),
              btn: renderFormItemSchema({
                title: '',
                required: false,
                'x-disabled': false,
                'x-component-props': {
                  onClick: props.onClick,
                  className: classNames(style.changCodeBtn),
                },
                'x-component': 'FormilyComsButton',
              }),
            },
          },

          ...changePwdSchemas(),
        },
      },
    },
  };
};
