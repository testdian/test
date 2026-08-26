/**
 * @description 进度追踪看板 - 产品碳分组柱状图
 */
import ReactECharts from 'echarts-for-react';
import { useMemo } from 'react';

import { FormLabelWithNote } from '@/components/ModifyNote';
import type { DemoData } from '@/views/supplyChainCarbon/data/demo-data';
import { listProductCarbonProgress } from '@/views/supplyChainCarbon/data/demo-supply-chain';
import styles from '@/views/supplyChainCarbon/styles.module.less';

const PRODUCT_CARBON_CHART_NOTE =
  '产品碳表格上方增加一个图表，分组柱状图，横轴是供应商名称-产品名称，纵轴是2个，1个目标产品碳足迹、1个实际产品碳足迹；实际产品碳足迹使用1—12月中月份最晚的审核通过有效数值。';

type ProductCarbonProgressChartProps = {
  data: DemoData;
  supplierKeyword?: string;
  productKeyword?: string;
  targetYear?: number | 'all';
};

export function ProductCarbonProgressChart({
  data,
  supplierKeyword = '',
  productKeyword = '',
  targetYear = 'all',
}: ProductCarbonProgressChartProps) {
  const chartData = useMemo(() => {
    const rows = listProductCarbonProgress(data, {
      supplierKeyword,
      productKeyword,
      targetYear,
    });

    return rows.map(row => ({
      category: `${row.supplier_name}-${row.product_name || '-'}`,
      targetFootprint: row.target_footprint ?? 0,
      actualFootprint: row.latest_actual ?? 0,
    }));
  }, [data, supplierKeyword, productKeyword, targetYear]);

  const hasRotatedLabels = chartData.length > 3;

  const chartOption = useMemo(
    () => ({
      tooltip: { trigger: 'axis' },
      legend: {
        data: ['目标产品碳足迹', '实际产品碳足迹'],
        top: 8,
        right: 16,
        itemGap: 20,
      },
      grid: {
        left: 16,
        right: 16,
        top: 44,
        bottom: hasRotatedLabels ? 88 : 56,
        containLabel: true,
      },
      xAxis: {
        type: 'category',
        data: chartData.map(item => item.category),
        axisLabel: {
          interval: 0,
          rotate: hasRotatedLabels ? 20 : 0,
          margin: hasRotatedLabels ? 14 : 8,
        },
      },
      yAxis: {
        type: 'value',
        name: 'tCO₂e/功能单位',
        nameLocation: 'end',
        nameGap: 16,
        nameTextStyle: {
          color: 'rgba(0, 0, 0, 0.45)',
          fontSize: 12,
          align: 'left',
          padding: [0, 0, 4, 0],
        },
      },
      series: [
        {
          name: '目标产品碳足迹',
          type: 'bar',
          data: chartData.map(item => item.targetFootprint),
          itemStyle: { color: '#5470C6' },
        },
        {
          name: '实际产品碳足迹',
          type: 'bar',
          data: chartData.map(item => item.actualFootprint),
          itemStyle: { color: '#EE8A44' },
        },
      ],
    }),
    [chartData, hasRotatedLabels],
  );

  return (
    <div className={styles.productCarbonProgressBlock}>
      <div
        className={styles.productCarbonProgressTitle}
        style={{ display: 'inline-flex', alignItems: 'center' }}
      >
        <FormLabelWithNote
          label='供应商产品碳足迹对比'
          note={PRODUCT_CARBON_CHART_NOTE}
        />
      </div>
      {chartData.length > 0 ? (
        <div className={styles.chartWrap}>
          <ReactECharts option={chartOption} style={{ height: '100%' }} />
        </div>
      ) : (
        <div className={styles.chartEmpty}>暂无产品碳数据</div>
      )}
    </div>
  );
}
