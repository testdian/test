import { request, ResponseData } from '@/api/request';

import { ReductionOverviewEmissionRespData } from './type';

/**
 * /computation/reductionPlanOverview/info
 * @description 预测减排/数据概览/获取详情
 */
export const getComputationReductionPlanOverviewInfoApi = (params: {
  // ghg 范围类别，scopeType,可用值:1,3,34
  scopeType: string;
}) =>
  request<ResponseData<ReductionOverviewEmissionRespData>>({
    url: '/computation/reductionPlan/overview',
    method: 'GET',
    params,
  });

/**
 * /computation/reductionPlan/table/detail
 * @description 预测减排/数据概览/表格详情数据
 */
export const getComputationReductionPlanTableDetailApi = () =>
  request<ResponseData<ReductionOverviewEmissionRespData>>({
    url: '/computation/reductionPlan/table/detail',
    method: 'GET',
  });

/**
 * /computation/reductionPlan/table/detailExport
 * @description 预测减排/数据概览/表格详情数据导出
 */
export const getComputationReductionPlanTableDetailExportApi = () =>
  request<ResponseData<string>>({
    url: '/computation/reductionPlan/table/detailExport',
    method: 'GET',
  });
