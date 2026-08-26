/**
 * @description 问卷回复
 */
import { DownloadOutlined } from '@ant-design/icons';
import { Button, Input, Modal, message } from 'antd';
import { useEffect, useMemo, useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';

import { FormActions } from '@/components/FormActions';
import { Page } from '@/components/Page';
import { SupplyChainRefRouteMaps } from '@/router/utils/supplyChainRefEnums';
import { FormFieldInputs } from '@/views/supplyChainCarbon/components/FormFieldInputs';
import { StatusTag } from '@/views/supplyChainCarbon/components/StatusTag';
import { supplierName } from '@/views/supplyChainCarbon/data/demo-data';
import {
  questionnaireDetail,
  rejectQuestionnaireAnswers,
} from '@/views/supplyChainCarbon/data/demo-questionnaires';
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
  const { data, update, ready } = useDemoStore();
  const [selectedSupplierId, setSelectedSupplierId] = useState<number | null>(
    null,
  );
  const [rejectSupplierId, setRejectSupplierId] = useState<number | null>(null);
  const [rejectReason, setRejectReason] = useState('');

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
  const repliedSuppliers = useMemo(
    () => detail?.suppliers.filter(item => item.status !== 'pending') || [],
    [detail],
  );

  useEffect(() => {
    if (selectedSupplierId != null || repliedSuppliers.length === 0) return;
    setSelectedSupplierId(repliedSuppliers[0].id);
  }, [selectedSupplierId, repliedSuppliers]);

  const selectedSupplier = detail?.suppliers.find(
    item => item.id === selectedSupplierId,
  );
  const rejectSupplier = detail?.suppliers.find(
    item => item.id === rejectSupplierId,
  );

  const closeRejectModal = () => {
    setRejectSupplierId(null);
    setRejectReason('');
  };

  const handleReject = () => {
    const reason = rejectReason.trim();
    if (!rejectSupplier || !reason) {
      message.error('请输入驳回原因');
      return;
    }
    update(current =>
      rejectQuestionnaireAnswers(
        current,
        questionnaireId,
        rejectSupplier.id,
        reason,
      ),
    );
    message.success('问卷已驳回，供应商可修改后重新提交');
    closeRejectModal();
  };

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
            {repliedSuppliers.length} 家
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
              const replied = item.status !== 'pending';
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
                    !replied
                      ? styles.questionnaireResponsesSupplierItemDisabled
                      : '',
                  ]
                    .filter(Boolean)
                    .join(' ')}
                  role='button'
                  tabIndex={replied ? 0 : -1}
                  aria-disabled={!replied}
                  onClick={() => {
                    if (replied) setSelectedSupplierId(item.id);
                  }}
                  onKeyDown={event => {
                    if (!replied) return;
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
                        status={item.status}
                        map={SUBMISSION_STATUS_BADGES}
                      />
                      <span>
                        {replied ? formatDate(item.submitted_at) : '-'}
                      </span>
                    </div>
                  </div>
                  {replied && (
                    <div
                      className={styles.questionnaireResponsesSupplierActions}
                    >
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
                        {submitted && (
                          <Button
                            danger
                            type='link'
                            size='small'
                            onClick={event => {
                              event.stopPropagation();
                              setRejectSupplierId(item.id);
                              setRejectReason('');
                            }}
                          >
                            驳回修改
                          </Button>
                        )}
                    </div>
                  )}
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

      <Modal
        title='驳回问卷修改'
        open={rejectSupplierId != null}
        okText='确认驳回'
        cancelText='取消'
        okButtonProps={{ danger: true }}
        onOk={handleReject}
        onCancel={closeRejectModal}
        destroyOnClose
      >
        <div style={{ marginBottom: 12 }}>
          供应商：
          {rejectSupplier?.supplier?.name ||
            (rejectSupplier ? supplierName(data, rejectSupplier.id) : '-')}
        </div>
        <div style={{ marginBottom: 8 }}>
          <span style={{ color: '#ff4d4f' }}>*</span> 驳回原因
        </div>
        <Input.TextArea
          value={rejectReason}
          onChange={event => setRejectReason(event.target.value)}
          placeholder='请输入需要供应商修改的内容及原因'
          maxLength={500}
          showCount
          autoSize={{ minRows: 4, maxRows: 8 }}
        />
      </Modal>

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
