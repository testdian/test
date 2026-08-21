/**
 * @description 问卷回复
 */
import { DownloadOutlined } from '@ant-design/icons';
import { Button, Col, Row, Space, Table, message } from 'antd';
import { useMemo, useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';

import { Page } from '@/components/Page';
import { TableActions } from '@/components/Table/TableActions';
import { SupplyChainRefRouteMaps } from '@/router/utils/supplyChainRefEnums';
import { FormFieldInputs } from '@/views/supplyChainCarbon/components/FormFieldInputs';
import { StatusTag } from '@/views/supplyChainCarbon/components/StatusTag';
import { supplierName } from '@/views/supplyChainCarbon/data/demo-data';
import { questionnaireDetail } from '@/views/supplyChainCarbon/data/demo-questionnaires';
import { SUBMISSION_STATUS_BADGES } from '@/views/supplyChainCarbon/data/status-badges';
import { useDemoStore } from '@/views/supplyChainCarbon/hooks/useDemoStore';
import styles from '@/views/supplyChainCarbon/styles.module.less';
import { formatDate } from '@/views/supplyChainCarbon/utils';

export default function QuestionnaireResponsesPage() {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const questionnaireId = Number(id);
  const { data, ready } = useDemoStore();
  const [selectedSupplierId, setSelectedSupplierId] = useState<number | null>(
    null,
  );

  const detail = useMemo(() => {
    const source = data.questionnaires.find(
      item => item.id === questionnaireId,
    );
    if (!source) return null;
    return questionnaireDetail(data, source);
  }, [data, questionnaireId]);

  const selectedSupplier = detail?.suppliers.find(
    item => item.id === selectedSupplierId,
  );

  const submittedSuppliers =
    detail?.suppliers.filter(item => item.status === 'submitted') || [];

  const handleExport = () => {
    message.info('导出功能开发中');
  };

  if (!ready) return null;
  if (!detail) {
    return <Page title='查看问卷回复'>未找到该调研填报任务</Page>;
  }

  return (
    <Page title='查看问卷回复'>
      <div style={{ marginBottom: 16 }}>
        <Button
          type='link'
          style={{ paddingLeft: 0 }}
          onClick={() =>
            navigate(
              SupplyChainRefRouteMaps.questionnaireInfo.replace(
                ':id',
                String(questionnaireId),
              ),
            )
          }
        >
          返回任务详情
        </Button>
      </div>

      <div style={{ marginBottom: 16 }}>
        <div style={{ fontSize: 16, fontWeight: 500 }}>{detail.name}</div>
        <div style={{ marginTop: 4, color: 'rgba(0,0,0,0.45)' }}>
          共 {detail.suppliers.length} 家供应商，已回复{' '}
          {submittedSuppliers.length} 家
        </div>
      </div>

      <Space style={{ marginBottom: 16 }}>
        <Button
          icon={<DownloadOutlined />}
          disabled={submittedSuppliers.length === 0}
          onClick={handleExport}
        >
          导出全部已回复（{submittedSuppliers.length}）
        </Button>
      </Space>

      <Row gutter={16}>
        <Col span={14}>
          <div className={styles.pageSection}>
            <div className={styles.sectionTitle}>供应商回复列表</div>
            <Table
              rowKey='id'
              pagination={false}
              dataSource={detail.suppliers}
              rowClassName={record =>
                selectedSupplierId === record.id ? 'ant-table-row-selected' : ''
              }
              columns={[
                {
                  title: '序号',
                  width: 64,
                  render: (_, __, index) => index + 1,
                },
                {
                  title: '供应商',
                  render: (_, record) =>
                    record.supplier?.name || supplierName(data, record.id),
                },
                {
                  title: '提交状态',
                  dataIndex: 'status',
                  render: status => (
                    <StatusTag
                      status={status === 'submitted' ? 'submitted' : 'pending'}
                      map={SUBMISSION_STATUS_BADGES}
                    />
                  ),
                },
                {
                  title: '提交时间',
                  dataIndex: 'submitted_at',
                  render: v => formatDate(v),
                },
                {
                  title: '操作',
                  width: 160,
                  render: (_, record) =>
                    record.status === 'submitted' ? (
                      <TableActions
                        menus={[
                          {
                            key: 'detail',
                            label: '查看详情',
                            onClick: () => setSelectedSupplierId(record.id),
                          },
                          {
                            key: 'export',
                            label: '导出 Excel',
                            onClick: handleExport,
                          },
                        ]}
                      />
                    ) : (
                      '-'
                    ),
                },
              ]}
            />
          </div>
        </Col>
        <Col span={10}>
          <div className={styles.pageSection}>
            <div className={styles.sectionTitle}>回复详情</div>
            {selectedSupplier ? (
              <div>
                <div
                  style={{
                    display: 'flex',
                    justifyContent: 'space-between',
                    marginBottom: 16,
                  }}
                >
                  <div>
                    <div style={{ fontWeight: 500 }}>
                      {selectedSupplier.supplier?.name ||
                        supplierName(data, selectedSupplier.id)}
                    </div>
                    <div style={{ fontSize: 13, color: 'rgba(0,0,0,0.45)' }}>
                      提交时间：{formatDate(selectedSupplier.submitted_at)}
                    </div>
                  </div>
                  <Button
                    size='small'
                    icon={<DownloadOutlined />}
                    onClick={handleExport}
                  >
                    导出
                  </Button>
                </div>
                <FormFieldInputs
                  fields={detail.form_fields}
                  sections={detail.form_sections}
                  values={selectedSupplier.answers || {}}
                  readOnly
                />
              </div>
            ) : (
              <div
                style={{
                  padding: 48,
                  textAlign: 'center',
                  color: 'rgba(0,0,0,0.45)',
                }}
              >
                请在左侧选择已提交的供应商查看回复详情
              </div>
            )}
          </div>
        </Col>
      </Row>
    </Page>
  );
}
