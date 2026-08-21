/**
 * @description 核查过程管理 - 类型定义
 */

/** 核查过程列表项 */
export interface VerificationProcessItem {
  /** 主键 */
  id?: number;
  /** 创建人 */
  createBy?: number;
  /** 更新人ID */
  updateBy?: number;
  /** 创建时间 */
  createTime?: string;
  /** 更新人 */
  updateByName?: string;
  /** 更新时间 */
  updateTime?: string;
  /** 机构名称 */
  orgName?: string;
  /** 核查计划ID */
  verificationPlanId?: number;
  /** 核查意见 */
  opinion?: string;
  /** 是否删除 */
  deleted?: boolean;
  /** 核算年度 */
  year?: number;
  /** 最新版本文件地址（JSON 字符串，结构为 UploadFileItem[]） */
  lastVersionUrl?: string;
  [property: string]: any;
}

/** 核查过程列表查询参数 */
export interface VerificationProcessPageReq {
  /** 页码 */
  pageNum?: number;
  /** 每页条数 */
  pageSize?: number;
  [property: string]: any;
}

/** 上传文件项 */
export interface UploadFileItem {
  /** 文件名 */
  name: string;
  /** 文件访问地址 */
  url: string;
  /** 文件唯一标识 */
  uid: string;
}

/** 上传核查意见参数 */
export interface UploadVerificationOpinionReq {
  /** 主键 */
  id: number;
  /** 核查意见文件列表（JSON 字符串） */
  opinion: string;
}
