import { buildAssessmentModel } from './carbon-assessment';
import {
  seedProgressReports,
  seedReductionPlans,
  seedReductionTargets,
  type DemoProgressReport,
  type DemoReductionPlan,
  type DemoReductionTarget,
} from './demo-supply-chain';
import {
  seedFormTemplates,
  supplierCategoryByIndex,
} from './form-template-seeds';

export interface DemoSupplier {
  id: number;
  name: string;
  contact_person: string;
  contact_phone: string;
  category: string;
  srm_code?: string;
}

export interface OrgMonthly {
  month: number;
  planned: number;
  actual: number;
}

export interface OrgTarget {
  id: number;
  year: number;
  org_level: string;
  org_name: string;
  baseline_emission: number;
  target_emission: number;
  monthly: OrgMonthly[];
}

export interface ProductStage {
  stage: string;
  current: number;
  target: number;
}

export interface ProductPath {
  measure: string;
  reduction: number;
  period: string;
}

export interface ProductTarget {
  id: number;
  product_name: string;
  model: string;
  current_footprint: number;
  target_footprint: number;
  target_year: number;
  stages: ProductStage[];
  paths: ProductPath[];
  trend: number[];
}

export interface DemoTask {
  id: number;
  name: string;
  type: string;
  supplier_ids: number[];
  deadline: string;
  status: string;
  created_at: string;
  submissions: Record<number, string>;
}

export interface FormField {
  id: number;
  name: string;
  code: string;
  type: string;
  maxLength: number;
  unit: string;
  required: boolean;
  options?: string;
  sectionId?: number;
}

export interface FormTemplateSection {
  id: number;
  name: string;
  fields: FormField[];
}

export interface FormTemplate {
  id: number;
  category: string;
  name: string;
  sections: FormTemplateSection[];
  /** 兼容旧数据 */
  fields?: FormField[];
}

export interface FormSectionMeta {
  id: number;
  name: string;
}

export interface AssessmentDimensionScore {
  code: string;
  name: string;
  value: string | number;
  score: number;
  weight: number;
}

export interface FormSubmission {
  id: number;
  supplier_id: number;
  template_id: number;
  task_id?: number;
  task_name?: string;
  values: Record<string, string | number>;
  dimension_scores?: AssessmentDimensionScore[];
  score: number;
  grade: string;
  summary?: string;
  recommendations?: string[];
  model_version?: string;
  report_no: string;
  submitted_at: string;
  generated_at?: string;
  valid_until?: string;
  status?: 'generated' | 'expired';
}

/** 调研任务原始填报，待自动建模生成碳评估报告 */
export interface ResearchSubmission {
  id: number;
  task_id: number;
  task_name: string;
  supplier_id: number;
  template_id: number;
  values: Record<string, string | number>;
  submitted_at: string;
  report_id?: number;
}

export interface Training {
  id: number;
  title: string;
  type: string;
  summary: string;
  content: string;
  attachment_name: string;
  attachments?: CertificateAttachment[];
  status: 'published' | 'draft';
  applicable: string;
  created_at: string;
  updated_at: string;
  updated_by?: string;
}

export interface CertificateAttachment {
  id: string;
  name: string;
  size: number;
  mime_type: string;
}

export interface CertificateVersion {
  version: number;
  file_name: string;
  uploaded_at: string;
  cert_no: string;
  expired_at: string;
  issuer: string;
  attachments?: CertificateAttachment[];
}

export interface CarbonCertificate {
  id: number;
  supplier_id: number;
  cert_category: string;
  cert_type: string;
  cert_no: string;
  issuer: string;
  issued_at: string;
  expired_at: string;
  boundary: string;
  file_name: string;
  attachments?: CertificateAttachment[];
  version: number;
  versions: CertificateVersion[];
  audit_status: 'pending' | 'approved' | 'rejected';
  pipeline_status: 'upload' | 'identify' | 'extract' | 'archive' | 'ledger';
  archived_at: string;
  created_at: string;
  updated_at?: string;
}

export interface DemoQuestionOption {
  content: string;
  allow_fill: boolean;
  fill_required: boolean;
}

export interface DemoQuestion {
  id: number;
  question_type: 'single' | 'multiple' | 'fill' | 'judge';
  content: string;
  hint: string;
  is_required: boolean;
  options: DemoQuestionOption[];
  sort_order: number;
}

export interface DemoQuestionnaire {
  id: number;
  name: string;
  description: string | null;
  organization: string | null;
  deadline: string | null;
  status: 'draft' | 'published' | 'ended';
  created_at: string;
  template_id: number | null;
  template_name: string | null;
  form_sections?: FormSectionMeta[];
  form_fields: FormField[];
  supplier_ids: number[];
  supplier_status: Record<number, 'pending' | 'submitted'>;
  supplier_answers: Record<number, Record<string, string | number>>;
}

export interface DemoData {
  demoSuppliers: DemoSupplier[];
  orgTargets: OrgTarget[];
  productTargets: ProductTarget[];
  reductionTargets: DemoReductionTarget[];
  reductionPlans: DemoReductionPlan[];
  progressReports: DemoProgressReport[];
  tasks: DemoTask[];
  formTemplates: FormTemplate[];
  formSubmissions: FormSubmission[];
  researchSubmissions: ResearchSubmission[];
  questionnaires: DemoQuestionnaire[];
  questionBank: DemoQuestion[];
  certificates: CarbonCertificate[];
  trainings: Training[];
  nextId: {
    orgTarget: number;
    productTarget: number;
    reductionTarget: number;
    reductionPlan: number;
    progressReport: number;
    task: number;
    formSub: number;
    researchSub: number;
    formTemplate: number;
    questionnaire: number;
    questionBank: number;
    cert: number;
    training: number;
  };
}

const monthly = (planned: number[], actual: number[]): OrgMonthly[] =>
  Array.from({ length: 12 }, (_, i) => ({
    month: i + 1,
    planned: planned[i],
    actual: actual[i],
  }));

export function fieldTypeLabel(type: string) {
  const map: Record<string, string> = {
    text: '文本',
    number: '数字',
    select: '下拉',
    date: '日期',
    attachment: '附件',
  };
  return map[type] || type;
}

export function normalizeFormTemplate(template: FormTemplate): FormTemplate {
  if (template.sections?.length) {
    return template;
  }
  const legacyFields = template.fields || [];
  return {
    ...template,
    sections: legacyFields.length
      ? [{ id: 1, name: '默认分区', fields: legacyFields }]
      : [],
  };
}

export function getTemplateFields(template: FormTemplate): FormField[] {
  return normalizeFormTemplate(template).sections.flatMap(
    section => section.fields,
  );
}

export function getTemplateFieldCount(template: FormTemplate): number {
  return getTemplateFields(template).length;
}

export function cloneTemplateFormStructure(template: FormTemplate): {
  form_sections: FormSectionMeta[];
  form_fields: FormField[];
} {
  const normalized = normalizeFormTemplate(template);
  return {
    form_sections: normalized.sections.map(section => ({
      id: section.id,
      name: section.name,
    })),
    form_fields: normalized.sections.flatMap(section =>
      section.fields.map(field => ({ ...field, sectionId: section.id })),
    ),
  };
}

function offsetDate(days: number) {
  const date = new Date();
  date.setDate(date.getDate() + days);
  return date.toISOString().slice(0, 10);
}

export function defaultDemoData(): DemoData {
  const certExpiredAt = offsetDate(-20);
  const certSoonAt = offsetDate(45);
  const certValidAt = offsetDate(240);
  const reportExpiredAt = offsetDate(-12);
  const reportSoonAt = offsetDate(60);
  const formTemplates = seedFormTemplates();
  const cathodeTemplate = formTemplates[0];
  const anodeTemplate = formTemplates[1];
  const electrolyteTemplate = formTemplates[2];

  const cathodeValues = {
    production_base: 'test',
    product_model: 'test',
    accounting_period: '季度',
    accounting_boundary: '摇篮到大门',
    cathode_material_usage: '磷酸铁锂 1200t/年',
    raw_material_origin: '锂矿-江西宜春；磷源-贵州',
    energy_consumption: '电耗 850万kWh；天然气 12万m³',
    waste_generation: 45,
    recycled_material: '再生锂 8%，来源认证齐全',
    green_power_cert: '绿证采购 120万kWh',
  };
  const anodeValues = {
    production_base: 'test',
    product_model: 'test',
    accounting_period: '月度',
    accounting_boundary: '特定工序段',
    anode_type: '人造石墨',
    raw_material_source: '人造',
    calcination_energy: 980,
    recycled_material_ratio: 22,
    packaging_usage: 5600,
    green_power_cert: '可再生电力占比 35%',
  };
  const cathodeModel = buildAssessmentModel(cathodeTemplate, cathodeValues);
  const anodeModel = buildAssessmentModel(anodeTemplate, anodeValues);

  return {
    demoSuppliers: [
      {
        id: 1,
        name: 'test-A',
        contact_person: 'test',
        contact_phone: 'test',
        category: supplierCategoryByIndex(0),
        srm_code: 'test',
      },
      {
        id: 2,
        name: 'test-B',
        contact_person: 'test',
        contact_phone: 'test',
        category: supplierCategoryByIndex(1),
        srm_code: 'test',
      },
      {
        id: 3,
        name: 'test-C',
        contact_person: 'test',
        contact_phone: 'test',
        category: supplierCategoryByIndex(2),
        srm_code: 'test',
      },
      {
        id: 4,
        name: 'test-D',
        contact_person: 'test',
        contact_phone: 'test',
        category: supplierCategoryByIndex(3),
        srm_code: 'test',
      },
      {
        id: 5,
        name: 'test-E',
        contact_person: 'test',
        contact_phone: 'test',
        category: supplierCategoryByIndex(4),
        srm_code: 'test',
      },
      {
        id: 6,
        name: 'test-F',
        contact_person: 'test',
        contact_phone: 'test',
        category: supplierCategoryByIndex(5),
        srm_code: 'test',
      },
      {
        id: 7,
        name: 'test-G',
        contact_person: 'test',
        contact_phone: 'test',
        category: supplierCategoryByIndex(6),
        srm_code: 'test',
      },
      {
        id: 8,
        name: 'test-H',
        contact_person: 'test',
        contact_phone: 'test',
        category: supplierCategoryByIndex(7),
        srm_code: 'test',
      },
      {
        id: 9,
        name: 'test-I',
        contact_person: 'test',
        contact_phone: 'test',
        category: supplierCategoryByIndex(8),
        srm_code: 'test',
      },
      {
        id: 10,
        name: 'test-J',
        contact_person: 'test',
        contact_phone: 'test',
        category: supplierCategoryByIndex(9),
        srm_code: 'test',
      },
      {
        id: 11,
        name: 'test-K',
        contact_person: 'test',
        contact_phone: 'test',
        category: supplierCategoryByIndex(10),
        srm_code: 'test',
      },
      {
        id: 12,
        name: 'test-L',
        contact_person: 'test',
        contact_phone: 'test',
        category: supplierCategoryByIndex(11),
        srm_code: 'test',
      },
    ],
    orgTargets: [
      {
        id: 1,
        year: 2025,
        org_level: '总部',
        org_name: 'test',
        baseline_emission: 120000,
        target_emission: 108000,
        monthly: monthly(
          [
            9800, 8420, 7980, 8250, 8680, 9350, 10120, 9920, 8720, 8510, 8890,
            9360,
          ],
          [
            10180, 8180, 7920, 8510, 8420, 9680, 9940, 10180, 8580, 8890, 8640,
            9120,
          ],
        ),
      },
      {
        id: 2,
        year: 2025,
        org_level: '工厂',
        org_name: 'test',
        baseline_emission: 45000,
        target_emission: 40500,
        monthly: monthly(
          [
            3680, 3160, 2990, 3090, 3260, 3510, 3790, 3720, 3270, 3190, 3330,
            3510,
          ],
          [
            3820, 3020, 2940, 3190, 3120, 3620, 3710, 3840, 3180, 3290, 3220,
            3380,
          ],
        ),
      },
    ],
    productTargets: [
      {
        id: 1,
        product_name: 'test',
        model: 'test',
        current_footprint: 85.2,
        target_footprint: 72.0,
        target_year: 2025,
        stages: [
          { stage: '原材料', current: 42, target: 35 },
          { stage: '生产制造', current: 28, target: 22 },
          { stage: '物流运输', current: 8, target: 6 },
          { stage: '使用阶段', current: 5, target: 5 },
          { stage: '回收处置', current: 2.2, target: 4 },
        ],
        paths: [
          { measure: '提升回收料比例至40%', reduction: 5.2, period: '6个月' },
          { measure: '绿电占比提升至60%', reduction: 3.5, period: '12个月' },
          { measure: '优化短途物流路线', reduction: 1.8, period: '3个月' },
        ],
        trend: [85.2, 83.5, 81.0, 78.5, 76.0, 74.0],
      },
      {
        id: 2,
        product_name: 'test',
        model: 'test',
        current_footprint: 62.5,
        target_footprint: 55.0,
        target_year: 2026,
        stages: [
          { stage: '原材料', current: 30, target: 26 },
          { stage: '生产制造', current: 20, target: 17 },
          { stage: '物流运输', current: 6, target: 5 },
          { stage: '使用阶段', current: 4, target: 4 },
          { stage: '回收处置', current: 2.5, target: 3 },
        ],
        paths: [
          { measure: '模组轻量化设计', reduction: 3.0, period: '9个月' },
          { measure: 'PACK产线绿电改造', reduction: 2.5, period: '12个月' },
        ],
        trend: [62.5, 61.0, 59.5, 58.0, 56.5, 55.0],
      },
    ],
    reductionTargets: seedReductionTargets(),
    reductionPlans: seedReductionPlans(),
    progressReports: seedProgressReports(),
    tasks: [
      {
        id: 1,
        name: '2025年度组织碳盘查调研',
        type: '组织碳盘查',
        supplier_ids: [1, 2],
        deadline: '2025-03-31',
        status: 'published',
        created_at: '2025-01-10',
        submissions: { 1: 'submitted', 2: 'pending' },
      },
      {
        id: 2,
        name: '动力电池产品碳足迹数据收集',
        type: '产品碳足迹',
        supplier_ids: [1, 3],
        deadline: '2025-04-30',
        status: 'published',
        created_at: '2025-01-15',
        submissions: { 1: 'submitted', 3: 'pending' },
      },
      {
        id: 3,
        name: '2024年度碳数据补录',
        type: '其他碳调研',
        supplier_ids: [2, 3],
        deadline: '2025-02-28',
        status: 'published',
        created_at: '2024-12-01',
        submissions: { 2: 'submitted', 3: 'submitted' },
      },
    ],
    formTemplates,
    formSubmissions: [
      {
        id: 1,
        supplier_id: 1,
        template_id: 1,
        task_id: 1,
        task_name: '2025年度组织碳盘查调研',
        values: cathodeValues,
        dimension_scores: cathodeModel.dimensionScores,
        score: cathodeModel.score,
        grade: cathodeModel.grade,
        summary: cathodeModel.summary,
        recommendations: cathodeModel.recommendations,
        model_version: 'v1.0-demo',
        report_no: 'RPT-2025-001',
        submitted_at: '2025-02-01',
        generated_at: '2025-02-01',
        valid_until: reportExpiredAt,
        status: 'generated',
      },
      {
        id: 2,
        supplier_id: 2,
        template_id: 2,
        task_id: 1,
        task_name: '2025年度组织碳盘查调研',
        values: anodeValues,
        dimension_scores: anodeModel.dimensionScores,
        score: anodeModel.score,
        grade: anodeModel.grade,
        summary: anodeModel.summary,
        recommendations: anodeModel.recommendations,
        model_version: 'v1.0-demo',
        report_no: 'RPT-2025-002',
        submitted_at: '2025-03-10',
        generated_at: '2025-03-10',
        valid_until: reportSoonAt,
        status: 'generated',
      },
      {
        id: 3,
        supplier_id: 3,
        template_id: 3,
        task_id: 2,
        task_name: '动力电池产品碳足迹数据收集',
        values: {
          production_base: 'test',
          product_model: 'test',
          accounting_period: '季度',
          accounting_boundary: '摇篮到大门',
          lif6_usage: 86,
          solvent_usage: 'EC/DMC/EMC 混合溶剂 420t',
          production_energy: 125000,
          waste_treatment: 12,
        },
        dimension_scores: [],
        score: 72,
        grade: 'C',
        summary: '基础数据完整，绿电与废弃物管理仍有提升空间。',
        recommendations: ['补充绿电采购证明', '完善溶剂回收台账'],
        model_version: 'v1.0-demo',
        report_no: 'RPT-2025-003',
        submitted_at: '2025-03-20',
        generated_at: '2025-03-20',
        valid_until: reportExpiredAt,
        status: 'expired',
      },
    ],
    researchSubmissions: [
      {
        id: 1,
        task_id: 1,
        task_name: '2025年度供应商低碳调研',
        supplier_id: 1,
        template_id: 1,
        values: cathodeValues,
        submitted_at: '2025-02-15',
        report_id: 1,
      },
      {
        id: 2,
        task_id: 1,
        task_name: '2025年度供应商低碳调研',
        supplier_id: 2,
        template_id: 2,
        values: anodeValues,
        submitted_at: '2025-03-28',
      },
      {
        id: 3,
        task_id: 4,
        task_name: '电解液产品碳足迹专项收集',
        supplier_id: 3,
        template_id: 3,
        values: {
          production_base: 'test',
          product_model: 'test',
          accounting_period: '季度',
          accounting_boundary: '摇篮到大门',
          lif6_usage: 86,
          solvent_usage: 'EC/DMC/EMC 混合溶剂 420t',
          production_energy: 125000,
          waste_treatment: 12,
          green_power_amount: 68000,
        },
        submitted_at: '2025-03-18',
        report_id: 3,
      },
    ],
    certificates: [
      {
        id: 1,
        supplier_id: 1,
        cert_category: '组织碳核查',
        cert_type: '组织碳核查证书',
        cert_no: 'ORG-2024-001',
        issuer: 'test',
        issued_at: '2024-06-01',
        expired_at: certExpiredAt,
        boundary: '集团组织边界（Scope 1+2）',
        file_name: '组织碳证书.pdf',
        attachments: [
          {
            id: 'seed-cert-1-v1-1',
            name: '组织碳证书.pdf',
            size: 245760,
            mime_type: 'application/pdf',
          },
          {
            id: 'seed-cert-1-v1-2',
            name: '核查报告摘要.docx',
            size: 128000,
            mime_type:
              'application/vnd.openxmlformats-officedocument.wordprocessingml.document',
          },
        ],
        version: 1,
        versions: [
          {
            version: 1,
            file_name: '组织碳证书.pdf',
            uploaded_at: '2024-06-01',
            cert_no: 'ORG-2024-001',
            expired_at: certExpiredAt,
            issuer: 'test',
            attachments: [
              {
                id: 'seed-cert-1-v1-1',
                name: '组织碳证书.pdf',
                size: 245760,
                mime_type: 'application/pdf',
              },
              {
                id: 'seed-cert-1-v1-2',
                name: '核查报告摘要.docx',
                size: 128000,
                mime_type:
                  'application/vnd.openxmlformats-officedocument.wordprocessingml.document',
              },
            ],
          },
        ],
        audit_status: 'approved',
        pipeline_status: 'ledger',
        archived_at: '2024-06-01',
        created_at: '2024-06-01',
      },
      {
        id: 2,
        supplier_id: 1,
        cert_category: '产品碳足迹',
        cert_type: '产品碳足迹认证',
        cert_no: 'PCF-2024-008',
        issuer: 'test',
        issued_at: '2024-09-01',
        expired_at: certSoonAt,
        boundary: 'G360-A 动力电池包全生命周期',
        file_name: '产品碳证书.pdf',
        attachments: [
          {
            id: 'seed-cert-2-v1-1',
            name: '产品碳证书.pdf',
            size: 198000,
            mime_type: 'application/pdf',
          },
        ],
        version: 1,
        versions: [
          {
            version: 1,
            file_name: '产品碳证书.pdf',
            uploaded_at: '2024-09-01',
            cert_no: 'PCF-2024-008',
            expired_at: certSoonAt,
            issuer: 'test',
            attachments: [
              {
                id: 'seed-cert-2-v1-1',
                name: '产品碳证书.pdf',
                size: 198000,
                mime_type: 'application/pdf',
              },
            ],
          },
        ],
        audit_status: 'approved',
        pipeline_status: 'ledger',
        archived_at: '2024-09-01',
        created_at: '2024-09-01',
      },
      {
        id: 3,
        supplier_id: 2,
        cert_category: 'ISO认证',
        cert_type: 'ISO 14064-1 证书',
        cert_no: 'ISO-2024-112',
        issuer: 'test',
        issued_at: '2024-03-15',
        expired_at: certValidAt,
        boundary: '制造企业运营边界',
        file_name: 'ISO14064证书.pdf',
        attachments: [
          {
            id: 'seed-cert-3-v2-1',
            name: 'ISO14064证书.pdf',
            size: 312000,
            mime_type: 'application/pdf',
          },
        ],
        version: 2,
        versions: [
          {
            version: 1,
            file_name: 'ISO14064证书_v1.pdf',
            uploaded_at: '2023-03-15',
            cert_no: 'ISO-2023-112',
            expired_at: '2024-03-14',
            issuer: 'test',
            attachments: [
              {
                id: 'seed-cert-3-v1-1',
                name: 'ISO14064证书_v1.pdf',
                size: 280000,
                mime_type: 'application/pdf',
              },
            ],
          },
          {
            version: 2,
            file_name: 'ISO14064证书.pdf',
            uploaded_at: '2024-03-15',
            cert_no: 'ISO-2024-112',
            expired_at: certValidAt,
            issuer: 'test',
            attachments: [
              {
                id: 'seed-cert-3-v2-1',
                name: 'ISO14064证书.pdf',
                size: 312000,
                mime_type: 'application/pdf',
              },
            ],
          },
        ],
        audit_status: 'approved',
        pipeline_status: 'ledger',
        archived_at: '2024-03-15',
        created_at: '2023-03-15',
      },
      {
        id: 4,
        supplier_id: 2,
        cert_category: '组织碳核查',
        cert_type: '组织碳核查证书',
        cert_no: 'ORG-2025-015',
        issuer: 'test',
        issued_at: '2025-01-10',
        expired_at: certValidAt,
        boundary: '负极材料生产边界',
        file_name: '组织碳核查_待审.pdf',
        attachments: [
          {
            id: 'seed-cert-4-v1-1',
            name: '组织碳核查_待审.pdf',
            size: 210000,
            mime_type: 'application/pdf',
          },
        ],
        version: 1,
        versions: [
          {
            version: 1,
            file_name: '组织碳核查_待审.pdf',
            uploaded_at: '2025-01-10',
            cert_no: 'ORG-2025-015',
            expired_at: certValidAt,
            issuer: 'test',
            attachments: [
              {
                id: 'seed-cert-4-v1-1',
                name: '组织碳核查_待审.pdf',
                size: 210000,
                mime_type: 'application/pdf',
              },
            ],
          },
        ],
        audit_status: 'pending',
        pipeline_status: 'identify',
        archived_at: '',
        created_at: '2025-01-10',
      },
      {
        id: 5,
        supplier_id: 3,
        cert_category: '客户指定',
        cert_type: '绿电使用证明',
        cert_no: 'GE-2024-003',
        issuer: 'test',
        issued_at: '2024-11-01',
        expired_at: certSoonAt,
        boundary: '2024年度用电',
        file_name: '绿电证明.pdf',
        attachments: [
          {
            id: 'seed-cert-5-v1-1',
            name: '绿电证明.pdf',
            size: 156000,
            mime_type: 'application/pdf',
          },
        ],
        version: 1,
        versions: [
          {
            version: 1,
            file_name: '绿电证明.pdf',
            uploaded_at: '2024-11-01',
            cert_no: 'GE-2024-003',
            expired_at: certSoonAt,
            issuer: 'test',
            attachments: [
              {
                id: 'seed-cert-5-v1-1',
                name: '绿电证明.pdf',
                size: 156000,
                mime_type: 'application/pdf',
              },
            ],
          },
        ],
        audit_status: 'rejected',
        pipeline_status: 'upload',
        archived_at: '',
        created_at: '2024-11-01',
        updated_at: '2025-02-01',
      },
      {
        id: 6,
        supplier_id: 3,
        cert_category: '产品碳足迹',
        cert_type: '产品碳足迹认证',
        cert_no: 'PCF-2025-006',
        issuer: 'test',
        issued_at: '2025-02-01',
        expired_at: certValidAt,
        boundary: 'EL-622 电解液摇篮到大门',
        file_name: '电解液产品碳证书.pdf',
        attachments: [
          {
            id: 'seed-cert-6-v1-1',
            name: '电解液产品碳证书.pdf',
            size: 176000,
            mime_type: 'application/pdf',
          },
        ],
        version: 1,
        versions: [
          {
            version: 1,
            file_name: '电解液产品碳证书.pdf',
            uploaded_at: '2025-02-01',
            cert_no: 'PCF-2025-006',
            expired_at: certValidAt,
            issuer: 'test',
            attachments: [
              {
                id: 'seed-cert-6-v1-1',
                name: '电解液产品碳证书.pdf',
                size: 176000,
                mime_type: 'application/pdf',
              },
            ],
          },
        ],
        audit_status: 'approved',
        pipeline_status: 'ledger',
        archived_at: '2025-02-01',
        created_at: '2025-02-01',
      },
    ],
    trainings: [
      {
        id: 1,
        title: '供应商系统填报指引',
        type: '操作指引',
        summary: '介绍平台登录、任务填报、证书上传等操作流程。',
        content:
          '<h3>一、平台登录</h3><p>供应商使用企业下发的账号登录碳云平台，进入供应商工作台。</p><h3>二、任务填报</h3><ul><li>在任务中心查看企业下发任务</li><li>进入定制数据填报完成专属表单</li><li>上传资质证书并等待审核</li></ul>',
        attachment_name: '供应商系统填报指引.html',
        status: 'published',
        applicable: 'all',
        created_at: '2025-01-01',
        updated_at: '2025-01-01',
        updated_by: '管理员',
      },
      {
        id: 2,
        title: '碳核算基础知识',
        type: '基础知识',
        summary: '范围1/2/3排放概念、组织碳与产品碳区别、常用标准介绍。',
        content:
          '<h3>一、碳排放范围</h3><p><strong>范围1</strong>：企业直接排放；<strong>范围2</strong>：外购电力热力间接排放；<strong>范围3</strong>：价值链其他间接排放。</p>',
        attachment_name: '碳核算基础知识.html',
        status: 'published',
        applicable: 'all',
        created_at: '2025-01-05',
        updated_at: '2025-01-05',
        updated_by: '李四',
      },
      {
        id: 3,
        title: '平台操作说明',
        type: '平台说明',
        summary: '平台菜单、角色切换、资料查看与下载说明。',
        content:
          '<h3>一、角色说明</h3><p>企业端负责目标下发、审核和培训资料配置；供应商端负责填报、上传和学习。</p>',
        attachment_name: '平台操作说明.html',
        status: 'published',
        applicable: 'all',
        created_at: '2025-01-08',
        updated_at: '2025-01-08',
        updated_by: '王五',
      },
      {
        id: 4,
        title: '2025年供应链降碳政策解读（草稿）',
        type: '政策解读',
        summary: '待发布的政策解读资料，仅管理端可见。',
        content: '<p>草稿内容...</p>',
        attachment_name: '',
        status: 'draft',
        applicable: 'all',
        created_at: '2025-03-01',
        updated_at: '2025-03-01',
        updated_by: '管理员',
      },
    ],
    questionBank: [
      {
        id: 101,
        question_type: 'judge',
        content: '是否开展碳排放核算？',
        hint: '',
        is_required: true,
        options: [],
        sort_order: 0,
      },
      {
        id: 102,
        question_type: 'fill',
        content: '请描述主要减排措施',
        hint: '可列举节能改造、绿电采购等',
        is_required: true,
        options: [],
        sort_order: 1,
      },
      {
        id: 103,
        question_type: 'single',
        content: '贵司碳管理体系建设阶段',
        hint: '',
        is_required: true,
        options: [
          { content: '尚未启动', allow_fill: false, fill_required: false },
          { content: '规划阶段', allow_fill: false, fill_required: false },
          { content: '已建立体系', allow_fill: false, fill_required: false },
        ],
        sort_order: 2,
      },
    ],
    questionnaires: [
      {
        id: 1,
        name: '2025年度供应商低碳调研',
        description: '收集供应商碳管理基础信息，用于供应链碳评估。',
        organization: 'test',
        deadline: '2025-06-30',
        status: 'published',
        created_at: '2025-01-10',
        template_id: cathodeTemplate.id,
        template_name: cathodeTemplate.name,
        ...cloneTemplateFormStructure(cathodeTemplate),
        supplier_ids: [1, 2, 3],
        supplier_status: { 1: 'submitted', 2: 'pending', 3: 'pending' },
        supplier_answers: {
          1: cathodeValues,
        },
      },
      {
        id: 2,
        name: '2024年度碳管理复盘调研',
        description: '已结束的年度复盘任务，仅供查看历史填报。',
        organization: 'test',
        deadline: '2024-12-31',
        status: 'ended',
        created_at: '2024-10-01',
        template_id: anodeTemplate.id,
        template_name: anodeTemplate.name,
        ...cloneTemplateFormStructure(anodeTemplate),
        supplier_ids: [1, 2],
        supplier_status: { 1: 'submitted', 2: 'submitted' },
        supplier_answers: {
          1: cathodeValues,
          2: anodeValues,
        },
      },
      {
        id: 3,
        name: '2025年Q2专项数据收集（草稿）',
        description: '管理端草稿，尚未发布。',
        organization: 'test',
        deadline: '2025-08-31',
        status: 'draft',
        created_at: '2025-03-15',
        template_id: cathodeTemplate.id,
        template_name: cathodeTemplate.name,
        ...cloneTemplateFormStructure(cathodeTemplate),
        supplier_ids: [1, 2, 3],
        supplier_status: {},
        supplier_answers: {},
      },
      {
        id: 4,
        name: '电解液产品碳足迹专项收集',
        description:
          '针对电解液供应商的专属数据填报，依据企业下发模板字段采集。',
        organization: 'test',
        deadline: '2025-07-31',
        status: 'published',
        created_at: '2025-03-20',
        template_id: electrolyteTemplate.id,
        template_name: electrolyteTemplate.name,
        ...cloneTemplateFormStructure(electrolyteTemplate),
        supplier_ids: [3],
        supplier_status: { 3: 'submitted' },
        supplier_answers: {
          3: {
            production_base: 'test',
            product_model: 'test',
            accounting_period: '季度',
            accounting_boundary: '摇篮到大门',
            lif6_usage: 86,
            solvent_usage: 'EC/DMC/EMC 混合溶剂 420t',
            production_energy: 125000,
            waste_treatment: 12,
            green_power_amount: 68000,
          },
        },
      },
      {
        id: 5,
        name: '2025年上半年绿电使用填报',
        description: '收集各供应商绿电采购与自发自用情况。',
        organization: 'test',
        deadline: '2025-05-31',
        status: 'published',
        created_at: '2025-03-25',
        template_id: cathodeTemplate.id,
        template_name: cathodeTemplate.name,
        ...cloneTemplateFormStructure(cathodeTemplate),
        supplier_ids: [1, 2, 3],
        supplier_status: { 1: 'pending', 2: 'submitted', 3: 'pending' },
        supplier_answers: {
          2: {
            ...anodeValues,
            green_power_cert: '可再生电力占比 42%',
          },
        },
      },
      {
        id: 6,
        name: '2024年供应商碳管理成熟度评估',
        description: '已结束的历史调研任务。',
        organization: 'test',
        deadline: '2024-11-30',
        status: 'ended',
        created_at: '2024-09-01',
        template_id: anodeTemplate.id,
        template_name: anodeTemplate.name,
        ...cloneTemplateFormStructure(anodeTemplate),
        supplier_ids: [1, 2, 3],
        supplier_status: { 1: 'submitted', 2: 'submitted', 3: 'submitted' },
        supplier_answers: {
          1: cathodeValues,
          2: anodeValues,
          3: {
            production_base: 'test',
            product_model: 'test',
            accounting_period: '年度',
            accounting_boundary: '摇篮到大门',
            lif6_usage: 320,
            solvent_usage: 'EC/DMC/EMC 混合溶剂 1580t',
            production_energy: 480000,
            waste_treatment: 38,
            green_power_amount: 210000,
          },
        },
      },
      {
        id: 7,
        name: '2026年度供应商碳数据调研',
        description:
          '收集供应商2026年度碳排放与能源使用数据，用于供应链碳评估。',
        organization: 'test',
        deadline: '2026-12-31',
        status: 'published',
        created_at: '2026-08-21',
        template_id: cathodeTemplate.id,
        template_name: cathodeTemplate.name,
        ...cloneTemplateFormStructure(cathodeTemplate),
        supplier_ids: [1, 2, 3],
        supplier_status: { 1: 'pending', 2: 'pending', 3: 'pending' },
        supplier_answers: {},
      },
    ],
    nextId: {
      orgTarget: 3,
      productTarget: 3,
      reductionTarget: 10,
      reductionPlan: 13,
      progressReport: 8,
      task: 4,
      formSub: 4,
      researchSub: 4,
      formTemplate: 6,
      questionnaire: 8,
      questionBank: 104,
      cert: 7,
      training: 5,
    },
  };
}

export const DEMO_STORAGE_KEY = 'carbon_platform_demo_data';

export function supplierName(data: DemoData, id: number) {
  return data.demoSuppliers.find(s => s.id === id)?.name || '-';
}

export function supplierCategory(data: DemoData, supplierId: number) {
  return data.demoSuppliers.find(s => s.id === supplierId)?.category || '-';
}

export function getTemplateBySupplier(data: DemoData, supplierId: number) {
  const category = supplierCategory(data, supplierId);
  return data.formTemplates.find(template => template.category === category);
}

export function getTemplateById(data: DemoData, templateId: number) {
  return data.formTemplates.find(template => template.id === templateId);
}

/** 与 useUserRole.ROLE_INFO 保持一致 */
export function demoSupplierIdFromRole(role: string): number {
  const map: Record<string, number> = {
    supplierA: 1,
    supplierB: 2,
    supplierC: 3,
    admin: 0,
  };
  return map[role] ?? 1;
}
