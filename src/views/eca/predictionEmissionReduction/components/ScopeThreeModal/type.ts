/**
 * ReductionOverviewEmissionResp
 */
interface TargetValueList {
  year: string;
  sbtValue: number;
}
export interface TargetValueListData {
  scope1Value: number;
  scope2Value?: null;
  scope3Value?: null;
  scope3ClassifyValueList: (number | null)[];
  valueList: TargetValueList[];
}
