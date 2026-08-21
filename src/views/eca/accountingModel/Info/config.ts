/** 核算模型步骤条类型 */
export const ANALYSIS_STEP_TYPE = {
  /** 基础信息 */
  SELECT_DATA: 0,
  /** 核算模型 */
  ANALYSIS_CONFIG: 1,
} as const;

/** 量化方法类型 */
export const QUANTITATIVE_METHOD_TYPE = {
  /** 排放因子法 */
  EMISSION_FACTOR_METHOD: 0,
};
