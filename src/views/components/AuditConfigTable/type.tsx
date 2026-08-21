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
