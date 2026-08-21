import type { FormField } from './demo-data';

export const FIELD_TYPE_NOTE =
  '当字段类型为日期时，无单位、最大长度字段；日期默认为年月日。同时增加一个字段类型：附件，当选择附件类型时，无最大长度、单位字段，增加提示文案：附件最多可上传5个，单个不超过100M，支持doc、docx、xls、xlsx、pdf、jpg、png、jpeg、zip、rar格式。当字段类型为数字时，去掉最大长度字段。当字段类型为下拉时，去掉最大长度字段。';

export const ATTACHMENT_FIELD_HINT =
  '附件最多可上传5个，单个不超过100M，支持doc、docx、xls、xlsx、pdf、jpg、png、jpeg、zip、rar格式。';

export const FIELD_TYPE_OPTIONS = [
  { label: '文本', value: 'text' },
  { label: '数字', value: 'number' },
  { label: '下拉', value: 'select' },
  { label: '日期', value: 'date' },
  { label: '附件', value: 'attachment' },
] as const;

export function normalizeFieldFormByType(
  fieldForm: Partial<FormField>,
  type: string,
) {
  const next = { ...fieldForm, type };
  if (type === 'date' || type === 'attachment') {
    next.unit = '';
  }
  if (
    type === 'attachment' ||
    type === 'date' ||
    type === 'number' ||
    type === 'select'
  ) {
    next.maxLength = 0;
  } else if (!next.maxLength) {
    next.maxLength = 100;
  }
  return next;
}

export function generateFieldCode(
  name: string,
  existingCodes: string[],
  fieldId: number,
) {
  const slug = name
    .trim()
    .toLowerCase()
    .replace(/\s+/g, '_')
    .replace(/[^a-z0-9_\u4e00-\u9fff]/g, '')
    .slice(0, 50);

  let base = slug || `field_${fieldId}`;
  if (/^\d/.test(base)) {
    base = `field_${base}`;
  }

  const used = new Set(existingCodes);
  let code = base;
  let suffix = 1;
  while (used.has(code)) {
    code = `${base}_${suffix++}`;
  }
  return code;
}
