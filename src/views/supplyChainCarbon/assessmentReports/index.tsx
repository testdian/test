/**
 * @description 碳评估报告
 */
import { Button, Card, Input, Select, Space, Table, message } from 'antd';
import { useMemo, useState } from 'react';
import { useNavigate } from 'react-router-dom';

import { Page } from '@/components/Page';
import { TableActions } from '@/components/Table/TableActions';
import { SupplyChainRefRouteMaps } from '@/router/utils/supplyChainRefEnums';
import { buildAssessmentReportPayload } from '@/views/supplyChainCarbon/data/carbon-assessment';
import {
  getTemplateById,
  supplierName,
} from '@/views/supplyChainCarbon/data/demo-data';
import { useDemoStore } from '@/views/supplyChainCarbon/hooks/useDemoStore';
import styles from '@/views/supplyChainCarbon/styles.module.less';
import { usePagination } from '@/views/supplyChainCarbon/utils';

type ReportFilters = {
  reportNo: string;
  supplierName: string;
  grade: string;
};

const defaultFilters: ReportFilters = {
  reportNo: '',
  supplierName: '',
  grade: 'all',
};

export default function AssessmentReportsPage() {
  const navigate = useNavigate();
  const { data, update, ready } = useDemoStore();
  const [filters, setFilters] = useState(defaultFilters);
  const [appliedFilters, setAppliedFilters] = useState(defaultFilters);

  const pendingSubmissions = data.researchSubmissions.filter(
    item => !item.report_id,
  );

  const filteredReports = useMemo(() => {
    return data.formSubmissions.filter(report => {
      if (
        appliedFilters.reportNo &&
        !report.report_no
          .toLowerCase()
          .includes(appliedFilters.reportNo.toLowerCase())
      ) {
        return false;
      }
      if (
        appliedFilters.supplierName &&
        !supplierName(data, report.supplier_id)
          .toLowerCase()
          .includes(appliedFilters.supplierName.toLowerCase())
      ) {
        return false;
      }
      if (
        appliedFilters.grade !== 'all' &&
        report.grade !== appliedFilters.grade
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
  } = usePagination(filteredReports);

  const generateReport = (researchId: number) => {
    const research = data.researchSubmissions.find(
      item => item.id === researchId,
    );
    if (!research) return;

    const template = getTemplateById(data, research.template_id);
    if (!template) {
      message.error('未找到对应表单模板');
      return;
    }

    const payload = buildAssessmentReportPayload({
      supplierId: research.supplier_id,
      template,
      values: research.values,
      taskId: research.task_id,
      taskName: research.task_name,
      existingReports: data.formSubmissions,
      submittedAt: research.submitted_at,
      validUntil: new Date(
        new Date(research.submitted_at).getTime() + 365 * 24 * 60 * 60 * 1000,
      )
        .toISOString()
        .slice(0, 10),
    });

    update(d => {
      const newId = d.nextId.formSub++;
      return {
        ...d,
        formSubmissions: [...d.formSubmissions, { id: newId, ...payload }],
        researchSubmissions: d.researchSubmissions.map(item =>
          item.id === researchId ? { ...item, report_id: newId } : item,
        ),
      };
    });

    message.success('已依据填报数据自动建模并生成碳评估报告');
  };

  return (
    <Page title='碳评估报告'>
      {pendingSubmissions.length > 0 && (
        <Card
          title={`待建模填报（${pendingSubmissions.length}）`}
          className={styles.sectionCard}
        >
          <Table
            rowKey='id'
            pagination={false}
            dataSource={pendingSubmissions}
            columns={[
              { title: '调研任务', dataIndex: 'task_name' },
              {
                title: '供应商',
                render: (_, record) => supplierName(data, record.supplier_id),
              },
              { title: '提交时间', dataIndex: 'submitted_at' },
              {
                title: '操作',
                width: 180,
                render: (_, record) => (
                  <Button
                    size='small'
                    onClick={() => generateReport(record.id)}
                  >
                    自动建模生成报告
                  </Button>
                ),
              },
            ]}
          />
        </Card>
      )}

      <Card title='碳评估报告'>
        <div className={styles.filterBar}>
          <Input
            placeholder='报告编号'
            value={filters.reportNo}
            onChange={e =>
              setFilters(prev => ({ ...prev, reportNo: e.target.value }))
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
            value={filters.grade}
            onChange={v => setFilters(prev => ({ ...prev, grade: v }))}
            style={{ width: 140 }}
            options={[
              { label: '全部等级', value: 'all' },
              ...['A', 'B', 'C', 'D', 'E'].map(grade => ({
                label: `${grade} 级`,
                value: grade,
              })),
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
            { title: '报告编号', dataIndex: 'report_no' },
            {
              title: '供应商',
              render: (_, record) => supplierName(data, record.supplier_id),
            },
            {
              title: '关联任务',
              dataIndex: 'task_name',
              render: v => v || '-',
            },
            {
              title: '生产基地',
              render: (_, record) =>
                String(record.values.production_base ?? '-'),
            },
            {
              title: '产品型号',
              render: (_, record) => String(record.values.product_model ?? '-'),
            },
            {
              title: '评估结果',
              render: (_, record) => `${record.score} 分（${record.grade}）`,
            },
            {
              title: '生成时间',
              render: (_, record) => record.generated_at || record.submitted_at,
            },
            {
              title: '操作',
              width: 120,
              render: (_, record) => (
                <TableActions
                  menus={[
                    {
                      key: 'view',
                      label: '查看报告',
                      onClick: () =>
                        navigate(
                          SupplyChainRefRouteMaps.assessmentReportInfo.replace(
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
      </Card>
    </Page>
  );
}
