/**
 * @description 供应商 - 减排计划
 */
import { Button, Input, Modal, Select, Space, Table } from 'antd';
import { useMemo, useState } from 'react';
import { useNavigate } from 'react-router-dom';

import { Page } from '@/components/Page';
import { FormLabelWithNote, ModifyNote } from '@/components/ModifyNote';
import { TableActions } from '@/components/Table/TableActions';
import { SupplyChainSupplierRouteMaps } from '@/router/utils/supplyChainSupplierEnums';
import { StatusTag } from '@/views/supplyChainCarbon/components/StatusTag';
import {
  listPlans,
  type PlanWithSupplier,
  type ReductionPlanStatus,
} from '@/views/supplyChainCarbon/data/demo-supply-chain';
import { PLAN_STATUS_BADGES } from '@/views/supplyChainCarbon/data/status-badges';
import { useDemoStore } from '@/views/supplyChainCarbon/hooks/useDemoStore';
import { useUserRole } from '@/views/supplyChainCarbon/hooks/useUserRole';
import styles from '@/views/supplyChainCarbon/styles.module.less';
import { formatDate, usePagination } from '@/views/supplyChainCarbon/utils';

function formatReductionMonth(month?: number) {
  return month ? `${month}月` : '-';
}

function normalizePlanStatus(status: ReductionPlanStatus): ReductionPlanStatus {
  return status === 'draft' ? 'to_fill' : status;
}

function planUpdatedAt(plan: PlanWithSupplier) {
  return plan.updated_at || plan.reviewed_at || plan.submitted_at || plan.created_at;
}

const SUPPLIER_PLAN_PAGE_NOTE =
  '当减排目标确认接收或修改后，则供应商端自动生成1-12月的减排计划，初始状态均为待填报。';

const SUPPLIER_PLAN_OPERATION_NOTE =
  '状态与操作对应：1、待填报：编辑、查看，2、待审核：查看，3、已通过：查看，4、已驳回：编辑、查看、查看驳回原因（弹窗展示管理员在管理端录入的驳回原因）。';

function showRejectReasonModal(reviewComment?: string | null) {
  const text = reviewComment?.trim() || '暂无驳回原因';
  Modal.info({
    title: '驳回原因',
    content: <div style={{ whiteSpace: 'pre-wrap', lineHeight: 1.6 }}>{text}</div>,
    okText: '知道了',
    width: 520,
  });
}

function buildSupplierPlanActions(
  record: PlanWithSupplier,
  navigate: ReturnType<typeof useNavigate>,
) {
  const status = normalizePlanStatus(record.status);
  const menus: {
    key: string;
    label: string;
    onClick: () => void;
  }[] = [];

  if (status === 'to_fill' || status === 'rejected') {
    menus.push({
      key: 'edit',
      label: '编辑',
      onClick: () =>
        navigate(SupplyChainSupplierRouteMaps.planCreate, {
          state: { planId: record.id },
        }),
    });
  }

  menus.push({
    key: 'view',
    label: '查看',
    onClick: () =>
      navigate(
        SupplyChainSupplierRouteMaps.planInfo.replace(':id', String(record.id)),
      ),
  });

  if (status === 'rejected') {
    menus.push({
      key: 'rejectReason',
      label: '查看驳回原因',
      onClick: () => showRejectReasonModal(record.review_comment),
    });
  }

  return menus;
}

export default function SupplierPlansPage() {
  const navigate = useNavigate();
  const { supplierId, isLoaded } = useUserRole();
  const { data, ready } = useDemoStore();
  const [planName, setPlanName] = useState('');
  const [status, setStatus] = useState('all');
  const [applied, setApplied] = useState({ planName: '', status: 'all' });

  const plans = useMemo(() => {
    if (supplierId <= 0) return [];
    return listPlans(data, { supplier_id: supplierId })
      .filter(plan => {
        if (
          applied.planName &&
          !plan.plan_name.toLowerCase().includes(applied.planName.toLowerCase())
        ) {
          return false;
        }
        if (
          applied.status !== 'all' &&
          normalizePlanStatus(plan.status) !== applied.status
        ) {
          return false;
        }
        return true;
      })
      .sort((a, b) => {
        const timeDiff =
          new Date(planUpdatedAt(b)).getTime() -
          new Date(planUpdatedAt(a)).getTime();
        return timeDiff || b.id - a.id;
      });
  }, [data, supplierId, applied]);

  const { paginatedItems, currentPage, pageSize, total, setCurrentPage, onPageSizeChange, resetPage } =
    usePagination(plans);

  if (!isLoaded || !ready) return null;

  return (
    <Page
      title={
        <span style={{ display: 'inline-flex', alignItems: 'center' }}>
          减排计划
          <ModifyNote content={SUPPLIER_PLAN_PAGE_NOTE} />
        </span>
      }
    >
      <div className={styles.filterBar}>
        <Input
          placeholder='减排方案名称'
          value={planName}
          onChange={e => setPlanName(e.target.value)}
          style={{ width: 200 }}
        />
        <Select
          value={status}
          onChange={setStatus}
          style={{ width: 140 }}
          options={[
            { label: '全部状态', value: 'all' },
            { label: '待填报', value: 'to_fill' },
            { label: '待审核', value: 'pending' },
            { label: '已通过', value: 'approved' },
            { label: '已驳回', value: 'rejected' },
          ]}
        />
        <Space>
          <Button
            type='primary'
            onClick={() => {
              setApplied({ planName: planName.trim(), status });
              resetPage();
            }}
          >
            查询
          </Button>
          <Button
            onClick={() => {
              setPlanName('');
              setStatus('all');
              setApplied({ planName: '', status: 'all' });
              resetPage();
            }}
          >
            重置
          </Button>
        </Space>
      </div>

      <Table
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
            title: '目标值',
            render: (_, r) => r.reduction_targets?.target_value || '-',
            ellipsis: true,
          },
          {
            title: '目标年度',
            render: (_, r) => r.reduction_targets?.baseline_year ?? '-',
            width: 100,
          },
          {
            title: '减排方案名称',
            dataIndex: 'plan_name',
            ellipsis: true,
          },
          {
            title: '减排月份',
            dataIndex: 'reduction_month',
            width: 100,
            render: v => formatReductionMonth(v),
          },
          {
            title: '状态',
            dataIndex: 'status',
            width: 100,
            render: s => (
              <StatusTag status={normalizePlanStatus(s)} map={PLAN_STATUS_BADGES} />
            ),
          },
          {
            title: '更新时间',
            width: 120,
            render: (_, record) => formatDate(planUpdatedAt(record)),
          },
          {
            title: (
              <FormLabelWithNote
                label='操作'
                note={SUPPLIER_PLAN_OPERATION_NOTE}
              />
            ),
            fixed: 'right',
            width: 240,
            render: (_, record) => (
              <TableActions menus={buildSupplierPlanActions(record, navigate)} />
            ),
          },
        ]}
      />
    </Page>
  );
}
