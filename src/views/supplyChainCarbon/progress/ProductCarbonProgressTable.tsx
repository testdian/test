/**
 * @description 进度追踪看板 - 产品碳进度表格
 */
import { Tag } from 'antd';
import type { ColumnsType } from 'antd/es/table';
import { useMemo } from 'react';

import { HorizontalDragTable } from '@/components/HorizontalDragTable';
import { FormLabelWithNote } from '@/components/ModifyNote';
import type { DemoData } from '@/views/supplyChainCarbon/data/demo-data';
import {
  listProductCarbonProgress,
  type CarbonTargetStatus,
  type ProductCarbonProgressRow,
} from '@/views/supplyChainCarbon/data/demo-supply-chain';
import styles from '@/views/supplyChainCarbon/styles.module.less';

const PRODUCT_CARBON_TABLE_NOTE =
  '产品碳以1—12月中月份最晚的有效产品碳足迹为最新值：目标偏差率=（最新产品碳足迹-目标产品碳足迹）÷目标产品碳足迹×100%；最新产品碳足迹不高于目标值时为已达标；减排目标完成度=（上一年度产品碳足迹-最新产品碳足迹）÷（上一年度产品碳足迹-目标产品碳足迹）×100%。';

const MONTH_LABELS = Array.from({ length: 12 }, (_, index) => `${index + 1}月`);

const PRODUCT_COLUMN_WIDTH = {
  supplierName: 160,
  productName: 160,
  prevFootprint: 300,
  reductionRatio: 120,
  targetFootprint: 280,
  monthlyActual: 280,
  latestActual: 280,
  deviationRate: 160,
  targetStatus: 120,
  reductionProgress: 190,
} as const;

const PRODUCT_TABLE_SCROLL_X =
  PRODUCT_COLUMN_WIDTH.supplierName +
  PRODUCT_COLUMN_WIDTH.productName +
  PRODUCT_COLUMN_WIDTH.prevFootprint +
  PRODUCT_COLUMN_WIDTH.reductionRatio +
  PRODUCT_COLUMN_WIDTH.targetFootprint +
  PRODUCT_COLUMN_WIDTH.monthlyActual * 12 +
  PRODUCT_COLUMN_WIDTH.latestActual +
  PRODUCT_COLUMN_WIDTH.deviationRate +
  PRODUCT_COLUMN_WIDTH.targetStatus +
  PRODUCT_COLUMN_WIDTH.reductionProgress;

function columnTitle(label: string) {
  return label;
}

function renderTargetStatus(status: CarbonTargetStatus) {
  if (status === 'achieved') return <Tag color='green'>已达标</Tag>;
  if (status === 'not_achieved') return <Tag color='red'>未达标</Tag>;
  return <Tag>暂无数据</Tag>;
}

function buildColumns(): ColumnsType<ProductCarbonProgressRow> {
  const monthlyColumns: ColumnsType<ProductCarbonProgressRow> =
    MONTH_LABELS.map((label, index) => ({
      title: columnTitle(`${label}实际产品碳足迹（tCO₂e/功能单位）`),
      dataIndex: 'monthly_actual',
      width: PRODUCT_COLUMN_WIDTH.monthlyActual,
      align: 'center',
      render: (values: number[]) => values?.[index] ?? '-',
    }));

  return [
    {
      title: '供应商名称',
      dataIndex: 'supplier_name',
      fixed: 'left',
      width: PRODUCT_COLUMN_WIDTH.supplierName,
    },
    {
      title: '产品名称',
      dataIndex: 'product_name',
      fixed: 'left',
      width: PRODUCT_COLUMN_WIDTH.productName,
      render: value => value || '-',
    },
    {
      title: columnTitle('上一年度产品碳足迹（tCO₂e/功能单位）'),
      dataIndex: 'prev_footprint',
      width: PRODUCT_COLUMN_WIDTH.prevFootprint,
      align: 'center',
      render: value => (value == null ? '-' : value),
    },
    {
      title: columnTitle('减排比例（%）'),
      dataIndex: 'reduction_ratio',
      width: PRODUCT_COLUMN_WIDTH.reductionRatio,
      align: 'center',
      render: value => (value == null ? '-' : `${value}%`),
    },
    {
      title: columnTitle('目标产品碳足迹（tCO₂e/功能单位）'),
      dataIndex: 'target_footprint',
      width: PRODUCT_COLUMN_WIDTH.targetFootprint,
      align: 'center',
      render: value => (value == null ? '-' : value),
    },
    ...monthlyColumns,
    {
      title: columnTitle('最新产品碳足迹（tCO₂e/功能单位）'),
      dataIndex: 'latest_actual',
      width: PRODUCT_COLUMN_WIDTH.latestActual,
      align: 'center',
      render: value => (value == null ? '-' : value),
    },
    {
      title: columnTitle('目标偏差率（%）'),
      dataIndex: 'deviation_rate',
      width: PRODUCT_COLUMN_WIDTH.deviationRate,
      align: 'center',
      render: value =>
        value == null ? (
          '-'
        ) : (
          <span style={{ color: value <= 0 ? '#389e0d' : '#cf1322' }}>
            {value > 0 ? '+' : ''}
            {value}%
          </span>
        ),
    },
    {
      title: '达标状态',
      dataIndex: 'target_status',
      width: PRODUCT_COLUMN_WIDTH.targetStatus,
      align: 'center',
      render: renderTargetStatus,
    },
    {
      title: columnTitle('减排目标完成度（%）'),
      dataIndex: 'reduction_progress',
      width: PRODUCT_COLUMN_WIDTH.reductionProgress,
      align: 'center',
      render: value => (value == null ? '-' : `${value}%`),
    },
  ];
}

type ProductCarbonProgressTableProps = {
  data: DemoData;
  loading?: boolean;
  supplierKeyword?: string;
  productKeyword?: string;
  targetYear?: number | 'all';
};

export function ProductCarbonProgressTable({
  data,
  loading = false,
  supplierKeyword = '',
  productKeyword = '',
  targetYear = 'all',
}: ProductCarbonProgressTableProps) {
  const rows = useMemo(
    () =>
      listProductCarbonProgress(data, {
        supplierKeyword,
        productKeyword,
        targetYear,
      }),
    [data, supplierKeyword, productKeyword, targetYear],
  );

  const columns = useMemo(() => buildColumns(), []);

  return (
    <div className={styles.productCarbonProgressBlock}>
      <div
        className={styles.productCarbonProgressTitle}
        style={{ display: 'inline-flex', alignItems: 'center' }}
      >
        <FormLabelWithNote
          label='产品碳足迹进度追踪'
          note={PRODUCT_CARBON_TABLE_NOTE}
        />
      </div>
      <HorizontalDragTable
        loading={loading}
        rowKey='id'
        size='small'
        bordered
        scrollX={PRODUCT_TABLE_SCROLL_X}
        pagination={false}
        columns={columns}
        dataSource={rows}
      />
    </div>
  );
}
