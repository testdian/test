import { request, ResponseData } from '@api/request';

import { VersionResp } from './type';

/**
 * 获取组织版本数据
 */
export function getOrgTreeVersionApi() {
  return request<ResponseData<VersionResp[]>>({
    method: 'GET',
    url: `/system/org/orgVersion/listAll`,
  });
}
