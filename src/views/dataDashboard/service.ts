import { request, ResponseData } from '@/api/request';

import {
  CarbonSummaryData,
  DownstreamTransportModeRawData,
  ForecastTargetNewItem,
  IndicatorItem,
  OrgTop5Data,
  ScopeDistItem,
  SupplierMaterialItem,
  SupplierProductEmissionData,
  TrendAnalysisNewItem,
  Top5Item,
} from './type';

export type CarbonSummaryParams = {
  year: number;
  orgCodeList?: string[];
  standardType?: number | string;
  baseYear?: number;
  operIndexName?: string;
  recentYears?: number;
  valueType?: number;
};

/** 获取指标列表（排放强度下拉） */
export const getIndicatorList = (params: Pick<CarbonSummaryParams, 'year'>) => {
  return request<ResponseData<IndicatorItem[]>>({
    url: '/computation/dashboard/listIndex',
    params,
  });
};

/** 年度碳排放量概览（新接口） */
export const getCarbonSummary = (data: CarbonSummaryParams) => {
  return request<ResponseData<CarbonSummaryData>>({
    method: 'POST',
    url: '/computation/dashboard/carbonSummary',
    data,
  });
};

/** 年度碳排放强度概览（新接口） */
export const getCarbonStrength = (data: CarbonSummaryParams) => {
  return request<ResponseData<CarbonSummaryData>>({
    method: 'POST',
    url: '/computation/dashboard/carbonStrength',
    data,
  });
};

/** 趋势分析（新接口） */
export const getTrendAnalysisDashboard = (data: CarbonSummaryParams) => {
  return request<ResponseData<TrendAnalysisNewItem[]>>({
    method: 'POST',
    url: '/computation/dashboard/trendAnalysis',
    data,
  });
};

/** TOP5 排放类型（新接口） */
export const getTop5EmissionType = (
  data: Pick<CarbonSummaryParams, 'year' | 'orgCodeList' | 'standardType'>,
) => {
  return request<ResponseData<Top5Item[]>>({
    method: 'POST',
    url: '/computation/dashboard/top5EmissionType',
    data,
  });
};

/** 预测与目标分析请求：须传 scopeType（1 范围一&二；3 范围三） */
export type ForecastTargetReq = Pick<
  CarbonSummaryParams,
  'year' | 'orgCodeList' | 'standardType'
> & {
  scopeType: 1 | 3;
};

/** 预测与目标分析（新接口） */
export const getForecastTargetNew = (data: ForecastTargetReq) => {
  return request<ResponseData<ForecastTargetNewItem[]>>({
    method: 'POST',
    url: '/computation/dashboard/forecastTarget',
    data,
  });
};

/** 各组织 TOP5 排放类型（新接口） */
export const getOrgTop5EmissionType = (
  data: Pick<CarbonSummaryParams, 'year' | 'orgCodeList' | 'standardType'>,
) => {
  return request<ResponseData<OrgTop5Data[]>>({
    method: 'POST',
    url: '/computation/dashboard/orgTop5EmissionType',
    data,
  });
};

/** 各组织排放情况（新接口） */
export const getOrgEmissionCategory = (
  data: Pick<CarbonSummaryParams, 'year' | 'orgCodeList' | 'standardType'>,
) => {
  return request<
    ResponseData<
      {
        orgCode: string;
        orgName: string;
        total: string;
        items: {
          name: string;
          value: number | string;
          ratio?: number | string;
        }[];
      }[]
    >
  >({
    method: 'POST',
    url: '/computation/dashboard/orgEmissionCategory',
    data,
  });
};

/** 按照品类查看排放占比（新接口） */
export const getMaterialCategoryRatio = (
  params: Pick<CarbonSummaryParams, 'year' | 'orgCodeList'>,
) => {
  return request<ResponseData<{ total: number; items: ScopeDistItem[] }>>({
    url: '/computation/dashboard/materialCategoryRatio',
    params,
  });
};

/** 排放量范围类别分布（新接口） */
export const getCategoryRatio = (
  data: Pick<CarbonSummaryParams, 'year' | 'orgCodeList' | 'standardType'>,
) => {
  return request<ResponseData<{ total: number; items: ScopeDistItem[] }>>({
    method: 'POST',
    url: '/computation/dashboard/categoryRatio',
    data,
  });
};

/** 供应商及产品列表（新接口） */
export const getSupplierMaterialList = (
  params: Pick<CarbonSummaryParams, 'year' | 'orgCodeList'>,
) => {
  return request<ResponseData<SupplierMaterialItem[]>>({
    method: 'GET',
    url: '/computation/dashboard/supplierMaterialList',
    params,
  });
};

/** 按供应商/产品查看各范围排放（新接口）；supplierList / material 按需传参 */
export const getSupplierProductEmission = (params: {
  year: number;
  orgCodeList: string[];
  supplierList?: string[];
  material?: string;
}) => {
  return request<ResponseData<SupplierProductEmissionData>>({
    url: '/computation/dashboard/supplierProductEmission',
    params,
  });
};

/** 下游运输方式统计 */
export const getDownstreamTransportMode = (
  data: Pick<CarbonSummaryParams, 'year' | 'orgCodeList' | 'standardType'>,
) => {
  return request<ResponseData<DownstreamTransportModeRawData>>({
    method: 'POST',
    url: '/computation/dashboard/downstreamTransportMode',
    data,
  });
};
