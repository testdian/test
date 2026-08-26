/**
 * @description 供应商 - 调研填报任务
 */
import { Button, Input, Modal, Select, Space, Table } from 'antd';
import { useMemo, useState } from 'react';
import { useNavigate } from 'react-router-dom';

import { Page } from '@/components/Page';
import { TableActions } from '@/components/Table/TableActions';
import { SupplyChainSupplierRouteMaps } from '@/router/utils/supplyChainSupplierEnums';
import { StatusTag } from '@/views/supplyChainCarbon/components/StatusTag';
import {
  latestQuestionnaireRejection,
  questionnaireListItem,
  resolveQuestionnaireStatus,
} from '@/views/supplyChainCarbon/data/demo-questionnaires';
import {
  QUESTIONNAIRE_SUBMIT_STATUS_BADGES,
  SUPPLIER_QUESTIONNAIRE_STATUS_BADGES,
} from '@/views/supplyChainCarbon/data/status-badges';
import { useDemoStore } from '@/views/supplyChainCarbon/hooks/useDemoStore';
import { useUserRole } from '@/views/supplyChainCarbon/hooks/useUserRole';
import styles from '@/views/supplyChainCarbon/styles.module.less';
import { formatDate, usePagination } from '@/views/supplyChainCarbon/utils';

export default function SupplierQuestionnairePage() {
  const navigate = useNavigate();
  const { supplierId, isLoaded } = useUserRole();
  const { data, ready } = useDemoStore();
  const [name, setName] = useState('');
  const [taskStatus, setTaskStatus] = useState('all');
  const [submitStatus, setSubmitStatus] = useState('all');
  const [applied, setApplied] = useState({
    name: '',
    taskStatus: 'all',
    submitStatus: 'all',
  });

  const questionnaires = useMemo(() => {
    if (supplierId <= 0) return [];
    return data.questionnaires
      .filter(q => {
        const status = resolveQuestionnaireStatus(q);
        return status !== 'draft' && q.supplier_ids.includes(supplierId);
      })
      .map(q => ({
        ...questionnaireListItem(q),
        submit_status: q.supplier_status[supplierId] || 'pending',
        latest_rejection: latestQuestionnaireRejection(q, supplierId),
      }))
      .filter(q => {
        if (applied.name && !q.name.includes(applied.name)) return false;
        if (applied.taskStatus !== 'all' && q.status !== applied.taskStatus) {
          return false;
        }
        if (
          applied.submitStatus !== 'all' &&
          q.submit_status !== applied.submitStatus
        ) {
          return false;
        }
        return true;
      })
      .sort((a, b) => b.id - a.id);
  }, [data.questionnaires, supplierId, applied]);

  const {
    paginatedItems,
    currentPage,
    pageSize,
    total,
    setCurrentPage,
    onPageSizeChange,
    resetPage,
  } = usePagination(questionnaires);

  if (!isLoaded || !ready) return null;

  return (
    <Page title='调研填报任务'>
      <div className={styles.filterBar}>
        <Input
          placeholder='任务名称'
          value={name}
          onChange={e => setName(e.target.value)}
          style={{ width: 200 }}
        />
        <Select
          value={taskStatus}
          onChange={setTaskStatus}
          style={{ width: 140 }}
          options={[
            { label: '全部状态', value: 'all' },
            { label: '进行中', value: 'published' },
            { label: '已结束', value: 'ended' },
          ]}
        />
        <Select
          value={submitStatus}
          onChange={setSubmitStatus}
          style={{ width: 140 }}
          options={[
            { label: '全部提交状态', value: 'all' },
            { label: '待填写', value: 'pending' },
            { label: '已提交', value: 'submitted' },
            { label: '已驳回', value: 'rejected' },
          ]}
        />
        <Space>
          <Button
            type='primary'
            onClick={() => {
              setApplied({
                name: name.trim(),
                taskStatus,
                submitStatus,
              });
              resetPage();
            }}
          >
            查询
          </Button>
          <Button
            onClick={() => {
              setName('');
              setTaskStatus('all');
              setSubmitStatus('all');
              setApplied({ name: '', taskStatus: 'all', submitStatus: 'all' });
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
            title: '序号',
            width: 64,
            render: (_, __, index) => (currentPage - 1) * pageSize + index + 1,
          },
          { title: '任务名称', dataIndex: 'name', ellipsis: true },
          {
            title: '所属组织',
            dataIndex: 'organization',
            render: v => v || '-',
          },
          {
            title: '任务状态',
            dataIndex: 'status',
            width: 100,
            render: s => (
              <StatusTag
                status={s}
                map={SUPPLIER_QUESTIONNAIRE_STATUS_BADGES}
              />
            ),
          },
          {
            title: '提交状态',
            dataIndex: 'submit_status',
            width: 100,
            render: s => (
              <StatusTag status={s} map={QUESTIONNAIRE_SUBMIT_STATUS_BADGES} />
            ),
          },
          {
            title: '截止日期',
            dataIndex: 'deadline',
            width: 120,
            render: v => formatDate(v),
          },
          {
            title: '操作',
            fixed: 'right',
            width: 260,
            render: (_, record) => (
              <TableActions
                menus={[
                  {
                    key: 'view',
                    label: '查看',
                    onClick: () =>
                      navigate(
                        SupplyChainSupplierRouteMaps.questionnaireInfo.replace(
                          ':id',
                          String(record.id),
                        ),
                      ),
                  },
                  ...((record.status === 'published' &&
                    record.submit_status === 'pending') ||
                  record.submit_status === 'rejected'
                    ? [
                        {
                          key: 'fill',
                          label: '填报',
                          onClick: () =>
                            navigate(
                              SupplyChainSupplierRouteMaps.questionnaireFill.replace(
                                ':id',
                                String(record.id),
                              ),
                            ),
                        },
                      ]
                    : []),
                  ...(record.submit_status === 'rejected' &&
                  record.latest_rejection
                    ? [
                        {
                          key: 'rejection-reason',
                          label: '查看驳回原因',
                          onClick: () =>
                            Modal.info({
                              title: '查看驳回原因',
                              okText: '知道了',
                              content: (
                                <div>
                                  <div style={{ marginBottom: 8 }}>
                                    {record.latest_rejection.reason}
                                  </div>
                                  <div style={{ color: '#8c8c8c' }}>
                                    驳回时间：
                                    {formatDate(
                                      record.latest_rejection.rejected_at,
                                    )}
                                  </div>
                                </div>
                              ),
                            }),
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
