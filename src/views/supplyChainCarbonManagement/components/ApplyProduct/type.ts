/**
 * 申请产品碳足迹请求参数
 */
export interface ApplyRequest {
  /**
   * 数据请求类型。1 核算结果 2 核算过程(1:仅结果; 2:全部核算过程)
   */
  applyType?: number;
  /**
   * 评价方法
   */
  assessmentMethod?: string;
  /**
   * 评价指标列表
   */
  assessmentTargetList?: string[];
  /**
   * 供应商数据编码
   */
  dataCode?: string;
  /**
   * 截止日期
   */
  deadline?: string;
  /**
   * id
   */
  id?: number;
  /**
   * 产品id
   */
  productId?: number;
  /**
   * 备注
   */
  remark?: string;
  /**
   * 供应商id
   */
  supplierId?: number;
  /**
   * 证明材料
   */
  supportFile?: any;
  /**
   * 系统边界生命周期类型。1 半生命周期; 2 全生命周期(1:半生命周期; 2:全生命周期; 3:自定义生命周期)
   */
  systemBoundaryType?: number;
  [property: string]: any;
}
