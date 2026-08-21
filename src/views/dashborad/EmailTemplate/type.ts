export interface IPage {
  pageNum: number;
  pageSize: number;
}

export interface EmailListType {
  id: number;
  createBy: number;
  updateBy: number;
  createTime: Date;
  updateTime: Date;
  updateByName: string;
  templateName: string;
  subject: string;
  content: string;
  attachments: string;
  toConfig: number;
  toConfig_name: string;
  toJson: string;
  ccConfig: number;
  ccConfig_name: string;
  ccJson: string;
  remark: string;
  deleted: boolean;
  toList: null;
  ccList: null;
  title: string;
}

export interface UserInfoListType {
  brands?: string;
  createBy?: number;
  createTime?: string;
  defaultPassword?: boolean;
  deleted?: boolean;
  email?: string;
  id?: number | null | string;
  customId?: string;
  lastLoginTime?: string;
  mobile?: string;
  orgCategory?: string;
  realName?: string;
  updateBy?: number;
  updateByName?: string;
  updateTime?: string;
  userStatus?: number;
  username?: string;
}

export interface EmailInfoListType {
  templateName: string;
  subject: string;
  content: string;
  ccConfig: number;
  rolesId: number[];
  copyRolesId: number[];
  ccList: CcList[];
  attachments: string | undefined;
  toList: CcList[];
  toConfig: number;
  sendTimeList?: string[];
  mailTemplateId?: number;
  mailTaskId?: number;
}

export interface CcList {
  /** 如果是角色，只传 id */
  id: number;
  username?: string;
  email?: string;
  customId?: string;
}
