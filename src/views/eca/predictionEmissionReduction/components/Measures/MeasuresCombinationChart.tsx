/**
 * 减排措施曲线图 + 右侧明细面板（数据来自 /reductionMeasure/curveChart、curveChartMeasures）
 */
import ReactECharts from 'echarts-for-react';
import React, { useCallback, useMemo, useRef, useState } from 'react';

import CustResizable from '@/components/Resizable';

import type {
  ReductionMeasureCurveChartMeasureResp,
  ReductionMeasureCurveChartResp,
  ReductionMeasureCurveChartYearMeasureResp,
} from './type';
import { CHART_BLUE } from '../DataOverview/chart';

interface MeasuresCombinationChartProps {
  chartData: ReductionMeasureCurveChartResp | null;
  /** 点击年份时由父组件请求并传入 */
  panelData: ReductionMeasureCurveChartMeasureResp[];
  /** 当前面板展示年份（由父组件同步） */
  panelYear: number | null;
  /** 点击图表某年份时回调 */
  onYearClick: (year: number) => void;
  /** 右侧面板勾选变化时，按措施 id 重新请求曲线图 */
  onMeasureFilterChange?: (checkedIds: number[], allIds: number[]) => void;
  /** 1 范围一&范围二；3 范围三，影响 Y 轴单位与面板展示字段 */
  scopeType: number;
  height?: number;
}

function collectYears(data: ReductionMeasureCurveChartResp | null): number[] {
  if (!data) return [];
  const set = new Set<number>();
  const add = (arr?: { year?: number }[]) => {
    arr?.forEach(p => {
      if (p.year != null) set.add(p.year);
    });
  };
  add(data.bauList);
  add(data.stage1List);
  add(data.stage2List);
  add(data.actualList);
  add(data.estimatedReductionList);
  add(data.measuresByYear);
  return Array.from(set).sort((a, b) => a - b);
}

/** 跨所有年份按措施 id 去重，生成图例名称（重名时带 id 区分） */
function collectMeasureLegendItems(
  measuresByYear?: ReductionMeasureCurveChartYearMeasureResp[],
): { id: number; legendName: string }[] {
  const byId = new Map<number, string>();
  measuresByYear?.forEach(row => {
    row.measures?.forEach(m => {
      if (m.id == null || byId.has(m.id)) return;
      const label = (m.measureName ?? '').trim() || `措施 ${m.id}`;
      byId.set(m.id, label);
    });
  });
  const nameCount = new Map<string, number>();
  Array.from(byId.values()).forEach(name => {
    nameCount.set(name, (nameCount.get(name) ?? 0) + 1);
  });
  return Array.from(byId.entries())
    .map(([id, measureName]) => ({
      id,
      legendName:
        (nameCount.get(measureName) ?? 0) > 1
          ? `${measureName} (${id})`
          : measureName,
    }))
    .sort((a, b) => a.id - b.id);
}

function measureValueAtYear(
  measuresByYear: ReductionMeasureCurveChartYearMeasureResp[] | undefined,
  year: number,
  measureId: number,
): number | null {
  const row = measuresByYear?.find(r => r.year === year);
  const item = row?.measures?.find(m => m.id === measureId);
  if (item?.value == null) return null;
  const v = Number(item.value);
  return Number.isNaN(v) ? null : v;
}

/** 与 BAU / 阶段目标 / 实际&预计主色错开，按索引循环使用（不含阶段专用蓝/绿） */
const MEASURE_BAR_COLORS = [
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

const BAR_WIDTH = 20;
const CENTERED_BAR_LAYOUT = {
  barWidth: BAR_WIDTH,
  barMaxWidth: BAR_WIDTH,
  barGap: '-100%',
  barCategoryGap: '60%',
};

const LINE_SYMBOL_SIZE = 6;

function buildHollowLinePoint(color: string) {
  return {
    symbol: 'circle' as const,
    symbolSize: LINE_SYMBOL_SIZE,
    itemStyle: {
      color: '#fff',
      borderColor: color,
      borderWidth: 2,
    },
  };
}

function seriesMap(
  years: number[],
  points?: { year?: number; value?: number }[],
): (number | null)[] {
  return years.map(y => {
    const hit = points?.find(p => p.year === y);
    return hit?.value != null ? hit.value : null;
  });
}

/** 合并阶段一、阶段二目标为单条「目标排放量」曲线 */
function buildTargetEmissionSeries(
  years: number[],
  chartData: ReductionMeasureCurveChartResp | null,
): (number | null)[] {
  const byYear = new Map<number, number>();
  chartData?.stage1List?.forEach(point => {
    if (point.year != null && point.value != null) {
      byYear.set(point.year, point.value);
    }
  });
  chartData?.stage2List?.forEach(point => {
    if (point.year != null && point.value != null) {
      byYear.set(point.year, point.value);
    }
  });
  return years.map(year => byYear.get(year) ?? null);
}

const MeasuresCombinationChart: React.FC<MeasuresCombinationChartProps> = ({
  chartData,
  panelData,
  panelYear,
  onYearClick,
  onMeasureFilterChange,
  scopeType,
  height = 340,
}) => {
  const years = useMemo(() => collectYears(chartData), [chartData]);
  const [panelExpanded, setPanelExpanded] = useState(false);
  const [checked, setChecked] = useState<Record<number, boolean>>({});

  const [unselectedLegends, setUnselectedLegends] = useState<
    Record<string, boolean>
  >({});

  const panelIds = panelData.map(p => p.measureId).filter(Boolean) as number[];
  const panelIdsKey = panelIds.join(',');

  React.useEffect(() => {
    const next: Record<number, boolean> = {};
    panelIds.forEach(id => {
      next[id] = checked[id] !== false;
    });
    setChecked(next);
    // eslint-disable-next-line react-hooks/exhaustive-deps -- 仅在新面板数据时默认全选
  }, [panelIdsKey]);

  React.useEffect(() => {
    if (panelYear == null) {
      setPanelExpanded(false);
    }
  }, [panelYear]);

  const yAxisName =
    scopeType === 3 ? '强度 (吨/万件)' : '排放量 / 减排量 (tCO₂e)';

  const buildOption = useCallback(() => {
    const targetEmission = buildTargetEmissionSeries(years, chartData);
    const actual = seriesMap(years, chartData?.actualList);
    const estimated = seriesMap(years, chartData?.estimatedReductionList);
    const estimatedLabel = scopeType === 3 ? '预计排放强度' : '预计排放量';
    const actualLabel = scopeType === 3 ? '实际强度' : '实际排放';
    const targetLabel = scopeType === 3 ? '目标排放强度' : '目标排放量';

    const actualBarSeries = {
      name: actualLabel,
      type: 'bar' as const,
      data: actual,
      ...CENTERED_BAR_LAYOUT,
      zlevel: 1,
      z: 3,
      itemStyle: { color: '#85dfca', borderRadius: [2, 2, 0, 0] },
      emphasis: { focus: 'series' as const },
    };

    const lineZ = { zlevel: 2 as const, z: 5 as const };

    const targetEmissionLineSeries = {
      name: targetLabel,
      type: 'line' as const,
      data: targetEmission,
      ...lineZ,
      smooth: true,
      lineStyle: { color: CHART_BLUE, width: 2.5 },
      symbol: 'circle' as const,
      symbolSize: LINE_SYMBOL_SIZE,
      itemStyle: { color: CHART_BLUE },
      connectNulls: false,
    };

    const measuresByYear = chartData?.measuresByYear;
    const measureLegendItems = collectMeasureLegendItems(measuresByYear);
    const hasMeasureBreakdown = measureLegendItems.length > 0;

    /** 预计减排：自 x 轴（0）起算的原始值，柱 + 折线（同名图例联动） */
    const estimatedFromZeroData = years.map((_, i) => {
      const e = estimated[i];
      if (e == null || e <= 0) return null;
      return Number(e);
    });

    const measureDataByItem = measureLegendItems.map(item =>
      years.map(y => {
        const raw = measureValueAtYear(measuresByYear, y, item.id);
        if (raw == null) return null;
        return raw;
      }),
    );

    const sumMeasuresPerYear = years.map((_, i) =>
      measureDataByItem.reduce((sum, arr, origIdx) => {
        const item = measureLegendItems[origIdx];
        if (unselectedLegends[item.legendName]) return sum;
        const v = arr[i];
        if (v == null || typeof v !== 'number' || v <= 0) return sum;
        return sum + v;
      }, 0),
    );

    /** 预计减排：柱、折线与「实际排放」深蓝系拉开；强度模式与深蓝线也需可辨 */
    const estimatedLineColor = scopeType === 3 ? '#6d28d9' : '#0891b2';

    /**
     * 单一堆叠柱（COMBINED_STACK）自下而上分两段：
     *   ① 缺口段（透明，= 目标排放量 − Σ措施）
     *   ② 各减排措施（从目标 − Σ措施 向上堆到目标排放量）
     */
    const COMBINED_STACK = 'combinedBar';

    const gapSpacerData = years.map((_, i) => {
      const target = targetEmission[i];
      if (target == null) return null;
      const sum = sumMeasuresPerYear[i];
      const gap = Number(target) - sum;
      return gap > 0 ? gap : 0;
    });

    const GAP_SERIES_NAME = '缺口';
    const gapSpacerSeries = {
      name: GAP_SERIES_NAME,
      type: 'bar' as const,
      stack: COMBINED_STACK,
      data: gapSpacerData,
      ...CENTERED_BAR_LAYOUT,
      zlevel: 0,
      z: 1,
      itemStyle: { color: 'rgba(0,0,0,0)', borderWidth: 0 },
      emphasis: { disabled: true },
      legendHoverLink: false,
    };

    // ② 减排措施段：自下而上堆叠，最末措施在底（紧贴缺口段），首措施在顶（紧贴 BAU）
    const measureBarSeries = hasMeasureBreakdown
      ? [...measureLegendItems].reverse().map(item => {
          const origIdx = measureLegendItems.findIndex(x => x.id === item.id);
          return {
            name: item.legendName,
            type: 'bar' as const,
            stack: COMBINED_STACK,
            data: measureDataByItem[origIdx],
            ...CENTERED_BAR_LAYOUT,
            zlevel: 0,
            z: 2,
            emphasis: { focus: 'series' as const },
            itemStyle: {
              color: MEASURE_BAR_COLORS[origIdx % MEASURE_BAR_COLORS.length],
            },
          };
        })
      : [];

    const estimatedLineFromZero = {
      name: estimatedLabel,
      type: 'line' as const,
      data: estimatedFromZeroData,
      zlevel: 3,
      z: 8,
      smooth: true,
      lineStyle: { color: estimatedLineColor, width: 2.5 },
      ...buildHollowLinePoint(estimatedLineColor),
      connectNulls: false,
    };

    const measureStackSeries = [gapSpacerSeries, ...measureBarSeries];

    const baseLegendNames = [targetLabel, actualLabel, estimatedLabel];
    const measureLegendNames = measureLegendItems.map(m => m.legendName);
    const barLegendNameSet = new Set([actualLabel, ...measureLegendNames]);
    const legendNames = [...baseLegendNames, ...measureLegendNames];

    /** 与 legend icon 一致：折线系列圆点，柱状系列圆角矩形 */
    const tooltipMarker = (seriesName: string, color?: string) => {
      const c = color ?? '#ccc';
      if (barLegendNameSet.has(seriesName)) {
        return `<span style="display:inline-block;vertical-align:middle;margin-right:5px;width:12px;height:8px;border-radius:2px;background-color:${c};"></span>`;
      }
      return `<span style="display:inline-block;vertical-align:middle;margin-right:5px;width:10px;height:10px;border-radius:50%;background-color:${c};"></span>`;
    };
    const legendRowHint =
      measureLegendItems.length > 0
        ? Math.min(72, 22 + Math.ceil(legendNames.length / 5) * 16)
        : 50;

    const formatTooltipValue = (value: unknown): string | null => {
      if (value == null || value === '') return null;
      const raw = Array.isArray(value) ? value[value.length - 1] : value;
      const num = Number(raw);
      if (Number.isNaN(num)) return null;
      return num.toLocaleString(undefined, { maximumFractionDigits: 4 });
    };

    const axisTooltipFormatter = (params: unknown) => {
      if (!Array.isArray(params) || params.length === 0) return '';
      type P = {
        seriesName?: string;
        color?: string;
        value?: unknown;
        axisValueLabel?: string;
        axisValue?: string | number;
        name?: string | number;
      };
      const list = params as P[];
      const axisLabel = String(
        list[0]?.axisValueLabel ?? list[0]?.axisValue ?? list[0]?.name ?? '',
      );
      const bySeriesName = new Map<string, P>();
      list.forEach(p => {
        const sn = String(p.seriesName ?? '');
        if (sn === GAP_SERIES_NAME) return;
        if (sn === estimatedLabel) {
          if (!bySeriesName.has(estimatedLabel))
            bySeriesName.set(estimatedLabel, p);
          return;
        }
        if (!bySeriesName.has(sn)) bySeriesName.set(sn, p);
      });
      const lines = [
        `<div style="font-weight:600;margin-bottom:6px">${axisLabel}</div>`,
      ];
      // 按图例顺序显示基础系列和各措施
      legendNames.forEach(name => {
        const p = bySeriesName.get(name);
        if (!p) return;
        const text = formatTooltipValue(p.value);
        if (text == null) return;
        lines.push(
          `${tooltipMarker(name, p.color)}${name}: <strong>${text}</strong>`,
        );
      });
      return lines.join('<br/>');
    };

    return {
      backgroundColor: 'transparent',
      grid: { top: legendRowHint, right: 24, bottom: 40, left: 64 },
      legend: {
        top: 0,
        type:
          legendNames.length > 10 ? ('scroll' as const) : ('plain' as const),
        itemWidth: 12,
        itemHeight: 8,
        textStyle: { fontSize: 11, color: '#666' },
        data: [
          ...baseLegendNames.map(name =>
            name === actualLabel
              ? { name, icon: 'roundRect' as const }
              : { name, icon: 'circle' as const },
          ),
          ...measureLegendNames.map(name => ({
            name,
            icon: 'roundRect' as const,
          })),
        ],
        selected: legendNames.reduce((acc, name) => {
          acc[name] = !unselectedLegends[name];
          return acc;
        }, {} as Record<string, boolean>),
      },
      tooltip: {
        trigger: 'axis' as const,
        axisPointer: {
          type: 'line' as const,
          lineStyle: { color: '#ddd', type: 'dashed' as const },
        },
        formatter: axisTooltipFormatter,
      },
      xAxis: {
        type: 'category' as const,
        data: years,
        boundaryGap: true,
        axisLine: { lineStyle: { color: '#e0e0e0' } },
        axisTick: { show: false, alignWithLabel: true },
        axisLabel: { fontSize: 11, color: '#999', interval: 0 },
      },
      yAxis: {
        type: 'value' as const,
        min: 0,
        name: yAxisName,
        nameTextStyle: {
          fontSize: 10,
          color: '#bbb',
          align: 'right',
          padding: [0, -80, 0, 0],
        },
        axisLabel: {
          fontSize: 11,
          color: '#bbb',
          formatter: (v: number) =>
            v >= 1000 ? `${(v / 1000).toFixed(0)}k` : `${v}`,
        },
        splitLine: { lineStyle: { color: '#f0f0f0', type: 'dashed' as const } },
      },
      series: [
        actualBarSeries,
        ...measureStackSeries,
        targetEmissionLineSeries,
        estimatedLineFromZero,
      ],
    };
  }, [chartData, years, scopeType, yAxisName, unselectedLegends]);

  const lastYearRef = useRef<number | null>(null);

  const onEvents = {
    click: (params: { name?: string | number; dataIndex?: number }) => {
      // params.name 是 category 轴的标签值（即实际年份字符串/数字）
      const raw = params?.name;
      const y = typeof raw === 'number' ? raw : Number(raw);
      if (Number.isNaN(y)) return;
      setPanelExpanded(true);
      if (y === lastYearRef.current) return;
      lastYearRef.current = y;
      onYearClick(y);
    },
    // 监听图例点击事件，记录未选中的图例项
    legendselectchanged: (params: {
      name: string;
      selected: Record<string, boolean>;
    }) => {
      const nextUnselected: Record<string, boolean> = {};
      Object.entries(params.selected || {}).forEach(([name, isSelected]) => {
        if (!isSelected) {
          nextUnselected[name] = true;
        }
      });
      setUnselectedLegends(nextUnselected);
    },
  };

  const toggleCheck = (measureId: number) => {
    setChecked(prev => {
      const next = { ...prev, [measureId]: !prev[measureId] };
      const checkedIds = panelIds.filter(id => next[id] !== false);
      onMeasureFilterChange?.(checkedIds, panelIds);
      return next;
    });
  };

  const checkedTotal = panelData.reduce((sum, m) => {
    const id = m.measureId;
    if (id == null || !checked[id]) return sum;
    if (scopeType === 3) {
      return sum + Number(m.reductionIntensity ?? 0);
    }
    return sum + Number(m.annualReduction ?? 0);
  }, 0);

  const unitLabel = scopeType === 3 ? '吨/万件' : '吨';

  const panelContent = (
    <div
      style={{
        border: '1px solid #e8e8e8',
        borderRadius: 8,
        background: '#fff',
        display: 'flex',
        flexDirection: 'column',
        height: '100%',
        overflow: 'hidden',
      }}
    >
      <div
        style={{
          padding: '12px 14px 10px',
          borderBottom: '1px solid #f0f0f0',
          fontWeight: 600,
          fontSize: 13,
          color: '#333',
          flexShrink: 0,
        }}
      >
        {panelYear != null ? `${panelYear}年 · 减排措施` : '减排措施明细'}
      </div>

      <div style={{ flex: 1, overflowY: 'auto', padding: '4px 0' }}>
        {(() => {
          if (panelYear == null) {
            return (
              <div
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  height: '100%',
                  padding: '20px 16px',
                  textAlign: 'center',
                  color: '#aaa',
                  fontSize: 12,
                  lineHeight: 1.6,
                }}
              >
                点击图表上的年份
                <br />
                可查看当年各措施明细
              </div>
            );
          }
          if (panelData.length === 0) {
            return (
              <div
                style={{
                  fontSize: 12,
                  color: '#bbb',
                  textAlign: 'center',
                  padding: '16px 0',
                }}
              >
                该年份暂无减排措施
              </div>
            );
          }
          return panelData.map(m => {
            const id = m.measureId ?? 0;
            const mainVal =
              scopeType === 3 ? m.reductionIntensity : m.annualReduction;
            return (
              <div
                key={`${id}-${m.measureName}`}
                style={{
                  display: 'flex',
                  alignItems: 'flex-start',
                  gap: 8,
                  padding: '8px 14px',
                  borderBottom: '1px solid #f5f5f5',
                }}
              >
                <input
                  type='checkbox'
                  checked={!!checked[id]}
                  onChange={() => toggleCheck(id)}
                  style={{
                    marginTop: 2,
                    accentColor: '#ff5500',
                    cursor: 'pointer',
                    flexShrink: 0,
                  }}
                />
                <div>
                  <div
                    style={{
                      fontSize: 12,
                      color: '#333',
                      fontWeight: 500,
                      lineHeight: 1.4,
                    }}
                  >
                    {m.measureName}
                  </div>
                  <div style={{ fontSize: 12, color: '#999', marginTop: 1 }}>
                    {mainVal != null
                      ? `${Number(mainVal).toLocaleString(undefined, {
                          maximumFractionDigits: 4,
                        })} ${unitLabel}`
                      : '—'}
                  </div>
                </div>
              </div>
            );
          });
        })()}
      </div>

      <div
        style={{
          padding: '10px 14px',
          borderTop: '1px solid #f0f0f0',
          display: 'flex',
          justifyContent: 'space-between',
          fontSize: 13,
          flexShrink: 0,
        }}
      >
        <span style={{ color: '#666' }}>勾选合计</span>
        <span style={{ fontWeight: 600, color: '#ff5500' }}>
          {panelYear != null && panelData.length
            ? `${Number(checkedTotal).toLocaleString(undefined, {
                maximumFractionDigits: 4,
              })} ${unitLabel}`
            : '—'}
        </span>
      </div>
    </div>
  );

  return (
    <>
      <div
        style={{
          display: 'flex',
          alignItems: 'stretch',
          width: '100%',
          height,
        }}
      >
        <div style={{ flex: 1, minWidth: 0, height: '100%' }}>
          <ReactECharts
            option={buildOption()}
            notMerge
            lazyUpdate
            style={{ height: '100%', width: '100%' }}
            opts={{ renderer: 'canvas' }}
            onEvents={onEvents}
          />
        </div>

        <CustResizable
          defaultCollapsed
          expanded={panelExpanded}
          onExpandedChange={setPanelExpanded}
          handlePosition='left'
          defaultPropsWidth={300}
          style={{
            flexShrink: 0,
            height: '100%',
            overflow: 'hidden',
          }}
          // eslint-disable-next-line react/no-unstable-nested-components
          childRender={() => panelContent}
        />
      </div>
      <div style={{ fontSize: 11, color: '#bbb', marginTop: 8 }}>
        点击曲线或柱子上的点，可展示右侧明细；勾选可筛选图表展示的措施
      </div>
    </>
  );
};

export default MeasuresCombinationChart;
