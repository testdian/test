/*
 * @@description:
 */
import I18N from '@src/lang/I18N';

export const TIME_TYPE = {
  /** 年 */
  YEAR: 1,
  /** 季度 */
  QUARTER: 2,
  /** 月 */
  MONTH: 3,
  /** 日 */
  DAY: 4,
  /** 时 */
  HOUR: 5,
  /** 分 */
  MINUTE: 6,
  /** 秒 */
  SECOND: 7,
  /** 文本 */
  TEXT: 8,
  /** 数值 */
  NUMBER: 9,
};
/** 时间维度下拉菜单 数值、文本、选项维度不展示下拉菜单 */
export const TimeMenu = [
  { label: I18N.Factors.year, value: TIME_TYPE.YEAR },
  { label: I18N.eca.quarter, value: TIME_TYPE.QUARTER },
  { label: I18N.carbonAccount.month, value: TIME_TYPE.MONTH },
  { label: I18N.carbonAccount.day, value: TIME_TYPE.DAY },
  { label: I18N.eca.time2, value: TIME_TYPE.HOUR },
  { label: I18N.eca.divide, value: TIME_TYPE.MINUTE },
  { label: I18N.eca.second, value: TIME_TYPE.SECOND },
];

export const NUMBER_TYPE = {
  /** 加和 */
  SUM: 1,
  /** 最大值 */
  MAX: 2,
  /** 最小值 */
  MIN: 3,
  /** 平均值 */
  AVG: 4,
  /** 方差 */
  VAR: 5,
  /** 标准差 */
  STD: 6,
  /** 计数 */
  COUNT: 7,
  /** 去重计数 */
  COUNT_DISTINCT: 8,
};

/** 数值维度数值类型下拉菜单  */
export const NumberMenu = [
  { label: I18N.eca.jiahe, value: NUMBER_TYPE.SUM },
  { label: I18N.eca.maximumValue, value: NUMBER_TYPE.MAX },
  { label: I18N.eca.minimumValue, value: NUMBER_TYPE.MIN },
  { label: I18N.carbonFootPrintLCA.averageValue, value: NUMBER_TYPE.AVG },
  { label: I18N.eca.variance, value: NUMBER_TYPE.VAR },
  { label: I18N.eca.standardDeviation, value: NUMBER_TYPE.STD },
  { label: I18N.eca.count, value: NUMBER_TYPE.COUNT },
  { label: I18N.eca.goCountAgain, value: NUMBER_TYPE.COUNT_DISTINCT },
];
/** 时间、文本、选项指标，可下拉展开聚合计算选择，枚举值：计数、去重计数；默认：计数； */
export const OtherNumberMenu = [
  { label: I18N.eca.count, value: NUMBER_TYPE.COUNT },
  { label: I18N.eca.goCountAgain, value: NUMBER_TYPE.COUNT_DISTINCT },
];

/** 条件设置 */
export const CaseMenu = [{ label: I18N.eca.setConditions, value: 8 }];
