/**
 * @description 碳核算行业版路由信息
 */

/** 路由变量 */
export enum ICARouteMaps {
  /** 碳核算行业版 */
  'ica' = '/industryCarbonAccounting',

  /** 碳核算行业版-生产单元 */
  'icaProductionUnit' = '/industryCarbonAccounting/productionUnit',
  /** 碳核算行业版-生产单元-详情 */
  'icaProductionUnitInfo' = '/industryCarbonAccounting/productionUnit/:pageTypeInfo',

  /** 碳核算行业版-碳排放核算 */
  'icaAccounting' = '/industryCarbonAccounting/accounting',
  /** 碳核算行业版-碳排放核算-详情 */
  'icaAccountingInfo' = '/industryCarbonAccounting/accounting/:pageTypeInfo',

  /** 碳核算行业版-排放数据填报 */
  'icaFill' = '/industryCarbonAccounting/fill',
  /** 碳核算行业版-排放数据填报-详情 */
  'icaFillInfo' = '/industryCarbonAccounting/fill/:pageTypeInfo',

  /** 碳核算行业版-排放数据审核 */
  'icaApproval' = '/industryCarbonAccounting/approval',
  /** 碳核算行业版-排放数据审核-详情 */
  'icaApprovalInfo' = '/industryCarbonAccounting/approval/:pageTypeInfo',

  /** 碳核算行业版-碳排放报告 */
  'icaReport' = '/industryCarbonAccounting/report',
  /** 碳核算行业版-碳排放报告-详情 */
  'icaReportInfo' = '/industryCarbonAccounting/report/:pageTypeInfo',
}
