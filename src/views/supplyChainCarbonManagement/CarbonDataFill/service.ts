import { IPageList, request, ResponseData } from '@src/api/request';

import {
  AuditDetailDto,
  SupplierFillListRequest,
  SupplierFillResp,
} from './type';
import { TypeApplyInfoResp } from '../utils/type';

/**
 * @description 供应商数据填报列表
 */
export const getSupplierFillList = (params: SupplierFillListRequest) =>
  request<ResponseData<IPageList<SupplierFillResp>>>({
    method: 'GET',
    url: '/supplychain/dataFill/page',
    params,
  });

/**
 * @description 供应商数据填报列表-提交
 */
export const postSupplierSubmit = (data: { id?: number }) =>
  request<ResponseData<{ [key: string]: any }>>({
    method: 'POST',
    url: '/supplychain/dataFill/submit',
    data,
  });

/**
 * @description 供应商数据填报列表-撤回
 */
export const postSupplierRollback = (data: { id?: number }) =>
  request<ResponseData<{ [key: string]: any }>>({
    method: 'POST',
    url: '/supplychain/audit/rollback',
    data,
  });

/**
 * @description 供应商数据填报列表-一键提审
 */
export const postSupplierSubmitApplus = (data: { id?: number }) =>
  request<ResponseData<{ assessmentId: number }>>({
    method: 'POST',
    url: '/supplychain/dataFill/submitApplus',
    data,
  });

/**
 * @description 查询审批配置
 */
export const getAuditConfig = (params: { applyInfoId: number }) =>
  request<ResponseData<AuditDetailDto>>({
    method: 'GET',
    url: '/supplychain/audit/check',
    params,
  });

/**
 * @description 供应商数据填报详情-数据请求
 */
export const getSupplierFillApplyData = (params: { applyInfoId: number }) =>
  request<ResponseData<TypeApplyInfoResp>>({
    method: 'GET',
    url: `/supplychain/dataFill/apply/${params.applyInfoId}`,
    params,
  });
