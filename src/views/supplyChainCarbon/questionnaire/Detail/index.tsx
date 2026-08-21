/**
 * @description 调研任务详情
 */
import { Button, Space, Tabs, Table } from 'antd';
import { useMemo } from 'react';
import { useNavigate, useParams } from 'react-router-dom';

import { Page } from '@/components/Page';
import { SupplyChainRefRouteMaps } from '@/router/utils/supplyChainRefEnums';
import { FormFieldPreview } from '@/views/supplyChainCarbon/components/FormFieldPreview';
import { StatusTag } from '@/views/supplyChainCarbon/components/StatusTag';
import { questionnaireDetail, resolveQuestionnaireStatus } from '@/views/supplyChainCarbon/data/demo-questionnaires';
import {
  QUESTIONNAIRE_STATUS_BADGES,
  SUBMISSION_STATUS_BADGES,
} from '@/views/supplyChainCarbon/data/status-badges';
import { useDemoStore } from '@/views/supplyChainCarbon/hooks/useDemoStore';
import styles from '@/views/supplyChainCarbon/styles.module.less';
import { formatDate } from '@/views/supplyChainCarbon/utils';

export default function QuestionnaireDetailPage() {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const questionnaireId = Number(id);
  const { data, ready } = useDemoStore();

  const questionnaire = useMemo(
    () => data.questionnaires.find(q => q.id === questionnaireId),
    [data.questionnaires, questionnaireId],
  );

  const detail = useMemo(() => {
    if (!questionnaire) return null;
    return questionnaireDetail(data, questionnaire);
  }, [data, questionnaire]);

  const displayStatus = questionnaire
    ? resolveQuestionnaireStatus(questionnaire)
    : null;

  if (!ready) return null;
  if (!questionnaire || !detail || !displayStatus) {
    return <Page title='调研任务详情'>未找到该任务</Page>;
  }

  return (
    <Page title={detail.name}>
      <div className={styles.detailHeader}>
        <p className={styles.detailMeta} style={{ marginBottom: 0 }}>
          {detail.description || '暂无任务说明'}
        </p>
        <Space>
          <StatusTag
            status={displayStatus}
            map={QUESTIONNAIRE_STATUS_BADGES}
          />
          {(displayStatus === 'published' || displayStatus === 'ended') && (
            <Button
              onClick={() =>
                navigate(
                  SupplyChainRefRouteMaps.questionnaireResponses.replace(
                    ':id',
                    String(questionnaire.id),
                  ),
                )
              }
            >
              查看问卷回复
            </Button>
          )}
          {displayStatus === 'draft' && (
            <Button
              type='primary'
              onClick={() =>
                navigate(
                  SupplyChainRefRouteMaps.questionnaireEdit.replace(
                    ':id',
                    String(questionnaire.id),
                  ),
                )
              }
            >
              编辑
            </Button>
          )}
        </Space>
      </div>

      <div className={styles.detailGrid} style={{ marginBottom: 24 }}>
        <div className={styles.detailItem}>
          <span className={styles.detailLabel}>所属组织</span>
          <span className={styles.detailValue}>
            {detail.organization || '-'}
          </span>
        </div>
        <div className={styles.detailItem}>
          <span className={styles.detailLabel}>截止日期</span>
          <span className={styles.detailValue}>
            {formatDate(detail.deadline)}
          </span>
        </div>
        <div className={styles.detailItem}>
          <span className={styles.detailLabel}>字段数</span>
          <span className={styles.detailValue}>{detail.field_count}</span>
        </div>
        <div className={styles.detailItem}>
          <span className={styles.detailLabel}>已回复 / 供应商数</span>
          <span className={styles.detailValue}>
            {detail.submitted_count} / {detail.supplier_count}
          </span>
        </div>
      </div>

      <Tabs
        items={[
          {
            key: 'fields',
            label: '填报字段',
            children: (
              <>
                <div style={{ marginBottom: 16 }}>
                  <div style={{ fontWeight: 500, marginBottom: 4 }}>
                    引用模板
                  </div>
                  <div style={{ color: 'rgba(0,0,0,0.65)' }}>
                    {detail.template_name || '未引用表单模板'}
                  </div>
                </div>
                <FormFieldPreview
                  fields={detail.form_fields}
                  sections={
                    detail.form_sections?.length
                      ? detail.form_sections.map(section => ({
                          ...section,
                          fields: detail.form_fields.filter(
                            field => field.sectionId === section.id,
                          ),
                        }))
                      : undefined
                  }
                />
              </>
            ),
          },
          {
            key: 'suppliers',
            label: '供应商列表',
            children: (
              <Table
                rowKey='id'
                pagination={false}
                dataSource={detail.suppliers}
                columns={[
                  {
                    title: '序号',
                    width: 64,
                    render: (_, __, index) => index + 1,
                  },
                  {
                    title: '供应商名称',
                    render: (_, record) => record.supplier?.name || '-',
                  },
                  {
                    title: '提交状态',
                    dataIndex: 'status',
                    render: status => (
                      <StatusTag
                        status={
                          status === 'submitted' ? 'submitted' : 'pending'
                        }
                        map={SUBMISSION_STATUS_BADGES}
                      />
                    ),
                  },
                ]}
              />
            ),
          },
        ]}
      />

      <Button
        className={styles.pageFooterActions}
        onClick={() => navigate(SupplyChainRefRouteMaps.questionnaire)}
      >
        返回
      </Button>
    </Page>
  );
}
