import type { FormField, FormSubmission, FormTemplate } from './demo-data';
import { getTemplateFields } from './demo-data';

export interface DimensionScore {
  code: string;
  name: string;
  value: string | number;
  score: number;
  weight: number;
}

export interface AssessmentModelResult {
  dimensionScores: DimensionScore[];
  score: number;
  grade: string;
  summary: string;
  recommendations: string[];
}

const FIELD_WEIGHTS: Record<string, number> = {
  recycled_ratio: 0.2,
  secondary_ratio: 0.1,
  renewable_ratio: 0.15,
  green_power_ratio: 0.25,
  green_vehicle_ratio: 0.2,
  energy_per_unit: 0.2,
  site: 0.05,
  product_model: 0.05,
  transport_type: 0.1,
};

function gradeFromScore(score: number) {
  if (score >= 90) return 'A';
  if (score >= 80) return 'B';
  if (score >= 70) return 'C';
  if (score >= 60) return 'D';
  return 'E';
}

function scorePercentageField(value: number) {
  if (Number.isNaN(value)) return 0;
  return Math.max(0, Math.min(100, Math.round(value * 1.1)));
}

function scoreEnergyField(value: number) {
  if (Number.isNaN(value)) return 0;
  if (value <= 8) return 95;
  if (value <= 12) return 82;
  if (value <= 16) return 70;
  return 58;
}

function scoreTransportField(value: string) {
  const map: Record<string, number> = {
    铁路: 90,
    水运: 85,
    公路: 72,
    空运: 55,
  };
  return map[value] ?? 70;
}

function scoreTextField(value: string) {
  return value.trim() ? 85 : 0;
}

function dimensionScore(
  field: FormField,
  rawValue: string | number | undefined,
): number {
  if (rawValue === undefined || rawValue === '') return 0;

  if (field.type === 'number') {
    const numeric = Number(rawValue);
    if (field.code === 'energy_per_unit') return scoreEnergyField(numeric);
    if (field.unit === '%' || field.code.includes('ratio'))
      return scorePercentageField(numeric);
    return Math.max(0, Math.min(100, Math.round(numeric)));
  }

  if (field.code === 'transport_type')
    return scoreTransportField(String(rawValue));
  return scoreTextField(String(rawValue));
}

export function buildAssessmentModel(
  template: FormTemplate,
  values: Record<string, string | number>,
): AssessmentModelResult {
  const dimensionScores: DimensionScore[] = getTemplateFields(template).map(field => {
    const weight = FIELD_WEIGHTS[field.code] ?? 0.1;
    const value = values[field.code] ?? '';
    return {
      code: field.code,
      name: field.name,
      value,
      score: dimensionScore(field, value),
      weight,
    };
  });

  const weightedTotal = dimensionScores.reduce(
    (sum, item) => sum + item.score * item.weight,
    0,
  );
  const totalWeight =
    dimensionScores.reduce((sum, item) => sum + item.weight, 0) || 1;
  const score = Math.round(weightedTotal / totalWeight);
  const grade = gradeFromScore(score);

  const recommendations: string[] = [];
  dimensionScores.forEach(item => {
    if (item.score < 70 && item.code.includes('green')) {
      recommendations.push(
        `建议提升${item.name}，当前为 ${item.value}${
          typeof item.value === 'number' ? '%' : ''
        }`,
      );
    }
    if (item.code === 'recycled_ratio' && Number(item.value) < 30) {
      recommendations.push(
        '回收料比例偏低，建议设定阶段性提升目标并纳入采购考核',
      );
    }
    if (item.code === 'energy_per_unit' && Number(item.value) > 12) {
      recommendations.push('单位产品能耗偏高，建议开展节能改造与工艺优化');
    }
  });

  if (!recommendations.length) {
    recommendations.push(
      '整体表现良好，建议保持数据更新频率并持续跟踪关键降碳指标',
    );
  }

  const summary = `基于${template.category}专属表单模板，对 ${dimensionScores.length} 项维度完成加权建模，综合得分 ${score} 分（${grade}级）。`;

  return { dimensionScores, score, grade, summary, recommendations };
}

export function createReportNo(existing: FormSubmission[]) {
  const year = new Date().getFullYear();
  const serial =
    existing.filter(item => item.report_no.startsWith(`RPT-${year}`)).length +
    1;
  return `RPT-${year}-${String(serial).padStart(3, '0')}`;
}

export function buildAssessmentReportPayload({
  supplierId,
  template,
  values,
  taskId,
  taskName,
  existingReports,
  submittedAt,
  validUntil,
}: {
  supplierId: number;
  template: FormTemplate;
  values: Record<string, string | number>;
  taskId?: number;
  taskName?: string;
  existingReports: FormSubmission[];
  submittedAt?: string;
  validUntil?: string;
}): Omit<FormSubmission, 'id'> {
  const model = buildAssessmentModel(template, values);
  const today = submittedAt || new Date().toISOString().slice(0, 10);

  return {
    supplier_id: supplierId,
    template_id: template.id,
    task_id: taskId,
    task_name: taskName,
    values,
    dimension_scores: model.dimensionScores,
    score: model.score,
    grade: model.grade,
    summary: model.summary,
    recommendations: model.recommendations,
    model_version: 'v1.0-demo',
    report_no: createReportNo(existingReports),
    submitted_at: today,
    generated_at: today,
    valid_until: validUntil,
    status: 'generated',
  };
}
