/*
 * @@description: 生产运营管理
 */
export enum ProRouteMaps {
  /** 生产运营管理 */
  'prodManagement' = '/carbonAccounting/productionManagement',
  /** 生产运营管理-  运营数据 */
  'prodManagementOperationalData' = '/carbonAccounting/productionManagement/:pageTypeInfo/:id',
  /** 生产运营管理-  运营指标*/
  'prodManagementDataOperationalIndicators' = '/carbonAccounting/productionManagement/operationalIndicators',
}
