/**
 * @description 计划审核
 */
import { Button, Select, Space, Table } from 'antd';
import { useMemo, useState } from 'react';
import { useNavigate } from 'react-router-dom';

import { ModifyNote, FormLabelWithNote } from '@/components/ModifyNote';
import { SearchInputWithNote } from '@/components/ModifyNote/SearchInputWithNote';
import { SelectWithNote } from '@/components/ModifyNote/SelectWithNote';
import { Page } from '@/components/Page';
import { TableActions } from '@/components/Table/TableActions';
import { SupplyChainRefRouteMaps } from '@/router/utils/supplyChainRefEnums';
import { StatusTag } from '@/views/supplyChainCarbon/components/StatusTag';
import {
  listPlans,
  type PlanWithSupplier,
} from '@/views/supplyChainCarbon/data/demo-supply-chain';
import { PLAN_STATUS_BADGES } from '@/views/supplyChainCarbon/data/status-badges';
import { useDemoStore } from '@/views/supplyChainCarbon/hooks/useDemoStore';
import styles from '@/views/supplyChainCarbon/styles.module.less';
import { formatDate, usePagination } from '@/views/supplyChainCarbon/utils';

type PlanFilters = {
  supplierKeyword: string;
  months: number[];
  status: string;
};

const defaultFilters: PlanFilters = {
  supplierKeyword: '',
  months: [],
  status: 'all',
};

const PLAN_REVIEW_NOTE =
  '计划审核是当管理员为供应商设定减排目标后，自动生成了12个月的任务，供应商需要按月更新减排方案给管理员进行审核。';
const PLAN_SUPPLIER_SEARCH_NOTE = '搜索项：供应商名称/编码，模糊搜索';
const PLAN_MONTH_SEARCH_NOTE = '减排月份，下拉选项，1-12月，支持多选';
const PLAN_STATUS_SEARCH_NOTE = '审核状态';
const PLAN_LIST_FIELDS_NOTE =
  '列表字段：供应商名称、目标值、目标年度、减排方案名称、减排月份、提交时间、审核状态';
const PLAN_OPERATION_NOTE =
  '审核状态和操作对应关系：待审核—审核、查看；已通过—查看；已驳回—查看。点击审核进入页面进行审核通过或驳回操作。';

const MONTH_OPTIONS = Array.from({ length: 12 }, (_, index) => ({
  label: `${index + 1}月`,
  value: index + 1,
}));

function formatReductionMonth(month?: number) {
  return month ? `${month}月` : '-';
}

export default function PlansPage() {
  const navigate = useNavigate();
  const { data, ready } = useDemoStore();
  const [filters, setFilters] = useState(defaultFilters);
  const [appliedFilters, setAppliedFilters] = useState(defaultFilters);

  const plans = useMemo(() => {
    const keyword = appliedFilters.supplierKeyword.trim().toLowerCase();
    return listPlans(data).filter(plan => {
      if (plan.status === 'draft' || plan.status === 'to_fill') {
        return false;
      }
      if (keyword) {
        const name = (plan.suppliers?.name || '').toLowerCase();
        const code = (plan.suppliers?.srm_code || '').toLowerCase();
        if (!name.includes(keyword) && !code.includes(keyword)) {
          return false;
        }
      }
      if (
        appliedFilters.months.length > 0 &&
        (!plan.reduction_month ||
          !appliedFilters.months.includes(plan.reduction_month))
      ) {
        return false;
      }
      if (
        appliedFilters.status !== 'all' &&
        plan.status !== appliedFilters.status
      ) {
        return false;
      }
      return true;
    });
  }, [data, appliedFilters]);

  const {
    paginatedItems,
    currentPage,
    pageSize,
    total,
    setCurrentPage,
    onPageSizeChange,
    resetPage,
  } = usePagination(plans);

  const goDetail = (record: PlanWithSupplier, review = false) => {
    navigate(
      SupplyChainRefRouteMaps.planInfo.replace(':id', String(record.id)),
      { state: review ? { review: true } : undefined },
    );
  };

  return (
    <Page
      title={
        <span style={{ display: 'inline-flex', alignItems: 'center' }}>
          计划审核
          <ModifyNote content={PLAN_REVIEW_NOTE} />
        </span>
      }
    >
      <div className={`${styles.filterBar} ${styles.filterBarInline}`}>
        <div className={styles.filterSearch}>
          <SearchInputWithNote
            note={PLAN_SUPPLIER_SEARCH_NOTE}
            placeholder='供应商名称/编码'
            value={filters.supplierKeyword}
            onChange={e =>
              setFilters(prev => ({ ...prev, supplierKeyword: e.target.value }))
            }
            style={{ width: '100%' }}
          />
        </div>
        <SelectWithNote
          note={PLAN_MONTH_SEARCH_NOTE}
          className={styles.filterMonthSelect}
          mode='multiple'
          allowClear
          placeholder='减排月份'
          value={filters.months}
          onChange={months =>
            setFilters(prev => ({ ...prev, months: months as number[] }))
          }
          options={MONTH_OPTIONS}
          maxTagCount='responsive'
        />
        <SelectWithNote
          note={PLAN_STATUS_SEARCH_NOTE}
          className={styles.filterSelect}
          value={filters.status}
          onChange={v => setFilters(prev => ({ ...prev, status: v }))}
          options={[
            { label: '全部状态', value: 'all' },
            { label: '待审核', value: 'pending' },
            { label: '已通过', value: 'approved' },
            { label: '已驳回', value: 'rejected' },
          ]}
        />
        <Space>
          <Button
            type='primary'
            onClick={() => {
              setAppliedFilters(filters);
              resetPage();
            }}
          >
            查询
          </Button>
          <Button
            onClick={() => {
              setFilters(defaultFilters);
              setAppliedFilters(defaultFilters);
              resetPage();
            }}
          >
            重置
          </Button>
        </Space>
      </div>

      <Table
        loading={!ready}
        rowKey='id'
        dataSource={paginatedItems}
        pagination={{
          current: currentPage,
          pageSize,
          total,
          showSizeChanger: true,
          onChange: setCurrentPage,
          onShowSizeChange: (_, size) => onPageSizeChange(size),
        }}
        columns={[
          {
            title: (
              <FormLabelWithNote
                label='供应商名称'
                note={PLAN_LIST_FIELDS_NOTE}
              />
            ),
            dataIndex: ['suppliers', 'name'],
            render: v => v || '-',
          },
          {
            title: '目标值',
            dataIndex: ['reduction_targets', 'target_value'],
            render: v => v || '-',
          },
          {
            title: '目标年度',
            dataIndex: ['reduction_targets', 'baseline_year'],
            render: v => v ?? '-',
          },
          {
            title: '减排方案名称',
            dataIndex: 'plan_name',
            render: v => v || '-',
          },
          {
            title: '减排月份',
            dataIndex: 'reduction_month',
            render: v => formatReductionMonth(v),
          },
          {
            title: '提交时间',
            dataIndex: 'submitted_at',
            render: v => formatDate(v),
          },
          {
            title: '审核状态',
            dataIndex: 'status',
            render: status => (
              <StatusTag status={status} map={PLAN_STATUS_BADGES} />
            ),
          },
          {
            title: (
              <FormLabelWithNote label='操作' note={PLAN_OPERATION_NOTE} />
            ),
            fixed: 'right',
            width: 160,
            render: (_, record) => (
              <TableActions
                menus={[
                  ...(record.status === 'pending'
                    ? [
                        {
                          key: 'review',
                          label: '审核',
                          onClick: () => goDetail(record, true),
                        },
                      ]
                    : []),
                  {
                    key: 'view',
                    label: '查看',
                    onClick: () => goDetail(record, false),
                  },
                ]}
              />
            ),
          },
        ]}
      />
    </Page>
  );
}
