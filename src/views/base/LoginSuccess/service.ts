import { request, ResponseData } from '@/api/request';
import { loginToken } from '@/sdks/authV2ApiDocs';

/**
 * /auth/token/tokenLogin
 * 单点登录接口
 */

export const tokenLoginApi = () =>
  request<ResponseData<loginToken>>({
    url: `/auth/token/tokenLogin`,
    method: 'GET',
  });
