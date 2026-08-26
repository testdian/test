/**
 * @description 供应商 - 调研填报
 */
import { message } from 'antd';
import { useEffect, useMemo, useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';

import { FormActions } from '@/components/FormActions';
import { Page } from '@/components/Page';
import { SupplyChainSupplierRouteMaps } from '@/router/utils/supplyChainSupplierEnums';
import { QuestionnaireFormPreview } from '@/views/supplyChainCarbon/components/QuestionnaireFormPreview';
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
  const submitStatus = questionnaire?.supplier_status[supplierId] || 'pending';

  const canFill =
    questionnaire &&
    questionnaire.supplier_ids.includes(supplierId) &&
    ((displayStatus === 'published' && submitStatus === 'pending') ||
      submitStatus === 'rejected');

  useEffect(() => {
    if (!questionnaire) return;
    setValues(questionnaire.supplier_answers?.[supplierId] || {});
  }, [questionnaire, supplierId]);

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
        <div className={styles.fieldEditorPreview}>
          <QuestionnaireFormPreview
            title={questionnaire.name}
            organization={questionnaire.organization}
            deadline={formatDate(questionnaire.deadline)}
            description={questionnaire.description}
            fields={fields}
            sections={questionnaire.form_sections}
            values={values}
            emptyText='请联系企业管理员配置专属表单模板。'
            onChange={(code, value) =>
              setValues(prev => ({ ...prev, [code]: value }))
            }
          />
        </div>
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
