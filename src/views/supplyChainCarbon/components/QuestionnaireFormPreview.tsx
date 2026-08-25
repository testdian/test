import { FormFieldInputs } from './FormFieldInputs';
import type { FormField, FormSectionMeta } from '../data/demo-data';
import styles from '../styles.module.less';

type QuestionnaireFormPreviewProps = {
  title: string;
  organization?: string | null;
  deadline: string;
  description?: string | null;
  fields: FormField[];
  sections?: FormSectionMeta[];
  values: Record<string, string | number>;
  onChange?: (code: string, value: string) => void;
  disabled?: boolean;
  emptyText?: string;
};

export function QuestionnaireFormPreview({
  title,
  organization,
  deadline,
  description,
  fields,
  sections,
  values,
  onChange,
  disabled = false,
  emptyText = '暂无表单字段',
}: QuestionnaireFormPreviewProps) {
  if (!fields.length) {
    return <div className={styles.fieldEditorPreviewEmpty}>{emptyText}</div>;
  }

  return (
    <>
      <div className={styles.questionnairePreviewTitle}>{title || '-'}</div>
      <div className={styles.questionnairePreviewMeta}>
        <div className={styles.questionnairePreviewMetaRow}>
          <span className={styles.questionnairePreviewMetaLabel}>所属组织</span>
          <span className={styles.questionnairePreviewMetaValue}>
            {organization || '-'}
          </span>
        </div>
        <div className={styles.questionnairePreviewMetaRow}>
          <span className={styles.questionnairePreviewMetaLabel}>截止日期</span>
          <span className={styles.questionnairePreviewMetaValue}>
            {deadline || '-'}
          </span>
        </div>
      </div>
      <div className={styles.questionnairePreviewDescription}>
        <div className={styles.questionnairePreviewMetaLabel}>任务说明</div>
        <div className={styles.questionnairePreviewDescriptionText}>
          {description?.trim() || '-'}
        </div>
      </div>
      <FormFieldInputs
        fields={fields}
        sections={sections}
        values={values}
        labelInline
        preview={disabled}
        onChange={onChange}
      />
    </>
  );
}
