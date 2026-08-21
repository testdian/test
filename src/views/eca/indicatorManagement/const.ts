export const PERIOD_TYPE_MAP = {
  /** 年 */
  YEAR: 1,
  /** 季度 */
  QUARTER: 2,
  /** 月 */
  MONTH: 3,
} as const;

export type PeriodType = typeof PERIOD_TYPE_MAP;

export type PeriodTypeEnum =
  (typeof PERIOD_TYPE_MAP)[keyof typeof PERIOD_TYPE_MAP];
