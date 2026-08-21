/** 供应商门户路由 */
export enum SupplyChainSupplierRouteMaps {
  supplierPortal = '/sys/supplierPortal',
  workbench = '/sys/supplierPortal/workbench',
  targets = '/sys/supplierPortal/targets',
  targetInfo = '/sys/supplierPortal/targets/:id',
  plans = '/sys/supplierPortal/plans',
  planCreate = '/sys/supplierPortal/plans/create',
  planInfo = '/sys/supplierPortal/plans/:id',
  progress = '/sys/supplierPortal/progress',
  progressCreate = '/sys/supplierPortal/progress/create',
  progressInfo = '/sys/supplierPortal/progress/:id',
  questionnaire = '/sys/supplierPortal/questionnaire',
  questionnaireFill = '/sys/supplierPortal/questionnaire/:id/fill',
  certificates = '/sys/supplierPortal/certificates',
  training = '/sys/supplierPortal/training',
  trainingInfo = '/sys/supplierPortal/training/:pageTypeInfo/:id',
}
