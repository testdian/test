import { UploadOutlined } from '@ant-design/icons';
import { Button, DatePicker, Form, Input, Select, Upload } from 'antd';
import dayjs from 'dayjs';

import type { FormField, FormSectionMeta } from '../data/demo-data';
import { ATTACHMENT_FIELD_HINT } from '../data/form-field-meta';
import { formatUnitLabel } from '../data/unit-dict';
import styles from '../styles.module.less';

type FormFieldInputsProps = {
  fields: FormField[];
  sections?: FormSectionMeta[];
  values: Record<string, string | number>;
  onChange?: (code: string, value: string) => void;
  readOnly?: boolean;
  /** 预览模式：展示真实控件样式，不可编辑 */
  preview?: boolean;
  /** 标签与输入框同一行（用于字段配置预览） */
  labelInline?: boolean;
};

function renderFieldControl(
  field: FormField,
  values: Record<string, string | number>,
  onChange: FormFieldInputsProps['onChange'],
  readOnly: boolean,
  preview: boolean,
) {
  if (readOnly) {
    return (
      <div
        style={{
          padding: '4px 11px',
          background: '#fafafa',
          border: '1px solid #d9d9d9',
          borderRadius: 6,
        }}
      >
        {values[field.code] ?? '-'}
      </div>
    );
  }
  if (field.type === 'select') {
    return (
      <Select
        disabled={preview}
        value={values[field.code] ? String(values[field.code]) : undefined}
        placeholder={`请选择${field.name}`}
        onChange={value => onChange?.(field.code, value)}
        options={(field.options || '')
          .split(',')
          .filter(Boolean)
          .map(option => ({ label: option, value: option }))}
      />
    );
  }
  if (field.type === 'date') {
    return (
      <DatePicker
        disabled={preview}
        style={{ width: '100%' }}
        format='YYYY-MM-DD'
        placeholder={`请选择${field.name}`}
        value={
          values[field.code] ? dayjs(String(values[field.code])) : undefined
        }
        onChange={(_, dateStr) => onChange?.(field.code, dateStr as string)}
      />
    );
  }
  if (field.type === 'attachment') {
    return (
      <>
        <Upload disabled={preview} maxCount={5} beforeUpload={() => false}>
          <Button disabled={preview} icon={<UploadOutlined />}>
            上传附件
          </Button>
        </Upload>
        <div
          style={{
            marginTop: 8,
            fontSize: 12,
            color: 'rgba(0, 0, 0, 0.45)',
            lineHeight: '20px',
          }}
        >
          {ATTACHMENT_FIELD_HINT}
        </div>
      </>
    );
  }
  const unitLabel = formatUnitLabel(field.unit);
  const placeholder = unitLabel
    ? `请输入${field.name}（单位：${unitLabel}）`
    : `请输入${field.name}`;
  return (
    <Input
      disabled={preview}
      type={field.type === 'number' ? 'number' : 'text'}
      value={values[field.code] != null ? String(values[field.code]) : ''}
      onChange={e => onChange?.(field.code, e.target.value)}
      placeholder={placeholder}
      maxLength={field.maxLength}
    />
  );
}

function renderFieldItem(
  field: FormField,
  values: Record<string, string | number>,
  onChange: FormFieldInputsProps['onChange'],
  readOnly: boolean,
  preview: boolean,
) {
  return (
    <Form.Item key={field.id} label={field.name} required={field.required}>
      {renderFieldControl(field, values, onChange, readOnly, preview)}
    </Form.Item>
  );
}

function renderFormBody(
  fields: FormField[],
  sections: FormSectionMeta[] | undefined,
  values: Record<string, string | number>,
  onChange: FormFieldInputsProps['onChange'],
  readOnly: boolean,
  preview: boolean,
) {
  if (sections?.length) {
    return sections.map(section => {
      const sectionFields = fields.filter(
        field => field.sectionId === section.id,
      );
      if (!sectionFields.length) return null;
      return (
        <div key={section.id} style={{ marginBottom: 24 }}>
          <div
            style={{
              marginBottom: 12,
              fontSize: 14,
              fontWeight: 500,
              color: '#262626',
            }}
          >
            {section.name}
          </div>
          {sectionFields.map(field =>
            renderFieldItem(field, values, onChange, readOnly, preview),
          )}
        </div>
      );
    });
  }

  return fields.map(field =>
    renderFieldItem(field, values, onChange, readOnly, preview),
  );
}

export function FormFieldInputs({
  fields,
  sections,
  values,
  onChange,
  readOnly = false,
  preview = false,
  labelInline = false,
}: FormFieldInputsProps) {
  const formProps = labelInline
    ? {
        layout: 'horizontal' as const,
        labelCol: { flex: 'none' },
        wrapperCol: { flex: '1 1 0' },
        colon: false,
      }
    : { layout: 'vertical' as const };

  return (
    <Form
      {...formProps}
      className={labelInline ? styles.formFieldInputsInline : undefined}
    >
      {renderFormBody(fields, sections, values, onChange, readOnly, preview)}
    </Form>
  );
}
