/**
 * OrgTreeSelect，org树
 */
export interface OrgTreeSelect {
  /**
   * 全选id列表
   */
  allCheckedList?: number[];
  /**
   * 半选id列表
   */
  halfCheckedList?: number[];
  /**
   * 树
   */
  tree?: OrgTree[];
  [property: string]: any;
}

/**
 * OrgTree，树
 */
export interface OrgTree {
  key: React.Key;
  /**
   * 组织简称
   */
  abbr?: string;
  label: string;
  value: string;
  /**
   * 子节点
   */
  children?: OrgTree[];
  /**
   * 组织ID
   */
  code: string;
  /**
   * id
   */
  id: number;
  /**
   * 组织层级。从1开始
   */
  level?: number;
  /**
   * 组织名称
   */
  name: string;
  /**
   * 0 启用；1 禁用 (启用 : 0； 禁用 : 1)
   */
  orgStatus?: number;
  path?: string;
  /**
   * 上级部门ID
   */
  pcode?: string;
  /**
   * 组织类型。0 真实；1 虚拟 (真实 : 0； 虚拟 : 1)
   */
  realVirtual?: number;
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

export interface OrgResp {
  /**
   * id
   */
  id?: number;
  /**
   * 组织ID
   */
  orgCode: string;
  /**
   * 组织名称
   */
  orgName: string;
  /**
   * 上级ID，传空位根组织
   */
  pcode?: string;
  /**
   * 上级组织所占股权比例
   */
  prate?: number;
  [property: string]: any;
}
