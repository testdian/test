/**
 * @description 核查计划详情 - 类型定义
 */

/** 核查计划详情行项 */
export interface VerificationPlanDetailItem {
  /** 主键 */
  id?: number;
  /** 创建人 */
  createBy?: number;
  /** 更新人 */
  updateBy?: number;
  /** 更新人姓名 */
  updateByName?: string;
  /** 创建时间 */
  createTime?: string;
  /** 更新时间 */
  updateTime?: string;
  /** 组织名称 */
  orgName?: string;
  /** 核查计划ID */
  verificationPlanId?: number;
  /** 开始时间 */
  startTime?: string;
  /** 结束时间 */
  endTime?: string;
  /** 内容 */
  content?: string;
  /** 审核组ID（逗号分隔） */
  groupIds?: any;
  /** 用户ID（逗号分隔） */
  userIds?: any;
  /** 部门名称 */
  department?: string;
  /** 审核组名称 */
  auditGroup?: string;
  /** 审核组组织编码 */
  auditGroupOrgCode?: string;
  /** 是否删除 */
  deleted?: boolean;
  /** 审核组名称列表 */
  groupNames?: string;
  /** 用户名称列表 */
  userNames?: string;
  /** 排放源名称 */
  emissionSourceName?: string;
  /** 部门编码 */
  deptCode?: string;
  /** 负责人（填报角色）名称 */
  principal?: string;
  /** 负责人（填报角色）ID（多选时为数组） */
  principalId?: string;
  /** 审核组ID */
  auditGroupId?: number;
  [property: string]: any;
}

/** 核查计划详情列表查询参数（分页） */
export interface VerificationPlanDetailPageReq {
  /** 核查计划ID */
  planId?: number;
  /** 页码 */
  pageNum?: number;
  /** 每页条数 */
  pageSize?: number;
  [property: string]: any;
}

/** 核查计划详情列表查询参数（不分页） */
export interface VerificationPlanDetailListReq {
  /** 核查计划ID */
  verificationPlanId: number;
}

/** 新增核查计划详情行参数 */
export interface AddVerificationPlanDetailReq {
  /** 核查计划ID */
  verificationPlanId: number;
  /** 开始时间 */
  startTime?: string;
  /** 结束时间 */
  endTime?: string;
  /** 内容 */
  content?: string;
  /** 审核组ID（逗号分隔字符串） */
  groupIds?: string;
  /** 用户ID（逗号分隔字符串） */
  userIds?: string;
  /** 部门 */
  department?: string;
  /** 审核组名称 */
  auditGroup?: string;
  /** 审核组组织编码 */
  auditGroupOrgCode?: string;
}

/** 编辑核查计划详情行参数 */
export interface EditVerificationPlanDetailReq
  extends AddVerificationPlanDetailReq {
  /** 主键 */
  id: number;
}

/** 导出核查计划参数 */
export interface ExportVerificationPlanReq {
  /** 核查计划ID */
  verificationPlanId: number;
}

/** computationSourceList 子项 */
export interface ComputationSourceItem {
  /** 主键 */
  id: number;
  /** 排放源ID */
  emissionSourceId: number;
  /** 排放源名称 */
  sourceName: string;
  [property: string]: any;
}

/** sourceGroups 顶层项 */
export interface SourceGroupItem {
  /** 主键 */
  id: number;
  /** 排放源ID */
  emissionSourceId: number;
  /** 排放源名称 */
  sourceName: string;
  /** 机构编码 */
  orgCode: string;
  /** 年度 */
  year: number;
  /** 排放源列表 */
  computationSourceList: ComputationSourceItem[];
  [property: string]: any;
}

/** 用户项 */
export interface UserItem {
  /** 主键 */
  id: number;
  /** 真实姓名 */
  realName: string;
  /** 用户名 */
  username: string;
  [property: string]: any;
}

/** 获取排放源组列表请求参数 */
export interface GetSourceGroupsReq {
  /** 机构编码，逗号分隔 */
  orgCodes: string;
  /** 年度 */
  year: number;
}

/** 根据排放源组查询用户列表请求参数 */
export interface GetUsersByGroupIdsReq {
  /** 排放源组ID列表，逗号分隔 */
  groupIds: string;
}
