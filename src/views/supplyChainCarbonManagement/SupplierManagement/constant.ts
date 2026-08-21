/** 商户类型 */
export const SUPPLIER_TYPE = {
  /** 供应商 */
  SUPPLIER: 0,
  /** 客户 */
  CUSTOMER: 1,
};

/** 新增商户方式 */
export const SUPPLIER_WAY = {
  /** 新商户开户 */
  NEW_SUPPLIER: 0,
  /** 关联已有商户 */
  ASSOCIATION_SUPPLIER: 1,
};

/** 供应商状态 */
export const SUPPLIER_STATUS = {
  /** 未提交 */
  UN_SUBMITTED: 0,
  /** 启用 */
  ENABLE: 1,
  /** 禁用 */
  DISABLED: 2,
  /** 审核中 */
  UNDER_REVIEW: 3,
  /** 审核不通过 */
  REVIEW_FAILED: 4,
};
