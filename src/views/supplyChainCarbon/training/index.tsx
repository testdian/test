/**
 * @description 线上培训管理
 */
import { Button, Input, Modal, Space, Table, message } from 'antd';
import { useMemo, useState } from 'react';
import { useNavigate } from 'react-router-dom';

import { ModifyNote } from '@/components/ModifyNote';
import { Page } from '@/components/Page';
import { TableActions } from '@/components/Table/TableActions';
import {
  PAGE_TYPE_VAR,
  PageTypeInfo,
} from '@/router/utils/enums';
import { SupplyChainRefRouteMaps } from '@/router/utils/supplyChainRefEnums';
import type { Training } from '@/views/supplyChainCarbon/data/demo-data';
import { useDemoStore } from '@/views/supplyChainCarbon/hooks/useDemoStore';
import styles from '@/views/supplyChainCarbon/styles.module.less';
import { usePagination } from '@/views/supplyChainCarbon/utils';

function trainingSummary(t: Training) {
  if (t.summary) return t.summary;
  const text = t.content.replace(/<[^>]+>/g, '').trim();
  return text.length > 60 ? `${text.slice(0, 60)}…` : text;
}

type TrainingFilters = {
  title: string;
};

const defaultFilters: TrainingFilters = {
  title: '',
};

export default function TrainingPage() {
  const navigate = useNavigate();
  const { data, update, ready } = useDemoStore();
  const [filters, setFilters] = useState(defaultFilters);
  const [appliedFilters, setAppliedFilters] = useState(defaultFilters);

  const filteredTrainings = useMemo(() => {
    return data.trainings.filter(training => {
      if (
        appliedFilters.title &&
        !training.title
          .toLowerCase()
          .includes(appliedFilters.title.toLowerCase())
      ) {
        return false;
      }
      return true;
    });
  }, [data.trainings, appliedFilters]);

  const {
    paginatedItems,
    currentPage,
    pageSize,
    total,
    setCurrentPage,
    onPageSizeChange,
    resetPage,
  } = usePagination(filteredTrainings);

  const goInfo = (pageType: PageTypeInfo, trainingId: number | string = 0) => {
    navigate(
      SupplyChainRefRouteMaps.trainingInfo
        .replace(PAGE_TYPE_VAR, pageType)
        .replace(':id', String(trainingId)),
    );
  };

  const deleteTraining = (id: number) => {
    Modal.confirm({
      title: '确定删除该培训资料？',
      onOk: () => {
        update(d => ({
          ...d,
          trainings: d.trainings.filter(t => t.id !== id),
        }));
        message.success('已删除');
      },
    });
  };

  return (
    <Page
      title={
        <span style={{ display: 'inline-flex', alignItems: 'center' }}>
          线上培训管理
          <ModifyNote content='线上培训管理模块配置的内容，需在主页显示' />
        </span>
      }
      actionBtnChildArr={[
        {
          button: '新增',
          click: () => goInfo(PageTypeInfo.add),
          buttonType: 'primary',
        },
      ]}
    >
      <div className={styles.filterBar}>
        <Input
          placeholder='资料名称'
          value={filters.title}
          onChange={e =>
            setFilters(prev => ({ ...prev, title: e.target.value }))
          }
          style={{ width: 200 }}
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
            title: '资料名称',
            dataIndex: 'title',
            render: (title, record) => (
              <div>
                <div>{title}</div>
                <div
                  style={{
                    fontSize: 12,
                    color: 'rgba(0,0,0,0.45)',
                    marginTop: 4,
                  }}
                >
                  {trainingSummary(record)}
                </div>
              </div>
            ),
          },
          {
            title: '更新时间',
            render: (_, record) => record.updated_at || record.created_at,
          },
          {
            title: '操作',
            width: 180,
            render: (_, record) => (
              <TableActions
                menus={[
                  {
                    key: 'view',
                    label: '查看',
                    onClick: () => goInfo(PageTypeInfo.show, record.id),
                  },
                  {
                    key: 'edit',
                    label: '编辑',
                    onClick: () => goInfo(PageTypeInfo.edit, record.id),
                  },
                  {
                    key: 'delete',
                    label: '删除',
                    onClick: () => deleteTraining(record.id),
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
