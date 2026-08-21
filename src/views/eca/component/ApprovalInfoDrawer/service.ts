import { request, ResponseData } from '@src/api/request';

import { AuditReq, UserLeaderRequest, UserLeaderResp } from './type';

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
    url: '/computation/auditConfig/editModel',
    data,
  });

/**
 * @description 审批设置详情
 */
export const getAuditSetDetail = (params: {
  auditType: number;
  dataId?: number;
}) =>
  request<ResponseData<AuditReq>>({
    method: 'GET',
    url: `/computation/auditConfig/detail`,
    params,
  });

/**
 * @description 查询用户上级列表
 * /system/user/leaderList
 */
export const getUserLeaderList = (params: UserLeaderRequest) =>
  request<ResponseData<UserLeaderResp[]>>({
    method: 'GET',
    url: '/system/user/leaderList',
    params,
  });
