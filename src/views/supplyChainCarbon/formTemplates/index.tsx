/**
 * @description 调研表单配置
 */
import { Button, Input, Select, Space, Table } from 'antd';
import { useMemo, useState } from 'react';
import { useNavigate } from 'react-router-dom';

import { ModifyNote } from '@/components/ModifyNote';
import { Page } from '@/components/Page';
import { TableActions } from '@/components/Table/TableActions';
import { SupplyChainRefRouteMaps } from '@/router/utils/supplyChainRefEnums';
import { useDemoStore } from '@/views/supplyChainCarbon/hooks/useDemoStore';
import styles from '@/views/supplyChainCarbon/styles.module.less';
import { usePagination } from '@/views/supplyChainCarbon/utils';

type TemplateFilters = {
  category: string;
  name: string;
};

const defaultFilters: TemplateFilters = {
  category: 'all',
  name: '',
};

export default function FormTemplatesPage() {
  const navigate = useNavigate();
  const { data, ready } = useDemoStore();
  const [filters, setFilters] = useState(defaultFilters);
  const [appliedFilters, setAppliedFilters] = useState(defaultFilters);

  const categories = useMemo(
    () => Array.from(new Set(data.formTemplates.map(item => item.category))),
    [data.formTemplates],
  );

  const filteredTemplates = useMemo(() => {
    return data.formTemplates.filter(template => {
      if (
        appliedFilters.category !== 'all' &&
        template.category !== appliedFilters.category
      ) {
        return false;
      }
      if (
        appliedFilters.name &&
        !template.name.toLowerCase().includes(appliedFilters.name.toLowerCase())
      ) {
        return false;
      }
      return true;
    });
  }, [data.formTemplates, appliedFilters]);

  const {
    paginatedItems,
    currentPage,
    pageSize,
    total,
    setCurrentPage,
    onPageSizeChange,
    resetPage,
  } = usePagination(filteredTemplates);

  return (
    <Page
      title={
        <span style={{ display: 'inline-flex', alignItems: 'center' }}>
          调研表单配置
          <ModifyNote content='配置的调研表单，需在供应链碳管理-发起调研填报任务时使用' />
        </span>
      }
      actionBtnChildArr={[
        {
          button: '新增',
          click: () => navigate(SupplyChainRefRouteMaps.formTemplateCreate),
          buttonType: 'primary',
        },
      ]}
    >
      <div className={styles.filterBar}>
        <Select
          value={filters.category}
          onChange={v => setFilters(prev => ({ ...prev, category: v }))}
          style={{ width: 180 }}
          options={[
            { label: '全部类别', value: 'all' },
            ...categories.map(c => ({ label: c, value: c })),
          ]}
        />
        <Input
          placeholder='模板名称'
          value={filters.name}
          onChange={e =>
            setFilters(prev => ({ ...prev, name: e.target.value }))
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
          { title: '供应商类别', dataIndex: 'category' },
          { title: '模板名称', dataIndex: 'name' },
          {
            title: '操作',
            width: 120,
            render: (_, record) => (
              <TableActions
                menus={[
                  {
                    key: 'view',
                    label: '配置字段',
                    onClick: () =>
                      navigate(
                        SupplyChainRefRouteMaps.formTemplateInfo.replace(
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
