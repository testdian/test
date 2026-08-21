/** 年度碳排放概览数据 */
export type EmissionOverviewData = {
  currentYear: string;
  baseYear: string;
  compareValue: string;
  yoy: string;
  baseYearLabel: string;
};

/** /computation/dashboard/carbonSummary 响应数据 */
export type CarbonSummaryData = {
  currentYear: string;
  yoy: string;
  baseYear: string;
  compareValue: string;
};

/** 堆叠数据 */
export interface StackData {
  name: string;
  total: number;
  /** 接口可能返回字符串数值或带 % 的占比 */
  values: { name: string; value: number | string; ratio?: number | string }[];
}

/** 趋势分析数据 */
export type TrendAnalysisData = {
  stackData: StackData[];
  baseline: { name: string; value: number }[];
};

/** /computation/dashboard/trendAnalysis 响应数据项 */
export type TrendAnalysisNewItem = {
  year: string;
  total: number;
  totalChangePercent: number;
  baseLineValue: number;
  items: { name: string; value: number | null }[];
};

/** 范围分布数据项 */
export type ScopeDistItem = {
  name: string;
  value: number;
  ratio?: string;
};

/** TOP5 排放类型数据项 */
export type Top5Item = {
  name: string;
  value: number;
};

/** 预测与目标数据项 */
export type ForecastItem = {
  name: string;
  actual: number | null;
  forecast: number | null;
  target: number | null;
};

/** /computation/dashboard/forecastTarget 响应数据项（与 DashboardForecastResp 一致） */
export type ForecastTargetNewItem = {
  year: string;
  /** SCOPE1AND2：实际排放量（ktCO₂e） */
  actualEmission?: number;
  /** SCOPE1AND2：目标排放量（ktCO₂e） */
  targetEmission?: number;
  /** SCOPE3：目标排放强度 */
  targetIntensity?: number;
  /** SCOPE3：若后端返回实际排放强度（文档扩展） */
  actualIntensity?: number;
};

/** 机构 TOP5 数据 */
export type OrgTop5Data = {
  orgCode: string;
  orgName: string;
  items: Top5Item[];
};

/** 指标列表 */
export type IndicatorItem = {
  id: number;
  indexName: string;
  unit: string;
  unitDesc: string;
};

/** /computation/dashboard/supplierProductEmission 折线柱图 series 项 */
export type SupplierProductEmissionSeriesItem = {
  name: string;
  data: number[];
};

/** /computation/dashboard/supplierProductEmission 汇总表行 */
export type SupplierProductEmissionTableRow = {
  supplier: string;
  totalEmission: number;
  emissionPerWeight: string;
};

/** /computation/dashboard/supplierProductEmission 响应 data */
export type SupplierProductEmissionData = {
  categories: string[];
  series: SupplierProductEmissionSeriesItem[];
  table: SupplierProductEmissionTableRow[];
};

/** /computation/dashboard/supplierMaterialList 响应数据项 */
export type SupplierMaterialItem = {
  material: string;
  supplierList: string[];
};

/** 下游运输方式统计原始响应项：接口文档未生成 SDK，兼容后端常见返回字段 */
export type DownstreamTransportModeRawItem = {
  name?: string;
  bu?: string;
  buName?: string;
  bizLine?: string;
  orgName?: string;
  transportMode?: string;
  value?: number | string;
  ratio?: number | string;
  percent?: number | string;
  total?: number | string;
  items?: DownstreamTransportModeRawItem[];
  values?: DownstreamTransportModeRawItem[];
  data?: DownstreamTransportModeRawItem[];
  [property: string]: unknown;
};

export type DownstreamTransportModeRawData =
  | DownstreamTransportModeRawItem[]
  | DownstreamTransportModeRawItem
  | undefined;

export type DownstreamTransportModeBarDatum = {
  value: number;
  rawValue?: number | string;
  ratio?: number | string;
};

export type DownstreamTransportModeSeriesItem = {
  name: string;
  data: DownstreamTransportModeBarDatum[];
};

export type DownstreamTransportModeChartData = {
  categories: string[];
  series: DownstreamTransportModeSeriesItem[];
};
