import { AxiosPromise } from 'axios';

import { loginToken } from '@/sdks/authV2ApiDocs';

import { request, ResponseData } from './request';
import { EncryptedLoginData } from './type';

/** 获取公钥 */
export const getPublicKeyApi = () =>
  request<ResponseData<any>>({
    url: `/auth/token/publicKey`,
    method: 'GET',
  });

/** 获取验证码 */
export const getCaptchaApi = (): AxiosPromise => {
  return request({
    url: `/auth/token/captcha`,
    method: 'GET',
  });
};

/**
 * 登录
 */
export const postAuthTokenAccountLoginApi = (data: EncryptedLoginData) =>
  request<ResponseData<loginToken>>({
    url: `/auth/token/account/login`,
    method: 'POST',
    data,
  });

/**
 * 忘记密码的修改密码
 */
export const postAuthTokenAccountChangePwdApi = (data: EncryptedLoginData) =>
  request<ResponseData<loginToken>>({
    url: `/auth/token/forgot/modifyPassword`,
    method: 'POST',
    data,
  });

/**
 * 用户登录后的初始重置密码
 */
export const postAuthTokenAccountResetPwdApi = (data: EncryptedLoginData) => {
  return request<ResponseData<loginToken>>({
    url: `/system/user/password/modifyDefault`,
    method: 'POST',
    data,
  });
};
