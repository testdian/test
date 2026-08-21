import { request, ResponseData, IPageList } from '@src/api/request';

import { SupplierDataListRequest, SupplierDataResp } from './type';

/**
 * @description 供应商核算数据列表
 */
export const getSupplierDataList = (params: SupplierDataListRequest) =>
  request<ResponseData<IPageList<SupplierDataResp>>>({
    method: 'GET',
    url: '/supplychain/apply/page',
    params,
  });

/**
 * @description 关闭产品环境足迹申请
 */
export const postCloseSupplyApply = (data: { id: number }) =>
  request<ResponseData<{ [key: string]: any }>>({
    method: 'POST',
    url: '/supplychain/apply/close',
    data,
  });
