/**
 * @description 进度追踪看板 - 组织碳范围一/范围二表格
 */
import { Tag } from 'antd';
import type { ColumnsType } from 'antd/es/table';
import { useMemo } from 'react';

import { HorizontalDragTable } from '@/components/HorizontalDragTable';
import { FormLabelWithNote } from '@/components/ModifyNote';
import {
  listOrgCarbonProgress,
  type CarbonTargetStatus,
  type OrgCarbonProgressRow,
} from '@/views/supplyChainCarbon/data/demo-supply-chain';
import type { DemoData } from '@/views/supplyChainCarbon/data/demo-data';
import styles from '@/views/supplyChainCarbon/styles.module.less';

const ORG_CARBON_TABLES_NOTE =
  '组织碳范围一、范围二分别计算：同期目标排放量=年度目标排放量×已填报月份数÷12；目标偏差率=（累计实际排放量-同期目标排放量）÷同期目标排放量×100%；累计实际排放量不高于同期目标时为已达标；减排目标完成度=（同期基准排放量-累计实际排放量）÷（同期基准排放量-同期目标排放量）×100%。';

const MONTH_LABELS = Array.from({ length: 12 }, (_, index) => `${index + 1}月`);

const ORG_COLUMN_WIDTH = {
  supplierName: 160,
  prevEmission: 220,
  reductionRatio: 120,
  targetEmission: 200,
  monthlyActual: 200,
  totalActual: 220,
  deviationRate: 160,
  targetStatus: 120,
  reductionProgress: 190,
} as const;

const ORG_TABLE_SCROLL_X =
  ORG_COLUMN_WIDTH.supplierName +
  ORG_COLUMN_WIDTH.prevEmission +
  ORG_COLUMN_WIDTH.reductionRatio +
  ORG_COLUMN_WIDTH.targetEmission +
  ORG_COLUMN_WIDTH.monthlyActual * 12 +
  ORG_COLUMN_WIDTH.totalActual +
  ORG_COLUMN_WIDTH.deviationRate +
  ORG_COLUMN_WIDTH.targetStatus +
  ORG_COLUMN_WIDTH.reductionProgress;

function columnTitle(label: string) {
  return label;
}

function renderTargetStatus(status: CarbonTargetStatus) {
  if (status === 'achieved') return <Tag color='green'>已达标</Tag>;
  if (status === 'not_achieved') return <Tag color='red'>未达标</Tag>;
  return <Tag>暂无数据</Tag>;
}

function buildColumns(): ColumnsType<OrgCarbonProgressRow> {
  const monthlyColumns: ColumnsType<OrgCarbonProgressRow> = MONTH_LABELS.map(
    (label, index) => ({
      title: columnTitle(`${label}实际排放量（tCO₂e）`),
      dataIndex: 'monthly_actual',
      width: ORG_COLUMN_WIDTH.monthlyActual,
      align: 'center',
      render: (values: number[]) => values?.[index] ?? '-',
    }),
  );

  return [
    {
      title: '供应商名称',
      dataIndex: 'supplier_name',
      fixed: 'left',
      width: ORG_COLUMN_WIDTH.supplierName,
    },
    {
      title: columnTitle('上一年度排放量（tCO₂e）'),
      dataIndex: 'prev_emission',
      width: ORG_COLUMN_WIDTH.prevEmission,
      align: 'center',
      render: value => (value == null ? '-' : value),
    },
    {
      title: columnTitle('减排比例（%）'),
      dataIndex: 'reduction_ratio',
      width: ORG_COLUMN_WIDTH.reductionRatio,
      align: 'center',
      render: value => (value == null ? '-' : `${value}%`),
    },
    {
      title: columnTitle('目标排放量（tCO₂e）'),
      dataIndex: 'target_emission',
      width: ORG_COLUMN_WIDTH.targetEmission,
      align: 'center',
      render: value => (value == null ? '-' : value),
    },
    ...monthlyColumns,
    {
      title: columnTitle('汇总实际排放量（tCO₂e）'),
      dataIndex: 'total_actual',
      width: ORG_COLUMN_WIDTH.totalActual,
      align: 'center',
    },
    {
      title: columnTitle('目标偏差率（%）'),
      dataIndex: 'deviation_rate',
      width: ORG_COLUMN_WIDTH.deviationRate,
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
      width: ORG_COLUMN_WIDTH.targetStatus,
      align: 'center',
      render: renderTargetStatus,
    },
    {
      title: columnTitle('减排目标完成度（%）'),
      dataIndex: 'reduction_progress',
      width: ORG_COLUMN_WIDTH.reductionProgress,
      align: 'center',
      render: value => (value == null ? '-' : `${value}%`),
    },
  ];
}

type OrgCarbonProgressTablesProps = {
  data: DemoData;
  loading?: boolean;
  supplierKeyword?: string;
  targetYear?: number | 'all';
};

export function OrgCarbonProgressTables({
  data,
  loading = false,
  supplierKeyword = '',
  targetYear = 'all',
}: OrgCarbonProgressTablesProps) {
  const scope1Rows = useMemo(
    () => listOrgCarbonProgress(data, 'scope1', supplierKeyword, targetYear),
    [data, supplierKeyword, targetYear],
  );
  const scope2Rows = useMemo(
    () => listOrgCarbonProgress(data, 'scope2', supplierKeyword, targetYear),
    [data, supplierKeyword, targetYear],
  );

  const scope1Columns = useMemo(() => buildColumns(), []);
  const scope2Columns = useMemo(() => buildColumns(), []);

  return (
    <div className={styles.orgCarbonProgressWrap}>
      <div className={styles.orgCarbonProgressBlock}>
        <div
          className={styles.orgCarbonProgressTitle}
          style={{ display: 'inline-flex', alignItems: 'center' }}
        >
          <FormLabelWithNote
            label='范围一排放量进度追踪'
            note={ORG_CARBON_TABLES_NOTE}
          />
        </div>
        <HorizontalDragTable
          loading={loading}
          rowKey='id'
          size='small'
          bordered
          scrollX={ORG_TABLE_SCROLL_X}
          pagination={false}
          columns={scope1Columns}
          dataSource={scope1Rows}
        />
      </div>

      <div className={styles.orgCarbonProgressBlock}>
        <div
          className={styles.orgCarbonProgressTitle}
          style={{ display: 'inline-flex', alignItems: 'center' }}
        >
          <FormLabelWithNote
            label='范围二排放量进度追踪'
            note={ORG_CARBON_TABLES_NOTE}
          />
        </div>
        <HorizontalDragTable
          loading={loading}
          rowKey='id'
          size='small'
          bordered
          scrollX={ORG_TABLE_SCROLL_X}
          pagination={false}
          columns={scope2Columns}
          dataSource={scope2Rows}
        />
      </div>
    </div>
  );
}
