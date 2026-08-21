/**
 * @description 碳减排管理路由信息
 */
export enum CarbonReductionRouteMaps {
  /** 碳减排管理 */
  'carbonReduction' = '/carbonReduction',
}

/** 碳减排管理按钮权限 */
export const CarbonReductionPerms = {
  /** 基准年编辑 */
  baseYearEdit: '/carbonReduction/baseYear/edit',
  /** 目标-编辑 */
  targetEdit: '/carbonReduction/target/edit',
  /** 目标-新增阶段 */
  targetAdd: '/carbonReduction/target/add',
  /** 目标-删除阶段 */
  targetDelete: '/carbonReduction/target/delete',
  /** 目标-导出 */
  targetExport: '/carbonReduction/target/export',
  /** BAU-编辑 */
  bauEdit: '/carbonReduction/bau/edit',
  /** 减排措施-查看 */
  measuresShow: '/carbonReduction/measures/show',
  /** 减排措施-新增 */
  measuresAdd: '/carbonReduction/measures/add',
  /** 减排措施-编辑 */
  measuresEdit: '/carbonReduction/measures/edit',
  /** 减排措施-删除 */
  measuresDelete: '/carbonReduction/measures/delete',
  /** 减排措施-导出 */
  measuresExport: '/carbonReduction/measures/export',
  /** 减排措施-导入 */
  measuresImport: '/carbonReduction/measures/import',
} as const;
