/**
 * @description 碳核查路由信息
 */
export enum CarbonVerifyRouteMaps {
  /** 碳核查 */
  'carbonVerify' = '/verification',
  /** 核查计划管理 */
  'verificationPlan' = '/verification/plan',
  /** 核查计划新增/编辑/详情 */
  'verificationPlanInfo' = '/verification/plan/:pageTypeInfo/:id',
  /** 核查过程管理 */
  'verificationProcess' = '/verification/process',
  /** 问题整改跟踪 */
  'verificationProblem' = '/verification/problem',
  /** 问题整改跟踪编辑/详情 */
  'verificationProblemInfo' = '/verification/problem/:pageTypeInfo/:id',
}
