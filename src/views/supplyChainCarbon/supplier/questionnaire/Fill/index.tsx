/**
 * @description 供应商 - 调研填报
 */
import { Form, message } from 'antd';
import { useMemo, useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';

import { FormActions } from '@/components/FormActions';
import { Page } from '@/components/Page';
import { SupplyChainSupplierRouteMaps } from '@/router/utils/supplyChainSupplierEnums';
import { FormFieldInputs } from '@/views/supplyChainCarbon/components/FormFieldInputs';
import {
  getQuestionnaireFields,
  resolveQuestionnaireStatus,
  submitQuestionnaireAnswers,
} from '@/views/supplyChainCarbon/data/demo-questionnaires';
import { useDemoStore } from '@/views/supplyChainCarbon/hooks/useDemoStore';
import { useUserRole } from '@/views/supplyChainCarbon/hooks/useUserRole';
import styles from '@/views/supplyChainCarbon/styles.module.less';
import { formatDate } from '@/views/supplyChainCarbon/utils';

export default function SupplierQuestionnaireFillPage() {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const questionnaireId = Number(id);
  const { supplierId } = useUserRole();
  const { data, update, ready } = useDemoStore();
  const [values, setValues] = useState<Record<string, string | number>>({});
  const [submitting, setSubmitting] = useState(false);

  const questionnaire = data.questionnaires.find(
    item => item.id === questionnaireId,
  );

  const fields = useMemo(
    () => (questionnaire ? getQuestionnaireFields(data, questionnaire) : []),
    [data, questionnaire],
  );

  const displayStatus = questionnaire
    ? resolveQuestionnaireStatus(questionnaire)
    : null;

  const canFill =
    questionnaire &&
    displayStatus === 'published' &&
    questionnaire.supplier_ids.includes(supplierId) &&
    (questionnaire.supplier_status[supplierId] || 'pending') !== 'submitted';

  const handleSubmit = async () => {
    if (!questionnaire || !canFill) return;
    const missing = fields.filter(
      field => field.required && !String(values[field.code] ?? '').trim(),
    );
    if (missing.length) {
      message.error(
        `请填写必填项：${missing.map(field => field.name).join('、')}`,
      );
      return;
    }
    setSubmitting(true);
    try {
      update(d =>
        submitQuestionnaireAnswers(d, questionnaireId, supplierId, values),
      );
      message.success(
        '专属数据填报已提交，企业将依据数据自动建模生成碳评估报告',
      );
      navigate(SupplyChainSupplierRouteMaps.questionnaire);
    } finally {
      setSubmitting(false);
    }
  };

  if (!ready) return null;

  if (!questionnaire) {
    return <Page title='调研填报'>未找到该调研填报任务</Page>;
  }

  if (!canFill) {
    return (
      <Page title='调研填报'>
        <div style={{ padding: 32, textAlign: 'center', color: '#999' }}>
          当前任务不可填报，可能已提交、已结束或未向您下发。
        </div>
      </Page>
    );
  }

  return (
    <Page title='专属数据填报' wrapperClass='marginBottomFormActionsHeight'>
      <div className={styles.pageSection}>
        <div className={styles.sectionTitle}>{questionnaire.name}</div>
        {questionnaire.description && (
          <p className={styles.formHint}>{questionnaire.description}</p>
        )}
        <div className={styles.detailGrid} style={{ marginBottom: 24 }}>
          <div className={styles.detailItem}>
            <span className={styles.detailLabel}>所属组织</span>
            <span className={styles.detailValue}>
              {questionnaire.organization || '-'}
            </span>
          </div>
          <div className={styles.detailItem}>
            <span className={styles.detailLabel}>截止日期</span>
            <span className={styles.detailValue}>
              {formatDate(questionnaire.deadline)}
            </span>
          </div>
        </div>

        {fields.length === 0 ? (
          <p style={{ color: 'rgba(0,0,0,0.45)' }}>
            请联系企业管理员配置专属表单模板。
          </p>
        ) : (
          <Form layout='vertical'>
            <FormFieldInputs
              fields={fields}
              values={values}
              onChange={(code, value) =>
                setValues(prev => ({ ...prev, [code]: value }))
              }
            />
          </Form>
        )}
      </div>

      <FormActions
        place='center'
        buttons={[
          {
            title: '取消',
            onClick: async () =>
              navigate(SupplyChainSupplierRouteMaps.questionnaire),
          },
          {
            title: '提交填报',
            type: 'primary',
            loading: submitting,
            disabled: fields.length === 0,
            onClick: async () => handleSubmit(),
          },
        ]}
      />
    </Page>
  );
}
