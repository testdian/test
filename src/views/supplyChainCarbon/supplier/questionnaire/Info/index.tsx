/**
 * @description 供应商 - 调研填报任务详情
 */
import { useMemo } from 'react';
import { useNavigate, useParams } from 'react-router-dom';

import { FormActions } from '@/components/FormActions';
import { Page } from '@/components/Page';
import { SupplyChainSupplierRouteMaps } from '@/router/utils/supplyChainSupplierEnums';
import { QuestionnaireFormPreview } from '@/views/supplyChainCarbon/components/QuestionnaireFormPreview';
import { getQuestionnaireFields } from '@/views/supplyChainCarbon/data/demo-questionnaires';
import { useDemoStore } from '@/views/supplyChainCarbon/hooks/useDemoStore';
import { useUserRole } from '@/views/supplyChainCarbon/hooks/useUserRole';
import styles from '@/views/supplyChainCarbon/styles.module.less';
import { formatDate } from '@/views/supplyChainCarbon/utils';

export default function SupplierQuestionnaireInfoPage() {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const questionnaireId = Number(id);
  const { supplierId, isLoaded } = useUserRole();
  const { data, ready } = useDemoStore();

  const questionnaire = data.questionnaires.find(
    item =>
      item.id === questionnaireId && item.supplier_ids.includes(supplierId),
  );
  const fields = useMemo(
    () => (questionnaire ? getQuestionnaireFields(data, questionnaire) : []),
    [data, questionnaire],
  );
  const values = questionnaire?.supplier_answers?.[supplierId] || {};

  if (!isLoaded || !ready) return null;

  if (!questionnaire) {
    return (
      <Page title='调研填报任务详情'>
        <div style={{ padding: 32, textAlign: 'center', color: '#999' }}>
          未找到该调研填报任务
        </div>
      </Page>
    );
  }

  return (
    <Page title='调研填报任务详情' wrapperClass='marginBottomFormActionsHeight'>
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
            disabled
          />
        </div>
      </div>

      <FormActions
        place='center'
        buttons={[
          {
            title: '返回',
            onClick: async () =>
              navigate(SupplyChainSupplierRouteMaps.questionnaire),
          },
        ]}
      />
    </Page>
  );
}
