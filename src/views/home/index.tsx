/**
 * @description 主页：展示已发布培训资料列表
 */
import { Button, Space, Table } from 'antd';
import { useMemo, useState } from 'react';
import { useNavigate } from 'react-router-dom';

import { FormLabelWithNote, ModifyNote } from '@/components/ModifyNote';
import { SearchInputWithNote } from '@/components/ModifyNote/SearchInputWithNote';
import { Page } from '@/components/Page';
import { TableActions } from '@/components/Table/TableActions';
import { PAGE_TYPE_VAR, PageTypeInfo } from '@/router/utils/enums';
import { SupplyChainRefRouteMaps } from '@/router/utils/supplyChainRefEnums';
import { SupplyChainSupplierRouteMaps } from '@/router/utils/supplyChainSupplierEnums';
import type { Training } from '@/views/supplyChainCarbon/data/demo-data';
import { useDemoStore } from '@/views/supplyChainCarbon/hooks/useDemoStore';
import { useUserRole } from '@/views/supplyChainCarbon/hooks/useUserRole';
import styles from '@/views/supplyChainCarbon/styles.module.less';
import { usePagination } from '@/views/supplyChainCarbon/utils';

function trainingSummary(t: Training) {
  if (t.summary) return t.summary;
  const text = t.content.replace(/<[^>]+>/g, '').trim();
  return text.length > 60 ? `${text.slice(0, 60)}…` : text;
}

type HomeFilters = {
  title: string;
};

const defaultFilters: HomeFilters = {
  title: '',
};

const HOME_PAGE_NOTE =
  '数据看板上方增加一个主页菜单：列表展示线上培训管理模块配置的资料名称、内容摘要，点击可查看详情。';
const HOME_SEARCH_NOTE = '搜索项：资料名称，文本框，模糊搜索';
const HOME_UPDATED_BY_NOTE = '列表在更新时间左侧增加字段：更新人';

export default function HomePage() {
  const navigate = useNavigate();
  const { isAdmin } = useUserRole();
  const { data, ready } = useDemoStore();
  const [filters, setFilters] = useState(defaultFilters);
  const [appliedFilters, setAppliedFilters] = useState(defaultFilters);

  const publishedTrainings = useMemo(
    () =>
      [...data.trainings]
        .filter(item => item.status === 'published')
        .filter(item => {
          if (
            appliedFilters.title &&
            !item.title
              .toLowerCase()
              .includes(appliedFilters.title.toLowerCase())
          ) {
            return false;
          }
          return true;
        })
        .sort((a, b) =>
          (b.updated_at || b.created_at).localeCompare(
            a.updated_at || a.created_at,
          ),
        ),
    [data.trainings, appliedFilters],
  );

  const {
    paginatedItems,
    currentPage,
    pageSize,
    total,
    setCurrentPage,
    onPageSizeChange,
    resetPage,
  } = usePagination(publishedTrainings);

  const goDetail = (id: number) => {
    if (isAdmin) {
      navigate(
        SupplyChainRefRouteMaps.trainingInfo
          .replace(PAGE_TYPE_VAR, PageTypeInfo.show)
          .replace(':id', String(id)),
        { state: { from: 'home' } },
      );
      return;
    }

    navigate(
      SupplyChainSupplierRouteMaps.trainingInfo
        .replace(':pageTypeInfo', PageTypeInfo.show)
        .replace(':id', String(id)),
    );
  };

  return (
    <Page
      title={
        <span style={{ display: 'inline-flex', alignItems: 'center' }}>
          主页
          <ModifyNote content={HOME_PAGE_NOTE} />
        </span>
      }
    >
      <div className={styles.filterBar}>
        <div style={{ width: 220 }}>
          <SearchInputWithNote
            note={HOME_SEARCH_NOTE}
            placeholder='资料名称'
            value={filters.title}
            onChange={e =>
              setFilters(prev => ({ ...prev, title: e.target.value }))
            }
            style={{ width: '100%' }}
          />
        </div>
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
            title: (
              <FormLabelWithNote label='更新人' note={HOME_UPDATED_BY_NOTE} />
            ),
            dataIndex: 'updated_by',
            width: 120,
            render: (updatedBy: string | undefined) => updatedBy || '-',
          },
          {
            title: '更新时间',
            render: (_, record) => record.updated_at || record.created_at,
          },
          {
            title: '操作',
            width: 100,
            render: (_, record) => (
              <TableActions
                menus={[
                  {
                    key: 'view',
                    label: '查看',
                    onClick: () => goDetail(record.id),
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
