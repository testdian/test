import { SchemaProperties } from '@formily/react';
import I18N from '@src/lang/I18N';

import { pwdReg } from '@/utils/regs';
import { InputTextLength100 } from '@/views/eca/util/type';

/** 默认密码框的样式 */
const initInputStyle = {
  padding: '12px 16px 12px 16px',
  borderRadius: '8px',
};
export const changePwdSchemas = (): SchemaProperties<
  any,
  any,
  any,
  any,
  any,
  any,
  any,
  any
> => {
  return {
    oldPassword: {
      type: 'string',
      title: '',
      'x-decorator': 'FormItem',
      'x-validator': [
        { required: true, message: I18N.base.pleaseEnterTheNewPassword },
        // eslint-disable-next-line
        (val: string) => {
          if (!val) return '';
          if (!pwdReg(val)) {
            return I18N.base.passwordFormatIsIncorrect;
          }
        },
      ],
      'x-reactions': [
        {
          dependencies: ['.newPassword'],
          fulfill: {
            state: {
              selfErrors:
                '{{ !$self.errors.length && ($deps[0] && $self.value && $self.value !== $deps[0] ? validatePwdTip : "")}}',
            },
          },
        },
      ],
      'x-component': 'Password',
      'x-component-props': {
        placeholder: I18N.base.password,
        maxLength: InputTextLength100,
        style: {
          ...initInputStyle,
        },
      },
    },
    newPassword: {
      type: 'string',
      required: true,
      title: '',
      'x-validator': [
        { required: true, message: I18N.base.pleaseEnterConfirmation },
        // eslint-disable-next-line consistent-return
        (val: string) => {
          if (!val) return '';
          if (!pwdReg(val)) {
            return I18N.base.passwordFormatIsIncorrect;
          }
        },
      ],
      'x-decorator': 'FormItem',
      'x-reactions': [
        {
          dependencies: ['.newPassword'],
          fulfill: {
            state: {
              selfErrors:
                '{{ !$self.errors.length && ($deps[0] && $self.value && $self.value !== $deps[0] ? validatePwdTip : "")}}',
            },
          },
        },
      ],
      'x-component': 'Password',
      'x-component-props': {
        placeholder: I18N.base.confirmNewPassword,
        maxLength: InputTextLength100,
        style: {
          ...initInputStyle,
        },
      },
    },
  };
};
