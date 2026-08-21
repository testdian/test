export interface CodeConfigurationListType {
  code: number;
  codeDesc: string;
  codeDescEn: string;
  codeType: number;
  createBy: number;
  createTime: string;
  deleted: boolean;
  id: number;
  updateBy: number;
  updateByName: string;
  updateTime: string;
}

export interface CodeConfigurationListParams {
  /** code */
  code?: string;
  /** 描述 */
  likeCodeDesc?: string;
  /** 适用场景 */
  likeScene?: string;
  /** 类型 */
  codeType?: string;
  /** 当前页码 */
  pageNum?: number;
  /** 每页数量 */
  pageSize?: number;
}

export interface CodeConfigurationExportParams {
  /** code */
  code?: string;
  /** 描述 */
  likeCodeDesc?: string;
  /** 适用场景 */
  likeScene?: string;
  /** 类型 */
  codeType?: string;
}
