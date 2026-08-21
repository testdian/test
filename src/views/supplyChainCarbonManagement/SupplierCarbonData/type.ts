/**
 * 供应商核算数据列表请求参数
 */
export interface SupplierDataListRequest {
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
 * 供应商核算数据列表返回
 */
export interface SupplierDataResp {
  /**
   * applus审核状态。0 未审核；1 审核中；2 审核通过(0:未审核; 1:审核中; 2:审核通过)
   */
  applusAuditStatus?: number;
  /**
   * 申请人联系方式
   */
  applyMobile?: string;
  /**
   * 申请人
   */
  applyRealName?: string;
  /**
   * 申请状态。0 未填报 1 填报中 2 待审核 3 审核通过 4 审核不通过(0:未填报; 1:填报中; 2:待审核; 3:审核通过; 4:审核不通过)
   */
  applyStatus?: number;
  /**
   * 申请时间 & 任务发起时间
   */
  applyTime?: Date;
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
   * 审核时间
   */
  auditTime?: Date;
  /**
   * 公司id
   */
  companyId?: number;
  /**
   * 客户名称
   */
  companyName?: string;
  /**
   * 创建者
   */
  createBy?: number;
  /**
   * 创建时间
   */
  createTime?: Date;
  /**
   * 供应商数据编码
   */
  dataCode?: string;
  /**
   * 数据要求
   */
  dataRequire?: string;
  /**
   * 截止日期
   */
  deadline?: Date;
  /**
   * 标记删除。0 未删除 1 已删除
   */
  deleted?: boolean;
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
   * 采购产品id
   */
  productId?: number;
  /**
   * 采购产品名称
   */
  productName?: string;
  /**
   * 备注
   */
  remark?: string;
  /**
   * 提交数据时间（获取时间）
   */
  submitTime?: Date;
  /**
   * 供应商id
   */
  supplierId?: number;
  /**
   * 供应商名称
   */
  supplierName?: string;
  /**
   * 证明材料
   */
  supportFile?: string;
  /**
   * 系统边界生命周期类型。1 半生命周期; 2 全生命周期(1:半生命周期; 2:全生命周期; 3:自定义生命周期)
   */
  systemBoundaryType?: number;
  /**
   * 供应商唯一代码
   */
  uniqueCode?: string;
  /**
   * 更新者
   */
  updateBy?: number;
  /**
   * 更新时间
   */
  updateTime?: Date;
  [property: string]: any;
}
