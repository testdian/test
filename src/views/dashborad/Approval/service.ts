import { request, ResponseData } from '@src/api/request';

import { IPageAuditResp, Request, AuditReq } from './type';

/**
 * @description 审批设置列表
 */
export const getAuditSetList = (params: Request) =>
  request<ResponseData<IPageAuditResp>>({
    method: 'GET',
    url: '/system/audit/page',
    params,
  });

/**
 * @description 审批设置新增
 */
export const postAuditSetAdd = (data: AuditReq) =>
  request<ResponseData<{ [key: string]: any }>>({
    method: 'POST',
    url: '/system/audit/add',
    data,
  });

/**
 * @description 审批设置编辑
 */
export const postAuditSetEdit = (data: AuditReq) =>
  request<ResponseData<{ [key: string]: any }>>({
    method: 'POST',
    url: '/system/audit/edit',
    data,
  });

/**
 * @description 审批设置详情
 */
export const getAuditSetDetail = (params: {
  auditType: number;
  orgId?: number;
}) =>
  request<ResponseData<AuditReq>>({
    method: 'GET',
    url: `/system/audit/detail/${params?.auditType}`,
    params,
  });
