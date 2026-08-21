/**
 * BAU（Business As Usual）— 与 openapi `ReductionBau` / `ReductionBauEditReq` 对齐
 */

/** 列表单项（openapi ReductionBau） */
export interface ReductionBau {
  id?: number;
  orgCode?: string;
  orgName?: string;
  scopeType?: 1 | 3;
  year?: number;
  /** 碳排放量（范围1+2）或强度值（范围3） */
  carbonEmission?: number;
  /** 产值增产率（倍数） */
  outputGrowthRate?: number;
  bau?: number;
  deleted?: boolean;
}

/** 编辑请求体（openapi ReductionBauEditReq） */
export interface ReductionBauEditReq {
  id: number;
  carbonEmission?: number;
  outputGrowthRate?: number;
}

/** 表格行（列表映射 + 编辑态使用） */
export interface BauYearRow {
  id: number;
  year: number;
  emission?: number;
  growth?: number;
  /** 接口返回的 BAU，展示态可优先使用 */
  bauFromApi?: number;
}
