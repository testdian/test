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
}

export interface EmailTemplateListType {
  id: number;
  createBy: number;
  updateBy: number;
  createTime: Date;
  updateTime: Date;
  updateByName: string;
  mailTemplateId: number;
  /** 大于 0 是企业碳核算模块 */
  sourceId: number;
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
  toList: CcListElement[];
  ccList: CcListElement[];
  toNames: string;
  ccNames: string;
  emailStatus: number;
  cancelBtnFlag: boolean;
  childrenFlag: number;
  children: EmailTemplateListType[];
}

export interface CcListElement {
  id: number;
  username: string;
  email: string;
}

export interface SendEmailInfoListType {
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
}
