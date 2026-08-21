/**
 * ReductionOverviewEmissionResp
 */
export interface TargetValueList {
  year: string;
  sbtValue: number;
  sbtFlag?: boolean;
}
export interface TargetValueListData {
  scope1Value: number;
  scope2Value?: null;
  scope3Value?: null;
  scope3ClassifyValueList: number[] | string[];
  valueList: TargetValueList[];
}

export interface BaseEmissionData {
  scope1Value: number;
  scope2Value: number;
  scope3Value: number;
  scope3ClassifyValueList: number[] | string[];
}

export interface StageTargetValueListResp {
  id?: number;
  sbtLevel?: number;
  scope1Ratio: string;
  scope2Ratio: string;
  scope3ClassifyRatioList?: string;
  scope3ClassifyRatios?: string;
  scope3Ratio: string;
  scope3Type?: number;
  targetYear?: number;
  sbtLevel_name?: string;
}

/** GET /reductionPlanTarget/stage/list 单条（网关前缀 /computation） */
export interface ReductionTargetStage {
  id?: number;
  orgCode?: string;
  orgName?: string;
  targetYear?: number;
  /** 1 范围一&范围二；3 范围三 */
  scopeType?: 1 | 3;
  standardYear?: number;
  reductionRatio?: number;
}

/** POST /reductionPlanTarget/stage/edit */
export interface ReductionTargetStageEditReq {
  id: number;
  targetYear: number;
  /** Scope1+2 时仅第一阶段必填，其余场景按后端约定 */
  reductionRatio?: number;
}

/** GET /reductionPlanTarget/stage/detailList 单行 */
export interface ReductionTargetStageDetail {
  id?: number;
  reductionTargetStageId?: number;
  year?: number;
  /** 所属阶段：1 阶段一；2 阶段二 */
  stageNo?: number;
  reductionRatio?: number;
  carbonEmission?: number;
}

/** POST /reductionPlanTarget/stage/detail/edit */
export interface ReductionTargetStageDetailEditReq {
  id: number;
  reductionRatio?: number;
  carbonEmission?: number;
}

/** GET /reductionPlanTarget/lineChart 折线点 */
export interface ReductionTargetForecastResp {
  year?: number;
  value?: number;
  /** 1 基准年及第一阶段；2 第二阶段（列表已按 stage1List/stage2List 区分时可忽略） */
  stageNo?: number;
}

/** GET /reductionPlanTarget/lineChart 折线图 */
export interface ReductionTargetLineChartResp {
  /** 第一阶段数据列表（含基准年），按年份升序 */
  stage1List?: ReductionTargetForecastResp[];
  /** 第二阶段数据列表，起始年份与第一阶段结尾年份相同，按年份升序 */
  stage2List?: ReductionTargetForecastResp[];
}
