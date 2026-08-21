/**
 * @description 核查计划管理 - 类型定义
 */

/** 核查计划列表项 */
export interface VerificationPlanItem {
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
  /** 核算ID */
  computationId?: number;
  /** 机构编码 */
  orgCodes?: string;
  /** 机构名称列表 */
  orgNames?: string;
  /** 核算年度 */
  year?: number;
  /** 是否发送消息 */
  sendMessage?: boolean;
  /** 是否删除 */
  deleted?: boolean;
  /** 通知计划 */
  notifySchedule?: string;
  [property: string]: any;
}

/** 核查计划列表查询参数 */
export interface VerificationPlanPageReq {
  /** 页码 */
  pageNum?: number;
  /** 每页条数 */
  pageSize?: number;
  [property: string]: any;
}

/** 编辑核查计划参数 */
export interface EditVerificationPlanReq {
  /** 主键 */
  id: number;
  /** 核算年度 */
  year?: number;
  /** 机构编码，逗号分隔 */
  orgCodes?: string;
  /** 钉钉通知发送开关 */
  sendMessage: boolean;
}

/** 新增核查计划参数 */
export interface AddVerificationPlanReq {
  /** 核算年度 */
  year: number;
  /** 机构编码，逗号分隔 */
  orgCodes: string;
}

/** 更新钉钉通知开关参数 */
export interface UpdateDingNotifySwitchReq {
  /** 主键 */
  id: number;
  /** 钉钉通知发送开关 0-关闭 1-开启 */
  dingNotifySwitch: 0 | 1;
}
