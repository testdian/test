/** 收件人类型。1 按人员；2 按角色(1:按人员; 2:按角色),可用值:1,2 */
import I18N from '@src/lang/I18N';

export enum ToConfigType {
  /** 收件人类型:1用户 */
  PERSON = 1,
  /** 收件人类型:2角色 */
  ROLE = 2,
}
/** 收件人类型选项 */
export const emailTypeOptions = [
  { label: I18N.dashborad.user, value: ToConfigType.PERSON },
  { label: I18N.dashborad.role, value: ToConfigType.ROLE },
];

/** 抄送人类型。1 按人员；2 按角色(1:按人员; 2:按角色),可用值:1,2 */
export enum CcConfigType {
  /** 抄送人类型。1用户 */
  PERSON = 1,
  /** 抄送人类型。2角色 */
  ROLE = 2,
}
/** 抄送人类型选项 */
export const copyTypeOptions = [
  { label: I18N.dashborad.user, value: CcConfigType.PERSON },
  { label: I18N.dashborad.role, value: CcConfigType.ROLE },
];
