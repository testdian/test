import { request, ResponseData } from '@api/request';

import { OrgTree } from './type';

/**
 * 获取已删除的组织列表
 */
export function getDelOrgListApi() {
  return request<ResponseData<OrgTree[]>>({
    method: 'GET',
    url: `/system/org/org/deletedList`,
  });
}
