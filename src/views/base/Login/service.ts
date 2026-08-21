import { request, ResponseData } from '@/api/request';
import { loginToken } from '@/sdks/authV2ApiDocs';

/**
 * 没用到了
 * /auth/token/tokenLogin
 * 单点登录接口
 */

export const oktaLoginApi = () =>
  request<ResponseData<loginToken>>({
    url: `/auth/request`,
    method: 'GET',
  });
