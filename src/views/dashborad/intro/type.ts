export interface PageConfigurationListType {
  content: string;
  createBy: number;
  createTime: string;
  deleted: boolean;
  id: number;
  pageName: string;
  updateBy: number;
  updateByName: string;
  updateTime: string;
}

export interface PageConfigurationParams {
  /** 当前页码 */
  pageNum?: number;
  /** 每页数量 */
  pageSize?: number;
}
