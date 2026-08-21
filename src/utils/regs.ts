/*
 * @@description: 全局正则存放
 * @Author: qifeng qifeng@carbonstop.net
 * @Date: 2023-02-06 17:27:45
 * @LastEditors: ljh255 jinhai@carbonstop.net
 * @LastEditTime: 2023-05-31 09:43:23
 */

import I18N from '@src/lang/I18N';
/** 手机号正则 */
export const mobileReg = (val: string | number) => {
  if (`${val}`.trim().length !== 11) return false;
  // return /^(13[0-9]|14[01456879]|15[0-35-9]|16[2567]|17[0-8]|18[0-9]|19[0-35-9])\d{8}$/.test(
  return /^1[0-9]{10}/.test(`${val}`);
};
/** 邮箱正则***/
export const emailReg = (value: string) => {
  return /^[a-zA-Z0-9_.-]+@[a-zA-Z0-9-]+(\.[a-zA-Z0-9-]+)*\.[a-zA-Z0-9]{2,6}$/.test(
    `${value}`,
  );
};
/** 登录密码验证 */
// 校验 数字 大写字母 小写字母
export const validatePassword = (password: string) => {
  // 判断密码长度
  if (password.length < 8) {
    return false;
  }

  // 判断是否同时包含大写字母、小写字母和数字
  let hasUpperCase = false;
  let hasLowerCase = false;
  let hasNumber = false;

  for (let i = 0; i < password.length; i++) {
    const char = password.charAt(i);

    if (/[A-Z]/.test(char)) {
      hasUpperCase = true;
    } else if (/[a-z]/.test(char)) {
      hasLowerCase = true;
    } else if (/\d/.test(char)) {
      hasNumber = true;
    }
  }

  return hasUpperCase && hasLowerCase && hasNumber;
};

export const pwdReg = (val: string) => {
  // 大写字母、小写字母、数字
  return (
    validatePassword(val) ||
    /^(?=.*[a-z])(?=.*[A-Z])(?=.*[!@#$%^&*()\-_=+{};:,<.>])[a-zA-Z!@#$%^&*()\-_=+{};:,<.>]{8,}$/.test(
      val,
    ) ||
    /^(?=.*[a-z])(?=.*\d)(?=.*[!@#$%^&*()\-_=+{};:,<.>])[a-z\d!@#$%^&*()\-_=+{};:,<.>]{8,}$/i.test(
      val,
    )
  );
};

/**
 * 单位1/单位2
 * **/
export const RegChectDoit10 = /^-?\d{0,20}(\.\d{1,10})?$|^0(\.\d{1,10})?$/;

export const RegNumberFore = [
  { pattern: RegChectDoit10, message: I18N.eca.supportDecimalPoint2 },
  { min: 0, message: I18N.utils.unitIncorrect },
  { max: 100000000000, message: I18N.utils.unitIncorrect },
];
