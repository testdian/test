/** 审批配置类型 */
import I18N from '@src/lang/I18N';

export const AUDIT_CONFIG_TYPE = {
  /** 按人员 */
  USER: 1,
  /** 按角色 */
  ROLE: 2,
} as const;

/** 是否需要审批 */
export const ADUDIT_REQUIRED_TYPE = {
  /** 需要审批 */
  REQUIRED: 1,
  /** 不需要审批 */
  NOT_REQUIRED: 2,
} as const;

const { REQUIRED, NOT_REQUIRED } = ADUDIT_REQUIRED_TYPE;

/** 是否需要审批的枚举 */
export const ADUDIT_REQUIRED_OPTIONS = [
  {
    label: I18N.dashborad.approvalRequired,
    value: REQUIRED,
  },
  {
    label: I18N.dashborad.noApprovalRequired,
    value: NOT_REQUIRED,
  },
];
