/** OpenAPI: 减排措施概览 */
export interface ReductionMeasureOverviewResp {
  measureCount?: number;
  /** 预计减排量（吨），范围一&范围二 */
  expectedReduction?: number;
  /** 预计减排强度（吨/万件），范围三 */
  expectedReductionIntensity?: number;
  expectedCost?: number;
  expectedRevenue?: number;
}

/** OpenAPI: ReductionMeasure 列表项 */
export interface ReductionMeasure {
  id?: number;
  createBy?: number;
  updateBy?: number;
  createTime?: string;
  updateByName?: string;
  updateTime?: string;
  orgName?: string;
  orgCode?: string;
  startTime?: string;
  endTime?: string;
  measureName?: string;
  measureDesc?: string;
  measureType?: number;
  feasibilityType?: number;
  ghgCategory?: number;
  ghgClassify?: number;
  ghgCategory_name?: string;
  ghgClassify_name?: string;
  bannerUrl?: string;
  deleted?: boolean;
  /** 以下字段部分列表接口可能返回，用于卡片等展示 */
  measureType_name?: string;
  feasibilityType_name?: string;
  reductionAmount?: number;
  expectRevenue?: string;
  /** 卡片等展示用 */
  estimatedCost?: string | number;
  scopeTypes?: string;
  detailList?: ReductionMeasureDetail[];
}

export interface IPageReductionMeasure {
  pageNum?: number;
  pageSize?: number;
  size?: number;
  total?: number;
  pages?: number;
  list?: ReductionMeasureWithDetailResp[];
}

/** GET /reductionMeasure/page */
export interface ReductionMeasurePageParams {
  pageNum: number;
  pageSize: number;
  orgCode: string;
  measureType?: number;
  likeMeasureName?: string;
  feasibilityType?: number;
  /** 1 范围一&范围二；3 范围三（必传） */
  scopeType: number;
}

/** 明细行（请求） */
export interface ReductionMeasureDetailItemReq {
  year: number;
  annualReduction?: number;
  production?: number;
  carbonPrice?: number;
  costSavings?: number;
  totalCost?: number;
  remark?: string;
}

/** 明细行（详情返回） */
export interface ReductionMeasureDetail extends ReductionMeasureDetailItemReq {
  id?: number;
  createBy?: number;
  updateBy?: number;
  createTime?: string;
  updateByName?: string;
  updateTime?: string;
  orgName?: string;
  reductionMeasureId?: number;
  reductionIntensity?: number;
  potentialRevenue?: number;
  potentialNetRevenue?: number;
  annualRoi?: number;
  deleted?: boolean;
}

/** 新增 */
export interface ReductionMeasureAddReq {
  orgCode: string;
  measureName: string;
  measureDesc?: string;
  /** 1 范围一&范围二；3 范围三 */
  ghgCategory: number;
  ghgClassify?: number;
  measureType?: number;
  startTime: string;
  endTime: string;
  feasibilityType?: number;
  bannerUrl?: string;
  detailList?: ReductionMeasureDetailItemReq[];
}

/** 编辑 */
export interface ReductionMeasureEditReq extends ReductionMeasureAddReq {
  id: number;
}

/** 详情 */
export interface ReductionMeasureWithDetailResp {
  id?: number;
  orgCode?: string;
  measureName?: string;
  measureDesc?: string;
  ghgCategory?: number;
  ghgClassify?: number;
  ghgCategory_name?: string;
  ghgClassify_name?: string;
  measureType?: number;
  startTime?: string;
  endTime?: string;
  feasibilityType?: number;
  bannerUrl?: string;
  createTime?: string;
  updateTime?: string;
  detailList?: ReductionMeasureDetail[];
}

export interface CurveChartPointResp {
  year?: number;
  value?: number;
}

export interface ReductionTargetForecastResp {
  year?: number;
  value?: number;
  /** 1 基准年及第一阶段；2 第二阶段 */
  stageNo?: number;
}

/** 曲线图接口：按年返回的单个措施项（措施 id + 名称 + 年度值） */
export interface ReductionMeasureCurveChartYearMeasureItemResp {
  /** 措施 id */
  id?: number;
  measureName?: string;
  /** 范围一&二为年减排量，范围三为年减排强度 */
  value?: number;
}

/** 曲线图接口：某年的措施列表 */
export interface ReductionMeasureCurveChartYearMeasureResp {
  year?: number;
  measures?: ReductionMeasureCurveChartYearMeasureItemResp[];
}

/** GET /reductionMeasure/curveChart */
export interface ReductionMeasureCurveChartResp {
  bauList?: CurveChartPointResp[];
  /** 目标线-第一阶段（含基准年） */
  stage1List?: ReductionTargetForecastResp[];
  /** 目标线-第二阶段 */
  stage2List?: ReductionTargetForecastResp[];
  actualList?: CurveChartPointResp[];
  estimatedReductionList?: CurveChartPointResp[];
  totalReduction?: number;
  totalReductionIntensity?: number;
  /** 按年份分组的措施明细，用于图例与按措施拆分的曲线 */
  measuresByYear?: ReductionMeasureCurveChartYearMeasureResp[];
}

/** GET /reductionMeasure/curveChartMeasures 单项 */
export interface ReductionMeasureCurveChartMeasureResp {
  measureId?: number;
  measureName?: string;
  /** 1 范围一；2 范围二；3 范围三 */
  ghgCategory?: number;
  annualReduction?: number;
  reductionIntensity?: number;
}

export interface ReductionMeasureImportReq {
  orgCode: string;
  scopeType: number;
  fileName: string;
  fileUrl: string;
}

/** GET /reductionMeasure/importRecords 分页参数 */
export interface ReductionMeasureImportRecordsParams {
  pageNum: number;
  pageSize: number;
}

/** 导入记录（ComputationImportLog） */
export interface ComputationImportLog {
  id?: number;
  createBy?: number;
  updateBy?: number;
  createTime?: string;
  updateByName?: string;
  updateTime?: string;
  orgName?: string;
  importType?: number;
  importTime?: string;
  doneTime?: string;
  fileName?: string;
  fileUrl?: string;
  failedFileUrl?: string;
  totalCount?: number;
  successCount?: number;
  failedCount?: number;
  /** 0 导入中；1 导入成功；2 导入暂存；-1 导入失败 */
  importStatus?: number;
  importStatus_name?: string;
  /** 0 未删除；1 已删除 */
  importFileStatus?: number;
  importFileStatus_name?: string;
  failedMsg?: string;
  deleted?: boolean;
}

export interface IPageComputationImportLog {
  pageNum?: number;
  pageSize?: number;
  size?: number;
  total?: number;
  pages?: number;
  list?: ComputationImportLog[];
}

export interface FileUploadResp {
  fileName?: string;
  filePath?: string;
  url?: string;
  internalUrl?: string;
}

/** 列表筛选（与接口 query 一致，不含分页） */
export interface MeasuresPageListParams {
  feasibilityType?: number;
  likeMeasureName?: string;
  measureType?: number;
  scopeType?: number;
}

/** GET /reductionMeasure/export */
export interface ReductionMeasureExportParams {
  orgCode: string;
  /** 1 范围一&范围二；3 范围三（必传） */
  scopeType: number;
  measureType?: number;
  likeMeasureName?: string;
  feasibilityType?: number;
}

/** 兼容旧卡片组件类型名 */
export type MeasuresPageListData = ReductionMeasure;
