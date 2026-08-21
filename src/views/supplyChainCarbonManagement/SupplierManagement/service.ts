import { request, ResponseData, IPageList } from '@src/api/request';

import {
  SupplierInfo,
  SupplierListRequest,
  SupplierRequest,
  SupplierResp,
} from './type';

/**
 * @description 供应商列表
 */
export const getSupplierList = (params: SupplierListRequest) =>
  request<ResponseData<IPageList<SupplierResp>>>({
    method: 'GET',
    url: '/supplychain/supplier/page',
    params,
  });

/**
 * @description 供应商列表-启用禁用
 */
export const postSupplierListStatus = (data: {
  id: number;
  supplierStatus?: number;
}) =>
  request<ResponseData<{ [key: string]: any }>>({
    method: 'POST',
    url: '/supplychain/supplier/status',
    data,
  });

/**
 * @description 供应商列表-提交审核
 */
export const postSupplierListSubmit = (data: {
  id?: number;
  idList?: number[];
}) =>
  request<ResponseData<{ [key: string]: any }>>({
    method: 'POST',
    url: '/supplychain/supplier/submit',
    data,
  });

/**
 * @description 新增商户
 */
export const postSupplierAdd = (data: SupplierRequest) =>
  request<ResponseData<{ [key: string]: any }>>({
    method: 'POST',
    url: '/supplychain/supplier/add',
    data,
  });

/**
 * @description 编辑商户
 */
export const postSupplierEdit = (data: SupplierRequest) =>
  request<ResponseData<{ [key: string]: any }>>({
    method: 'POST',
    url: '/supplychain/supplier/edit',
    data,
  });

/**
 * @description 商户详情
 */
export const getSupplierInfo = (params: { id: number }) =>
  request<ResponseData<SupplierInfo>>({
    method: 'GET',
    url: `/supplychain/supplier/${params.id}`,
    params,
  });
