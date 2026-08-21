/** 新增指标 */
export interface AddIndicatorInfoType {
  id: number;
  indexDataPeriod: number;
  indexDimension: number;
  indexName: string;
  indexStatistical: number;
  unit: string;
  year: string;
}
export interface IndicatorInfoDatumType {
  id: number;
  createBy: number;
  updateBy: number;
  createTime: Date;
  updateTime: Date;
  updateByName: string;
  indexName: string;
  unit: string;
  year: number;
  indexDimension: number;
  indexDimension_name: string;
  indexDataPeriod: number;
  indexDataPeriod_name: string;
  indexStatistical: number;
  indexStatistical_name: string;
  deleted: boolean;
  unitDesc: string;
  dataValue: null;
}

export interface IndicatorInfoTableItemDatum {
  id: number;
  createBy: number;
  updateBy: number;
  createTime: Date;
  updateTime: Date;
  updateByName: string;
  operIndexId: number;
  org: string;
  value1: null;
  value2: null;
  value3: null;
  value4: null;
  value5: null;
  value6: null;
  value7: null;
  value8: null;
  value9: null;
  value10: null;
  value11: null;
  value12: null;
  dataValue: null;
  deleted: boolean;
  orgName: string;
}
