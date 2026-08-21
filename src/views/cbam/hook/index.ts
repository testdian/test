import { useEffect, useState } from 'react';

import {
  EnumResp,
  getSupplychainEnumsEnumName,
} from '@/sdks_v2/new/supplychainV2ApiDocs';

import {
  getCbamEnums,
  getParameterIncludeProductList,
  getParameterList,
  getPrecursorList,
  getProcessList,
  getSupplierList,
} from './service';
import { CbamEnumResp, DefaultProduct, SupplierResp } from './type';
import { getFactoryList } from '../FactoryInformation/service';
import { FactoryResp } from '../FactoryInformation/type';
import { ParameterResp } from '../ParameterConfig/type';
import { getProductProcessListApi } from '../ReportForm/service';
import { ProductProcessResp } from '../ReportForm/type';

/**
 * @description 获取cbam枚举
 */
export const useCbamEnums = (enumName: string) => {
  const [enums, setEnums] = useState<CbamEnumResp[]>([]);
  useEffect(() => {
    getCbamEnums({ enumName }).then(({ data }) => setEnums(data?.data || []));
  }, []);
  return enums;
};

/**
 * @description 获取工厂列表
 */
export const useFactoryList = () => {
  const [list, setList] = useState<FactoryResp[]>([]);
  useEffect(() => {
    getFactoryList({
      pageNum: 1,
      pageSize: 100000,
    }).then(({ data }) => setList(data?.data?.records || []));
  }, []);
  return list;
};

/**
 * @description 获取工序列表
 */
export const useProcessList = (
  cbamId?: number,
  id?: number,
  open?: boolean,
) => {
  const [list, setList] = useState<ProductProcessResp[]>([]);
  useEffect(() => {
    if (cbamId && open) {
      getProcessList({
        cbamId,
        id,
      }).then(({ data }) => setList(data?.data || []));
    }
  }, [cbamId, id, open]);
  return list;
};

/**
 * @description 获取前体列表
 */
export const usePrecursorList = (cbamId?: number, open?: boolean) => {
  const [list, setList] = useState<ProductProcessResp[]>([]);
  useEffect(() => {
    if (cbamId && open) {
      getPrecursorList({
        cbamId,
      }).then(({ data }) => setList(data?.data || []));
    }
  }, [cbamId, open]);
  return list;
};

/**
 * @description 获取参数配置-产品分类列表
 */
export const useParameterProductCategoryList = () => {
  const [list, setList] = useState<ParameterResp[]>([]);
  useEffect(() => {
    getParameterList({
      pageNum: 1,
      pageSize: 100000,
    }).then(({ data }) => setList(data?.data?.records || []));
  }, []);
  return list;
};

/**
 * @description  获取参数配置-包含产品列表
 */
export const useParameterIncludeProductList = (productCategoryId?: number) => {
  const [list, setList] = useState<DefaultProduct[]>([]);
  useEffect(() => {
    getParameterIncludeProductList({
      pageNum: 1,
      pageSize: 100000,
      productCategoryId,
    }).then(({ data }) => setList(data?.data?.records || []));
  }, [productCategoryId]);
  return list;
};

/**
 * @description 获取报表下所有自厂工序列表
 */
export const useProductProcessList = (cbamId?: number) => {
  const [list, setList] = useState<ProductProcessResp[]>([]);
  useEffect(() => {
    if (cbamId) {
      getProductProcessListApi({
        cbamId,
      }).then(({ data }) => setList(data?.data || []));
    }
  }, [cbamId]);
  return list;
};

/** 商户类型 */
export const SUPPLIER_TYPE = {
  /** 供应商 */
  SUPPLIER: 0,
  /** 客户 */
  CUSTOMER: 1,
};

/** 供应商状态 */
export const SUPPLIER_STATUS = {
  /** 未提交 */
  UN_SUBMITTED: 0,
  /** 启用 */
  ENABLE: 1,
  /** 禁用 */
  DISABLED: 2,
  /** 审核中 */
  UNDER_REVIEW: 3,
  /** 审核不通过 */
  REVIEW_FAILED: 4,
};

/**
 * @description 获取供应链商户列表-供应商&启用
 */
export const useSupplyList = () => {
  const [list, setList] = useState<SupplierResp[]>([]);
  useEffect(() => {
    getSupplierList({
      pageNum: 1,
      pageSize: 1000,
      supplierStatus: SUPPLIER_STATUS.ENABLE,
      supplierType: SUPPLIER_TYPE.SUPPLIER,
    }).then(({ data }) => setList(data?.data?.list || []));
  }, []);
  return list;
};

/**
 * @description 供应商碳管理枚举
 */
export const useSupplyChainEnums = (enumName: string) => {
  const [supplyChainenum, setSupplyChainenumEnum] = useState<EnumResp[]>();
  useEffect(() => {
    if (enumName) {
      getSupplychainEnumsEnumName({ enumName }).then(({ data }) => {
        if (data.code === 200) {
          setSupplyChainenumEnum(data.data);
        }
      });
    }
  }, [enumName]);
  return supplyChainenum;
};
