/** 详情导航标签类型 */
import I18N from '@src/lang/I18N';

export const TAB_TYPE = {
  /** 审核内容 */
  APPROVAL_CONTENT: '1',
  /** 审核信息 */
  APPROVAL_INFO: '2',
} as const;

/** 详情导航标签枚举 */
export const TAB_OPTIONS = [
  {
    label: I18N.eca.reviewContent,
    key: TAB_TYPE.APPROVAL_CONTENT,
  },
  {
    label: I18N.eca.reviewInformation,
    key: TAB_TYPE.APPROVAL_INFO,
  },
];

/** 审核状态 */
export const AUDIT_STATUS_TYPE = {
  /** 已作废 */
  CANCEL: 4,
};
