export interface AccountModelRequest {
  /**
   * 模型名称
   */
  likeModelName?: string;
  /**
   * 页码
   */
  pageNum: number;
  /**
   * 每页条数
   */
  pageSize: number;
  [property: string]: any;
}

export interface AccountModelResponse {
  orgName: string;
  year: number;
  modelName: string;
  intro: string;
  id: number;
  [key: string]: any;
}
