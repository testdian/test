/**
 * @description 审批记录列表
 */

import { request, ResponseData } from '@/api/request';

import { AuditRecordLog } from './type';

export const getAuditRecordList = (params: { computationSourceId: number }) =>
  request<ResponseData<AuditRecordLog[]>>({
    method: 'GET',
    url: `/computation/audit/log/list`,
    params,
  });
