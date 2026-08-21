import { request, ResponseData } from '@/api/request';

import { VersionReq, VersionResp } from './type';
/**
 *
 * @returns 获取版本列表
 */
export const getVersionListApi = (params: VersionReq) =>
  request<ResponseData<VersionResp>>({
    url: `/system/org/orgVersion/page`,
    method: 'GET',
    params,
  });
