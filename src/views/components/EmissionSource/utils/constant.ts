/*
 * @@description:
 */

import I18N from '@src/lang/I18N';

export const CHOOSE_FACTOR = {
  FORM_VALUES: 'emissionManageValues',
  FACTOR_ID: 'factorId',
  SCREEN_ID: 'screenId',
  URLPARAMSDATA: 'urlParamsData',
  CHOOSECARBONMISSIONID: 'ChooseCarbonMissionID',
  CHOOSECARBONMISSIONDATA: 'ChooseCarbonMissionData',
} as const;

/** 排放因子选择方式 */
export const FACTOR_SELECT_WAY = {
  FACTOR: '1',
  FACTOR_CREATE: '2',
  SUPPLIER: '3',
};

export const FACTOR_SELECT_WAY_TEXT = {
  [FACTOR_SELECT_WAY.FACTOR]: I18N.Factors.emissionFactors,
  [FACTOR_SELECT_WAY.FACTOR_CREATE]: I18N.components.newFactor,
  [FACTOR_SELECT_WAY.SUPPLIER]: I18N.components.supplierData,
};

/** 计算公式枚举 */
export const CALCULATION_FORMULA_ENUM = {
  FORMULA: 1,
};

/** 计算公式 */
export const CALCULATION_FORMULA = [
  {
    label: I18N.components.formula,
    value: CALCULATION_FORMULA_ENUM.FORMULA,
  },
];

/** 数据收集周期枚举 */
export const COLLECT_CYCLE_ENUM = {
  /** 按年 */
  YEARLY: 1,
  /** 按季度 */
  QUARTERLY: 2,
  /** 按月 */
  MONTHLY: 3,
};

/** 数据收集周期 */
export const COLLECT_CYCLE = [
  {
    label: '按年',
    value: COLLECT_CYCLE_ENUM.YEARLY,
  },
  {
    label: '按季度',
    value: COLLECT_CYCLE_ENUM.QUARTERLY,
  },
  {
    label: '按月',
    value: COLLECT_CYCLE_ENUM.MONTHLY,
  },
];
