export interface EmissionSourceListRequest {
  /**
   * 核算id
   */
  computationId: number;
  /**
   * 是否有截止时间。0 否；1 是
   */
  hasDeadline?: number;
  /**
   * 组织编码
   */
  orgCode: string;
  /**
   * 数据周期
   */
  dataPeriodName?: string;
  /**
   * 数据收集季度或月份
   */
  idx?: number;
  [property: string]: any;
}

export interface EmissionSourceListResponse {
  id: number;
  createBy: number;
  updateBy: number;
  createTime: Date;
  updateTime: Date;
  updateByName: string;
  computationId: number;
  modelId: number;
  emissionSourceId: number;
  sourceCode: string;
  carbonEmission: null;
  fillDeadline: null;
  fillStatus: number;
  fillStatus_name: string;
  reviewStatus: number;
  reviewStatus_name: string;
  emailStatus: number;
  emailStatus_name: string;
  ghgCategory: number;
  ghgCategory_name: string;
  ghgClassify: number;
  ghgClassify_name: string;
  sourceName: string;
  facility: string;
  roleIds: string;
  roleNames: string;
  remainingDay: null;
  dataPeriod: number;
  dataPeriodIdx: number;
  [property: string]: any;
}

/** 截止时间提醒项 */
export interface DeadlineRemindItem {
  /** 核算id */
  computationId: number;
  /** 组织code */
  orgCode: string;
  /** 超期标识，0 是超期前；1 超期后 */
  exceedFlag: number;
  /** 时间间隔，0 日；1 周；2 月；3 年（日：1周、前1天；2 月：3 月；3 年：1、2、3） */
  dateInterval?: 0 | 1 | 2 | 3;
  /** 日期值 */
  dateValue: number;
  /** 时间值 */
  timeValue: number;
}

/** 设置截止时间提醒请求 */
export type SetDeadlineRemindRequest = DeadlineRemindItem[];

/** 查询截止时间提醒响应 */
export interface DeadlineRemindResponse {
  id: number;
  createBy: number;
  updateBy: number;
  createTime: string;
  updateTime: string;
  orgName: string;
  computationId: number;
  orgCode: string;
  exceedFlag: number;
  dateInterval: number;
  dateValue: number;
  timeValue: number;
  deleted: boolean;
}
