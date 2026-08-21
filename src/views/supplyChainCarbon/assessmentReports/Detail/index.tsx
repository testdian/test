/**
 * @description 碳评估报告详情
 */
import { Button, Card, Col, Progress, Row, Space, Table, Tag } from 'antd';
import { useMemo } from 'react';
import { useNavigate, useParams } from 'react-router-dom';

import { Page } from '@/components/Page';
import { SupplyChainRefRouteMaps } from '@/router/utils/supplyChainRefEnums';
import {
  getTemplateById,
  getTemplateFields,
  supplierName,
} from '@/views/supplyChainCarbon/data/demo-data';
import { useDemoStore } from '@/views/supplyChainCarbon/hooks/useDemoStore';

function fieldLabel(
  data: ReturnType<typeof useDemoStore>['data'],
  templateId: number,
  code: string,
) {
  const template = getTemplateById(data, templateId);
  return getTemplateFields(template).find(field => field.code === code)?.name || code;
}

export default function AssessmentReportDetailPage() {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const reportId = Number(id);
  const { data, ready } = useDemoStore();

  const report = useMemo(
    () => data.formSubmissions.find(item => item.id === reportId),
    [data.formSubmissions, reportId],
  );

  const template = report ? getTemplateById(data, report.template_id) : null;

  if (!ready) return null;
  if (!report) {
    return <Page title='碳评估报告详情'>未找到该碳评估报告</Page>;
  }

  return (
    <Page title={`碳评估报告 · ${report.report_no}`}>
      <p style={{ marginBottom: 16, color: 'rgba(0,0,0,0.65)' }}>
        {report.summary || '依据调研填报数据自动建模生成'}
      </p>

      <Row gutter={16} style={{ marginBottom: 16 }}>
        <Col span={8}>
          <Card title='评估概览'>
            <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
              <div>
                <span style={{ color: 'rgba(0,0,0,0.45)' }}>供应商：</span>
                {supplierName(data, report.supplier_id)}
              </div>
              <div>
                <span style={{ color: 'rgba(0,0,0,0.45)' }}>供应商类别：</span>
                {template?.category || '-'}
              </div>
              <div>
                <span style={{ color: 'rgba(0,0,0,0.45)' }}>关联任务：</span>
                {report.task_name || '-'}
              </div>
              <div>
                <span style={{ color: 'rgba(0,0,0,0.45)' }}>表单模板：</span>
                {template?.name || '-'}
              </div>
              <div>
                <span style={{ color: 'rgba(0,0,0,0.45)' }}>建模版本：</span>
                {report.model_version || '-'}
              </div>
              <div>
                <span style={{ color: 'rgba(0,0,0,0.45)' }}>填报时间：</span>
                {report.submitted_at}
              </div>
              <div>
                <span style={{ color: 'rgba(0,0,0,0.45)' }}>生成时间：</span>
                {report.generated_at || report.submitted_at}
              </div>
              <Space style={{ marginTop: 8 }}>
                <span style={{ fontSize: 28, fontWeight: 600 }}>
                  {report.score}
                </span>
                <span style={{ color: 'rgba(0,0,0,0.45)' }}>分</span>
                <Tag color='success'>{report.grade} 级</Tag>
              </Space>
            </div>
          </Card>
        </Col>
        <Col span={16}>
          <Card title='维度得分'>
            {report.dimension_scores?.length ? (
              <div
                style={{ display: 'flex', flexDirection: 'column', gap: 16 }}
              >
                {report.dimension_scores.map(item => (
                  <div key={item.code}>
                    <div
                      style={{
                        display: 'flex',
                        justifyContent: 'space-between',
                        marginBottom: 4,
                      }}
                    >
                      <span>{item.name}</span>
                      <span style={{ color: 'rgba(0,0,0,0.45)' }}>
                        {item.value} · {item.score} 分
                      </span>
                    </div>
                    <Progress
                      percent={Math.min(item.score, 100)}
                      showInfo={false}
                      strokeColor='#38968A'
                    />
                  </div>
                ))}
              </div>
            ) : (
              <div style={{ color: 'rgba(0,0,0,0.45)' }}>暂无维度得分</div>
            )}
          </Card>
        </Col>
      </Row>

      <Row gutter={16}>
        <Col span={12}>
          <Card title='原始填报数据'>
            <Table
              rowKey='code'
              pagination={false}
              dataSource={Object.entries(report.values).map(
                ([code, value]) => ({
                  code,
                  value: String(value),
                }),
              )}
              columns={[
                {
                  title: '维度字段',
                  dataIndex: 'code',
                  render: code => fieldLabel(data, report.template_id, code),
                },
                { title: '填报值', dataIndex: 'value' },
              ]}
            />
          </Card>
        </Col>
        <Col span={12}>
          <Card title='建模建议'>
            {(report.recommendations || []).length ? (
              <ul style={{ paddingLeft: 20, margin: 0 }}>
                {(report.recommendations || []).map(item => (
                  <li key={item} style={{ marginBottom: 8 }}>
                    {item}
                  </li>
                ))}
              </ul>
            ) : (
              <div style={{ color: 'rgba(0,0,0,0.45)' }}>暂无建议</div>
            )}
          </Card>
        </Col>
      </Row>

      <Button
        style={{ marginTop: 24 }}
        onClick={() => navigate(SupplyChainRefRouteMaps.assessmentReports)}
      >
        返回
      </Button>
    </Page>
  );
}
