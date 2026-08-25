/**
 * @description 供应商 - 减排目标
 */
import { Button, Space, Table } from 'antd';
import { useMemo, useState } from 'react';
import { useNavigate } from 'react-router-dom';

import { FormLabelWithNote } from '@/components/ModifyNote';
import { SelectWithNote } from '@/components/ModifyNote/SelectWithNote';
import { Page } from '@/components/Page';
import { TableActions } from '@/components/Table/TableActions';
import { SupplyChainSupplierRouteMaps } from '@/router/utils/supplyChainSupplierEnums';
import { StatusTag } from '@/views/supplyChainCarbon/components/StatusTag';
import { listTargets } from '@/views/supplyChainCarbon/data/demo-supply-chain';
import { SUPPLIER_TARGET_STATUS_BADGES } from '@/views/supplyChainCarbon/data/status-badges';
import { useDemoStore } from '@/views/supplyChainCarbon/hooks/useDemoStore';
import { useUserRole } from '@/views/supplyChainCarbon/hooks/useUserRole';
import styles from '@/views/supplyChainCarbon/styles.module.less';
import { formatDate, usePagination } from '@/views/supplyChainCarbon/utils';

const SUPPLIER_TARGET_STATUS_NOTE =
  '状态与操作栏对应关系：待确认—确认；已确认、已修改—查看。点击待确认的「确认」进入目标确认页，底部有确认接收、修改目标两个按钮；点击确认接收，弹窗提示：是否确认接收此减排目标？确认后管理员端状态变为已确认。点击修改目标，产品碳或组织碳的卡片内字段变为可编辑状态，其他字段仍不可编辑，保存后管理员端状态变为已修改并返回列表页。';

const SUPPLIER_TARGET_OPERATION_NOTE =
  '状态与操作栏对应关系：待确认—确认；已确认、已修改—查看。';

export default function SupplierTargetsPage() {
  const navigate = useNavigate();
  const { supplierId, isLoaded } = useUserRole();
  const { data, ready } = useDemoStore();
  const [status, setStatus] = useState('all');
  const [appliedStatus, setAppliedStatus] = useState('all');

  const targets = useMemo(() => {
    if (supplierId <= 0) return [];
    return listTargets(data, { supplier_id: supplierId }).filter(target => {
      if (target.status === 'draft') return false;
      if (appliedStatus !== 'all' && target.status !== appliedStatus) {
        return false;
      }
      return true;
    });
  }, [data, supplierId, appliedStatus]);

  const {
    paginatedItems,
    currentPage,
    pageSize,
    total,
    setCurrentPage,
    onPageSizeChange,
    resetPage,
  } = usePagination(targets);

  if (!isLoaded || !ready) return null;

  return (
    <Page title='减排目标'>
      <div className={`${styles.filterBar} ${styles.filterBarInline}`}>
        <SelectWithNote
          note={SUPPLIER_TARGET_STATUS_NOTE}
          className={styles.filterSelect}
          value={status}
          onChange={setStatus}
          options={[
            { label: '全部状态', value: 'all' },
            { label: '待确认', value: 'pushed' },
            { label: '已确认', value: 'confirmed' },
            { label: '已修改', value: 'modified' },
          ]}
        />
        <Space>
          <Button
            type='primary'
            onClick={() => {
              setAppliedStatus(status);
              resetPage();
            }}
          >
            查询
          </Button>
          <Button
            onClick={() => {
              setStatus('all');
              setAppliedStatus('all');
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
          { title: '目标值', dataIndex: 'target_value', ellipsis: true },
          {
            title: '目标年度',
            dataIndex: 'baseline_year',
            width: 100,
            render: v => v ?? '-',
          },
          {
            title: (
              <FormLabelWithNote
                label='状态'
                note={SUPPLIER_TARGET_STATUS_NOTE}
              />
            ),
            dataIndex: 'status',
            width: 100,
            render: s => (
              <StatusTag status={s} map={SUPPLIER_TARGET_STATUS_BADGES} />
            ),
          },
          {
            title: '创建时间',
            dataIndex: 'created_at',
            width: 120,
            render: v => formatDate(v),
          },
          {
            title: (
              <FormLabelWithNote
                label='操作'
                note={SUPPLIER_TARGET_OPERATION_NOTE}
              />
            ),
            fixed: 'right',
            width: 100,
            render: (_, record) => (
              <TableActions
                menus={[
                  {
                    key: record.status === 'pushed' ? 'confirm' : 'view',
                    label: record.status === 'pushed' ? '确认' : '查看',
                    onClick: () =>
                      navigate(
                        SupplyChainSupplierRouteMaps.targetInfo.replace(
                          ':id',
                          String(record.id),
                        ),
                      ),
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
