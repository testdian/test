/**
 * @description 供应商管理
 */
import { ReloadOutlined } from '@ant-design/icons';
import { Button, Input, message, Select, Space, Table } from 'antd';
import { useMemo, useState } from 'react';

import { Page } from '@/components/Page';
import { PageActionLabel } from '@/views/supplyChainCarbon/components/PageActionLabel';
import { SUPPLIER_FORM_CATEGORIES } from '@/views/supplyChainCarbon/data/form-template-seeds';
import { useDemoStore } from '@/views/supplyChainCarbon/hooks/useDemoStore';
import styles from '@/views/supplyChainCarbon/styles.module.less';
import { usePagination } from '@/views/supplyChainCarbon/utils';

type SupplierFilters = {
  srmCode: string;
  supplierName: string;
  category: string;
};

const defaultFilters: SupplierFilters = {
  srmCode: '',
  supplierName: '',
  category: 'all',
};

export default function SupplierTasksPage() {
  const { data, update, ready } = useDemoStore();
  const [filters, setFilters] = useState(defaultFilters);
  const [appliedFilters, setAppliedFilters] = useState(defaultFilters);

  const filteredSuppliers = useMemo(() => {
    return data.demoSuppliers.filter(supplier => {
      if (
        appliedFilters.srmCode &&
        !(supplier.srm_code || '')
          .toLowerCase()
          .includes(appliedFilters.srmCode.toLowerCase())
      ) {
        return false;
      }
      if (
        appliedFilters.supplierName &&
        !supplier.name
          .toLowerCase()
          .includes(appliedFilters.supplierName.toLowerCase())
      ) {
        return false;
      }
      if (
        appliedFilters.category !== 'all' &&
        supplier.category !== appliedFilters.category
      ) {
        return false;
      }
      return true;
    });
  }, [data.demoSuppliers, appliedFilters]);

  const {
    paginatedItems,
    currentPage,
    pageSize,
    total,
    setCurrentPage,
    onPageSizeChange,
    resetPage,
  } = usePagination(filteredSuppliers);

  const syncSrm = () => {
    update(d => {
      const nid = Math.max(...d.demoSuppliers.map(s => s.id), 0) + 1;
      const category =
        SUPPLIER_FORM_CATEGORIES[(nid - 1) % SUPPLIER_FORM_CATEGORIES.length];
      return {
        ...d,
        demoSuppliers: [
          ...d.demoSuppliers,
          {
            id: nid,
            name: `供应商${String.fromCharCode(
              64 + ((nid - 1) % 26) + 1,
            )}(SRM)`,
            contact_person: `联系人${nid}`,
            contact_phone: `13${String(nid).padStart(9, '0')}`,
            category,
            srm_code: `SRM-${String(nid).padStart(3, '0')}`,
          },
        ],
      };
    });
    message.success('已从 SRM 同步 1 家供应商');
  };

  const handleSearch = () => {
    setAppliedFilters(filters);
    resetPage();
  };

  const handleReset = () => {
    setFilters(defaultFilters);
    setAppliedFilters(defaultFilters);
    resetPage();
  };

  return (
    <Page
      title='供应商管理'
      actionBtnChildArr={[
        {
          button: (
            <PageActionLabel icon={<ReloadOutlined />}>
              同步 SRM
            </PageActionLabel>
          ),
          click: syncSrm,
          buttonType: 'default',
        },
      ]}
    >
      <div className={styles.filterBar}>
        <Input
          placeholder='SRM编码'
          value={filters.srmCode}
          onChange={e =>
            setFilters(prev => ({ ...prev, srmCode: e.target.value }))
          }
          style={{ width: 160 }}
        />
        <Input
          placeholder='供应商名称'
          value={filters.supplierName}
          onChange={e =>
            setFilters(prev => ({ ...prev, supplierName: e.target.value }))
          }
          style={{ width: 160 }}
        />
        <Select
          value={filters.category}
          onChange={value => setFilters(prev => ({ ...prev, category: value }))}
          style={{ width: 160 }}
          options={[
            { label: '全部类别', value: 'all' },
            ...SUPPLIER_FORM_CATEGORIES.map(c => ({ label: c, value: c })),
          ]}
        />
        <Space>
          <Button type='primary' onClick={handleSearch}>
            查询
          </Button>
          <Button onClick={handleReset}>重置</Button>
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
          { title: 'SRM编码', dataIndex: 'srm_code', render: v => v || '-' },
          { title: '供应商', dataIndex: 'name' },
          { title: '类别', dataIndex: 'category' },
          { title: '联系人', dataIndex: 'contact_person' },
          { title: '电话', dataIndex: 'contact_phone' },
        ]}
      />
    </Page>
  );
}
