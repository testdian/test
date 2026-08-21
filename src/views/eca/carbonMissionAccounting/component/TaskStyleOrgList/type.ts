export interface ComputationOrgTreeReq {
  /**
   * orgCode
   */
  orgCode: string;
  /**
   * year
   */
  year?: number;
  [property: string]: any;
}

export interface ComputationOrgTreeResp {
  /**
   * 组织简称
   */
  abbr?: string;
  children?: ComputationOrgTreeResp[];
  /**
   * 组织ID
   */
  code?: string;
  currValue?: EmissionValue;
  /**
   * 数据类型。0 自身有碳排放量；1 自身无碳排放量
   */
  dataType?: number;
  /**
   * 组织层级。从1开始
   */
  level?: number;
  /**
   * 组织名称
   */
  name?: string;
  path?: string;
  /**
   * 上级部门ID
   */
  pcode?: string;
  /**
   * 组织类型。0 真实；1 虚拟 (真实 : 0； 虚拟 : 1)
   */
  realVirtual?: number;
  totalValue?: EmissionValue;
  [property: string]: any;
}

/**
 * Value，值
 */
export interface EmissionValue {
  /**
   * 审核通过
   */
  approvedNum?: number;
  /**
   * 待填报
   */
  notFilledNum?: number;
  /**
   * 待审核
   */
  pendingNum?: number;
  scope1Emission?: string;
  scope2Emission?: string;
  scope3Emission?: string;
  totalEmission?: string;
  /**
   * 总数
   */
  totalNum?: number;
  [property: string]: any;
}
