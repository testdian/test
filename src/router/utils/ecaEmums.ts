/*
 * @@description: 企业碳核算的路由信息
 */
export enum EcaRouteMaps {
  /** 企业碳核算 */
  'eca' = '/carbonAccounting',

  /** 企业碳核算/碳排放核算**/
  'carbonMissionAccounting' = '/carbonAccounting/carbonMissionAccounting',
  /** 企业碳核算/碳排放核算/核算管理抽屉/模型详情 */
  'carbonMissionAccountingModelInfo' = '/carbonAccounting/carbonMissionAccounting/accountingModelInfo/:pageTypeInfo/:id',
  /* 企业碳核算/碳排放核算- 核算详情 emissionSource**/
  'carbonMission' = '/carbonAccounting/carbonMissionAccounting/carbonMission',
  'carbonMissionAccountingInfo' = '/carbonAccounting/carbonMissionAccounting/carbonMission/:pageTypeInfo/:id',
  /** 企业碳核算/碳排放管理-详情-排fao放源列表-查看 */
  'carbonMissionAccountingInfoEmissionSourceInfo' = '/carbonAccounting/carbonMissionAccounting/carbonMission/:pageTypeInfo/:id/emissionSource/:factorPageInfo/:sourcefactorId/:computationDataId',
  'carbonMissionAccountingSourceInfo' = '/carbonAccounting/carbonMissionAccounting/emissionSource/:pageTypeInfo/:id',
  /** 企业碳核算/碳排放核算/排放源审核详情页 */
  'carbonMissionAccountingAuditSourceInfo' = '/carbonAccounting/carbonMissionAccounting/auditSource/:actionType/:computationId/:orgCode/:isGroup/:sourceId',
  'carbonMissionAccountingSourceInfofactorDetail' = '/carbonAccounting/carbonMissionAccounting/emissionSource/:pageTypeInfo/:id/detailfactor/:factorPageInfo/:SourcefactorId',
  /** 企业碳核算/排放源详情**/
  'carbonMissionAccountingSourceInfoDetail' = '/carbonAccounting/carbonMissionAccounting/carbonMission/:pageTypeInfo/:id/detailfactor/:factorPageInfo/:SourcefactorId/:computationDataId',
  /** 企业碳核算/选择排放源**/
  'carbonMissionAccountingSource' = '/carbonAccounting/carbonMissionAccounting/emissionSource/:pageTypeInfo/:id/chooseEmissionSource/:SourcefactorId',

  /** 企业碳核算/数据填报**/
  'fillData' = '/carbonAccounting/fillData',
  /** 企业碳核算/数据填报-新增 编辑 详情***/
  'fillDataInfo' = '/carbonAccounting/fillData/:pageTypeInfo/:id/:approvalId',
  // 企业碳核算/数据填报 -导入
  'fillDataInfoImport' = '/carbonAccounting/fillData/:pageTypeInfo/:id/:approvalId/import',
  'fillDataInfoScreen' = '/carbonAccounting/fillData/:pageTypeInfo/:id/:approvalId/detailfactor/:sourcePageInfo/:SourcefactorId',
  /** 企业碳核算/数据填报-选择排放源因子 */
  'fillDataInfoScreenSelectEmissionSource' = '/carbonAccounting/fillData/:pageTypeInfo/:id/detailfactor/:sourcePageInfo/:SourcefactorId/selectEmissionSource',
  /** 企业碳核算/数据填报-选择排放源因子-详情 */
  'fillDataInfoScreenSelectEmissionSourceDetail' = '/carbonAccounting/fillData/:pageTypeInfo/:id/detailfactor/:sourcePageInfo/:SourcefactorId/selectEmissionSource/:factorPageInfo/:factorId',
  /** 企业碳核算/数据填报-选择供应商数据 */
  'fillDataInfoScreenSelectSupplier' = '/carbonAccounting/fillData/:pageTypeInfo/:id/detailfactor/:sourcePageInfo/:SourcefactorId/selectSupplier',
  /** 企业碳核算/数据填报-选择供应商数据-详情 */
  'fillDataInfoScreenSelectSupplierDetail' = '/carbonAccounting/fillData/:pageTypeInfo/:id/detailfactor/:sourcePageInfo/:SourcefactorId/selectSupplier/:applyInfoId',
  /** 排放数据审核**/
  'approvalManage' = '/carbonAccounting/approvalManage',
  /** 排放数据审核-详情**/
  'approvalManageInfo' = '/carbonAccounting/approvalManage/:pageTypeInfo/:id/:dataId/:auditStatus',
  'approvalManageInfoDetail' = '/carbonAccounting/approvalManage/:pageTypeInfo/:id/:dataId',
  /** 审核-排放数据详情**/
  'approvalManageInfoSourceDetail' = '/carbonAccounting/approvalManage/:pageTypeInfo/:id/:dataId/:auditStatus/detailfactor/:factorPageInfo/:SourcefactorId',
  /** 企业碳核算/数据填报-选择排放源**/
  'fillDataAccountingSource' = '/carbonAccounting/fillData/:pageTypeInfo/:id/:approvalId/chooseEmissionSource',
  /** *企业碳核算/数据填报 排放源详情**/
  'fillDataAccountingSourceInfoDetail' = '/carbonAccounting/fillData/:pageTypeInfo/:id/:approvalId/chooseEmissionSource/:factorPageInfo/:SourcefactorId',
  // 'carbonMissionAccountingSourceInfofactorDetail' = '/carbonAccounting/carbonMissionAccounting/emissionSource/:pageTypeInfo/:id/detailfactor/:factorPageInfo/:SourcefactorId',

  /** 报告生成配置 */
  'ecaReport' = '/ecaReport',
  /** 排放目标（原型新增） */
  'emissionTarget' = '/emissionTarget',
  /** 减排措施（原型新增） */
  'reductionMeasures' = '/reductionMeasures',
  /** 报告生成配置/基准年**/
  'baseYear' = '/ecaReport/baseYear',
  /** 报告生成配置/基准年 新增 编辑 查看**/
  'baseYearInfo' = '/ecaReport/baseYear/:pageTypeInfo/:id',
  /** =======================基准年end==================================== */

  /** 报告生成配置/数据质量控制**/
  'dataQualityManage' = '/ecaReport/dataQualityManage',
  /** 报告生成配置/数据质量控制详情 **/
  'editDataQualityManage' = '/ecaReport/dataQualityManage/:pageTypeInfo/:id',
  /** 报告生成配置/标准详情***/
  'editDataQualityManageEditDetail' = '/ecaReport/dataQualityManage/:pageTypeInfo/:id/edit/:controlPlanId/:standardType',
  'editDataQualityManageDetail' = '/ecaReport/dataQualityManage/:pageTypeInfo/:id/show/:controlPlanId/:standardType',
  /** =======================数据质量控制end================================= */

  /** 报告生成配置/核算报告**/
  'accountingReport' = '/ecaReport/accountingReport',
  /** 报告生成配置/核算报告 新增 编辑 查看****/
  'accountingReportInfo' = '/ecaReport/accountingReport/:pageTypeInfo/:id',
  /** 报告生成配置/核算报告 - 选择减排场景***/
  'accountingReportInfoChooseScreen' = '/ecaReport/accountingReport/:pageTypeInfo/:id/:chooseType/',
  'accountingReportInfoChooseScreenDetail' = '/ecaReport/accountingReport/:pageTypeInfo/:id/:chooseType/:serenPageTypeInfo/:sercenId',
  /** =======================核算报告end================================= */

  /** 报告生成配置/减排场景**/
  'reductionScene' = '/ecaReport/reductionScene',
  /** 报告生成配置/减排场景 新增 编辑 查看**/
  'reductionSceneInfo' = '/ecaReport/reductionScene/:pageTypeInfo/:id',
  /** =======================减排场景end================================= */

  /** 核算配置模块 */
  'accountingAllocation' = '/accountingAllocation',
  /** 核算配置模块/参数库 */
  'ecaParameter' = '/accountingAllocation/parameter',
  /** 核算配置模块/排放因子库 */
  'factor' = '/accountingAllocation/factor',
  /** 核算配置模块/排放因子 */
  'factorInfo' = '/accountingAllocation/factor/info/:pageTypeInfo/:id',
  /** 核算配置模块/排放源库 */
  'emissionManage' = '/accountingAllocation/emissionManage',
  'emissionManagInfo' = '/accountingAllocation/emissionManage/:pageTypeInfo/:id',
  'emissionManagInfoChoose' = '/accountingAllocation/emissionManage/:pageTypeInfo/:id/chooseFactor',
  'emissionManagInfoChooseDetail' = '/accountingAllocation/emissionManage/:pageTypeInfo/:id/chooseFactor/:factorPageInfo/:factorId',
  /** 核算配置模块/排放源库-详情-选择供应商数据 */
  'emissionManagInfoChooseSupplierData' = '/accountingAllocation/emissionManage/:pageTypeInfo/:id/chooseSupplierData',
  /** 核算配置模块/排放源库-详情-选择供应商数据-详情 */
  'emissionManagInfoChooseSupplierDataInfo' = '/accountingAllocation/emissionManage/:pageTypeInfo/:id/chooseSupplierData/:applyInfoId',

  /** 核算配置模块/核算模型 */
  'accountingModel' = '/accountingAllocation/accountingModel',
  /** 核算配置模块/核算模型-新增编辑查看 */
  'accountingModelInfo' = '/accountingAllocation/accountingModel/:pageTypeInfo/:id',
  /** 核算配置模块/排放源管理 */
  'accountingModelEmissionSource' = '/accountingAllocation/accountingModel/emissionSource/:pageTypeInfo/:id',
  /** 核算配置模块/选择排放源 */
  'accountingModelEmissionSourceInfo' = '/accountingAllocation/accountingModel/emissionSource/:pageTypeInfo/:id/chooseEmissionSource/:SourcefactorId',
  /** 核算配置模块/排放源详情 */
  'accountingModelEmissionSourceInfoShow' = '/accountingAllocation/accountingModel/emissionSource/:pageTypeInfo/:id/detailfactor/:factorPageInfo/:SourcefactorId',
  /** 核算配置模块/指标管理 */
  'pom' = '/accountingAllocation/pom',

  /** 核算配置模块/数据字典 */
  'dataDictionary' = '/accountingAllocation/dicttype',
  'systemDictCategory' = '/accountingAllocation/dicttype/category/:id',
  /** 数据字典枚举值 */
  'systemDictInfo' = '/accountingAllocation/dicttype/info/:id',
}
