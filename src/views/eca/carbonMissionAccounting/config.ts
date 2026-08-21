/** 填报状态 0 -；1 未填报；2 填报中；3 填报完成 */
import I18N from '@src/lang/I18N';

export const fillStatusMap = {
  /** 填报状态：- 0 */
  UN: 0,
  /** 填报状态：未填报 1 */
  UN_FILL: 1,
  /** 填报状态：填报中 2*/
  FILLING: 2,
  /** 填报状态：填报完成 3 */
  FILL_COMPLETE: 3,
};
/** 填报状态 */
export const fillStatusOptions = [
  {
    label: '-',
    value: fillStatusMap.UN,
  },
  { label: I18N.cbam.notFilledIn, value: fillStatusMap.UN_FILL },
  { label: I18N.cbam.fillingIn, value: fillStatusMap.FILLING },
  { label: I18N.eca.completedFilling, value: fillStatusMap.FILL_COMPLETE },
];

/** 审核状态 0 -；2 未审核；3 审批通过；4 审批不通过 */
export const reviewStatusMap = {
  /** 审核状态：- */
  UN: 0,
  /** 审核状态：未审核 */
  UN_REVIEW: 2,
  /** 审核状态：审批通过 */
  REVIEW_PASS: 3,
  /** 审核状态：审批不通过 */
  REVIEW_NOT_PASS: 4,
};

/** 匹配因子状态 */
export const matchFactorStatusMap = {
  /** 审核状态：待匹配因子 */
  WAIT_MATCH_FACTOR: 1,
};

/** 审核状态选项 */
export const reviewStatusOptions = [
  {
    label: '-',
    value: reviewStatusMap.UN,
  },
  { label: I18N.eca.unaudited, value: reviewStatusMap.UN_REVIEW },
  { label: I18N.eca.approved1, value: reviewStatusMap.REVIEW_PASS },
  { label: I18N.eca.reviewFailed1, value: reviewStatusMap.REVIEW_NOT_PASS },
];

/** 邮件状态 未发送；1 发送失败；-1 发送成功 2*/
export const emailStatusMap = {
  /** 邮件状态：未发送 */
  UN_SEND: 1,
  /** 邮件状态：发送失败 */
  SEND_FAIL: -1,
  /** 邮件状态：发送成功 */
  SEND_SUCCESS: 2,
};

/** 碳排放核算的邮件状态选项 */
export const carbonAccountEmailStatusOptions = [
  {
    label: I18N.eca.notSent,
    value: emailStatusMap.UN_SEND,
  },
  { label: I18N.eca.successfullySent, value: emailStatusMap.SEND_SUCCESS },
];

/**
 * 邮件发送管理的邮件状态选项
 */
export const emailSendStatusOptions = [
  {
    label: I18N.eca.notSent,
    value: emailStatusMap.UN_SEND,
  },
  { label: I18N.eca.failInSend, value: emailStatusMap.SEND_FAIL },
  { label: I18N.eca.successfullySent, value: emailStatusMap.SEND_SUCCESS },
];

export enum ColumnsActionType {
  VIEW = 'view',
  EDIT = 'edit',
  DELETE = 'delete',
  MATCH_FACTOR = 'matchFactor',
  REVIEW = 'review',
  EDIT_FACTOR = 'editFactor',
  WITHDRAW = 'withdraw',
  SYNC_DATA = 'syncData',
  RECALCULATE = 'recalculate',
  NO_NEED_FILL = 'noNeedFill',
  COPY_TO_SOURCE_LIBRARY = 'copyToSourceLibrary',
}

/** 任务样式、清单样式 */
export const TabKey = {
  /** 任务样式：1 */
  Task: 1,
  /** 清单样式:2 */
  Tree: 2,
};

/** 需要增加同步数据按钮的看板标识：CARE3.1、CARE3.4、WMS3.12、碳账户飞机、碳账户大巴、碳账户出租车、碳账户火车 */
export const syncDataBoardFlag = [11, 12, 31, 21, 24, 23, 22];
