/** echarts搜索按钮枚举值 */
import I18N from '@src/lang/I18N';

export const BUTTON = {
  /** 总量 */
  TOTAL: '0',
  /** GHG Protocol标准 */
  GHG: '1',
  /** ISO14064-1:2018标准 */
  ISO: '2',
};

/** echarts搜索按钮option GHG ISO */
export const BUTTON_OPTION = [
  {
    value: BUTTON.GHG,
    label: I18N.carbonData.ghgPr,
  },
  {
    value: BUTTON.ISO,
    label: I18N.carbonData.isoStandard,
  },
];

/** echarts搜索按钮option 总量 GHG标准 ISO标准 */
export const BUTTON_ALL_OPTION = [
  {
    value: BUTTON.TOTAL,
    label: I18N.carbonData.total,
  },
  ...BUTTON_OPTION,
];

/** 排放清单搜索按钮枚举值 */
export const EMISSION_BUTTON = {
  /** 按分类 */
  SORT: 1,
  /** 按排放量 */
  EMISSION: 2,
};

/** 排放清单搜索按钮option */
export const EMISSION_BUTTON_OPTION = [
  {
    value: EMISSION_BUTTON.SORT,
    label: I18N.carbonData.byClassification,
  },
  {
    value: EMISSION_BUTTON.EMISSION,
    label: I18N.carbonData.byEmissions,
  },
];

/** 是否包含子组织枚举 */
export const ORG_FITTER = {
  /** 包含子组织 */
  INCLUDE_SUB_ORG: true,
  /** 不包含子组织 */
  EXCLUDING_SUB_ORG: false,
};

/** 是否包含子组织option */
export const ORG_FITTER_OPTION = [
  {
    value: ORG_FITTER.INCLUDE_SUB_ORG,
    label: I18N.carbonData.includeSubOrganizations,
  },
  {
    value: ORG_FITTER.EXCLUDING_SUB_ORG,
    label: I18N.carbonData.excludingSubgroups,
  },
];

/** 集团组织 */
export const GROUP = 1;

/** 公共柱形条宽度 */
export const COMMON_BAR_WIDTH = 16;

/** 图表的基本颜色 */
export const CHART_COLOR = {
  blue: '#3491FA',
  green: '#0CBF9F',
  red: '#F46F6F',
  orange: '#FBA93E',
  darkblue: '#1E53A4',
  lightblue: '#0EA7D7',
};

/** 共用颜色 */
export const COMMON_COLOR = [
  CHART_COLOR.blue,
  CHART_COLOR.green,
  CHART_COLOR.red,
  CHART_COLOR.darkblue,
  CHART_COLOR.lightblue,
];

/** 判断同比 */
export const GROWTH = {
  /** 增长 */
  UP: 1,
  /** 下降 */
  DOWN: -1,
  /** - */
  ZERO: 0,
};

//

/** 同比 */
export const PERCENT = {
  /** 增长 */
  UP: '1',
  /** 下降 */
  DOWN: '-1',
  /** - */
  ZERO: '0',
};

/** 温室气体 */
export const GAS = ['CO₂', 'CH₄', 'N₂O', 'SF₆', 'PFCs', 'HFCs', 'NF₃'];
