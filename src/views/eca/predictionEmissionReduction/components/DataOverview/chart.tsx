// components/FlexibleLineChart.js
import { EChartsOption, SeriesOption } from 'echarts';
import ReactECharts from 'echarts-for-react';

/** 减排目标折线图接口单点 */
export type ReductionTargetLineForecastInput = {
  year?: number;
  value?: number;
};

/** GET /reductionPlanTarget/lineChart 折线图 data */
export type ReductionTargetLineChartPayload = {
  stage1List?: ReductionTargetLineForecastInput[];
  stage2List?: ReductionTargetLineForecastInput[];
};

/** 解析折线图接口 data：stage1List 为阶段一，stage2List 为阶段二 */
export function normalizeReductionTargetLineChartPayload(
  payload: unknown,
): ReductionTargetLineChartPayload {
  if (
    payload != null &&
    typeof payload === 'object' &&
    !Array.isArray(payload)
  ) {
    const record = payload as Record<string, unknown>;
    return {
      stage1List: Array.isArray(record.stage1List)
        ? (record.stage1List as ReductionTargetLineForecastInput[])
        : [],
      stage2List: Array.isArray(record.stage2List)
        ? (record.stage2List as ReductionTargetLineForecastInput[])
        : [],
    };
  }
  return { stage1List: [], stage2List: [] };
}

/**
 * 将 stage1List、stage2List 按年份合并为两阶段曲线（同一图中两条线）
 */
export function buildReductionTargetLineChartPlotData(
  payload: ReductionTargetLineChartPayload | unknown,
): Array<{
  year: number;
  stage1Target: number | null;
  stage2Target: number | null;
}> {
  const { stage1List = [], stage2List = [] } =
    normalizeReductionTargetLineChartPayload(payload);
  const byYear = new Map<
    number,
    { stage1Target: number | null; stage2Target: number | null }
  >();

  const applyList = (
    list: ReductionTargetLineForecastInput[],
    stageKey: 'stage1Target' | 'stage2Target',
  ) => {
    list.forEach(r => {
      const y = r.year;
      if (y == null) {
        return;
      }
      if (!byYear.has(y)) {
        byYear.set(y, { stage1Target: null, stage2Target: null });
      }
      const slot = byYear.get(y);
      if (!slot) {
        return;
      }
      slot[stageKey] =
        r.value == null || Number.isNaN(r.value) ? null : r.value;
    });
  };

  applyList(stage1List, 'stage1Target');
  applyList(stage2List, 'stage2Target');

  return Array.from(byYear.entries())
    .sort((a, b) => a[0] - b[0])
    .map(([year, pair]) => ({
      year,
      stage1Target: pair.stage1Target,
      stage2Target: pair.stage2Target,
    }));
}

/** 阶段一 / 阶段二专用色，不参与通用色卡循环 */
export const CHART_BLUE = '#1677ff';
export const CHART_GREEN = '#16a34a';

/** 通用图表色卡（不含阶段专用蓝/绿） */
const chartColors = [
  'rgba(52, 78, 173, 1)',
  '#82DEDE',
  'rgba(253, 225, 135, 1)',
  '#D97330',
  '#ADCFFE',
  'rgba(98, 168, 232, 1)',
  '#894931',
  '#D91E18',
];

/**
 * 获取基础图表配置
 * @param {Object} props - 图表属性
 * @param {string} chartType - 图表类型 ('line' 或 'bar')
 * @returns {EChartsOption} - 基础图表配置
 */
const getBaseChartOptions = (
  props: {
    data: Array<Record<string, any>>;
    xKey: string;
    series: { key: string; name: string; color?: string }[];
    title?: string;
    yName?: string;
    xName?: string;
    height?: number;
    extraOptions?: any;
  },
  chartType: 'line' | 'bar',
): EChartsOption => {
  const { data, xKey, series, title, yName, xName, extraOptions } = props;

  // 提取X轴数据
  const xData = data.map(item => item[xKey]);

  // 构建系列数据，应用自定义颜色
  const seriesData: SeriesOption[] = series.map(({ key, name, color }) => ({
    name,
    type: chartType,
    data: data.map(item => item[key]),
    // 应用自定义颜色
    ...(color && {
      color,
      itemStyle: { color },
      lineStyle: { color },
    }),
    ...(chartType === 'bar' && {
      barWidth: 24,
      label: {
        show: true,
        position: 'top',
      },
      itemStyle: {
        borderRadius: 4,
      },
    }),
  }));

  // 基础配置
  const baseOptions: EChartsOption = {
    color: chartColors,
    tooltip: {
      trigger: 'axis',
      axisPointer: {
        type: 'shadow',
      },
    },
    title: {
      text: title,
      left: 'center',
    },
    legend: {
      data: series.map(s => s.name),
      show: true,
      itemWidth: 16,
      itemHeight: 8,
    },
    grid: {
      left: '3%',
      // x 轴 name 默认在末端（右侧），过小会被裁切；有单位名时多留右侧
      right: xName ? '12%' : '3%',
      bottom: xName ? '10%' : '3%',
      containLabel: true,
    },
    xAxis: {
      type: 'category',
      data: xData,
      name: xName,
      nameTextStyle: {
        color: '#333',
        fontSize: 12,
      },
      axisLine: {
        lineStyle: {
          color: '#E7EAEE',
        },
      },
      axisLabel: {
        color: '#333',
        fontSize: 12,
      },
    },
    yAxis: {
      type: 'value',
      name: yName,
      axisLabel: {
        color: '#333',
        fontSize: 12,
      },
      splitLine: {
        lineStyle: {
          color: '#E7EAEE',
        },
      },
    },
    series: seriesData,
  };

  // 合并额外配置（grid 浅合并，避免 extraOptions.grid 整块替换丢掉 containLabel / 默认边距）
  const merged: EChartsOption = { ...baseOptions, ...extraOptions };
  const baseGrid = baseOptions.grid;
  const extraGrid = extraOptions?.grid;
  if (extraGrid != null && !Array.isArray(extraGrid)) {
    merged.grid = {
      ...(typeof baseGrid === 'object' &&
      baseGrid != null &&
      !Array.isArray(baseGrid)
        ? baseGrid
        : {}),
      ...extraGrid,
    };
  }
  return merged;
};

/**
 * 灵活的折线图组件，支持动态配置
 * @param {Object} props - 组件属性
 * @param {Array} props.data - 图表数据
 * @param {string} props.xKey - X轴数据键名
 * @param {Array} props.series - 系列配置
 * @param {string} props.title - 图表标题
 * @param {string} props.yName - Y轴名称
 * @param {string} props.xName - X轴名称
 * @param {number} props.height - 图表高度
 * @param {Object} props.extraOptions - 额外的ECharts配置
 */
export const FlexibleLineChart = ({
  data = [],
  xKey = 'year',
  series = [],
  title = '',
  yName = '',
  xName = '',
  height = 400,
  extraOptions = {},
}: {
  data: Array<Record<string, any>>;
  xKey: string;
  series: { key: string; name: string; color?: string }[];
  title?: string;
  yName?: string;
  xName?: string;
  height?: number;
  extraOptions?: any;
}) => {
  const coloredSeries = series.map((s, index) => ({
    ...s,
    color: s.color ?? chartColors[index % chartColors.length],
  }));
  const chartOptions = getBaseChartOptions(
    { data, xKey, series: coloredSeries, title, yName, xName, extraOptions },
    'line',
  );

  return (
    <div style={{ height: `${height}px`, width: '100%' }}>
      <ReactECharts
        option={chartOptions}
        style={{ height: '100%', width: '100%' }}
        opts={{ renderer: 'canvas' }}
      />
    </div>
  );
};

/**
 * 灵活的柱状图组件，支持动态配置
 * @param {Object} props - 组件属性
 * @param {Array} props.data - 图表数据
 * @param {string} props.xKey - X轴数据键名
 * @param {Array} props.series - 系列配置
 * @param {string} props.title - 图表标题
 * @param {string} props.yName - Y轴名称
 * @param {number} props.height - 图表高度
 * @param {Object} props.extraOptions - 额外的ECharts配置
 */
export const FlexibleBarChart = ({
  data = [],
  xKey = 'name',
  series = [],
  title = '',
  yName = '',
  xName = '',
  height = 400,
  extraOptions = {},
}: {
  data: Array<Record<string, any>>;
  xKey: string;
  series: { key: string; name: string; color?: string }[];
  title?: string;
  yName?: string;
  xName?: string;
  height?: number;
  extraOptions?: any;
}) => {
  const chartOptions = getBaseChartOptions(
    { data, xKey, series, title, yName, xName, extraOptions },
    'bar',
  );

  return (
    <div style={{ height: `${height}px`, width: '100%' }}>
      <ReactECharts
        option={chartOptions}
        style={{ height: '100%', width: '100%' }}
        opts={{ renderer: 'canvas' }}
      />
    </div>
  );
};

/**
 * 灵活的面积图组件，支持动态配置
 * @param {Object} props - 组件属性
 * @param {Array} props.data - 图表数据
 * @param {string} props.xKey - X轴数据键名
 * @param {Array} props.series - 系列配置
 * @param {string} props.title - 图表标题
 * @param {string} props.yName - Y轴名称
 * @param {string} props.xName - X轴名称
 * @param {number} props.height - 图表高度
 * @param {Object} props.extraOptions - 额外的ECharts配置
 */
export const FlexibleAreaChart = ({
  data = [],
  xKey = 'year',
  series = [],
  title = '',
  yName = '',
  xName = '',
  height = 400,
  extraOptions = {},
}: {
  data: Array<Record<string, any>>;
  xKey: string;
  series: { key: string; name: string; color?: string; areaOpacity?: number }[];
  title?: string;
  yName?: string;
  xName?: string;
  height?: number;
  extraOptions?: any;
}) => {
  // 获取基础配置并设置为面积图
  const chartOptions = getBaseChartOptions(
    { data, xKey, series, title, yName, xName, extraOptions },
    'line', // 面积图使用line类型，但配置fill为true
  );

  // 自定义面积图配置
  chartOptions.series = (chartOptions.series as SeriesOption[]).map(
    (seriesItem, index) => {
      const seriesConfig = series[index];
      const areaOpacity =
        seriesConfig?.areaOpacity !== undefined
          ? seriesConfig.areaOpacity
          : 0.3;

      return {
        ...seriesItem,
        type: 'line',
        areaStyle: {
          opacity: areaOpacity, // 使用配置的透明度或默认值
        },
        emphasis: {
          focus: 'series',
        },
        lineStyle: {
          width: 2,
        },
        symbol: 'circle',
        symbolSize: 6,
        showSymbol: false,
        hoverAnimation: true,
      };
    },
  ) as SeriesOption[];

  return (
    <div style={{ height: `${height}px`, width: '100%' }}>
      <ReactECharts
        option={chartOptions}
        style={{ height: '100%', width: '100%' }}
        opts={{ renderer: 'canvas' }}
      />
    </div>
  );
};
