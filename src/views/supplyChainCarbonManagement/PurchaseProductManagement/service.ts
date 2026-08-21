import { request, ResponseData, IPageList } from '@src/api/request';

import {
  ProductionRequest,
  ProductionResp,
  ProductRequest,
  ProductInfo,
  ProductFootprintApplyResp,
  ProductFootprintApplyRequest,
} from './type';

/**
 * @description 采购产品列表
 */
export const getProductionList = (params: ProductionRequest) =>
  request<ResponseData<IPageList<ProductionResp>>>({
    method: 'GET',
    url: '/supplychain/product/page',
    params,
  });

/**
 * @description 新增采购产品
 */
export const postProductAdd = (data: ProductRequest) =>
  request<ResponseData<{ [key: string]: any }>>({
    method: 'POST',
    url: '/supplychain/product/add',
    data,
  });

/**
 * @description 编辑采购产品
 */
export const postProductEdit = (data: ProductRequest) =>
  request<ResponseData<{ [key: string]: any }>>({
    method: 'POST',
    url: '/supplychain/product/edit',
    data,
  });

/**
 * @description 采购产品详情
 */
export const getProductInfo = (params: { id: number }) =>
  request<ResponseData<ProductInfo>>({
    method: 'GET',
    url: `/supplychain/product/${params.id}`,
    params,
  });

/**
 * @description 采购产品-详情-产品环境足迹列表
 */
export const getProductFootprintApplyList = (
  params: ProductFootprintApplyRequest,
) =>
  request<ResponseData<IPageList<ProductFootprintApplyResp>>>({
    method: 'GET',
    url: '/supplychain/product/footprint/apply/page',
    params,
  });
