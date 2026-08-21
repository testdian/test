/**
 * ReductionOverviewEmissionResp
 */
export interface ReductionOverviewEmissionRespData {
  targetYear: number;
  targetEmission: number;
  latestYear: number;
  latestEmission?: string;
  predictYear: number;
  predictSbtEmission?: number;
  predictBauEmission: number;
  predictBapEmission?: number;
  valueList: Array<ValueList>;
  nameValueList: Array<NameValueList>;
}

export interface ValueList {
  year: string;
  actualValue?: number;
  sbtValue: number;
  bauValue: number;
  bapValue?: number;
}

export interface NameValueList {
  name: string;
  value: number;
}

export interface OverViewDataItem {
  actualEmission?: number;
  targetEmissionReduction?: number;
  targetEmission?: number;
  actualNetSales?: number;
  predictedNetSales?: number;
  actualEmissionReduction?: number;
  sbtTotal?: number;
  sbtScope12?: number;
  sbtScope3?: number;
  sbtScope34?: number;
  bauTotal?: number;
  bauScope12?: number;
  bauScope3?: number;
  bauScope34?: number;
  bapTotal?: number;
  bapScope12?: number;
  bapScope3?: number;
  bapScope34?: number;
}
