/**
 * @description 供应商 - 进度上报
 */
import { PlusOutlined } from '@ant-design/icons';
import { Button, Input, Progress, Space, Table } from 'antd';
import { useMemo, useState } from 'react';
import { useNavigate } from 'react-router-dom';

import { Page } from '@/components/Page';
import { TableActions } from '@/components/Table/TableActions';
import { SupplyChainSupplierRouteMaps } from '@/router/utils/supplyChainSupplierEnums';
import { PageActionLabel } from '@/views/supplyChainCarbon/components/PageActionLabel';
import {
  listProgressReports,
  type ProgressWithPlan,
} from '@/views/supplyChainCarbon/data/demo-supply-chain';
import { useDemoStore } from '@/views/supplyChainCarbon/hooks/useDemoStore';
import { useUserRole } from '@/views/supplyChainCarbon/hooks/useUserRole';
import styles from '@/views/supplyChainCarbon/styles.module.less';
import { formatDate, parseReductionTonnes, usePagination } from '@/views/supplyChainCarbon/utils';

function getProgress(report: ProgressWithPlan) {
  const expected = parseReductionTonnes(
    report.reduction_plans?.expected_reduction,
  );
  const actual = parseReductionTonnes(report.current_reduction);
  if (expected <= 0) return 0;
  return Math.min(100, Math.round((actual / expected) * 100));
}

export default function SupplierProgressPage() {
  const navigate = useNavigate();
  const { supplierId, isLoaded } = useUserRole();
  const { data, ready } = useDemoStore();
  const [planName, setPlanName] = useState('');
  const [applied, setApplied] = useState('');

  const reports = useMemo(() => {
    if (supplierId <= 0) return [];
    return listProgressReports(data, { supplier_id: supplierId }).filter(
      report => {
        const name = report.reduction_plans?.plan_name || '';
        return !applied || name.toLowerCase().includes(applied.toLowerCase());
      },
    );
  }, [data, supplierId, applied]);

  const { paginatedItems, currentPage, pageSize, total, setCurrentPage, onPageSizeChange, resetPage } =
    usePagination(reports);

  if (!isLoaded || !ready) return null;

  return (
    <Page
      title='进度上报'
      actionBtnChildArr={[
        {
          button: (
            <PageActionLabel icon={<PlusOutlined />}>新增上报</PageActionLabel>
          ),
          click: () => navigate(SupplyChainSupplierRouteMaps.progressCreate),
          buttonType: 'primary',
        },
      ]}
    >
      <div className={styles.filterBar}>
        <Input
          placeholder='计划名称'
          value={planName}
          onChange={e => setPlanName(e.target.value)}
          style={{ width: 200 }}
        />
        <Space>
          <Button
            type='primary'
            onClick={() => {
              setApplied(planName.trim());
              resetPage();
            }}
          >
            查询
          </Button>
          <Button
            onClick={() => {
              setPlanName('');
              setApplied('');
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
            title: '计划名称',
            render: (_, r) => r.reduction_plans?.plan_name || '-',
            ellipsis: true,
          },
          {
            title: '上报日期',
            dataIndex: 'report_date',
            width: 120,
            render: v => formatDate(v),
          },
          { title: '当前减排量', dataIndex: 'current_reduction', width: 120 },
          {
            title: '完成进度',
            width: 160,
            render: (_, record) => {
              const percent = getProgress(record);
              return (
                <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                  <Progress
                    percent={percent}
                    size='small'
                    style={{ width: 80, margin: 0 }}
                  />
                  <span>{percent}%</span>
                </div>
              );
            },
          },
          {
            title: '完成情况',
            dataIndex: 'completion_status',
            ellipsis: true,
          },
          {
            title: '操作',
            fixed: 'right',
            width: 100,
            render: (_, record) => (
              <TableActions
                menus={[
                  {
                    key: 'view',
                    label: '查看',
                    onClick: () =>
                      navigate(
                        SupplyChainSupplierRouteMaps.progressInfo.replace(
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
