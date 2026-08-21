/**
 * @description 调研填报任务
 */
import { Button, Input, Modal, Select, Space, Table, message } from 'antd';
import { useMemo, useState } from 'react';
import { useNavigate } from 'react-router-dom';

import { FormLabelWithNote } from '@/components/ModifyNote';
import { SelectWithNote } from '@/components/ModifyNote/SelectWithNote';
import { Page } from '@/components/Page';
import { TableActions } from '@/components/Table/TableActions';
import { SupplyChainRefRouteMaps } from '@/router/utils/supplyChainRefEnums';
import { StatusTag } from '@/views/supplyChainCarbon/components/StatusTag';
import {
  publishQuestionnaire,
  questionnaireListItem,
} from '@/views/supplyChainCarbon/data/demo-questionnaires';
import { QUESTIONNAIRE_STATUS_BADGES } from '@/views/supplyChainCarbon/data/status-badges';
import { useDemoStore } from '@/views/supplyChainCarbon/hooks/useDemoStore';
import styles from '@/views/supplyChainCarbon/styles.module.less';
import { formatDate, usePagination } from '@/views/supplyChainCarbon/utils';

type QuestionnaireFilters = {
  name: string;
  status: string;
};

const defaultFilters: QuestionnaireFilters = {
  name: '',
  status: 'all',
};

const STATUS_FILTER_NOTE =
  '状态筛选：未发布、已发布、已结束；当任务已到截止日期时，状态自动变为已结束';
const STATUS_OPERATION_NOTE =
  '状态和操作栏对应关系：1、未发布--操作：查看、编辑、删除、发布，2、已发布--操作：查看、查看问卷回复。3、已结束--操作：查看、查看问卷回复。当任务已到截止日期时，状态自动变为已结束。';

export default function QuestionnairePage() {
  const navigate = useNavigate();
  const { data, update, ready } = useDemoStore();
  const [filters, setFilters] = useState(defaultFilters);
  const [appliedFilters, setAppliedFilters] = useState(defaultFilters);
  const [deleteTarget, setDeleteTarget] = useState<{
    id: number;
    name: string;
  } | null>(null);

  const questionnaires = useMemo(() => {
    return data.questionnaires
      .map(questionnaireListItem)
      .filter(q => {
        if (appliedFilters.name && !q.name.includes(appliedFilters.name)) {
          return false;
        }
        if (
          appliedFilters.status !== 'all' &&
          q.status !== appliedFilters.status
        ) {
          return false;
        }
        return true;
      })
      .sort((a, b) => b.id - a.id);
  }, [data.questionnaires, appliedFilters]);

  const {
    paginatedItems,
    currentPage,
    pageSize,
    total,
    setCurrentPage,
    onPageSizeChange,
    resetPage,
  } = usePagination(questionnaires);

  const handlePublish = (id: number) => {
    const source = data.questionnaires.find(q => q.id === id);
    if (!source) return;
    if (!source.template_id) {
      message.error('请先配置表单模板');
      return;
    }
    if (!source.supplier_ids.length) {
      message.error('请至少选择一个供应商');
      return;
    }
    update(d => publishQuestionnaire(d, id, source.supplier_ids));
    message.success('调研填报任务发布成功');
  };

  const handleDelete = () => {
    if (!deleteTarget) return;
    update(d => ({
      ...d,
      questionnaires: d.questionnaires.filter(q => q.id !== deleteTarget.id),
    }));
    message.success('已删除');
    setDeleteTarget(null);
  };

  return (
    <Page
      title='调研填报任务'
      actionBtnChildArr={[
        {
          button: '新增',
          click: () => navigate(SupplyChainRefRouteMaps.questionnaireCreate),
          buttonType: 'primary',
        },
      ]}
    >
      <div className={styles.filterBar}>
        <Input
          placeholder='任务名称'
          value={filters.name}
          onChange={e =>
            setFilters(prev => ({ ...prev, name: e.target.value }))
          }
          style={{ width: 200 }}
        />
        <SelectWithNote
          note={STATUS_FILTER_NOTE}
          value={filters.status}
          onChange={v => setFilters(prev => ({ ...prev, status: v }))}
          style={{ width: 140 }}
          options={[
            { label: '全部状态', value: 'all' },
            { label: '未发布', value: 'draft' },
            { label: '已发布', value: 'published' },
            { label: '已结束', value: 'ended' },
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
            title: <span style={{ whiteSpace: 'nowrap' }}>供应商数量</span>,
            dataIndex: 'supplier_count',
            width: 110,
          },
          {
            title: <span style={{ whiteSpace: 'nowrap' }}>回收答卷数量</span>,
            dataIndex: 'submitted_count',
            width: 120,
          },
          {
            title: (
              <FormLabelWithNote label='状态' note={STATUS_OPERATION_NOTE} />
            ),
            dataIndex: 'status',
            width: 100,
            render: status => (
              <StatusTag status={status} map={QUESTIONNAIRE_STATUS_BADGES} />
            ),
          },
          {
            title: '截止日期',
            dataIndex: 'deadline',
            width: 120,
            render: v => formatDate(v),
          },
          {
            title: (
              <FormLabelWithNote label='操作' note={STATUS_OPERATION_NOTE} />
            ),
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
                        SupplyChainRefRouteMaps.questionnaireInfo.replace(
                          ':id',
                          String(record.id),
                        ),
                      ),
                  },
                  ...(record.status === 'draft'
                    ? [
                        {
                          key: 'edit',
                          label: '编辑',
                          onClick: () =>
                            navigate(
                              SupplyChainRefRouteMaps.questionnaireEdit.replace(
                                ':id',
                                String(record.id),
                              ),
                            ),
                        },
                        {
                          key: 'delete',
                          label: '删除',
                          onClick: () =>
                            setDeleteTarget({
                              id: record.id,
                              name: record.name,
                            }),
                        },
                        {
                          key: 'publish',
                          label: '发布',
                          onClick: () => handlePublish(record.id),
                        },
                      ]
                    : []),
                  ...(record.status === 'published' || record.status === 'ended'
                    ? [
                        {
                          key: 'responses',
                          label: '查看问卷回复',
                          onClick: () =>
                            navigate(
                              SupplyChainRefRouteMaps.questionnaireResponses.replace(
                                ':id',
                                String(record.id),
                              ),
                            ),
                        },
                      ]
                    : []),
                ]}
              />
            ),
          },
        ]}
      />

      <Modal
        title='删除调研填报任务'
        open={deleteTarget != null}
        onOk={handleDelete}
        onCancel={() => setDeleteTarget(null)}
        okText='确定删除'
        okButtonProps={{ danger: true }}
      >
        确定要删除调研填报任务「{deleteTarget?.name}」吗？此操作不可撤销。
      </Modal>
    </Page>
  );
}
