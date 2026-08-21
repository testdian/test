export interface VersionReq {
  /**
   * 页码
   */
  pageNum: string;
  /**
   * 每页条数
   */
  pageSize: string;
  [property: string]: any;
}

export interface VersionResp {
  /**
   * 变更说明
   */
  changeLog?: string;
  /**
   * 创建者
   */
  createBy?: number;
  /**
   * 创建时间
   */
  createTime?: Date;
  /**
   * 标记删除。0 未删除 1 已删除
   */
  deleted?: boolean;
  /**
   * id
   */
  id?: number;
  /**
   * 更新者
   */
  updateBy?: number;
  /**
   * 更新人名称
   */
  updateByName?: string;
  /**
   * 更新时间
   */
  updateTime?: Date;
  /**
   * 版本
   */
  version?: string;
  /**
   * 版本状态
   */
  versionStatus?: string;
  [property: string]: any;
}
