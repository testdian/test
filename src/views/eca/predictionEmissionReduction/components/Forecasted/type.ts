export interface ForecastDataValueList {
  year: string;
  sbtValue: number;
  bauValue?: null;
}
export interface ForecastInfoData {
  latestYear: number;
  latestEmission: number;
  latestSales: number;
  latestEmissionPerSales: number;
  predictYear: number;
  predictEmission?: null;
  predictSales?: null;
  predictGrowthRate: string;
  sbtRatio: string;
  bauRatio?: null;
  valueList: ForecastDataValueList[];
}
