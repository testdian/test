/** 活动数据枚举 */
export const ACTIVITY_DATA_ENUM = {
  /** 选择参数 */
  SELECT_PARAMS: 0,
  /** 公式计算 */
  FORMULA_CALCULATION: 1,
} as const;

/** 活动数据枚举 */
export const ACTIVITY_DATA_OPTIONS = [
  { label: '选择参数', value: ACTIVITY_DATA_ENUM.SELECT_PARAMS },
  { label: '公式计算', value: ACTIVITY_DATA_ENUM.FORMULA_CALCULATION },
];
