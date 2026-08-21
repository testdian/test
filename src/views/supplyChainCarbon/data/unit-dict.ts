/** 单位字典（原型） */
export const UNIT_DICT_OPTIONS = [
  { label: '千克 (kg)', value: 'kg' },
  { label: '吨 (t)', value: 't' },
  { label: '千瓦时 (kWh)', value: 'kWh' },
  { label: '立方米 (m³)', value: 'm³' },
  { label: '升 (L)', value: 'L' },
  { label: '百分比 (%)', value: '%' },
  { label: '件', value: '件' },
  { label: '套', value: '套' },
  { label: '平方米 (m²)', value: 'm²' },
  { label: '千克二氧化碳当量 (kgCO2eq)', value: 'kgCO2eq' },
];

export function parseUnitValues(unit?: string) {
  if (!unit?.trim()) return [];
  return unit
    .split(',')
    .map(item => item.trim())
    .filter(Boolean);
}

export function formatUnitValues(values: string[]) {
  return values.join(',');
}

export function formatUnitLabel(unit?: string) {
  const values = parseUnitValues(unit);
  if (!values.length) return '';
  return values.join('、');
}
