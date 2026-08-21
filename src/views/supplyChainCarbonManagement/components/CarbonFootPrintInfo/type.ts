/**
 * 产品环境足迹数据请求参数
 */
export interface FootprintDataRequest {
  applyInfoId: number;
}

/**
 * 产品环境足迹数据返回
 */
export interface FootprintDataResp {
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
