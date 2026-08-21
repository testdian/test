/**
 * 产品环境足迹数据请求参数
 */
export interface FootprintFillDataRequest {
  applyInfoId: number;
}

/**
 * 产品环境足迹数据返回
 */
export interface FootprintFillDataResp {
  /**
   * 申请id
   */
  applyInfoId?: number;
  /**
   * 申请状态。0 未填报 1 填报中 2 待审核 3 审核通过 4 审核不通过(0:未填报; 1:填报中; 2:待审核; 3:审核通过; 4:审核不通过)
   */
  applyStatus?: number;
  /**
   * 数据请求类型。1 仅结果；2 全部核算过程(1:仅结果; 2:全部核算过程)
   */
  applyType?: number;
  /**
   * 快照的方案id。未选择为0
   */
  assessmentId?: number;
  /**
   * 评价方法
   */
  assessmentMethod?: string;
  /**
   * 评价方法name
   */
  assessmentMethodName?: string;
  /**
   * 审核时间（完成时间）
   */
  auditTime?: Date;
  /**
   * 公司id
   */
  companyId?: number;
  /**
   * 核算周期结束日
   */
  endTime?: Date;
  /**
   * 功能单位
   */
  funcUnit?: string;
  /**
   * id
   */
  id?: number;
  /**
   * 快照的模型id。未选择为0
   */
  modelId?: number;
  /**
   * 组织id
   */
  orgId?: number;
  /**
   * 产品名称
   */
  productName?: string;
  /**
   * 核算单位
   */
  productUnit?: string;
  /**
   * 核算单位name
   */
  productUnitName?: string;
  /**
   * 结果数据
   */
  resultList?: ApplyResultResp[];
  /**
   * 规格/型号
   */
  specification?: string;
  /**
   * 核算周期起始日
   */
  startTime?: Date;
  /**
   * 供应商名称
   */
  supplierName?: string;
  /**
   * 证明材料
   */
  supportFile?: string;
  /**
   * 系统边界生命周期类型。1 半生命周期; 2 全生命周期(1:半生命周期; 2:全生命周期; 3:自定义生命周期)
   */
  systemBoundaryType?: number;
  /**
   * 供应商唯一代码
   */
  uniqueCode?: string;
  [property: string]: any;
}

/**
 * ApplyResultResp
 */
export interface ApplyResultResp {
  /**
   * 评价指标
   */
  assessmentTarget: string;
  /**
   * 评价指标名称
   */
  assessmentTargetName?: string;
  /**
   * 数值列表
   */
  dataValueList?: number[];
  /**
   * 单位
   */
  unit?: string;
  [property: string]: any;
}

/**
 * 方案数据
 */
export interface FillAssessmentRequest {
  /**
   * 申请id
   */
  applyInfoId: number;
  /**
   * 方案id
   */
  assessmentId: number;
  [property: string]: any;
}

/**
 * 方案数据
 */
export interface FillAssessmentResp {
  /**
   * applus审核状态。0 未审核；1 审核中；2 审核通过(0:未审核; 1:审核中; 2:审核通过)
   */
  applusAuditStatus?: number;
  /**
   * 申请id
   */
  applyInfoId?: number;
  /**
   * 申请状态。0 未填报 1 填报中 2 待审核 3 审核通过 4 审核不通过(0:未填报; 1:填报中; 2:待审核; 3:审核通过; 4:审核不通过)
   */
  applyStatus?: number;
  /**
   * 数据请求类型。1 仅结果；2 全部核算过程(1:仅结果; 2:全部核算过程)
   */
  applyType?: number;
  /**
   * 快照的方案id。未选择为0
   */
  assessmentId?: number;
  /**
   * 评价方法
   */
  assessmentMethod?: string;
  /**
   * 评价方法name
   */
  assessmentMethodName?: string;
  /**
   * 审核时间（完成时间）
   */
  auditTime?: Date;
  /**
   * 公司id
   */
  companyId?: number;
  /**
   * 核算周期结束日
   */
  endTime?: string;
  /**
   * 功能单位
   */
  funcUnit?: string;
  /**
   * id
   */
  id?: number;
  /**
   * 快照的模型id。未选择为0
   */
  modelId?: number;
  /**
   * 组织id
   */
  orgId?: number;
  /**
   * 产品名称
   */
  productName?: string;
  /**
   * 核算单位
   */
  productUnit?: string;
  /**
   * 核算单位name
   */
  productUnitName?: string;
  /**
   * 结果数据
   */
  resultList?: FillAssessmentResultResp[];
  /**
   * 规格/型号
   */
  specification?: string;
  /**
   * 核算周期起始日
   */
  startTime?: string;
  /**
   * 供应商名称
   */
  supplierName?: string;
  /**
   * 证明材料
   */
  supportFile?: string;
  /**
   * 系统边界生命周期类型。1 半生命周期; 2 全生命周期(1:半生命周期; 2:全生命周期; 3:自定义生命周期)
   */
  systemBoundaryType?: number;
  /**
   * 供应商唯一代码
   */
  uniqueCode?: string;
  [property: string]: any;
}

/**
 * FillAssessmentResultResp
 */
export interface FillAssessmentResultResp {
  /**
   * 评价指标
   */
  assessmentTarget?: string;
  /**
   * 评价指标名称
   */
  assessmentTargetName?: string;
  /**
   * 数值列表
   */
  dataValueList?: number[];
  /**
   * 单位
   */
  unit?: string;
  [property: string]: any;
}

/** 评价指标表格 */
export interface TargetTable {
  /**
   * id
   */
  id?: number;
  /**
   * 评价指标
   */
  assessmentTarget: string;
  /**
   * 评价指标名称
   */
  assessmentTargetName?: string;
  /**
   * 单位
   */
  unit?: string;
  /**
   * 单位产品环境影响评价结果
   */
  resultData?: number;
  /**
   * 原材料阶段（包括资源开采和运输）
   */
  rawMaterialStage?: number;
  /**
   * 包装材料阶段
   */
  packagingMaterialStage?: number;
  /**
   * 入厂运输阶段
   */
  entranceTransportationStage?: number;
  /**
   * 生产制造
   */
  productionManufacturing?: number;
  /**
   * 废弃物阶段（包括废物处理和处置）
   */
  wasteStage?: number;
  /**
   * 分销阶段
   */
  distributionStage?: number;
  /**
   * 使用阶段
   */
  usageStage?: number;
  /**
   * 生命终结阶段
   */
  endStage?: number;
  [property: string]: any;
}

/**
 * 数据填报保存
 */
export interface FootprintFillDataSaveRequest {
  /**
   * 申请id
   */
  applyInfoId?: number;
  /**
   * 快照的方案id。未选择为0
   */
  assessmentId?: number;
  /**
   * 核算周期结束日
   */
  endTime?: string;
  /**
   * 功能单位
   */
  funcUnit?: string;
  /**
   * 快照的模型id。未选择为0
   */
  modelId?: number;
  /**
   * 产品名称
   */
  productName?: string;
  /**
   * 核算单位
   */
  productUnit?: string;
  /**
   * 结果数据
   */
  resultList?: ApplyResultReq[];
  /**
   * 规格/型号
   */
  specification?: string;
  /**
   * 核算周期起始日
   */
  startTime?: string;
  /**
   * 证明材料
   */
  supportFile?: any;
  [property: string]: any;
}

/**
 * ApplyResultReq
 */
export interface ApplyResultReq {
  /**
   * 评价指标
   */
  assessmentTarget?: string;
  /**
   * 数值列表
   */
  dataValueList?: (number | null | undefined)[];
  [property: string]: any;
}
