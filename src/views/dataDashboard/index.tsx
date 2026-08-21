/**
 * @description 数据看板（新版）
 */
import { ArrowDownOutlined, ArrowUpOutlined } from '@ant-design/icons';
import { Checkbox, Col, Radio, Row, Select, TreeSelect } from 'antd';
import EChartsReact from 'echarts-for-react';
import { FC, useEffect, useMemo, useState } from 'react';

import { ModifyNote } from '@/components/ModifyNote';
import { useOrgTreeData } from '@/hooks/useOrgTreeData';
import { getYear } from '@/utils';
import { useComputationEnum } from '@/views/eca/hooks/useComputationEnum';

import ChartCard from './components/ChartCard';
import {
  BASELINE_COLOR,
  H_BAR_GRID,
  SCOPE_COLORS,
  TREND_ANALYSIS_COLORS,
  TREND_GRID,
  Y_AXIS_SPLIT_LINE,
} from './constant';
import styles from './index.module.less';
import {
  getCarbonStrength,
  getCarbonSummary,
  getCategoryRatio,
  getIndicatorList,
  getOrgEmissionCategory,
  getOrgTop5EmissionType,
  getTop5EmissionType,
  getTrendAnalysisDashboard,
} from './service';
import {
  EmissionOverviewData,
  IndicatorItem,
  OrgTop5Data,
  ScopeDistItem,
  StackData,
  Top5Item,
  TrendAnalysisData,
} from './type';

const yearOptions = getYear().map(y => ({ label: `${y}年`, value: y }));

const xAxisBaseStyle = {
  axisLine: { show: false },
  axisTick: { show: false },
  axisLabel: { color: '#999999' },
};

/** 饼图在 option 中的 legend（右侧纵向，项多时滚动；颜色与扇区由 data.itemStyle 一致） */
const pieChartLegendOption = {
  type: 'scroll',
  orient: 'vertical',
  right: 8,
  top: 'center',
  icon: 'roundRect',
};

const pieChartLayout = {
  radius: ['42%', '56%'],
  center: ['40%', '50%'],
};

/** 趋势图柱顶数值格式 */
const formatTrendBarLabel = (v: unknown) => {
  if (v === undefined || v === null || v === '') return '';
  const n = Number(v);
  if (!Number.isNaN(n) && n === 0) return '';
  return String(v);
};

const parseOrgEmissionNumeric = (v: unknown): number | undefined => {
  if (v === undefined || v === null || v === '') return undefined;
  if (typeof v === 'number') return Number.isNaN(v) ? undefined : v;
  const n = Number(String(v).replace(/,/g, ''));
  return Number.isNaN(n) ? undefined : n;
};

/** 将接口占比转为展示用字符串（支持 "98.94%" 或数字 98.94） */
const formatOrgEmissionRatioStr = (ratio: unknown): string => {
  if (ratio === undefined || ratio === null || ratio === '') return '';
  if (typeof ratio === 'string') {
    const t = ratio.trim();
    if (!t) return '';
    if (/%/.test(t)) return t;
    return `${t}%`;
  }
  if (typeof ratio === 'number' && !Number.isNaN(ratio)) {
    return `${ratio}%`;
  }
  return '';
};

type OrgEmissionBarDatum = {
  value: number;
  rawValue?: number | string;
  ratio?: number | string;
};

const formatOrgEmissionBarLabel = (params: {
  value?: number | string;
  data?: number | OrgEmissionBarDatum;
}) => {
  const raw = params.data;

  if (raw != null && typeof raw === 'object' && 'value' in raw) {
    const datum = raw as OrgEmissionBarDatum;
    const valStr = formatTrendBarLabel(datum.rawValue ?? datum.value);
    const ratioStr = formatOrgEmissionRatioStr(datum.ratio);
    if (!valStr && !ratioStr) return '';
    if (!valStr) return ratioStr;
    if (!ratioStr) return valStr;
    return `${ratioStr}\n${valStr}`;
  }

  const valStr = formatTrendBarLabel(params.value);
  return valStr;
};

const formatTooltipValue = (value: unknown) => {
  if (value === undefined || value === null || value === '') return '-';
  return String(value);
};

const formatRatioValueTooltip = (params: {
  marker?: string;
  name?: string;
  value?: number | string;
  percent?: number;
  data?: { ratio?: number | string };
}) => {
  const ratioStr =
    formatOrgEmissionRatioStr(params.data?.ratio) ||
    formatOrgEmissionRatioStr(params.percent);
  return `${params.marker || ''}${params.name || '-'}<br/>${formatTooltipValue(
    params.value,
  )}${ratioStr ? `（${ratioStr}）` : ''}`;
};

const formatOrgEmissionTooltip = (
  params: Array<{
    marker?: string;
    seriesName?: string;
    name?: string;
    value?: number | string;
    data?: OrgEmissionBarDatum;
  }>,
) => {
  if (!params.length) return '';
  const lines = params.map(item => {
    const valueStr = formatTooltipValue(
      item.data?.rawValue ?? item.data?.value ?? item.value,
    );
    const ratioStr = formatOrgEmissionRatioStr(item.data?.ratio);
    return `${item.marker || ''}${item.seriesName || '-'}：${valueStr}${
      ratioStr ? `（${ratioStr}）` : ''
    }`;
  });
  return [params[0]?.name || '', ...lines].join('<br/>');
};

/** 趋势图柱状 series：分组柱状图（左 Y 轴） */
/** 将接口 ratio 字段统一转为带 % 的展示字符串，空值返回 '' */
const formatTrendBarRatio = (ratio: number | string | undefined): string => {
  if (ratio === undefined || ratio === null || ratio === '') return '';
  if (typeof ratio === 'string') {
    const t = ratio.trim();
    return t.endsWith('%') ? t : `${t}%`;
  }
  const n = Number(ratio);
  return Number.isNaN(n) ? '' : `${n}%`;
};

const buildTrendBarSeries = (
  trendData: TrendAnalysisData,
  trendColors: string[],
) => {
  const { stackData = [] } = trendData || {};
  const allTypeNames = Array.from(
    new Set(stackData.flatMap(d => d.values.map(v => v.name)).filter(Boolean)),
  );

  return allTypeNames.map((name, idx) => ({
    name,
    type: 'bar',
    yAxisIndex: 0,
    color: trendColors[idx % trendColors.length],
    barMaxWidth: 18,
    barGap: '150%',
    barCategoryGap: '40%',
    data: stackData.map(d => {
      const found = d.values.find(v => v.name === name);
      return { value: found?.value ?? 0, ratio: found?.ratio };
    }),
    label: {
      show: true,
      position: 'top',
      distance: 8,
      fontSize: 9,
      color: '#333333',
      formatter: (params: {
        value?: number | string;
        data?: { ratio?: number | string };
      }) => {
        const valStr = formatTrendBarLabel(params.value);
        const ratioStr = formatTrendBarRatio(params.data?.ratio);
        if (!valStr && !ratioStr) return '';
        if (ratioStr && valStr) return `${ratioStr}\n${valStr}`;
        return valStr || ratioStr;
      },
    },
  }));
};

/** 趋势图基准年同比折线 series */
const buildTrendBaselineSeries = (trendData: TrendAnalysisData) => {
  const { baseline = [], stackData = [] } = trendData || {};
  return [
    {
      name: '同比',
      type: 'line',
      color: BASELINE_COLOR,
      lineStyle: { type: 'dashed' as const, width: 2 },
      symbolSize: 6,
      data: baseline.map(d => d.value),
      label: {
        show: true,
        position: 'top' as const,
        distance: 10,
        color: BASELINE_COLOR,
        fontSize: 11,
        formatter: (params: {
          value?: number | string;
          dataIndex?: number;
        }) => {
          const v = params.value;
          if (v === '' || v === undefined || v === null) return '';
          const pctStr = formatOrgEmissionRatioStr(v);
          const idx = params.dataIndex ?? -1;
          const total = idx >= 0 ? stackData[idx]?.total : undefined;
          const totalStr = formatTrendBarLabel(total);
          return totalStr ? `${totalStr}\n${pctStr}` : pctStr;
        },
      },
    },
  ];
};

/** 生成各组织分组柱 series（同类目下多系列并排） */
const buildOrgEmissionSeries = (data: StackData[], scopeColors: string[]) => {
  const allTypeNames = Array.from(
    new Set(data.flatMap(d => d.values.map(v => v.name)).filter(Boolean)),
  );
  return allTypeNames.map((name, idx) => ({
    name,
    type: 'bar',
    color: scopeColors[idx % scopeColors.length],
    barMaxWidth: 18,
    /** 仅首组 bar 生效：类目间距、同组柱间距 */
    ...(idx === 0
      ? { barGap: '28%', barCategoryGap: '48%' }
      : { barGap: '150%', barCategoryGap: '40%' }),
    data: data.map(d => {
      const found = d.values.find(v => v.name === name);
      const num = parseOrgEmissionNumeric(found?.value) ?? 0;
      return {
        value: num,
        rawValue: found?.value ?? num,
        ratio: found?.ratio,
      } satisfies OrgEmissionBarDatum;
    }),
    label: {
      show: true,
      position: 'top',
      distance: 8,
      fontSize: 9,
      color: '#333333',
      formatter: formatOrgEmissionBarLabel,
    },
  }));
};

const baseYearOptions = getYear().map(y => ({ label: `${y}年`, value: y }));

const trendTimeRangeOptions = [
  { label: '近3年', value: '3' },
  { label: '近5年', value: '5' },
  { label: '近10年', value: '10' },
];

type TrendType = 'total' | 'intensity';

/** 概览卡片：半圆仪表 + 数据 */
const OverviewCard: FC<{
  data: EmissionOverviewData | undefined;
  title: string;
  /** 仪表盘进度、同比箭头与数值的统一强调色（每张卡片可不同） */
  accentColor: string;
  extra?: React.ReactNode;
  /** 卡片标题旁单位；不传则不展示 */
  unit?: string;
  currentYearLabel?: string;
  baseYear?: number;
  onBaseYearChange?: (year: number) => void;
}> = ({
  data,
  title,
  accentColor,
  extra,
  unit,
  currentYearLabel = '年度排放量',
  baseYear,
  onBaseYearChange,
}) => {
  const compareNum = parseFloat(data?.compareValue ?? '0') || 0;
  const yoyStr = data?.yoy ?? '';
  const hasYoy = yoyStr !== '';
  const yoyIsDown = yoyStr.startsWith('-');

  return (
    <ChartCard title={title} unit={unit} extra={extra}>
      <div className={styles.overviewContainer}>
        <EChartsReact
          className={styles.overviewChart}
          style={{ width: 148, height: 148 }}
          option={{
            series: [
              {
                type: 'gauge',
                startAngle: 210,
                endAngle: -30,
                min: 0,
                max: 100,
                radius: '90%',
                pointer: { show: false },
                progress: {
                  show: true,
                  width: 10,
                  itemStyle: { color: accentColor },
                },
                axisLine: {
                  lineStyle: { width: 10, color: [[1, '#B9B9B9']] },
                },
                axisTick: { show: false },
                splitLine: { show: false },
                axisLabel: { show: false },
                detail: {
                  valueAnimation: true,
                  formatter: () =>
                    formatOrgEmissionRatioStr(data?.compareValue),
                  fontSize: 18,
                  fontWeight: 800,
                  color: accentColor,
                  offsetCenter: [0, 0],
                },
                title: {
                  show: true,
                  offsetCenter: [0, '50%'],
                  fontSize: 12,
                  color: 'rgba(4,37,43,0.45)',
                },
                data: [
                  {
                    value: Math.abs(compareNum),
                    name: '对比基准年',
                  },
                ],
              },
            ],
          }}
        />
        <div className={styles.overviewDivider} />
        <div className={styles.overviewData}>
          <div className={styles.overviewItem}>
            <div className={styles.overviewLabel}>{currentYearLabel}</div>
            <div className={styles.overviewValue}>
              {data?.currentYear || '-'}
            </div>
            {hasYoy && (
              <div
                className={styles.overviewYoy}
                style={{ color: accentColor }}
              >
                {yoyIsDown ? (
                  <ArrowDownOutlined className={styles.yoyIcon} />
                ) : (
                  <ArrowUpOutlined className={styles.yoyIcon} />
                )}
                <span>
                  {yoyIsDown ? '同比下降' : '同比上升'}{' '}
                  {yoyStr.replace(/^[+-]/, '')}
                </span>
              </div>
            )}
          </div>
          <div className={styles.overviewItem}>
            <div className={styles.overviewLabel}>
              基准年
              <Select
                value={baseYear}
                options={baseYearOptions}
                onChange={onBaseYearChange}
                variant='borderless'
                size='small'
                style={{ marginLeft: 2 }}
              />
            </div>
            <div className={styles.overviewValue}>{data?.baseYear || '-'}</div>
          </div>
        </div>
      </div>
    </ChartCard>
  );
};

const DataDashboard: FC = () => {
  const [year, setYear] = useState(yearOptions[0]?.value ?? '');
  const [orgTreeData] = useOrgTreeData({ filterVirtualOrg: true });
  const [orgCodes, setOrgCodes] = useState<string[]>([]);
  const standardList = useComputationEnum({ enumType: 'standardType' });
  const [standardId, setStandardId] = useState<string | number | undefined>(
    undefined,
  );

  const scopeColors = useMemo(
    () => (standardId === 2 ? SCOPE_COLORS : TREND_ANALYSIS_COLORS),
    [standardId],
  );

  const [indicatorList, setIndicatorList] = useState<IndicatorItem[]>([]);
  const [indicator, setIndicator] = useState<number | undefined>(undefined);

  const [baseYear, setBaseYear] = useState<number>(2024);

  const [emissionOverview, setEmissionOverview] = useState<
    EmissionOverviewData | undefined
  >(undefined);
  const [intensityOverview, setIntensityOverview] = useState<
    EmissionOverviewData | undefined
  >(undefined);

  const [trendIndicator, setTrendIndicator] = useState<number | undefined>(
    undefined,
  );
  const [trendTimeRange, setTrendTimeRange] = useState('5');
  const [trendType, setTrendType] = useState<TrendType>('total');

  const [trendData, setTrendData] = useState<TrendAnalysisData | undefined>(
    undefined,
  );
  const [scopeData, setScopeData] = useState<ScopeDistItem[]>([]);
  const [top5Data, setTop5Data] = useState<Top5Item[]>([]);
  const [orgTop5Data, setOrgTop5Data] = useState<OrgTop5Data[]>([]);
  const [orgEmissionData, setOrgEmissionData] = useState<StackData[]>([]);
  const [orgTop5SelectedCodes, setOrgTop5SelectedCodes] = useState<string[]>(
    [],
  );
  const [orgEmissionSelectedCodes, setOrgEmissionSelectedCodes] = useState<
    string[]
  >([]);

  const flatOrgOptions = useMemo(() => {
    const flatten = (
      nodes: typeof orgTreeData,
    ): { label: string; value: string }[] =>
      nodes.flatMap(n => [
        { label: n.name, value: n.code },
        ...flatten(n.children || []),
      ]);
    return flatten(orgTreeData);
  }, [orgTreeData]);

  const scope3CategoryChart = useMemo(() => {
    const values = top5Data.map(d => Number(d.value) || 0);
    const sum = values.reduce((a, b) => a + b, 0);
    return {
      categories: top5Data.map(d => d.name || '-'),
      values,
      ratios: sum ? values.map(v => (v / sum) * 100) : values.map(() => 0),
    };
  }, [top5Data]);

  // orgTreeData 加载后默认选中第一个组织及其所有子组织
  useEffect(() => {
    if (orgTreeData.length > 0 && orgCodes.length === 0) {
      const collectCodes = (nodes: typeof orgTreeData): string[] =>
        nodes.flatMap(n => [
          n.value as string,
          ...collectCodes(n.children || []),
        ]);
      setOrgCodes(collectCodes([orgTreeData[0]]));
    }
  }, [orgTreeData]);

  // 只选了印尼工厂（code="21"）时，基准年默认值改为 2025，否则为 2024
  useEffect(() => {
    const defaultBaseYear =
      orgCodes.length === 1 && orgCodes[0] === '21' ? 2025 : 2024;
    setBaseYear(defaultBaseYear);
  }, [orgCodes]);

  // flatOrgOptions 加载后默认全选
  useEffect(() => {
    if (flatOrgOptions.length > 0) {
      const allCodes = flatOrgOptions.map(o => o.value);
      setOrgTop5SelectedCodes(allCodes);
      setOrgEmissionSelectedCodes(allCodes);
    }
  }, [flatOrgOptions]);

  // standardList 加载后默认选中第一项
  useEffect(() => {
    if (standardList.length > 0 && standardId === undefined) {
      setStandardId(standardList[0].value);
    }
  }, [standardList]);

  // year 变化时更新指标列表
  useEffect(() => {
    getIndicatorList({ year }).then(({ data }) => {
      const list = data.data || [];
      setIndicatorList(list);
      const defaultId = list.length > 0 ? list[0].id : undefined;
      setIndicator(defaultId);
      setTrendIndicator(defaultId);
    });
  }, [year]);

  // 排放量概览：year/orgCodes/standardId/emissionBaseYear 变化时刷新
  useEffect(() => {
    if (!standardId) return;
    getCarbonSummary({
      year: Number(year),
      orgCodeList: orgCodes,
      standardType: standardId,
      baseYear: Number(baseYear),
    }).then(({ data }) => {
      const raw = data.data;
      if (raw) {
        setEmissionOverview({
          currentYear: raw.currentYear,
          baseYear: raw.baseYear,
          compareValue: raw.compareValue,
          yoy: raw.yoy ?? '',
          baseYearLabel: '',
        });
      } else {
        setEmissionOverview(undefined);
      }
    });
  }, [year, orgCodes, standardId, baseYear]);

  // 排放强度概览：indicator 或 baseYear 变化时刷新
  useEffect(() => {
    if (!standardId || !indicator) return;
    const operIndexName =
      indicatorList.find(i => i.id === indicator)?.indexName ?? '';
    getCarbonStrength({
      year: Number(year),
      orgCodeList: orgCodes,
      standardType: standardId,
      baseYear: Number(baseYear),
      operIndexName,
      valueType: 2,
    }).then(({ data }) => {
      const raw = data.data;
      if (raw) {
        setIntensityOverview({
          currentYear: raw.currentYear,
          baseYear: raw.baseYear,
          compareValue: raw.compareValue,
          yoy: raw.yoy ?? '',
          baseYearLabel: '',
        });
      } else {
        setIntensityOverview(undefined);
      }
    });
  }, [year, orgCodes, standardId, indicator, baseYear, indicatorList]);

  // 趋势分析：trendTimeRange / trendType / trendIndicator 变化时刷新
  useEffect(() => {
    if (!standardId) return;
    const operIndexName =
      indicatorList.find(i => i.id === trendIndicator)?.indexName ?? '';
    getTrendAnalysisDashboard({
      baseYear,
      year: Number(year),
      orgCodeList: orgCodes,
      standardType: standardId,
      recentYears: Number(trendTimeRange),
      valueType: trendType === 'intensity' ? 2 : 1,
      operIndexName,
    }).then(({ data }) => {
      const list = data.data || [];
      setTrendData({
        stackData: list.map(d => ({
          name: d.year,
          total: d.total,
          values: d.items.map(item => ({ ...item, value: item.value ?? 0 })),
        })),
        baseline: list.map(d => ({
          name: d.year,
          value: d.totalChangePercent,
        })),
      });
    });
  }, [
    year,
    orgCodes,
    standardId,
    trendTimeRange,
    trendType,
    trendIndicator,
    indicatorList,
    baseYear,
  ]);

  // TOP5、范围分布、预测、各组织排放、品类占比
  useEffect(() => {
    if (!standardId) return;
    getTop5EmissionType({
      year: Number(year),
      orgCodeList: orgCodes,
      standardType: standardId,
    }).then(({ data }) => setTop5Data(data.data || []));
    getCategoryRatio({
      year: Number(year),
      orgCodeList: orgCodes,
      standardType: standardId,
    }).then(({ data }) => setScopeData(data.data?.items || []));
  }, [year, orgCodes, standardId]);

  // 各组织 TOP5：orgTop5SelectedCodes 变化时独立刷新
  useEffect(() => {
    if (!standardId) return;
    getOrgTop5EmissionType({
      year: Number(year),
      orgCodeList: orgTop5SelectedCodes,
      standardType: standardId,
    }).then(({ data }) => setOrgTop5Data(data.data || []));
  }, [year, orgTop5SelectedCodes, standardId]);

  // 各组织排放情况：orgEmissionSelectedCodes 变化时独立刷新
  useEffect(() => {
    if (!standardId) return;
    getOrgEmissionCategory({
      year: Number(year),
      orgCodeList: orgEmissionSelectedCodes,
      standardType: standardId,
    }).then(({ data }) => {
      const list = data.data || [];
      setOrgEmissionData(
        list.map(d => ({
          name: d.orgName,
          total: Number(d.total),
          values: d.items,
        })),
      );
    });
  }, [year, orgEmissionSelectedCodes, standardId]);

  const trendLegendNames = Array.from(
    new Set(
      (trendData?.stackData ?? [])
        .flatMap(d => d.values.map(v => v.name))
        .filter(Boolean),
    ),
  );

  return (
    <div className={styles.dashboard}>
      {/* ===== 标题栏 ===== */}
      <div className={styles.titleBar}>
        <span className={styles.titleText}>数据看板</span>
        <ModifyNote content='数据看板去掉这些图表：预测与目标分析、按照品类查看排放占比、按照供应商查看特定产品的碳排放量和占比、下游运输方式重量及碳排量占比统计' />
      </div>

      {/* ===== 筛选栏 ===== */}
      <div className={styles.filterBar}>
        <div className={styles.filterLeft}>
          <TreeSelect
            treeData={orgTreeData}
            treeCheckable
            showCheckedStrategy={TreeSelect.SHOW_ALL}
            className={styles.orgSelect}
            placeholder='核算组织'
            value={orgCodes}
            onChange={setOrgCodes}
            allowClear
            maxTagCount='responsive'
            treeNodeFilterProp='label'
            treeDefaultExpandAll
          />
        </div>
        <div className={styles.filterRight}>
          <Select
            value={year}
            options={yearOptions}
            onChange={setYear}
            allowClear={false}
            showSearch
            style={{ width: 120 }}
          />
          <Select
            value={standardId}
            options={standardList}
            onChange={setStandardId}
            placeholder='选择标准'
            style={{ width: 200 }}
          />
        </div>
      </div>

      {/* ===== Content ===== */}
      <div className={styles.content}>
        {/* Row 1：年度碳排放量概览 + 年度碳排放强度概览 */}
        <div className={styles.section}>
          <Row gutter={16}>
            {/* 0-年度碳排放量概览 */}
            <Col span={12}>
              <OverviewCard
                data={emissionOverview}
                title='年度碳排放量概览'
                accentColor='#FF4D00'
                unit='tCO₂e'
                baseYear={baseYear}
                onBaseYearChange={setBaseYear}
              />
            </Col>
            {/* 1-年度碳排放强度概览 */}
            <Col span={12}>
              <OverviewCard
                data={intensityOverview}
                title='年度碳排放强度概览'
                accentColor='#5f7839'
                unit='kgCO2e'
                currentYearLabel='年度排放强度'
                baseYear={baseYear}
                onBaseYearChange={setBaseYear}
                extra={
                  <Select
                    value={indicator}
                    options={indicatorList.map(i => ({
                      value: i.id,
                      label: `${i.indexName || ''}(${i.unitDesc || ''})`,
                    }))}
                    onChange={setIndicator}
                    style={{ maxWidth: 260 }}
                    placeholder='选择指标'
                  />
                }
              />
            </Col>
          </Row>
        </div>

        {/* Row 2：趋势分析 */}
        <div className={styles.section}>
          {/* 1-趋势分析（柱状图） */}
          <ChartCard
            title='趋势分析'
            extra={
              <div className={styles.trendExtra}>
                <Select
                  value={trendTimeRange}
                  options={trendTimeRangeOptions}
                  onChange={setTrendTimeRange}
                  style={{ width: 112 }}
                />
                <Select
                  value={trendIndicator}
                  options={indicatorList.map(i => ({
                    value: i.id,
                    label: `${i.indexName || ''}(${i.unitDesc || ''})`,
                  }))}
                  onChange={setTrendIndicator}
                  style={{ maxWidth: 260 }}
                  placeholder='选择指标'
                />
                <Radio.Group
                  value={trendType}
                  onChange={e => setTrendType(e.target.value)}
                >
                  <Radio.Button value='total'>总排放量</Radio.Button>
                  <Radio.Button value='intensity'>排放强度</Radio.Button>
                </Radio.Group>
              </div>
            }
          >
            <EChartsReact
              className={styles.trendChart}
              notMerge
              option={{
                legend: {
                  data: [...trendLegendNames],
                  selectedMode: true,
                  top: 0,
                },
                tooltip: { trigger: 'axis' },
                grid: TREND_GRID,
                xAxis: {
                  type: 'category',
                  data: (trendData?.stackData ?? []).map(d => d.name),
                  ...xAxisBaseStyle,
                },
                yAxis: {
                  type: 'value',
                  splitLine: Y_AXIS_SPLIT_LINE,
                  axisLabel: { color: '#999999' },
                },
                series: trendData
                  ? buildTrendBarSeries(trendData, scopeColors)
                  : [],
              }}
            />
          </ChartCard>
          {/* 2-排放量同比变化趋势（折线图） */}
          <ChartCard title='排放量同比变化趋势'>
            <EChartsReact
              className={styles.trendChart}
              notMerge
              option={{
                legend: {
                  data: ['同比'],
                  top: 0,
                },
                tooltip: {
                  trigger: 'axis',
                  formatter: (
                    params: Array<{ name?: string; value?: number | string }>,
                  ) => {
                    const p = params[0];
                    if (!p) return '';
                    const v = p.value;
                    const valStr =
                      v === '' || v === undefined || v === null
                        ? '-'
                        : formatOrgEmissionRatioStr(v);
                    return `${p.name}<br/>同比：${valStr}`;
                  },
                },
                grid: TREND_GRID,
                xAxis: {
                  type: 'category',
                  data: (trendData?.stackData ?? []).map(d => d.name),
                  ...xAxisBaseStyle,
                },
                yAxis: {
                  type: 'value',
                  splitLine: Y_AXIS_SPLIT_LINE,
                  axisLabel: {
                    color: '#999999',
                    formatter: (v: number) => `${v}%`,
                  },
                },
                series: trendData ? buildTrendBaselineSeries(trendData) : [],
              }}
            />
          </ChartCard>
        </div>

        {/* Row 3：排放量范围类别分布 + TOP5 排放类型 */}
        <div className={styles.section}>
          <Row gutter={16}>
            {/* 3-排放量范围类别分布 */}
            <Col span={24}>
              <ChartCard title='排放量范围类别分布' unit='tCO₂e'>
                <div className={styles.scopeContainer}>
                  <EChartsReact
                    className={styles.scopePieChart}
                    option={{
                      tooltip: {
                        trigger: 'item',
                        formatter: formatRatioValueTooltip,
                      },
                      legend: pieChartLegendOption,
                      series: [
                        {
                          type: 'pie',
                          ...pieChartLayout,
                          label: {
                            formatter: (p: {
                              value?: number | string;
                              percent?: number;
                              data?: { ratio?: number | string };
                            }) => {
                              const ratioStr =
                                formatOrgEmissionRatioStr(p.data?.ratio) ||
                                formatOrgEmissionRatioStr(p.percent);
                              const valStr =
                                formatTrendBarLabel(p.value) ||
                                String(p.value ?? '');
                              return ratioStr
                                ? `${ratioStr}\n${valStr}`
                                : valStr;
                            },
                            fontSize: 11,
                            color: '#666',
                          },
                          data: scopeData.map((item, idx) => ({
                            name: item.name,
                            value: item.value,
                            ratio: item.ratio,
                            itemStyle: {
                              color: scopeColors[idx % scopeColors.length],
                            },
                          })),
                        },
                      ],
                    }}
                  />
                </div>
              </ChartCard>
            </Col>
          </Row>
        </div>

        {/* Row 4：范围三各类别碳排放 */}
        <div className={styles.section}>
          <EChartsReact
            className={styles.top5Chart}
            option={{
              title: {
                text: '范围三各类别碳排放',
                left: 'center',
                top: 0,
                textStyle: {
                  color: '#04252b',
                  fontSize: 14,
                },
              },
              legend: {
                data: ['碳排放量(tCO₂e)', '碳排放占比(%)'],
                top: 8,
                right: 8,
              },
              tooltip: {
                trigger: 'axis',
                axisPointer: { type: 'shadow' },
              },
              grid: { ...TREND_GRID },
              xAxis: {
                type: 'category',
                data: scope3CategoryChart.categories,
                axisLabel: {
                  color: '#999999',
                  fontSize: 11,
                  interval: 0,
                  rotate: 32,
                },
                axisLine: { show: false },
                axisTick: { show: false },
              },
              yAxis: [
                {
                  type: 'value',
                  nameTextStyle: { color: '#999999', fontSize: 11 },
                  splitLine: Y_AXIS_SPLIT_LINE,
                  axisLabel: { color: '#999999' },
                },
                {
                  type: 'value',
                  position: 'right',
                  nameTextStyle: { color: '#999999', fontSize: 11 },
                  splitLine: { show: false },
                  axisLabel: {
                    color: '#999999',
                    formatter: (v: number) => `${v}%`,
                  },
                },
              ],
              series: [
                {
                  name: '碳排放量(tCO₂e)',
                  type: 'bar',
                  yAxisIndex: 0,
                  color: '#3b86d0',
                  barMaxWidth: 28,
                  data: scope3CategoryChart.values,
                  label: {
                    show: true,
                    position: 'top',
                    distance: 24,
                    fontSize: 10,
                    color: '#333333',
                    formatter: (params: { value?: number | string }) =>
                      formatTrendBarLabel(params.value),
                  },
                },
                {
                  name: '碳排放占比(%)',
                  type: 'line',
                  yAxisIndex: 1,
                  color: '#efa871',
                  symbolSize: 7,
                  data: scope3CategoryChart.ratios,
                  label: {
                    show: true,
                    position: 'top',
                    distance: 12,
                    fontSize: 10,
                    color: '#efa871',
                    formatter: ({ value }: { value?: number | string }) => {
                      if (value === undefined || value === null || value === '')
                        return '';
                      const n = Number(value);
                      if (!Number.isNaN(n) && n <= 0) return '';
                      return formatOrgEmissionRatioStr(value);
                    },
                  },
                },
              ],
            }}
          />
        </div>

        {/* Row 5：各组织 TOP5 排放类型 */}
        <div className={styles.section}>
          {/* 6-各组织TOP5排放类型 */}
          <ChartCard title='各组织 TOP5 排放类型' unit='tCO₂e'>
            <div className={styles.orgTop5FilterBar}>
              <Checkbox.Group
                options={flatOrgOptions}
                value={orgTop5SelectedCodes}
                onChange={vals => setOrgTop5SelectedCodes(vals as string[])}
              />
            </div>
            <div className={styles.orgTop5Grid}>
              {orgTop5Data.map((org, orgIdx) => (
                <div key={org.orgCode} className={styles.orgTop5Item}>
                  <div className={styles.orgTop5Title}>{org.orgName}</div>
                  {org.items.length === 0 ? (
                    <div className={styles.orgTop5Chart} />
                  ) : (
                    <EChartsReact
                      className={styles.orgTop5Chart}
                      option={{
                        tooltip: {
                          trigger: 'axis',
                          axisPointer: { type: 'none' },
                        },
                        grid: H_BAR_GRID,
                        xAxis: (() => {
                          const maxVal = Math.max(
                            ...org.items.map(d => d.value),
                            0,
                          );
                          const raw = Math.ceil(maxVal / 4) || 1;
                          const magnitude = 10 ** Math.floor(Math.log10(raw));
                          const interval =
                            Math.ceil(raw / magnitude) * magnitude;
                          return {
                            type: 'value',
                            splitLine: Y_AXIS_SPLIT_LINE,
                            min: 0,
                            max: interval * 4,
                            interval,
                            ...xAxisBaseStyle,
                            axisLabel: {
                              color: '#999999',
                              fontSize: 10,
                            },
                          };
                        })(),
                        yAxis: {
                          type: 'category',
                          data: org.items.map(d => d.name),
                          inverse: true,
                          axisLine: { show: false },
                          axisTick: { show: false },
                          axisLabel: {
                            align: 'right',
                            width: 100,
                            overflow: 'truncate',
                            fontSize: 11,
                            color: '#999999',
                          },
                        },
                        series: [
                          {
                            type: 'bar',
                            color: [
                              '#FF4D00',
                              '#FF9466',
                              '#FFB899',
                              '#67B034',
                              '#F5BA1B',
                            ][orgIdx % 5],
                            barMaxWidth: 18,
                            label: {
                              show: true,
                              position: 'right',
                              fontSize: 11,
                              color: '#333',
                            },
                            data: org.items.map(d => d.value),
                          },
                        ],
                      }}
                    />
                  )}
                </div>
              ))}
            </div>
          </ChartCard>
        </div>

        {/* Row 6：各组织排放情况 */}
        <div className={styles.section}>
          {/* 7-各组织排放情况 */}
          <ChartCard title='各组织排放情况' unit='tCO₂e'>
            <div className={styles.orgTop5FilterBar}>
              <Checkbox.Group
                options={flatOrgOptions}
                value={orgEmissionSelectedCodes}
                onChange={vals => setOrgEmissionSelectedCodes(vals as string[])}
              />
            </div>
            <EChartsReact
              className={styles.orgEmissionChart}
              notMerge
              option={{
                legend: {
                  data: Array.from(
                    new Set(
                      orgEmissionData
                        .flatMap(d => d.values.map(v => v.name))
                        .filter(Boolean),
                    ),
                  ),
                  top: 0,
                },
                tooltip: {
                  trigger: 'axis',
                  formatter: formatOrgEmissionTooltip,
                },
                grid: {
                  top: 40,
                  right: 20,
                  bottom: 30,
                  left: 8,
                  containLabel: true,
                },
                xAxis: {
                  type: 'category',
                  data: orgEmissionData.map(d => d.name || ''),
                  ...xAxisBaseStyle,
                },
                yAxis: {
                  type: 'value',
                  splitLine: Y_AXIS_SPLIT_LINE,
                  splitNumber: 16,
                  axisLabel: { color: '#999999' },
                },
                series: buildOrgEmissionSeries(orgEmissionData, scopeColors),
              }}
            />
          </ChartCard>
        </div>
      </div>
    </div>
  );
};

export default DataDashboard;
