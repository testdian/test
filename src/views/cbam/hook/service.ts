import { IPageList, ResponseData, request } from '@/api/request';

import {
  CbamEnumResp,
  DefaultProduct,
  ParameterIncludeProductRequest,
  ParameterRequest,
  ParameterResp,
  PrePrecursorRequest,
  PreProcessRequest,
  SupplierListRequest,
  SupplierResp,
} from './type';
import { ProductProcessResp } from '../ReportForm/type';

/**
 * 查询cbam枚举
 */
export const getCbamEnums = ({ enumName }: { enumName: string }) =>
  request<ResponseData<CbamEnumResp[]>>({
    method: 'GET',
    url: `/cbam/enums/${enumName}`,
  });

/**
 * @description cbam报表-工业过程-上级工序列表
 */
export const getProcessList = (params: PreProcessRequest) =>
  request<ResponseData<ProductProcessResp[]>>({
    method: 'GET',
    url: '/cbam/productProcess/chooseProcess',
    params,
  });

/**
 * @description cbam报表-工业过程-选择外购前体列表
 */
export const getPrecursorList = (params: PrePrecursorRequest) =>
  request<ResponseData<ProductProcessResp[]>>({
    method: 'GET',
    url: '/cbam/productPrecursor/choosePre',
    params,
  });

/**
 * @description 参数配置-产品分类列表
 */
export const getParameterList = (params: ParameterRequest) =>
  request<ResponseData<IPageList<ParameterResp>>>({
    method: 'GET',
    url: '/cbam/productCategory',
    params,
  });

/**
 * @description 参数配置-产品分类列表
 */
export const getParameterIncludeProductList = (
  params: ParameterIncludeProductRequest,
) =>
  request<ResponseData<IPageList<DefaultProduct>>>({
    method: 'GET',
    url: '/cbam/defaultProduct',
    params,
  });

/**
 * @description 供应商列表
 */
export const getSupplierList = (params: SupplierListRequest) =>
  request<ResponseData<IPageList<SupplierResp>>>({
    method: 'GET',
    url: '/supplychain/supplier/page',
    params,
  });
