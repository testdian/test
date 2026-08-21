/**
 * @description 问题整改跟踪 - 类型定义
 */

/** 问题整改列表项 */
export interface VerificationProblemItem {
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
  /** 问题清单文件地址 */
  issueUrl?: string;
  /** 问题内容 */
  issueContent?: string;
  /** 是否删除 */
  deleted?: boolean;
  /** 核算年度 */
  year?: number;
  [property: string]: any;
}

/** 问题整改列表查询参数 */
export interface VerificationProblemPageReq {
  /** 页码 */
  pageNum?: number;
  /** 每页条数 */
  pageSize?: number;
  [property: string]: any;
}

/** 问题整改详情 */
export interface VerificationProblemDetail extends VerificationProblemItem {
  /** 整改状态 0-待整改 1-已整改 */
  rectifyStatus?: 0 | 1;
  /** 整改说明 */
  rectifyRemark?: string;
}
