/**
 * @description 问题清单 - 类型定义
 */

/** 问题整改跟踪详情 */
export interface IssueTrackingDetail {
  id?: number;
  createBy?: number;
  updateBy?: number;
  createTime?: string;
  updateByName?: string;
  updateTime?: string;
  orgName?: string;
  verificationPlanId?: number;
  issueUrl?: string;
  issueContent?: string;
  deleted?: boolean;
  year?: number;
}

/** 图片项 */
export interface ImageItem {
  name: string;
  uid: string;
  url: string;
}

/** 表格行 */
export interface TableRow {
  cells: string[];
  images: ImageItem[];
}

/** 表格内容（表头 + 行数据） */
export interface TableContent {
  headers: string[];
  rows: TableRow[];
}

/** 保存表格内容请求参数 */
export interface SaveContentReq {
  id: number;
  content: TableContent;
}

/** 表格行扁平化后的数据（用于 EditableProTable） */
export interface FlatTableRow {
  id: string;
  images: ImageItem[];
  [key: string]: any;
}
