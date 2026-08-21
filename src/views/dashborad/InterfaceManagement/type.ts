export interface IPage {
  pageNum: number;
  pageSize: number;
  likeBatchNo?: string;
  interfaceType?: string;
  startDate?: string;
  endDate?: string;
  hasWarning?: string;
}

export interface InterFaceList {
  id: number;
  createBy: number;
  updateBy: number;
  createTime: string;
  updateByName: string;
  updateTime: string;
  orgName: string;
  batchNo: string;
  interfaceType: number;
  interfaceType_name: string;
  pushTime: string;
  deleteTime: string;
  totalNum: number;
  warningNum: number;
  deleted: boolean;
}

export interface ExportParams {
  id?: number;
  likeBatchNo?: string;
  interfaceType?: string;
  startDate?: string;
  endDate?: string;
  hasWarning?: string;
}

/** 能源系统数据行 */
export interface EnergyPageItem {
  id: number;
  createBy: number;
  updateBy: number;
  createTime: string;
  updateByName: string;
  updateTime: string;
  orgName: string;
  rowBatchNo: string;
  rowDate: string;
  rowImportFlag: number;
  rowImportMsg: string;
  rowRead: number;
  rowUuid: string;
  rowYear: number;
  rowDataId: number;
  energyType: number;
  electricity: number;
}

/** KTMS 数据行 */
export interface KtmsPageItem {
  id: number;
  createBy: number;
  updateBy: number;
  createTime: string;
  updateByName: string;
  updateTime: string;
  orgName: string;
  rowBatchNo: string;
  rowDate: string;
  rowImportFlag: number;
  rowImportMsg: string;
  rowRead: number;
  rowUuid: string;
  rowYear: number;
  rowDataId: number;
  reportNo: string;
  contractNo: string;
  reportDate: string;
  factory: string;
  exportPort: string;
  transportMode: string;
  destCountry: string;
  boxCount: number;
  totalWeight: number;
}

/** OA 数据行 */
export interface OaPageItem {
  id: number;
  createBy: number;
  updateBy: number;
  createTime: string;
  updateByName: string;
  updateTime: string;
  orgName: string;
  rowBatchNo: string;
  rowDate: string;
  rowImportFlag: number;
  rowImportMsg: string;
  rowRead: number;
  rowUuid: string;
  rowYear: number;
  rowDataId: number;
  billNo?: string;
  genDate?: string;
  department?: string;
  transportMode?: string;
  departure?: string;
  destination?: string;
  amount?: number;
  mileage?: number;
  roomCount?: number;
  nights?: number;
  /** 住宿地国别/类型（与接口字段一致） */
  country?: string;
}
