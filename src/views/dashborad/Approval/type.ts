/**
 * 审批设置列表类型
 */
export interface IPageAuditResp {
  /**
   * list
   */
  list?: AuditResp[];
  /**
   * 页码，从1开始
   */
  pageNum?: number;
  /**
   * 页面大小
   */
  pageSize?: number;
  /**
   * 总页数
   */
  pages?: number;
  /**
   * 当前页的数量
   */
  size?: number;
  /**
   * 总数
   */
  total?: number;
}

/**
 * 审批设置类型
 */
export interface AuditResp {
  /**
   * 是否需要审批 1需要 2不需要
   */
  auditRequired?: number;
  /**
   * 审批内容（枚举）(1:企业碳核算排放数据审核; 3:供应链碳数据审核; 4:行业碳核算数据审核)
   */
  auditType?: number;
  /**
   * 租户id
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
  id?: number;
  /**
   * 组织id
   */
  orgId?: number;
  /**
   * 组织名称
   */
  orgName?: string;
  /**
   * 更新者
   */
  updateBy?: number;
  /**
   * 更新者名称
   */
  updateByName?: string;
  /**
   * 更新时间
   */
  updateTime?: Date;
  [property: string]: any;
}

/** 审批设置列表搜索栏部分类型 */
export interface Request {
  /**
   * 审批内容 1,3,4
   */
  auditType?: number;
  /**
   * 组织id
   */
  orgId?: number;
  /**
   * 页码
   */
  pageNum: number;
  /**
   * 每页条数
   */
  pageSize: number;
  [property: string]: any;
}

/**
 * 审批设置详情的类型
 */
export interface AuditReq {
  /**
   * 审批需要。1 需要审批；2 不需要审批
   */
  auditRequired?: number;
  /**
   * 审批内容（枚举）(1:企业碳核算排放数据审核; 3:供应链碳数据审核; 4:行业碳核算数据审核)
   */
  auditType?: number;
  /**
   * 节点列表
   */
  nodeList?: AuditNodeDto[];
  /**
   * 组织id
   */
  orgId?: number;
}

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
}
