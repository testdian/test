import type {
  DemoData,
  DemoQuestionnaire,
  FormField,
  FormTemplate,
} from './demo-data';
import {
  cloneTemplateFormStructure,
  getTemplateFields,
  supplierName,
} from './demo-data';

export type QuestionnaireDisplayStatus = DemoQuestionnaire['status'];

function isQuestionnaireDeadlinePassed(deadline?: string | null): boolean {
  if (!deadline) return false;
  const today = new Date();
  today.setHours(0, 0, 0, 0);
  const deadlineDate = new Date(deadline);
  deadlineDate.setHours(23, 59, 59, 999);
  return today > deadlineDate;
}

export function resolveQuestionnaireStatus(
  questionnaire: DemoQuestionnaire,
): QuestionnaireDisplayStatus {
  if (questionnaire.status === 'draft') return 'draft';
  if (questionnaire.status === 'ended') return 'ended';
  if (
    questionnaire.status === 'published' &&
    isQuestionnaireDeadlinePassed(questionnaire.deadline)
  ) {
    return 'ended';
  }
  return questionnaire.status;
}

export function questionnaireListItem(q: DemoQuestionnaire) {
  const submitted_count = Object.values(q.supplier_status).filter(
    s => s === 'submitted',
  ).length;
  const status = resolveQuestionnaireStatus(q);
  return {
    id: q.id,
    name: q.name,
    description: q.description,
    organization: q.organization,
    deadline: q.deadline,
    status,
    created_at: q.created_at,
    template_id: q.template_id,
    template_name: q.template_name,
    supplier_count: q.supplier_ids.length,
    field_count: (q.form_fields || []).length,
    question_count: (q.form_fields || []).length,
    submitted_count,
  };
}

export function latestQuestionnaireRejection(
  questionnaire: DemoQuestionnaire,
  supplierId: number,
) {
  const records = questionnaire.supplier_rejections?.[supplierId] || [];
  return records[records.length - 1] || null;
}

export function questionnaireDetail(data: DemoData, q: DemoQuestionnaire) {
  return {
    ...questionnaireListItem(q),
    form_fields: q.form_fields || [],
    form_sections: q.form_sections || [],
    suppliers: q.supplier_ids.map(supplierId => ({
      id: supplierId,
      status: q.supplier_status[supplierId] || 'pending',
      submitted_at:
        q.supplier_status[supplierId] !== 'pending' ? q.created_at : null,
      supplier: { id: supplierId, name: supplierName(data, supplierId) },
      answers: q.supplier_answers?.[supplierId] || {},
      latest_rejection: latestQuestionnaireRejection(q, supplierId),
    })),
  };
}

export function rejectQuestionnaireAnswers(
  data: DemoData,
  questionnaireId: number,
  supplierId: number,
  reason: string,
): DemoData {
  const rejectedAt = new Date().toISOString();
  return {
    ...data,
    questionnaires: data.questionnaires.map(questionnaire => {
      if (
        questionnaire.id !== questionnaireId ||
        questionnaire.supplier_status[supplierId] !== 'submitted'
      ) {
        return questionnaire;
      }
      const history = questionnaire.supplier_rejections?.[supplierId] || [];
      return {
        ...questionnaire,
        supplier_status: {
          ...questionnaire.supplier_status,
          [supplierId]: 'rejected' as const,
        },
        supplier_rejections: {
          ...questionnaire.supplier_rejections,
          [supplierId]: [
            ...history,
            {
              reason,
              rejected_at: rejectedAt,
              rejected_by: '管理员',
            },
          ],
        },
      };
    }),
  };
}

export function upsertQuestionnaireBasic(
  data: DemoData,
  id: number | null,
  basic: {
    name: string;
    organization: string;
    deadline: string | null;
    description: string;
  },
): { data: DemoData; questionnaireId: number } {
  const payload = {
    name: basic.name,
    organization: basic.organization || null,
    deadline: basic.deadline,
    description: basic.description || null,
  };

  if (id) {
    return {
      questionnaireId: id,
      data: {
        ...data,
        questionnaires: data.questionnaires.map(q =>
          q.id === id ? { ...q, ...payload } : q,
        ),
      },
    };
  }

  const newId = data.nextId.questionnaire;
  const newQuestionnaire: DemoQuestionnaire = {
    id: newId,
    ...payload,
    status: 'draft',
    created_at: new Date().toISOString().slice(0, 10),
    template_id: null,
    template_name: null,
    form_fields: [],
    supplier_ids: [],
    supplier_status: {},
    supplier_answers: {},
  };

  return {
    questionnaireId: newId,
    data: {
      ...data,
      questionnaires: [...data.questionnaires, newQuestionnaire],
      nextId: { ...data.nextId, questionnaire: newId + 1 },
    },
  };
}

export function saveQuestionnaireTemplate(
  data: DemoData,
  questionnaireId: number,
  template: FormTemplate,
) {
  return {
    ...data,
    questionnaires: data.questionnaires.map(q =>
      q.id === questionnaireId
        ? {
            ...q,
            template_id: template.id,
            template_name: template.name,
            ...cloneTemplateFormStructure(template),
          }
        : q,
    ),
  };
}

export function publishQuestionnaire(
  data: DemoData,
  questionnaireId: number,
  supplierIds: number[],
) {
  const supplier_status = Object.fromEntries(
    supplierIds.map(sid => [sid, 'pending' as const]),
  );
  return {
    ...data,
    questionnaires: data.questionnaires.map(q =>
      q.id === questionnaireId
        ? {
            ...q,
            status: 'published' as const,
            supplier_ids: supplierIds,
            supplier_status,
            supplier_rejections: {},
          }
        : q,
    ),
  };
}

export function submitQuestionnaireAnswers(
  data: DemoData,
  questionnaireId: number,
  supplierId: number,
  answers: Record<string, string | number>,
): DemoData {
  const questionnaire = data.questionnaires.find(q => q.id === questionnaireId);
  if (!questionnaire) return data;

  const templateId =
    questionnaire.template_id ??
    data.formTemplates.find(
      template =>
        template.category ===
        data.demoSuppliers.find(s => s.id === supplierId)?.category,
    )?.id;

  const submittedAt = new Date().toISOString().slice(0, 10);
  const existingResearch = data.researchSubmissions.find(
    item => item.task_id === questionnaireId && item.supplier_id === supplierId,
  );

  let next: DemoData = {
    ...data,
    questionnaires: data.questionnaires.map(q =>
      q.id === questionnaireId
        ? {
            ...q,
            supplier_status: {
              ...q.supplier_status,
              [supplierId]: 'submitted' as const,
            },
            supplier_answers: {
              ...q.supplier_answers,
              [supplierId]: answers,
            },
          }
        : q,
    ),
  };

  if (templateId && existingResearch) {
    next = {
      ...next,
      researchSubmissions: next.researchSubmissions.map(item =>
        item.id === existingResearch.id
          ? { ...item, values: answers, submitted_at: submittedAt }
          : item,
      ),
    };
  } else if (templateId) {
    const researchId =
      next.nextId.researchSub ?? next.researchSubmissions.length + 1;
    next = {
      ...next,
      nextId: { ...next.nextId, researchSub: researchId + 1 },
      researchSubmissions: [
        ...next.researchSubmissions,
        {
          id: researchId,
          task_id: questionnaireId,
          task_name: questionnaire.name,
          supplier_id: supplierId,
          template_id: templateId,
          values: answers,
          submitted_at: submittedAt,
        },
      ],
    };
  }

  return next;
}

export function supplierQuestionnairesFor(
  data: DemoData,
  supplierId: number,
  options?: { pendingOnly?: boolean },
) {
  return data.questionnaires
    .filter(q => {
      const status = resolveQuestionnaireStatus(q);
      return status !== 'draft' && q.supplier_ids.includes(supplierId);
    })
    .filter(q => {
      if (!options?.pendingOnly) return true;
      return (q.supplier_status[supplierId] || 'pending') !== 'submitted';
    });
}

export function getQuestionnaireFields(
  data: DemoData,
  questionnaire: DemoQuestionnaire,
): FormField[] {
  if (questionnaire.form_fields?.length) {
    return questionnaire.form_fields;
  }
  if (questionnaire.template_id) {
    const template = data.formTemplates.find(
      item => item.id === questionnaire.template_id,
    );
    return template ? getTemplateFields(template) : [];
  }
  return [];
}
