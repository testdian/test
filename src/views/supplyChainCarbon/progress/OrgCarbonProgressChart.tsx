/**
 * @description 进度追踪看板 - 组织碳分组堆叠柱状图
 */
import ReactECharts from 'echarts-for-react';
import { useMemo } from 'react';

import { FormLabelWithNote } from '@/components/ModifyNote';
import { listOrgCarbonChartData } from '@/views/supplyChainCarbon/data/demo-supply-chain';
import type { DemoData } from '@/views/supplyChainCarbon/data/demo-data';
import styles from '@/views/supplyChainCarbon/styles.module.less';

const ORG_CARBON_CHART_NOTE =
  '组织碳图表比较同期目标排放量与审核通过月份的累计实际排放量；范围一、范围二分别堆叠展示，避免用部分月份实际值直接对比全年目标。';

type OrgCarbonProgressChartProps = {
  data: DemoData;
  supplierKeyword?: string;
  targetYear?: number | 'all';
};

export function OrgCarbonProgressChart({
  data,
  supplierKeyword = '',
  targetYear = 'all',
}: OrgCarbonProgressChartProps) {
  const chartData = useMemo(
    () => listOrgCarbonChartData(data, supplierKeyword, targetYear),
    [data, supplierKeyword, targetYear],
  );

  const hasRotatedLabels = chartData.length > 4;

  const chartOption = useMemo(
    () => ({
      tooltip: {
        trigger: 'axis',
        axisPointer: { type: 'shadow' },
      },
      legend: {
        data: [
          '范围一（同期目标排放量）',
          '范围二（同期目标排放量）',
          '范围一（累计实际排放量）',
          '范围二（累计实际排放量）',
        ],
        top: 8,
        left: 'center',
        itemGap: 12,
        textStyle: { fontSize: 11 },
      },
      grid: {
        left: 16,
        right: 16,
        top: 64,
        bottom: hasRotatedLabels ? 88 : 56,
        containLabel: true,
      },
      xAxis: {
        type: 'category',
        data: chartData.map(item => item.supplier_name),
        axisLabel: {
          interval: 0,
          rotate: hasRotatedLabels ? 20 : 0,
          margin: hasRotatedLabels ? 14 : 8,
        },
      },
      yAxis: {
        type: 'value',
        name: '排放量(tCO₂e)',
        nameLocation: 'middle',
        nameRotate: 90,
        nameGap: 42,
        nameTextStyle: {
          color: 'rgba(0, 0, 0, 0.45)',
          fontSize: 12,
        },
      },
      series: [
        {
          name: '范围一（同期目标排放量）',
          type: 'bar',
          stack: 'target',
          emphasis: { focus: 'series' },
          data: chartData.map(item =>
            item.scope1_period_target > 0
              ? item.scope1_period_target
              : undefined,
          ),
          itemStyle: { color: '#5470C6' },
        },
        {
          name: '范围二（同期目标排放量）',
          type: 'bar',
          stack: 'target',
          emphasis: { focus: 'series' },
          data: chartData.map(item =>
            item.scope2_period_target > 0
              ? item.scope2_period_target
              : undefined,
          ),
          itemStyle: { color: '#91B4F5' },
        },
        {
          name: '范围一（累计实际排放量）',
          type: 'bar',
          stack: 'actual',
          emphasis: { focus: 'series' },
          data: chartData.map(item =>
            item.scope1_actual > 0 ? item.scope1_actual : undefined,
          ),
          itemStyle: { color: '#EE8A44' },
        },
        {
          name: '范围二（累计实际排放量）',
          type: 'bar',
          stack: 'actual',
          emphasis: { focus: 'series' },
          data: chartData.map(item =>
            item.scope2_actual > 0 ? item.scope2_actual : undefined,
          ),
          itemStyle: { color: '#FAC858' },
        },
      ],
    }),
    [chartData, hasRotatedLabels],
  );

  return (
    <div className={styles.orgCarbonProgressBlock}>
      <div
        className={styles.orgCarbonProgressTitle}
        style={{ display: 'inline-flex', alignItems: 'center' }}
      >
        <FormLabelWithNote
          label='供应商排放量对比'
          note={ORG_CARBON_CHART_NOTE}
        />
      </div>
      {chartData.length > 0 ? (
        <div className={styles.chartWrap}>
          <ReactECharts option={chartOption} style={{ height: '100%' }} />
        </div>
      ) : (
        <div className={styles.chartEmpty}>暂无组织碳数据</div>
      )}
    </div>
  );
}
