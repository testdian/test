import { IPageList, request, ResponseData } from '@src/api/request';

import {
  AuditNode,
  AuditLog,
  SupplierApprovalListRequest,
  SupplierApprovalResp,
} from './type';

/**
 * @description 供应商审批列表
 */
export const getSupplierApprovalList = (params: SupplierApprovalListRequest) =>
  request<ResponseData<IPageList<SupplierApprovalResp>>>({
    method: 'GET',
    url: '/supplychain/audit/page',
    params,
  });

/**
 * @description 审批流程列表
 */
export const getAuditProcessList = (params: { applyInfoId: number }) =>
  request<ResponseData<AuditNode[]>>({
    method: 'GET',
    url: `/supplychain/audit/node/list/curr`,
    params,
  });

/**
 * @description 审批记录列表
 */

export const getAuditRecordList = (params: { applyInfoId: number }) =>
  request<ResponseData<AuditLog[]>>({
    method: 'GET',
    url: `/supplychain/audit/log/list`,
    params,
  });

/**
 * @description 指定审批流程列表（仅状态为已作废时）
 */
export const getAuditProcessListForCancel = (params: { auditDataId: number }) =>
  request<ResponseData<AuditNode[]>>({
    method: 'GET',
    url: `/supplychain/audit/node/list`,
    params,
  });

/**
 * @description 审批记录列表（仅状态为已作废时）
 */

export const getAuditRecordListForCancel = (params: { auditDataId: number }) =>
  request<ResponseData<AuditLog[]>>({
    method: 'GET',
    url: `/supplychain/audit/data/log/list`,
    params,
  });
