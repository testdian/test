/**
 * 供应商关联审核列表请求参数
 */
export interface SupplierLinkRequest {
  /**
   * 关联商户名称
   */
  linkLinkCompanyName?: string;
  /**
   * 企业唯一代码
   */
  linkUniqueCode?: string;
  /**
   * 页码
   */
  pageNum: number;
  /**
   * 每页条数
   */
  pageSize: number;
  /**
   * 商户关联状态。0 待反馈；1 已同意；2 已拒绝
   */
  supplierLinkStatus?: number;
  /**
   * 商户类型。0 供应商；1 客户
   */
  supplierType?: number;
  [property: string]: any;
}

/**
 * 供应商关联审核列表返回
 */
export interface SupplierLinkResp {
  /**
   * 公司id
   */
  companyId?: number;
  /**
   * 创建者
   */
  createBy?: number;
  /**
   * 创建时间 & 申请时间
   */
  createTime?: Date;
  /**
   * id
   */
  id?: number;
  /**
   * 关联商户名称
   */
  linkCompanyName?: string;
  /**
   * 关联商户唯一代码
   */
  linkUniqueCode?: string;
  /**
   * 组织id
   */
  orgId?: number;
  /**
   * 供应商表id
   */
  supplierId?: number;
  /**
   * 商户关联状态。0 待反馈；1 已同意；2 已拒绝(0:待反馈; 1:已同意; 2:已拒绝)
   */
  supplierLinkStatus?: number;
  /**
   * 供应商类型。0 供应商；1 客户(0:供应商; 1:客户)
   */
  supplierType?: number;
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
