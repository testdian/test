/**
 * @description 趋势分析颜色常量
 */
export const TREND_ANALYSIS_COLORS = ['#EFA871', '#AED09B', '#B6CCE7'];

/** 6 个排放类别颜色（与范围分布、组织排放图一致） */
export const SCOPE_COLORS = [
  // 直接排放或清除
  '#D97330',
  // 能源间接排放
  '#EFA871',
  // 运输间接排放
  '#5F7839',
  // 外购产品或服务间接排放
  '#AED09B',
  // 供应链下游排放
  '#3B86D0',
  // 其他间接排放
  '#B6CCE7',
];

/** 按照品类查看排放颜色 */
export const CATEGORY_COLORS = [
  '#EFA871',
  '#AED09B',
  '#B6CCE7',
  '#D97330',
  '#5F7839',
  '#3B86D0',
  '#894931',
  '#D91E18',
  '#FCF7E7',
  '#B9B9B9',
  '#53606E',
  '#D4A017',
];

/** 排放类别颜色反转 */
export const SCOPE_COLORS_REVERSE = [...SCOPE_COLORS].reverse();

/** 基准年折线颜色 */
export const BASELINE_COLOR = '#FF4D00';

/** 趋势图 grid 配置 */
export const TREND_GRID = {
  top: 50,
  left: 40,
  right: 20,
  bottom: 10,
  containLabel: true,
};

/** 横向柱状图公共 grid 配置 */
export const H_BAR_GRID = {
  top: 10,
  left: 10,
  right: 60,
  bottom: 10,
  containLabel: true,
};

/** 公共纵坐标线样式 */
export const Y_AXIS_SPLIT_LINE = {
  lineStyle: { color: '#E7EAEE' },
};
