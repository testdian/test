/**
 * @description 问卷回复
 */
import { DownloadOutlined } from '@ant-design/icons';
import { Button } from 'antd';
import { useEffect, useMemo, useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';

import { FormActions } from '@/components/FormActions';
import { Page } from '@/components/Page';
import { SupplyChainRefRouteMaps } from '@/router/utils/supplyChainRefEnums';
import { FormFieldInputs } from '@/views/supplyChainCarbon/components/FormFieldInputs';
import { StatusTag } from '@/views/supplyChainCarbon/components/StatusTag';
import { supplierName } from '@/views/supplyChainCarbon/data/demo-data';
import { questionnaireDetail } from '@/views/supplyChainCarbon/data/demo-questionnaires';
import {
  downloadAllSupplierQuestionnaireExcels,
  downloadSupplierQuestionnaireExcel,
} from '@/views/supplyChainCarbon/data/questionnaire-export';
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

  const submittedSuppliers = useMemo(
    () => detail?.suppliers.filter(item => item.status === 'submitted') || [],
    [detail],
  );

  useEffect(() => {
    if (selectedSupplierId != null || submittedSuppliers.length === 0) return;
    setSelectedSupplierId(submittedSuppliers[0].id);
  }, [selectedSupplierId, submittedSuppliers]);

  const selectedSupplier = detail?.suppliers.find(
    item => item.id === selectedSupplierId,
  );

  if (!ready) return null;
  if (!detail) {
    return <Page title='查看问卷回复'>未找到该调研填报任务</Page>;
  }

  const exportPayload = (item: (typeof detail.suppliers)[number]) => ({
    taskName: detail.name,
    supplierName: item.supplier?.name || supplierName(data, item.id),
    organization: detail.organization,
    deadline: detail.deadline,
    submittedAt: item.submitted_at,
    fields: detail.form_fields,
    answers: item.answers || {},
  });

  return (
    <Page title='查看问卷回复' wrapperClass='marginBottomFormActionsHeight'>
      <div className={styles.questionnaireResponsesSummary}>
        <div className={styles.questionnaireResponsesTitle}>{detail.name}</div>
        <div className={styles.questionnaireResponsesSummaryActions}>
          <div className={styles.questionnaireResponsesMeta}>
            共 {detail.suppliers.length} 家供应商，已回复{' '}
            {submittedSuppliers.length} 家
          </div>
          <Button
            icon={<DownloadOutlined />}
            disabled={submittedSuppliers.length === 0}
            onClick={() =>
              downloadAllSupplierQuestionnaireExcels(
                submittedSuppliers.map(exportPayload),
              )
            }
          >
            批量导出
          </Button>
        </div>
      </div>

      <div className={styles.questionnaireResponsesLayout}>
        <aside className={styles.questionnaireResponsesSidebar}>
          <div className={styles.questionnaireResponsesSidebarHeader}>
            供应商回复列表
          </div>
          <div className={styles.questionnaireResponsesSupplierList}>
            {detail.suppliers.map((item, index) => {
              const submitted = item.status === 'submitted';
              const active = selectedSupplierId === item.id;
              const currentSupplierName =
                item.supplier?.name || supplierName(data, item.id);
              return (
                <div
                  key={item.id}
                  className={[
                    styles.questionnaireResponsesSupplierItem,
                    active
                      ? styles.questionnaireResponsesSupplierItemActive
                      : '',
                    !submitted
                      ? styles.questionnaireResponsesSupplierItemDisabled
                      : '',
                  ]
                    .filter(Boolean)
                    .join(' ')}
                  role='button'
                  tabIndex={submitted ? 0 : -1}
                  aria-disabled={!submitted}
                  onClick={() => {
                    if (submitted) setSelectedSupplierId(item.id);
                  }}
                  onKeyDown={event => {
                    if (!submitted) return;
                    if (event.key === 'Enter' || event.key === ' ') {
                      event.preventDefault();
                      setSelectedSupplierId(item.id);
                    }
                  }}
                >
                  <div className={styles.questionnaireResponsesSupplierMain}>
                    <span
                      className={styles.questionnaireResponsesSupplierIndex}
                    >
                      {index + 1}
                    </span>
                    <span className={styles.questionnaireResponsesSupplierName}>
                      {currentSupplierName}
                    </span>
                  </div>
                  <div className={styles.questionnaireResponsesSupplierMeta}>
                    <div
                      className={styles.questionnaireResponsesSupplierStatus}
                    >
                      <StatusTag
                        status={submitted ? 'submitted' : 'pending'}
                        map={SUBMISSION_STATUS_BADGES}
                      />
                      <span>
                        {submitted ? formatDate(item.submitted_at) : '-'}
                      </span>
                    </div>
                    {submitted && (
                      <Button
                        type='link'
                        size='small'
                        icon={<DownloadOutlined />}
                        className={styles.questionnaireResponsesExportButton}
                        onClick={event => {
                          event.stopPropagation();
                          downloadSupplierQuestionnaireExcel(
                            exportPayload(item),
                          );
                        }}
                      >
                        导出
                      </Button>
                    )}
                  </div>
                </div>
              );
            })}
          </div>
        </aside>

        <section className={styles.questionnaireResponsesDetail}>
          <div className={styles.questionnaireResponsesDetailHeader}>
            <div className={styles.sectionTitle}>回复详情</div>
            {selectedSupplier && (
              <div className={styles.questionnaireResponsesSelectedSupplier}>
                <span>
                  {selectedSupplier.supplier?.name ||
                    supplierName(data, selectedSupplier.id)}
                </span>
                <span>
                  提交时间：{formatDate(selectedSupplier.submitted_at)}
                </span>
              </div>
            )}
          </div>

          {selectedSupplier ? (
            <div className={styles.questionnaireResponsesForm}>
              <FormFieldInputs
                fields={detail.form_fields}
                sections={detail.form_sections}
                values={selectedSupplier.answers || {}}
                readOnly
              />
            </div>
          ) : (
            <div className={styles.questionnaireResponsesEmpty}>
              暂无已提交的供应商回复
            </div>
          )}
        </section>
      </div>

      <FormActions
        place='center'
        buttons={[
          {
            title: '返回',
            onClick: async () =>
              navigate(
                SupplyChainRefRouteMaps.questionnaireInfo.replace(
                  ':id',
                  String(questionnaireId),
                ),
              ),
          },
        ]}
      />
    </Page>
  );
}
