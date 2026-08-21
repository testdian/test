/**
 * 审批配置
 */
export interface AuditDetailDto {
  /**
   * 审批需要。1 需要审批；2 不需要审批
   */
  auditRequired?: number;
  /**
   * 审批内容（枚举）(1:企业碳核算排放数据审核; 3:供应链碳数据审核; 4:行业碳核算数据审核)
   */
  auditType?: number;
  /**
   * 公司id
   */
  companyId?: number;
  /**
   * 节点列表
   */
  nodeList?: AuditNodeDto[];
  /**
   * 组织id
   */
  orgId?: number;
}

/**
 * 审批节点
 */
export interface AuditNodeDto {
  /**
   * 审批组织id
   */
  auditOrgId?: number;
  /**
   * 配置类型。1 按人员；2 按角色
   */
  configType?: number;
  id?: number;
  /**
   * 节点层级。从1开始
   */
  nodeLevel?: number;
  /**
   * 节点名称
   */
  nodeName?: string;
  /**
   * 角色id或用户ids
   */
  targetIds?: number[];
  /**
   * 角色名或用户名
   */
  targetNames?: string;
}

/**
 * 审批流程
 */

export interface AuditNode {
  /**
   * 数据审批id
   */
  auditDataId?: number;
  /**
   * 审批组织id
   */
  auditOrgId?: number;
  /**
   * 审核状态。0 待审核；1 审核通过；2 审核不通过；3 已撤回；4 已作废(0:待审核; 1:审核通过; 2:审核不通过; 3:已撤回; 4:已作废),
   */

  auditStatus?: number;
  /**
   * 审批内容（枚举）(1:企业碳核算排放数据审核; 3:供应链碳数据审核; 4:行业碳核算数据审核)
   */
  auditType?: number;
  /**
   * 公司id
   */
  companyId?: number;
  /**
   * 配置类型。1 按人员；2 按角色
   */
  configType?: number;
  /**
   * 创建者
   */
  createBy?: number;
  /**
   * 创建时间
   */
  createTime?: Date;
  /**
   * 审批关联的数据
   */
  dataId?: string;
  /**
   * 标记删除。0 未删除 1 已删除
   */
  deleted?: boolean;
  id?: number;
  /**
   * 节点层级。从1开始
   */
  nodeLevel?: number;
  /**
   * 节点名称
   */
  nodeName?: string;
  /**
   * 组织id
   */
  orgId?: number;
  /**
   * 是否已审批节点或当前节点
   */
  passed?: boolean;
  /**
   * 审批配置id
   */
  sysAuditId?: number;
  /**
   * 角色id或用户ids。,分隔
   */
  targetIds?: number[];
  /**
   * 角色名或用户名
   */
  targetNames?: string;
  /**
   * 更新者
   */
  updateBy?: number;
  /**
   * 更新时间
   */
  updateTime?: Date;
}

/**
 * 审批记录
 */
export interface AuditLog {
  /**
   * 审批人id
   */
  auditBy?: number;
  /**
   * 审批人手机号
   */
  auditByMobile?: string;
  /**
   * 审批人名称
   */
  auditByName?: string;
  /**
   * 审批意见
   */
  auditComment?: string;
  /**
   * 数据审批id
   */
  auditDataId?: number;
  /**
   * 审核状态。0 待审核；1 审核通过；2 审核不通过；3 已撤回；4 已作废
   */
  auditStatus?: 0 | 1 | 2 | 3 | 4;
  /**
   * 审批时间
   */
  auditTime?: Date;
  /**
   * 审批内容（枚举）(1:企业碳核算排放数据审核; 3:供应链碳数据审核; 4:行业碳核算数据审核)
   */
  auditType?: 1 | 3 | 4;
  /**
   * 公司id
   */
  companyId?: number;
  /**
   * 创建者
   */
  createBy?: number;
  /**
   * 创建时间
   */
  createTime?: Date;
  /**
   * 审批关联的数据
   */
  dataId?: string;

  /**
   * id
   */
  id?: number;
  /**
   * 组织id
   */
  orgId?: number;
  /**
   * 更新者
   */
  updateBy?: number;
  /**
   * 更新时间
   */
  updateTime?: Date;
}
