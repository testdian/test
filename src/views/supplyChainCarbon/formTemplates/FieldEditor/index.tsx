/**
 * @description 表单模板字段配置
 */
import {
  Button,
  Checkbox,
  Form,
  Input,
  InputNumber,
  Select,
  Space,
  message,
} from 'antd';
import { useEffect, useMemo, useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';

import { FormActions } from '@/components/FormActions';
import { FormLabelWithNote } from '@/components/ModifyNote';
import { Page } from '@/components/Page';
import { SupplyChainRefRouteMaps } from '@/router/utils/supplyChainRefEnums';
import { FormFieldInputs } from '@/views/supplyChainCarbon/components/FormFieldInputs';
import {
  fieldTypeLabel,
  normalizeFormTemplate,
  type FormField,
  type FormTemplate,
  type FormTemplateSection,
} from '@/views/supplyChainCarbon/data/demo-data';
import {
  formatUnitLabel,
  formatUnitValues,
  parseUnitValues,
  UNIT_DICT_OPTIONS,
} from '@/views/supplyChainCarbon/data/unit-dict';
import {
  ATTACHMENT_FIELD_HINT,
  FIELD_TYPE_NOTE,
  FIELD_TYPE_OPTIONS,
  generateFieldCode,
  normalizeFieldFormByType,
} from '@/views/supplyChainCarbon/data/form-field-meta';
import { useDemoStore } from '@/views/supplyChainCarbon/hooks/useDemoStore';
import styles from '@/views/supplyChainCarbon/styles.module.less';

const UNIT_NOTE = '单位，下拉，多选，非必选，枚举值来自单位字典';
const SECTION_NAME_NOTE = '分区名称，必输，文本框，不超过100个字符';
const MAX_SECTION_NAME_LENGTH = 100;

const defaultFieldForm: Partial<FormField> = {
  type: 'text',
  required: true,
  maxLength: 100,
  unit: '',
};

function nextSectionId(sections: FormTemplateSection[]) {
  return sections.length
    ? Math.max(...sections.map(section => section.id)) + 1
    : 1;
}

function nextFieldId(sections: FormTemplateSection[]) {
  const ids = sections.flatMap(section =>
    section.fields.map(field => field.id),
  );
  return ids.length ? Math.max(...ids) + 1 : 1;
}

function getAllFields(sections: FormTemplateSection[]) {
  return sections.flatMap(section => section.fields);
}

function resolveEditorSections(sections: FormTemplateSection[]) {
  if (
    sections.length === 1 &&
    sections[0].name === '默认分区' &&
    sections[0].fields.length === 0
  ) {
    return [];
  }
  return sections;
}

type SectionFieldFormProps = {
  fieldForm: Partial<FormField>;
  onFieldFormChange: (value: Partial<FormField>) => void;
  onSave: () => void;
  isEditing?: boolean;
  onCancelEdit?: () => void;
};

function SectionFieldForm({
  fieldForm,
  onFieldFormChange,
  onSave,
  isEditing = false,
  onCancelEdit,
}: SectionFieldFormProps) {
  const fieldType = fieldForm.type || 'text';
  const showMaxLength =
    fieldType !== 'attachment' &&
    fieldType !== 'date' &&
    fieldType !== 'number' &&
    fieldType !== 'select';
  const showUnit = fieldType !== 'date' && fieldType !== 'attachment';

  return (
    <Form layout='vertical' className={styles.fieldEditorFieldForm}>
      <Form.Item label='字段名称' required>
        <Input
          value={fieldForm.name || ''}
          onChange={e =>
            onFieldFormChange({ ...fieldForm, name: e.target.value })
          }
          placeholder='如：产品型号'
        />
      </Form.Item>
      <Form.Item
        label={<FormLabelWithNote label='字段类型' note={FIELD_TYPE_NOTE} />}
      >
        <Select
          value={fieldType}
          onChange={v =>
            onFieldFormChange(normalizeFieldFormByType(fieldForm, v))
          }
          options={[...FIELD_TYPE_OPTIONS]}
        />
      </Form.Item>
      {showMaxLength && (
        <Form.Item label='最大长度'>
          <InputNumber
            style={{ width: '100%' }}
            value={fieldForm.maxLength}
            onChange={v =>
              onFieldFormChange({
                ...fieldForm,
                maxLength: Number(v) || 100,
              })
            }
          />
        </Form.Item>
      )}
      {showUnit && (
        <Form.Item label={<FormLabelWithNote label='单位' note={UNIT_NOTE} />}>
          <Select
            mode='multiple'
            allowClear
            placeholder='请选择单位'
            value={parseUnitValues(fieldForm.unit)}
            options={UNIT_DICT_OPTIONS}
            onChange={values =>
              onFieldFormChange({
                ...fieldForm,
                unit: formatUnitValues(values),
              })
            }
          />
        </Form.Item>
      )}
      {fieldType === 'select' && (
        <Form.Item label='下拉选项（逗号分隔）'>
          <Input
            value={fieldForm.options || ''}
            onChange={e =>
              onFieldFormChange({ ...fieldForm, options: e.target.value })
            }
            placeholder='如：选项A,选项B,选项C'
          />
        </Form.Item>
      )}
      {fieldType === 'attachment' && (
        <div className={styles.formHint}>{ATTACHMENT_FIELD_HINT}</div>
      )}
      <Form.Item>
        <Space>
          <Checkbox
            checked={fieldForm.required}
            onChange={e =>
              onFieldFormChange({ ...fieldForm, required: e.target.checked })
            }
          >
            必填
          </Checkbox>
          <Button type='primary' onClick={onSave}>
            {isEditing ? '保存修改' : '添加字段'}
          </Button>
          {isEditing && onCancelEdit && (
            <Button onClick={onCancelEdit}>取消编辑</Button>
          )}
        </Space>
      </Form.Item>
    </Form>
  );
}

export default function FormTemplateFieldEditorPage() {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const templateId = Number(id);
  const { data, update, ready } = useDemoStore();
  const [sections, setSections] = useState<FormTemplateSection[]>([]);
  const [newSectionName, setNewSectionName] = useState('');
  const [fieldForms, setFieldForms] = useState<
    Record<number, Partial<FormField>>
  >({});
  const [previewValues, setPreviewValues] = useState<
    Record<string, string | number>
  >({});
  const [editingField, setEditingField] = useState<{
    sectionId: number;
    fieldId: number;
  } | null>(null);

  const template = data.formTemplates.find(t => t.id === templateId) as
    | FormTemplate
    | undefined;

  useEffect(() => {
    if (!template) return;
    const normalized = normalizeFormTemplate(template);
    const editorSections = resolveEditorSections(normalized.sections);
    setSections(editorSections);
    setFieldForms(
      Object.fromEntries(
        editorSections.map(section => [section.id, { ...defaultFieldForm }]),
      ),
    );
  }, [template]);

  const previewFields = useMemo(
    () =>
      sections.flatMap(section =>
        section.fields.map(field => ({ ...field, sectionId: section.id })),
      ),
    [sections],
  );

  const previewSections = useMemo(
    () => sections.map(section => ({ id: section.id, name: section.name })),
    [sections],
  );

  const addSection = () => {
    const name = newSectionName.trim();
    if (!name) {
      message.error('请输入分区名称');
      return;
    }
    if (name.length > MAX_SECTION_NAME_LENGTH) {
      message.error(`分区名称不超过${MAX_SECTION_NAME_LENGTH}个字符`);
      return;
    }
    const sectionId = nextSectionId(sections);
    setSections(prev => [...prev, { id: sectionId, name, fields: [] }]);
    setFieldForms(prev => ({ ...prev, [sectionId]: { ...defaultFieldForm } }));
    setNewSectionName('');
  };

  const deleteSection = (sectionId: number) => {
    setSections(prev => prev.filter(section => section.id !== sectionId));
    setFieldForms(prev => {
      const next = { ...prev };
      delete next[sectionId];
      return next;
    });
  };

  const saveField = (sectionId: number) => {
    const fieldForm = fieldForms[sectionId] || defaultFieldForm;
    if (!fieldForm.name?.trim()) {
      message.error('请填写字段名称');
      return;
    }
    const fieldName = fieldForm.name.trim();

    const isEditingCurrent =
      editingField?.sectionId === sectionId && editingField.fieldId != null;

    if (isEditingCurrent) {
      setSections(prev =>
        prev.map(section =>
          section.id === sectionId
            ? {
                ...section,
                fields: section.fields.map(field =>
                  field.id === editingField.fieldId
                    ? {
                        ...field,
                        name: fieldName,
                        type: fieldForm.type || 'text',
                        maxLength:
                          fieldForm.type === 'attachment' ||
                          fieldForm.type === 'date' ||
                          fieldForm.type === 'number' ||
                          fieldForm.type === 'select'
                            ? 0
                            : fieldForm.maxLength || 100,
                        unit:
                          fieldForm.type === 'date' ||
                          fieldForm.type === 'attachment'
                            ? ''
                            : fieldForm.unit || '',
                        required: fieldForm.required ?? true,
                        options: fieldForm.options,
                      }
                    : field,
                ),
              }
            : section,
        ),
      );
      setEditingField(null);
      setFieldForms(prev => ({
        ...prev,
        [sectionId]: { ...defaultFieldForm },
      }));
      message.success('字段已更新');
      return;
    }

    const fieldId = nextFieldId(sections);
    const existingCodes = getAllFields(sections).map(field => field.code);
    const code = generateFieldCode(fieldName, existingCodes, fieldId);

    const newField: FormField = {
      id: fieldId,
      name: fieldName,
      code,
      type: fieldForm.type || 'text',
      maxLength:
        fieldForm.type === 'attachment' ||
        fieldForm.type === 'date' ||
        fieldForm.type === 'number' ||
        fieldForm.type === 'select'
          ? 0
          : fieldForm.maxLength || 100,
      unit:
        fieldForm.type === 'date' || fieldForm.type === 'attachment'
          ? ''
          : fieldForm.unit || '',
      required: fieldForm.required ?? true,
      options: fieldForm.options,
      sectionId,
    };

    setSections(prev =>
      prev.map(section =>
        section.id === sectionId
          ? { ...section, fields: [...section.fields, newField] }
          : section,
      ),
    );
    setFieldForms(prev => ({
      ...prev,
      [sectionId]: { ...defaultFieldForm },
    }));
  };

  const deleteField = (sectionId: number, fieldId: number) => {
    if (
      editingField?.sectionId === sectionId &&
      editingField.fieldId === fieldId
    ) {
      setEditingField(null);
      setFieldForms(prev => ({
        ...prev,
        [sectionId]: { ...defaultFieldForm },
      }));
    }
    setSections(prev =>
      prev.map(section =>
        section.id === sectionId
          ? {
              ...section,
              fields: section.fields.filter(field => field.id !== fieldId),
            }
          : section,
      ),
    );
  };

  const startEditField = (sectionId: number, field: FormField) => {
    if (editingField && editingField.sectionId !== sectionId) {
      setFieldForms(prev => ({
        ...prev,
        [editingField.sectionId]: { ...defaultFieldForm },
      }));
    }
    setEditingField({ sectionId, fieldId: field.id });
    setFieldForms(prev => ({
      ...prev,
      [sectionId]: {
        name: field.name,
        type: field.type,
        maxLength: field.maxLength,
        unit: field.unit,
        required: field.required,
        options: field.options,
      },
    }));
  };

  const cancelEditField = (sectionId: number) => {
    if (editingField?.sectionId === sectionId) {
      setEditingField(null);
    }
    setFieldForms(prev => ({ ...prev, [sectionId]: { ...defaultFieldForm } }));
  };

  const saveTemplate = () => {
    if (!template) return;
    update(d => ({
      ...d,
      formTemplates: d.formTemplates.map(t =>
        t.id === template.id ? { ...t, sections } : t,
      ),
    }));
    message.success('模板字段已保存');
    navigate(SupplyChainRefRouteMaps.formTemplates);
  };

  if (!ready) return null;
  if (!template) {
    return <Page title='配置字段'>未找到该表单模板</Page>;
  }

  return (
    <Page title='配置字段' wrapperClass='marginBottomFormActionsHeight'>
      <div style={{ marginBottom: 16, color: 'rgba(0,0,0,0.65)' }}>
        {template.category} · {template.name}
      </div>

      <div className={styles.fieldEditorLayout}>
        <div className={styles.fieldEditorAddSectionBlock}>
          <div className={styles.pageSection}>
            <div className={styles.sectionTitle}>添加分区</div>
            <div className={styles.fieldEditorSectionNameLabel}>
              <FormLabelWithNote label='分区名称' note={SECTION_NAME_NOTE} />
            </div>
            <Space.Compact className={styles.fieldEditorAddSection}>
              <Input
                value={newSectionName}
                onChange={e => setNewSectionName(e.target.value)}
                placeholder='如：1.基本信息'
                maxLength={MAX_SECTION_NAME_LENGTH}
                onPressEnter={addSection}
              />
              <Button type='primary' onClick={addSection}>
                添加分区
              </Button>
            </Space.Compact>
          </div>
        </div>

        <div className={styles.fieldEditorPreviewBlock}>
          <div className={styles.pageSection}>
            <div className={styles.sectionTitle}>表单预览</div>
            <div className={styles.fieldEditorPreviewHint}>
              可填写体验，不会保存
            </div>
            <div className={styles.fieldEditorPreview}>
              {previewFields.length === 0 ? (
                <div className={styles.fieldEditorPreviewEmpty}>
                  配置字段后，将在此处实时预览填报样式
                </div>
              ) : (
                <FormFieldInputs
                  fields={previewFields}
                  sections={previewSections}
                  values={previewValues}
                  labelInline
                  onChange={(code, value) =>
                    setPreviewValues(prev => ({ ...prev, [code]: value }))
                  }
                />
              )}
            </div>
          </div>
        </div>

        <div className={styles.fieldEditorSectionsBlock}>
          {sections.length === 0 ? (
            <div className={styles.fieldEditorPreviewEmpty}>
              暂无分区，请先添加分区后再配置字段
            </div>
          ) : (
            sections.map(section => (
              <div key={section.id} className={styles.templateSection}>
                <div className={styles.templateSectionHeader}>
                  <div className={styles.templateSectionTitle}>
                    {section.name}
                  </div>
                  <Button
                    danger
                    type='link'
                    onClick={() => deleteSection(section.id)}
                  >
                    删除分区
                  </Button>
                </div>

                <div className={styles.pageSection}>
                  <div className={styles.sectionTitle}>
                    {editingField?.sectionId === section.id
                      ? '编辑字段'
                      : '添加字段'}
                  </div>
                  <SectionFieldForm
                    fieldForm={fieldForms[section.id] || defaultFieldForm}
                    onFieldFormChange={value =>
                      setFieldForms(prev => ({ ...prev, [section.id]: value }))
                    }
                    onSave={() => saveField(section.id)}
                    isEditing={
                      editingField?.sectionId === section.id &&
                      editingField.fieldId != null
                    }
                    onCancelEdit={() => cancelEditField(section.id)}
                  />
                </div>

                <div className={styles.pageSection}>
                  <div className={styles.sectionTitle}>
                    已配置字段（{section.fields.length}）
                  </div>
                  {section.fields.length === 0 ? (
                    <div style={{ color: 'rgba(0,0,0,0.45)' }}>
                      该分区暂无字段
                    </div>
                  ) : (
                    <div className={styles.fieldEditorFieldList}>
                      {section.fields.map(field => (
                        <div
                          key={field.id}
                          className={`${styles.fieldEditorFieldItem}${
                            editingField?.sectionId === section.id &&
                            editingField.fieldId === field.id
                              ? ` ${styles.fieldEditorFieldItemActive}`
                              : ''
                          }`}
                        >
                          <div className={styles.fieldEditorFieldMeta}>
                            <div className={styles.fieldEditorFieldName}>
                              {field.name}
                            </div>
                            <div>
                              {fieldTypeLabel(field.type)}
                              {field.type !== 'attachment' &&
                              field.type !== 'date' &&
                              formatUnitLabel(field.unit)
                                ? ` · ${formatUnitLabel(field.unit)}`
                                : ''}
                              {field.required ? ' · 必填' : ' · 选填'}
                            </div>
                          </div>
                          <Space size={0}>
                            <Button
                              type='link'
                              onClick={() => startEditField(section.id, field)}
                            >
                              编辑
                            </Button>
                            <Button
                              type='link'
                              danger
                              onClick={() => deleteField(section.id, field.id)}
                            >
                              删除
                            </Button>
                          </Space>
                        </div>
                      ))}
                    </div>
                  )}
                </div>
              </div>
            ))
          )}
        </div>
      </div>

      <FormActions
        place='center'
        buttons={[
          {
            title: '取消',
            onClick: async () =>
              navigate(SupplyChainRefRouteMaps.formTemplates),
          },
          {
            title: '保存',
            type: 'primary',
            onClick: async () => saveTemplate(),
          },
        ]}
      />
    </Page>
  );
}
