/**
 * @description 减排目标管理
 */
import { PlusOutlined } from '@ant-design/icons';
import { Button, message, Modal, Select, Space, Table } from 'antd';
import { useMemo, useState } from 'react';
import { useNavigate } from 'react-router-dom';

import { FormLabelWithNote } from '@/components/ModifyNote';
import { SearchInputWithNote } from '@/components/ModifyNote/SearchInputWithNote';
import { SelectWithNote } from '@/components/ModifyNote/SelectWithNote';
import { Page } from '@/components/Page';
import { TableActions } from '@/components/Table/TableActions';
import {
  PAGE_TYPE_VAR,
  PageTypeInfo,
} from '@/router/utils/enums';
import { SupplyChainRefRouteMaps } from '@/router/utils/supplyChainRefEnums';
import { PageActionLabel } from '@/views/supplyChainCarbon/components/PageActionLabel';
import { StatusTag } from '@/views/supplyChainCarbon/components/StatusTag';
import {
  canEditReductionTarget,
  canPushReductionTarget,
  listTargets,
  pushReductionTarget,
  type TargetWithSupplier,
} from '@/views/supplyChainCarbon/data/demo-supply-chain';
import { TARGET_STATUS_BADGES } from '@/views/supplyChainCarbon/data/status-badges';
import { useDemoStore } from '@/views/supplyChainCarbon/hooks/useDemoStore';
import styles from '@/views/supplyChainCarbon/styles.module.less';
import { formatDate, usePagination } from '@/views/supplyChainCarbon/utils';

import { buildPushTargetConfirmContent } from './reduction-target-form';

type TargetFilters = {
  supplierName: string;
  status: string;
};

const defaultFilters: TargetFilters = {
  supplierName: '',
  status: 'all',
};

const SUPPLIER_SEARCH_NOTE = '搜索项：供应商名称/编码，模糊搜索';
const TARGET_STATUS_NOTE =
  '状态与操作栏对应关系：待推送—查看、编辑、推送；待确认—查看；已确认—查看；已修改—查看。待推送为管理员已完成减排目标的录入但尚未推送；待确认为已推送给供应商待确认；已确认为供应商已确认接受；已修改为供应商已修改并返回给管理员，默认管理员直接接受该目标。';
const TARGET_OPERATION_NOTE =
  '状态与操作栏对应关系：待推送—查看、编辑、推送；待确认—查看；已确认—查看；已修改—查看。';

export default function ReductionTargetsPage() {
  const navigate = useNavigate();
  const { data, update, ready } = useDemoStore();
  const [filters, setFilters] = useState(defaultFilters);
  const [appliedFilters, setAppliedFilters] = useState(defaultFilters);

  const targets = useMemo(() => {
    const keyword = appliedFilters.supplierName.trim().toLowerCase();
    return listTargets(data).filter(target => {
      if (keyword) {
        const name = (target.suppliers?.name || '').toLowerCase();
        const code = (target.suppliers?.srm_code || '').toLowerCase();
        if (!name.includes(keyword) && !code.includes(keyword)) {
          return false;
        }
      }
      if (
        appliedFilters.status !== 'all' &&
        target.status !== appliedFilters.status
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
  } = usePagination(targets);

  const goInfo = (pageType: PageTypeInfo, id: number | string = 0) => {
    navigate(
      SupplyChainRefRouteMaps.targetInfo
        .replace(PAGE_TYPE_VAR, pageType)
        .replace(':id', String(id)),
    );
  };

  const handlePush = (record: TargetWithSupplier) => {
    Modal.confirm({
      title: '推送确认',
      content: buildPushTargetConfirmContent(record.suppliers?.name || '-'),
      onOk: () => {
        update(d => pushReductionTarget(d, record.id));
        message.success('目标已推送');
      },
    });
  };

  return (
    <Page
      title='减排目标管理'
      actionBtnChildArr={[
        {
          button: (
            <PageActionLabel icon={<PlusOutlined />}>新增</PageActionLabel>
          ),
          click: () => goInfo(PageTypeInfo.add),
          buttonType: 'primary',
        },
      ]}
    >
      <div className={`${styles.filterBar} ${styles.filterBarInline}`}>
        <div className={styles.filterSearch}>
          <SearchInputWithNote
            note={SUPPLIER_SEARCH_NOTE}
            placeholder='供应商名称/编码'
            value={filters.supplierName}
            onChange={e =>
              setFilters(prev => ({ ...prev, supplierName: e.target.value }))
            }
            style={{ width: '100%' }}
          />
        </div>
        <SelectWithNote
          note={TARGET_STATUS_NOTE}
          className={styles.filterSelect}
          value={filters.status}
          onChange={v => setFilters(prev => ({ ...prev, status: v }))}
          options={[
            { label: '全部状态', value: 'all' },
            { label: '待推送', value: 'draft' },
            { label: '待确认', value: 'pushed' },
            { label: '已确认', value: 'confirmed' },
            { label: '已修改', value: 'modified' },
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
            title: '供应商名称',
            dataIndex: ['suppliers', 'name'],
            render: v => v || '-',
          },
          { title: '目标值', dataIndex: 'target_value' },
          {
            title: '目标年度',
            dataIndex: 'baseline_year',
            render: v => v ?? '-',
          },
          {
            title: (
              <FormLabelWithNote label='状态' note={TARGET_STATUS_NOTE} />
            ),
            dataIndex: 'status',
            render: status => (
              <StatusTag status={status} map={TARGET_STATUS_BADGES} />
            ),
          },
          {
            title: '创建时间',
            dataIndex: 'created_at',
            render: v => formatDate(v),
          },
          {
            title: (
              <FormLabelWithNote label='操作' note={TARGET_OPERATION_NOTE} />
            ),
            fixed: 'right',
            width: 180,
            render: (_, record) => (
              <TableActions
                menus={[
                  {
                    key: 'view',
                    label: '查看',
                    onClick: () => goInfo(PageTypeInfo.show, record.id),
                  },
                  ...(canEditReductionTarget(record.status)
                    ? [
                        {
                          key: 'edit',
                          label: '编辑',
                          onClick: () => goInfo(PageTypeInfo.edit, record.id),
                        },
                      ]
                    : []),
                  ...(canPushReductionTarget(record.status)
                    ? [
                        {
                          key: 'push',
                          label: '推送',
                          onClick: () => handlePush(record),
                        },
                      ]
                    : []),
                ]}
              />
            ),
          },
        ]}
      />
    </Page>
  );
}
