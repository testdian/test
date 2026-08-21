/**
 * 供应商审批列表请求参数
 */
export interface SupplierApprovalListRequest {
  /**
   * applus审核状态。0 未审核；1 审核中；2 审核通过
   */
  applusAuditStatus?: number;
  /**
   * 申请状态。0 未填报 1 填报中 2 待审核 3 审核通过 4 审核不通过
   */
  applyStatus?: number;
  /**
   * 数据请求类型。1 仅结果；2 全部核算过程
   */
  applyType?: number;
  /**
   * 评价方法
   */
  assessmentMethod?: string;
  /**
   * 产品名称
   */
  likeProductName?: string;
  /**
   * 供应商名称
   */
  likeSupplierName?: string;
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
 * 供应商审批列表返回
 */
export interface SupplierApprovalResp {
  /**
   * applus审核状态。0 未审核；1 审核中；2 审核通过(0:未审核; 1:审核中; 2:审核通过)
   */
  applusAuditStatus?: number;
  /**
   * 申请id
   */
  applyInfoId?: number;
  /**
   * 申请状态。0 未填报 1 填报中 2 待审核 3 审核通过 4 审核不通过(0:未填报; 1:填报中; 2:待审核; 3:审核通过; 4:审核不通过)
   */
  applyStatus?: number;
  /**
   * 数据请求类型。1 仅结果；2 全部核算过程(1:仅结果; 2:全部核算过程)
   */
  applyType?: number;
  /**
   * 评价方法
   */
  assessmentMethod?: string;
  /**
   * 评价方法
   */
  assessmentMethodName?: string;
  /**
   * 评价指标。|分割
   */
  assessmentTargetList?: string;
  /**
   * 评价指标
   */
  assessmentTargetNames?: string;
  /**
   * 审核状态。0 待审核；1 审核通过；2 审核不通过；3 已撤回；4 已作废(0:待审核; 1:审核通过; 2:审核不通过; 3:已撤回; 4:已作废)
   */
  auditStatus?: number;
  /**
   * 审批内容（枚举）(1:企业碳核算排放数据审核; 3:供应链审核; 4:碳应用平台行业碳核算)
   */
  auditType?: number;
  createBy?: number;
  /**
   * 提交人名称
   */
  createByName?: string;
  createTime?: Date;
  /**
   * 供应商数据编码
   */
  dataCode?: string;
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
   * 组织名称
   */
  orgName?: string;
  /**
   * 采购产品名称
   */
  productName?: string;
  /**
   * 提交数据时间（获取时间）
   */
  submitTime?: Date;
  /**
   * 供应商名称
   */
  supplierName?: string;
  /**
   * 角色名或用户名
   */
  targetNames?: string;
  updateBy?: number;
  updateTime?: Date;
  /**
   * 用户是否处于当前审核节点 && 当前节点待审核
   */
  userBtnFlag?: boolean;
  [property: string]: any;
}

//
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
  auditStatus_name?: string;
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
  auditStatus_name?: string;
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

export type SearchParamses = {
  likeUsername?: string;
  current: number;
  pageSize?: number;
};

export interface FileListType {
  name: string;
  url: string;
  uid: string;
  suffix: string;
  fileName?: string;
}

export interface FileType {
  name: string;
  url: string;
}
