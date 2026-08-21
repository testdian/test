import { request, ResponseData } from '@/api/request';

import {
  BaseEmissionData,
  ReductionTargetLineChartResp,
  ReductionTargetStage,
  ReductionTargetStageDetail,
  ReductionTargetStageDetailEditReq,
  ReductionTargetStageEditReq,
  StageTargetValueListResp,
  TargetValueList,
} from './type';

/**
 * /computation/reductionPlan/target
 * @description 预测减排/减排目标
 */
export const getComputationReductionPlanTargetApi = (params: {
  orgCode: string;
  standardYear: number;
  scopeTypeList: number[];
}) =>
  request<ResponseData<TargetValueList[]>>({
    url: '/computation/reductionPlan/target',
    method: 'GET',
    params,
  });

/**
 * /computation/reductionPlan/baseEmission
 * @description 预测减排/减排目标/基准年排放量
 */
export const getComputationReductionPlanBaseEmissionApi = (params: {
  orgCode: string;
  standardYear: number;
}) =>
  request<ResponseData<BaseEmissionData>>({
    url: '/computation/reductionPlan/baseEmission',
    method: 'GET',
    params,
  });

/**
 *  GET /computation/reductionPlanTarget/stage/list
 * @description 减排计划-减排目标：阶段列表（openapi `/reductionPlanTarget/stage/list`）
 */
export const getComputationReductionPlanTargetStageListApi = (params: {
  orgCode: string;
  /** 1 范围一&范围二；3 范围三 */
  scopeType: 1 | 3;
}) =>
  request<ResponseData<ReductionTargetStage[]>>({
    url: '/computation/reductionPlanTarget/stage/list',
    method: 'GET',
    params,
  });

/**
 * POST /computation/reductionPlanTarget/stage/edit
 * @description 减排计划-减排目标：阶段编辑（openapi `/reductionPlanTarget/stage/edit`）
 */
export const postComputationReductionPlanTargetStageEditApi = (
  data: ReductionTargetStageEditReq,
) =>
  request<ResponseData<void>>({
    url: '/computation/reductionPlanTarget/stage/edit',
    method: 'POST',
    data,
  });

/**
 * GET /computation/reductionPlanTarget/stage/detailList
 * @description 减排计划-减排目标：阶段明细列表（openapi `/reductionPlanTarget/stage/detailList`）
 */
export const getComputationReductionPlanTargetStageDetailListApi = (params: {
  orgCode: string;
  scopeType: 1 | 3;
}) =>
  request<ResponseData<ReductionTargetStageDetail[]>>({
    url: '/computation/reductionPlanTarget/stage/detailList',
    method: 'GET',
    params,
  });

/**
 * POST /computation/reductionPlanTarget/stage/detail/edit
 * @description 减排计划-减排目标：阶段明细编辑（openapi `/reductionPlanTarget/stage/detail/edit`）
 */
export const postComputationReductionPlanTargetStageDetailEditApi = (
  data: ReductionTargetStageDetailEditReq,
) =>
  request<ResponseData<void>>({
    url: '/computation/reductionPlanTarget/stage/detail/edit',
    method: 'POST',
    data,
  });

/**
 * GET /computation/reductionPlanTarget/lineChart
 * @description 减排计划-减排目标：折线图（openapi `/reductionPlanTarget/lineChart`）
 */
export const getComputationReductionPlanTargetLineChartApi = (params: {
  orgCode: string;
  scopeType: 1 | 3;
}) =>
  request<ResponseData<ReductionTargetLineChartResp>>({
    url: '/computation/reductionPlanTarget/lineChart',
    method: 'GET',
    params,
  });

/**
 * /computation/reductionPlanTarget/stage/add
 * @description 预测减排/减排目标/阶段列表/新增
 */
export const postComputationReductionPlanTargetStageAddApi = (
  data: StageTargetValueListResp,
) =>
  request<ResponseData<object>>({
    url: '/computation/reductionPlanTarget/stage/add',
    method: 'POST',
    data,
  });

/**
 * /computation/reductionPlanTarget/calc/ratio
 * @description 预测减排/减排目标/根据SBT计算比例
 */
export const postComputationReductionPlanTargetCalcRatioApi = (data: {
  sbtLevel: number;
  targetYear: number;
}) =>
  request<ResponseData<string>>({
    url: '/computation/reductionPlanTarget/calc/ratio',
    method: 'POST',
    data,
  });

/**
 * /computation/reductionPlanTarget/stage/delete
 * @description 预测减排/减排目标/阶段列表/删除
 */
export const postComputationReductionPlanTargetStageDeleteApi = (data: {
  id: number;
}) =>
  request<ResponseData<object>>({
    url: '/computation/reductionPlanTarget/stage/delete',
    method: 'POST',
    data,
  });

/**
 * /computation/reductionPlanTarget/calc/sbt
 * @description 预测减排/减排目标/根据比例计算SBT
 */
export const postComputationReductionPlanTargetCalcSbtApi = (
  data: StageTargetValueListResp,
) =>
  request<ResponseData<StageTargetValueListResp>>({
    url: '/computation/reductionPlanTarget/calc/sbt',
    method: 'POST',
    data,
  });
