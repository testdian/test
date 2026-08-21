import I18N from '@src/lang/I18N';

/** 是否可以 */
export const ISCAN = {
  /** 可以 */
  CAN: 1,
  /** 不可以 */
  CANNOT: 0,
} as const;

/** 是否可以撤回枚举 */
export const WITHDRAW_ENUM = [
  { label: I18N.dashborad.canBeWithdrawn, value: ISCAN.CAN },
  { label: I18N.dashborad.cannotBeWithdrawn, value: ISCAN.CANNOT },
];

/** 是否可以编辑枚举 */
export const EDIT_ENUM = [
  { label: I18N.dashborad.canBeEdited, value: ISCAN.CAN },
  { label: I18N.dashborad.cannotBeEdited, value: ISCAN.CANNOT },
];

/** 左侧tab */
export const TABS = [
  {
    id: 1,
    modelName: I18N.dashborad.enterpriseCarbonAccounting,
  },
  // {
  //   id: 2,
  //   modelName: I18N.dashborad.carbonAccountingIndustry,
  // },
  {
    id: 3,
    modelName: I18N.router.theProductEnvironmentIsSufficient,
  },
];

/** 类型标识 */
export const TYPES = {
  /** 企业碳核算 */
  ENTERPRISE_CARBON_ACCOUNTING: 0,
  /** 碳核算行业版 */
  CARBON_ACCOUNTING_INDUSTRY_EDITION: 1,
};

/** 接口字段枚举 */
export const REQ_ENUM = {
  /** 排放数据审核通过后，是否可以撤回 */
  DATAAUDIOLLBACK: 'dataAuditRollback',
  /** 基准年设定时，查询的核算数据，是否可以编辑 */
  EMISSIONSTANDARDEDIT: 'emissionStandardEdit',
  LCAWEIGHT: 'lcaWeightBalance',
};
