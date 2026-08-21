import { request, ResponseData, IPageList } from '@src/api/request';

import { SupplierLinkRequest, SupplierLinkResp } from './type';

/**
 * @description 供应商关联审核列表
 */
export const getSupplierLinkList = (params: SupplierLinkRequest) =>
  request<ResponseData<IPageList<SupplierLinkResp>>>({
    method: 'GET',
    url: '/supplychain/supplierLink/page',
    params,
  });

/**
 * @description 供应商关联审核列表-同意拒绝
 */
export const postSupplierListStatus = (data: {
  id: number;
  supplierLinkStatus: number;
}) =>
  request<ResponseData<{ [key: string]: any }>>({
    method: 'POST',
    url: '/supplychain/supplierLink/audit',
    data,
  });
