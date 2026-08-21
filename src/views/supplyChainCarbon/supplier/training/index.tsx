/**
 * @description 供应商 - 培训中心
 */
import { Button, Input, Space, Table } from 'antd';
import { useMemo, useState } from 'react';
import { useNavigate } from 'react-router-dom';

import { Page } from '@/components/Page';
import { TableActions } from '@/components/Table/TableActions';
import { PageTypeInfo } from '@/router/utils/enums';
import { SupplyChainSupplierRouteMaps } from '@/router/utils/supplyChainSupplierEnums';
import { useDemoStore } from '@/views/supplyChainCarbon/hooks/useDemoStore';
import styles from '@/views/supplyChainCarbon/styles.module.less';
import { usePagination } from '@/views/supplyChainCarbon/utils';

function trainingSummary(summary?: string, content?: string) {
  if (summary) return summary;
  const text = (content || '').replace(/<[^>]+>/g, '').trim();
  return text.length > 60 ? `${text.slice(0, 60)}…` : text;
}

export default function SupplierTrainingPage() {
  const navigate = useNavigate();
  const { data, ready } = useDemoStore();
  const [title, setTitle] = useState('');
  const [applied, setApplied] = useState('');

  const trainings = useMemo(
    () =>
      data.trainings
        .filter(t => t.status === 'published')
        .filter(
          t =>
            !applied ||
            t.title.toLowerCase().includes(applied.toLowerCase()),
        ),
    [data.trainings, applied],
  );

  const { paginatedItems, currentPage, pageSize, total, setCurrentPage, onPageSizeChange, resetPage } =
    usePagination(trainings);

  if (!ready) return null;

  return (
    <Page title='培训中心'>
      <div className={styles.filterBar}>
        <Input
          placeholder='资料名称'
          value={title}
          onChange={e => setTitle(e.target.value)}
          style={{ width: 200 }}
        />
        <Space>
          <Button
            type='primary'
            onClick={() => {
              setApplied(title.trim());
              resetPage();
            }}
          >
            查询
          </Button>
          <Button
            onClick={() => {
              setTitle('');
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
          { title: '资料名称', dataIndex: 'title', ellipsis: true },
          { title: '类型', dataIndex: 'type', width: 120 },
          {
            title: '内容摘要',
            render: (_, record) =>
              trainingSummary(record.summary, record.content),
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
                        SupplyChainSupplierRouteMaps.trainingInfo
                          .replace(':pageTypeInfo', PageTypeInfo.show)
                          .replace(':id', String(record.id)),
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
