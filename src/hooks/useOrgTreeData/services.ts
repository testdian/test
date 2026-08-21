import { request, ResponseData } from '@api/request';

import { OrgTreeReq, OrgTreeSelect } from './type';

/**
 * 获取组织树
 */
export function getOrgTreeApi(params: OrgTreeReq) {
  return request<ResponseData<OrgTreeSelect>>({
    method: 'GET',
    url: `/system/org/tree`,
    params,
  });
}
