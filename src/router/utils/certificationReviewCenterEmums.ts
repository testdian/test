/**
 * @description 认证审核中心
 */

/** 路由变量 */
export enum CertifiCatioinReviewCenterMaps {
  /** 认证审核中心 */

  /** 认证审核中心-企业碳核算 */
  'certificationReviewCenterEca' = '/certificationReviewCenter',
  /** 认证审核中心 - 企业碳核算 - 新增 编辑  查看 审核单据**/
  'certificationReviewCenterEcaInfo' = '/certificationReviewCenter/eca/:pageTypeInfo/:id',
  /** 认证审核中心 - CBAM - 新增 编辑  查看 审核单据**/
  'certificationReviewCenterCbamInfo' = '/certificationReviewCenter/cbam/:pageTypeInfo/:id',
  /** 认证审核中心 - 产品碳足迹 - 新增 编辑  查看 审核单据**/
  'certificationReviewCenterFootprintLInfo' = '/certificationReviewCenter/Footprint/:pageTypeInfo/:id',
  /** 认证审核中心 - 产品碳足迹 - 评价方法  **/
  'certificationReviewCenterFootprintInfoChooseReport' = '/certificationReviewCenter/Footprint/:pageTypeInfo/:id/ChooseReport',
  /** 认证审核中心 - 产品碳足迹 - 评价方法详情 **/
  'certificationReviewCenterFootprintInfoChooseReportInfo' = '/certificationReviewCenter/Footprint/:pageTypeInfo/:id/ChooseReport/:modelId',

  /** 认证审核中心 - CBAM - 查看 **/
  'certificationReviewCenterCbamInfoCbam' = '/certificationReviewCenter/:pageTypeInfo/:id/cbamInfo',
  /** 认证审核中心 - CBAM - 查看(原数据) **/
  'certificationReviewCenterCbamInfoOriginCbam' = '/certificationReviewCenter/:pageTypeInfo/:id/cbamOriginInfo',

  /** * 认证审核中心 - 企业碳核算 -查看碳排放核算  **/
  'certificationReviewCenterEcaCarbonMissionInfo' = '/certificationReviewCenter/eca/:pageTypeInfo/:id/CarbonMissionInfo/:CarbonMissionPageTypeInfo/:CarbonMissionPageTypeInfoType/:computationDataId/:authNo',

  /** * 认证审核中心 - 企业碳核算 - 选择碳排放核算 **/
  'certificationReviewCenterEcaInfoChooseCarbonMission' = '/certificationReviewCenter/eca/:pageTypeInfo/:id/ChooseCarbonMission',
  /** *认证审核中心 - 企业碳核算 - 碳排放核算详情 **/
  'certificationReviewCenterEcaInfoChooseCarbonMissionInfo' = '/certificationReviewCenter/eca/:pageTypeInfo/:id/ChooseCarbonMission/:CarbonMissionPageInfo/:CarbonMissionId',
  /** * 认证审核中心 - 产品环境足迹  **/
  'certificationReviewCenterFooterPrinter' = '/certificationReviewCenter/footerPrinter',
  /** 认证审核中心 - 产品环境足迹 - 新增 编辑  查看 审核单据 ****/
  'certificationReviewCenterFooterPrinterInfo' = '/certificationReviewCenter/footerPrinter/:id',
}
