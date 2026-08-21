import { Badge, Button, Input, Select, Space, Table, message } from 'antd';
import { useMemo, useState } from 'react';
import { useNavigate } from 'react-router-dom';

import { Page } from '@/components/Page';
import { SupplyChainRefRouteMaps } from '@/router/utils/supplyChainRefEnums';

import {
  SupplierDataFillRow,
  fillStatusOptions,
  supplierDataFillRows,
} from './data';
import styles from './index.module.less';

const statusColor: Record<string, string> = {
  未填报: '#8c8c8c',
  填报中: '#1677ff',
  已填报: '#13c2c2',
  待审批: '#fa8c16',
  审批通过: '#13c2a3',
  审批不通过: '#ff4d4f',
  已撤回: '#d4b106',
  已关闭: '#8c8c8c',
  未审核: '#9aa0a6',
  审核中: '#fa541c',
  已审核: '#13c2a3',
};

export default function SupplierDataFillPage() {
  const navigate = useNavigate();
  const [records, setRecords] = useState(supplierDataFillRows);
  const [companyName, setCompanyName] = useState('');
  const [status, setStatus] = useState<string>();
  const [appliedName, setAppliedName] = useState('');
  const [appliedStatus, setAppliedStatus] = useState<string>();

  const rows = useMemo(
    () =>
      records.filter(
        row =>
          (!appliedName || row.companyName.includes(appliedName)) &&
          (!appliedStatus || row.applyStatus === appliedStatus),
      ),
    [records, appliedName, appliedStatus],
  );

  const detailPath = (id: number, editable = false) => {
    const path = SupplyChainRefRouteMaps.supplierDataFillInfo.replace(
      ':id',
      String(id),
    );
    return editable ? `${path}?mode=edit&tab=fill` : path;
  };

  const updateStatus = (
    id: number,
    applyStatus: SupplierDataFillRow['applyStatus'],
    successText: string,
  ) => {
    setRecords(current =>
      current.map(record =>
        record.id === id
          ? {
              ...record,
              applyStatus,
              submitTime:
                applyStatus === '待审批'
                  ? '2026-08-13 16:45:00'
                  : record.submitTime,
            }
          : record,
      ),
    );
    message.success(successText);
  };

  const renderActions = (record: SupplierDataFillRow) => {
    if (record.applyStatus === '已关闭') return '-';

    const canFill = [
      '未填报',
      '填报中',
      '已填报',
      '审批不通过',
      '已撤回',
    ].includes(record.applyStatus);
    const canSubmit = ['已填报', '审批不通过', '已撤回'].includes(
      record.applyStatus,
    );
    const canWithdraw = record.applyStatus === '待审批';

    return (
      <Space size={4} wrap>
        {canFill && (
          <Button
            type='link'
            className={styles.actionLink}
            onClick={() => navigate(detailPath(record.id, true))}
          >
            填报
          </Button>
        )}
        {canSubmit && (
          <Button
            type='link'
            className={styles.actionLink}
            onClick={() => updateStatus(record.id, '待审批', '提交成功')}
          >
            提交
          </Button>
        )}
        {canWithdraw && (
          <Button
            type='link'
            className={styles.actionLink}
            onClick={() => updateStatus(record.id, '已撤回', '撤回成功')}
          >
            撤回
          </Button>
        )}
        <Button
          type='link'
          className={styles.actionLink}
          onClick={() => navigate(detailPath(record.id))}
        >
          查看
        </Button>
      </Space>
    );
  };

  return (
    <Page title='供应商数据填报'>
      <div className={styles.filterBar}>
        <Input
          placeholder='客户名称'
          value={companyName}
          onChange={event => setCompanyName(event.target.value)}
          style={{ width: 224 }}
        />
        <Select
          allowClear
          showSearch
          placeholder='填报审批状态'
          value={status}
          onChange={setStatus}
          style={{ width: 224 }}
          options={fillStatusOptions.map(value => ({ label: value, value }))}
        />
        <Space>
          <Button
            type='primary'
            onClick={() => {
              setAppliedName(companyName.trim());
              setAppliedStatus(status);
            }}
          >
            查询
          </Button>
          <Button
            onClick={() => {
              setCompanyName('');
              setStatus(undefined);
              setAppliedName('');
              setAppliedStatus(undefined);
            }}
          >
            重置
          </Button>
        </Space>
      </div>

      <Table
        rowKey='id'
        dataSource={rows}
        scroll={{ x: 1420 }}
        pagination={{ pageSize: 20, showSizeChanger: false }}
        columns={[
          { title: '序号', width: 64, render: (_, __, index) => index + 1 },
          { title: '客户名称', dataIndex: 'companyName', width: 150 },
          { title: '联系人', dataIndex: 'contact', width: 140 },
          { title: '联系方式', dataIndex: 'mobile', width: 140 },
          { title: '任务发起时间', dataIndex: 'applyTime', width: 160 },
          { title: '任务截止日期', dataIndex: 'deadline', width: 140 },
          {
            title: '填报审批状态',
            dataIndex: 'applyStatus',
            width: 140,
            render: value => <Badge color={statusColor[value]} text={value} />,
          },
          {
            title: '数据审核',
            dataIndex: 'auditStatus',
            width: 120,
            render: value => <Badge color={statusColor[value]} text={value} />,
          },
          { title: '提交时间', dataIndex: 'submitTime', width: 160 },
          {
            title: '审批填报',
            fixed: 'right',
            width: 190,
            render: (_, record) => renderActions(record),
          },
        ]}
      />
    </Page>
  );
}
