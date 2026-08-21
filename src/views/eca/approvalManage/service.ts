import { request, ResponseData } from '@src/api/request';

import { AuditDetailDto, AuditNode, AuditLog } from './type';

/**
 * @description 查询审批配置
 */
export const getAuditConfig = (params: { orgId: number }) =>
  request<ResponseData<AuditDetailDto>>({
    method: 'GET',
    url: `/computation/audit/${params.orgId}`,
    params,
  });

/**
 * @description 指定审批流程列表（仅状态为已作废时）
 */
export const getAuditProcessListForCancel = (params: { auditDataId: number }) =>
  request<ResponseData<AuditNode[]>>({
    method: 'GET',
    url: `/computation/audit/node/list`,
    params,
  });

/**
 * @description 审批记录列表（仅状态为已作废时）
 */

export const getAuditRecordListForCancel = (params: { auditDataId: number }) =>
  request<ResponseData<AuditLog[]>>({
    method: 'GET',
    url: `/computation/audit/data/log/list`,
    params,
  });
