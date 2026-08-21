import { request, ResponseData } from '@api/request';

import { OrgResp, OrgTreeReq, OrgTreeSelect } from './type';

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

/**
 * 新增组织
 */
export const addOrgApi = (data: OrgResp) =>
  request<ResponseData<{ [key: string]: any }>>({
    method: 'POST',
    url: `/system/org/add`,
    data,
  });

/**
 * 编辑组织
 */
export const editOrgApi = (data: OrgResp) =>
  request<ResponseData<{ [key: string]: any }>>({
    method: 'POST',
    url: `/system/org/edit`,
    data,
  });

/**
 * 获取组织详情
 */
export const getOrgInfoApi = (params: { id: number }) =>
  request<ResponseData<OrgResp>>({
    method: 'GET',
    url: `/system/org/${params.id}`,
    params,
  });

/**
 * 删除组织
 */
export const deleteOrgApi = (data: { id: number }) =>
  request<ResponseData<{ [key: string]: any }>>({
    method: 'POST',
    url: `/system/org/delete`,
    data,
  });
