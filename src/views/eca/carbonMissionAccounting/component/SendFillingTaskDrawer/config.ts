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

/** 邮件发送类型。0 群发；1 分别发送 (群发 : 0； 分别发送 : 1),可用值:0,1 */
export enum MailSendType {
  /** 邮件发送类型。0 群发 */
  GROUP = 0,
  /** 邮件发送类型。1 分别发送 */
  SEPARATE = 1,
}

/** 邮件发送类型选项 */
export const mailSendTypeOptions = [
  { label: '群发', value: MailSendType.GROUP },
  { label: '分别发送', value: MailSendType.SEPARATE },
];
