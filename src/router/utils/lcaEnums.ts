/**
 * @description 产品环境足迹路由信息
 */

/** 路由变量 */
export enum LCARouteMaps {
  /** 产品环境足迹 */
  'lca' = '/carbonFootprintLCA',

  /** 产品环境足迹-产品信息管理 */
  'lcaProduction' = '/carbonFootprintLCA/production',

  /** 产品环境足迹-产品环境足迹建模 */
  'lcaModel' = '/carbonFootprintLCA/model',
  /** 产品环境足迹-产品环境足迹建模详情 */
  'lcaModelInfo' = '/carbonFootprintLCA/model/:pageTypeInfo',
  /** 产品环境足迹-产品环境足迹建模详情-导入清单 */
  'lcaModelInfoImport' = '/carbonFootprintLCA/model/import',

  /** 产品环境足迹-过程库 */
  'lcaProcessLibrary' = '/carbonFootprintLCA/processLibrary',
  /** 产品环境足迹-过程库详情 */
  'lcaProcessLibraryInfo' = '/carbonFootprintLCA/processLibrary/:pageTypeInfo',

  /** 产品环境足迹-环境足迹报告 */
  'lcaReport' = '/carbonFootprintLCA/report',
}
