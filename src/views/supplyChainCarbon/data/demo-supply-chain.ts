import type { DemoData, DemoSupplier } from './demo-data';
import { supplierName } from './demo-data';

export type ReductionTargetStatus =
  | 'draft'
  | 'pushed'
  | 'confirmed'
  | 'modified';

export function canEditReductionTarget(status: ReductionTargetStatus): boolean {
  return status === 'draft';
}

export function canPushReductionTarget(status: ReductionTargetStatus): boolean {
  return status === 'draft';
}
export type ReductionPlanStatus =
  | 'to_fill'
  | 'draft'
  | 'pending'
  | 'approved'
  | 'rejected';

export type ReductionCategory = 'org' | 'product';

export interface OrgCarbonTarget {
  scope1_prev_emission?: number;
  scope1_reduction_ratio?: number;
  scope1_target_emission?: number;
  scope2_prev_emission?: number;
  scope2_reduction_ratio?: number;
  scope2_target_emission?: number;
}

export interface ProductCarbonTarget {
  product_name?: string;
  prev_footprint?: number;
  functional_unit?: string;
  reduction_ratio?: number;
  target_footprint?: number;
}

export interface DemoReductionTarget {
  id: number;
  supplier_id: number;
  target_value: string;
  baseline_year?: number;
  deadline?: string;
  suggestions?: string;
  attachments?: unknown;
  status: ReductionTargetStatus;
  created_at: string;
  categories?: ReductionCategory[];
  org_carbon?: OrgCarbonTarget;
  product_carbon?: ProductCarbonTarget;
}

export interface DemoReductionPlan {
  id: number;
  target_id: number;
  supplier_id: number;
  plan_name: string;
  reduction_month?: number;
  /** 本月是否减排：是 / 否 */
  reduce_this_month?: 'yes' | 'no';
  /** 当月实际排放量（tCO2e） */
  actual_emission?: number;
  /** 减排类别：组织碳 / 产品碳 */
  reduction_category?: ReductionCategory;
  measures: string;
  /** 当月减排量（tCO2e） */
  monthly_reduction?: number;
  time_nodes?: string;
  expected_reduction?: string;
  responsible_person?: string;
  attachments?: unknown;
  status: ReductionPlanStatus;
  review_comment?: string;
  submitted_at?: string | null;
  reviewed_at?: string | null;
  created_at: string;
  updated_at?: string;
}

export interface DemoProgressReport {
  id: number;
  plan_id: number;
  supplier_id: number;
  report_date: string;
  completion_status: string;
  current_reduction?: string;
  proof_files?: string[] | null;
  created_at: string;
}

export interface TargetWithSupplier extends DemoReductionTarget {
  suppliers: Pick<
    DemoSupplier,
    'id' | 'name' | 'contact_person' | 'contact_phone' | 'srm_code'
  >;
}

export interface PlanWithSupplier extends DemoReductionPlan {
  suppliers: Pick<DemoSupplier, 'id' | 'name' | 'srm_code'>;
  reduction_targets?: Pick<
    DemoReductionTarget,
    'id' | 'target_value' | 'baseline_year'
  >;
}

export interface ProgressWithPlan extends DemoProgressReport {
  reduction_plans: PlanWithSupplier;
}

function supplierBrief(data: DemoData, supplierId: number) {
  const supplier = data.demoSuppliers.find(item => item.id === supplierId);
  return {
    id: supplierId,
    name: supplier?.name || supplierName(data, supplierId),
    contact_person: supplier?.contact_person || '',
    contact_phone: supplier?.contact_phone || '',
    srm_code: supplier?.srm_code || '',
  };
}

export function enrichTarget(
  data: DemoData,
  target: DemoReductionTarget,
): TargetWithSupplier {
  return {
    ...target,
    suppliers: supplierBrief(data, target.supplier_id),
  };
}

export function enrichPlan(
  data: DemoData,
  plan: DemoReductionPlan,
): PlanWithSupplier {
  const target = data.reductionTargets.find(item => item.id === plan.target_id);
  const supplier = data.demoSuppliers.find(item => item.id === plan.supplier_id);
  return {
    ...plan,
    suppliers: {
      id: plan.supplier_id,
      name: supplierName(data, plan.supplier_id),
      srm_code: supplier?.srm_code || '',
    },
    reduction_targets: target
      ? {
          id: target.id,
          target_value: target.target_value,
          baseline_year: target.baseline_year,
        }
      : undefined,
  };
}

export function enrichProgress(
  data: DemoData,
  report: DemoProgressReport,
): ProgressWithPlan {
  const plan = data.reductionPlans.find(item => item.id === report.plan_id);
  return {
    ...report,
    reduction_plans: plan ? enrichPlan(data, plan) : ({} as PlanWithSupplier),
  };
}

export function listTargets(
  data: DemoData,
  filters?: { supplier_id?: number; status?: string },
): TargetWithSupplier[] {
  return data.reductionTargets
    .filter(target => {
      if (filters?.supplier_id && target.supplier_id !== filters.supplier_id)
        return false;
      if (filters?.status && target.status !== filters.status) return false;
      return true;
    })
    .map(target => enrichTarget(data, target))
    .sort((a, b) => b.id - a.id);
}

export function listPlans(
  data: DemoData,
  filters?: { supplier_id?: number; status?: string },
): PlanWithSupplier[] {
  return data.reductionPlans
    .filter(plan => {
      if (filters?.supplier_id && plan.supplier_id !== filters.supplier_id)
        return false;
      if (filters?.status && plan.status !== filters.status) return false;
      return true;
    })
    .map(plan => enrichPlan(data, plan))
    .sort((a, b) => b.id - a.id);
}

export function listProgressReports(
  data: DemoData,
  filters?: { supplier_id?: number },
): ProgressWithPlan[] {
  return data.progressReports
    .filter(report =>
      filters?.supplier_id ? report.supplier_id === filters.supplier_id : true,
    )
    .map(report => enrichProgress(data, report))
    .sort(
      (a, b) =>
        new Date(b.report_date).getTime() - new Date(a.report_date).getTime(),
    );
}

export interface OrgCarbonProgressRow {
  id: string;
  supplier_id: number;
  supplier_name: string;
  srm_code: string;
  prev_emission?: number;
  reduction_ratio?: number;
  target_emission?: number;
  monthly_actual: number[];
  total_actual: number;
  achievement_rate?: number;
}

function generateMonthlyActual(
  supplierId: number,
  scope: 'scope1' | 'scope2',
  targetEmission?: number,
): number[] {
  const monthlyTarget = (targetEmission ?? 0) / 12;
  return Array.from({ length: 12 }, (_, index) => {
    const offset = scope === 'scope1' ? 1 : 2;
    const factor =
      0.82 +
      ((supplierId * 7 + index * 3 + offset * 5) % 28) / 100;
    return Number((monthlyTarget * factor).toFixed(2));
  });
}

export function listOrgCarbonProgress(
  data: DemoData,
  scope: 'scope1' | 'scope2',
  supplierKeyword = '',
  targetYear: number | 'all' = 'all',
): OrgCarbonProgressRow[] {
  const keyword = supplierKeyword.trim().toLowerCase();
  return data.reductionTargets
    .filter(
      target =>
        target.categories?.includes('org') &&
        target.org_carbon &&
        (targetYear === 'all' || target.baseline_year === targetYear) &&
        (!keyword ||
          supplierName(data, target.supplier_id)
            .toLowerCase()
            .includes(keyword) ||
          (data.demoSuppliers.find(item => item.id === target.supplier_id)
            ?.srm_code || '')
            .toLowerCase()
            .includes(keyword)),
    )
    .map(target => {
      const supplier = data.demoSuppliers.find(
        item => item.id === target.supplier_id,
      );
      const org = target.org_carbon!;
      const prevEmission =
        scope === 'scope1'
          ? org.scope1_prev_emission
          : org.scope2_prev_emission;
      const reductionRatio =
        scope === 'scope1'
          ? org.scope1_reduction_ratio
          : org.scope2_reduction_ratio;
      const targetEmission =
        scope === 'scope1'
          ? org.scope1_target_emission
          : org.scope2_target_emission;
      const monthlyActual = generateMonthlyActual(
        target.supplier_id,
        scope,
        targetEmission,
      );
      const totalActual = Number(
        monthlyActual.reduce((sum, value) => sum + value, 0).toFixed(2),
      );
      const achievementRate =
        targetEmission && targetEmission > 0
          ? Number(((totalActual / targetEmission) * 100).toFixed(1))
          : undefined;

      return {
        id: `${scope}-${target.id}`,
        supplier_id: target.supplier_id,
        supplier_name: supplier?.name || supplierName(data, target.supplier_id),
        srm_code: supplier?.srm_code || '',
        prev_emission: prevEmission,
        reduction_ratio: reductionRatio,
        target_emission: targetEmission,
        monthly_actual: monthlyActual,
        total_actual: totalActual,
        achievement_rate: achievementRate,
      };
    });
}

export interface OrgCarbonChartRow {
  supplier_name: string;
  scope1_target: number;
  scope2_target: number;
  scope1_actual: number;
  scope2_actual: number;
}

export function listOrgCarbonChartData(
  data: DemoData,
  supplierKeyword = '',
  targetYear: number | 'all' = 'all',
): OrgCarbonChartRow[] {
  const scope1Rows = listOrgCarbonProgress(
    data,
    'scope1',
    supplierKeyword,
    targetYear,
  );
  const scope2Rows = listOrgCarbonProgress(
    data,
    'scope2',
    supplierKeyword,
    targetYear,
  );
  const supplierMap = new Map<string, OrgCarbonChartRow>();

  const ensureRow = (supplierName: string) => {
    if (!supplierMap.has(supplierName)) {
      supplierMap.set(supplierName, {
        supplier_name: supplierName,
        scope1_target: 0,
        scope2_target: 0,
        scope1_actual: 0,
        scope2_actual: 0,
      });
    }
    return supplierMap.get(supplierName)!;
  };

  scope1Rows.forEach(row => {
    const current = ensureRow(row.supplier_name);
    current.scope1_target += row.target_emission ?? 0;
    current.scope1_actual += row.total_actual;
  });

  scope2Rows.forEach(row => {
    const current = ensureRow(row.supplier_name);
    current.scope2_target += row.target_emission ?? 0;
    current.scope2_actual += row.total_actual;
  });

  return Array.from(supplierMap.values());
}

export interface ProductCarbonProgressRow {
  id: string;
  supplier_id: number;
  supplier_name: string;
  srm_code: string;
  product_name?: string;
  prev_footprint?: number;
  reduction_ratio?: number;
  target_footprint?: number;
  monthly_actual: number[];
  total_actual: number;
  achievement_rate?: number;
}

function generateMonthlyProductFootprint(
  supplierId: number,
  targetId: number,
  targetFootprint?: number,
): number[] {
  const base = targetFootprint ?? 0;
  return Array.from({ length: 12 }, (_, index) => {
    const factor =
      0.84 +
      ((supplierId * 5 + targetId * 3 + index * 4) % 26) / 100;
    return Number((base * factor).toFixed(2));
  });
}

export function listProductCarbonProgress(
  data: DemoData,
  filters: {
    supplierKeyword?: string;
    productKeyword?: string;
    targetYear?: number | 'all';
  } = {},
): ProductCarbonProgressRow[] {
  const supplierKeyword = (filters.supplierKeyword ?? '').trim().toLowerCase();
  const productKeyword = (filters.productKeyword ?? '').trim().toLowerCase();
  const targetYear = filters.targetYear ?? 'all';

  return data.reductionTargets
    .filter(target => {
      if (!target.categories?.includes('product') || !target.product_carbon) {
        return false;
      }
      if (targetYear !== 'all' && target.baseline_year !== targetYear) {
        return false;
      }
      if (supplierKeyword) {
        const name = supplierName(data, target.supplier_id).toLowerCase();
        const code = (
          data.demoSuppliers.find(item => item.id === target.supplier_id)
            ?.srm_code || ''
        ).toLowerCase();
        if (!name.includes(supplierKeyword) && !code.includes(supplierKeyword)) {
          return false;
        }
      }
      if (productKeyword) {
        const product = (target.product_carbon.product_name || '').toLowerCase();
        if (!product.includes(productKeyword)) {
          return false;
        }
      }
      return true;
    })
    .map(target => {
      const supplier = data.demoSuppliers.find(
        item => item.id === target.supplier_id,
      );
      const product = target.product_carbon!;
      const targetFootprint = product.target_footprint;
      const monthlyActual = generateMonthlyProductFootprint(
        target.supplier_id,
        target.id,
        targetFootprint,
      );
      const totalActual = Number(
        monthlyActual.reduce((sum, value) => sum + value, 0).toFixed(2),
      );
      const annualTarget =
        targetFootprint != null ? targetFootprint * 12 : undefined;
      const achievementRate =
        annualTarget && annualTarget > 0
          ? Number(((totalActual / annualTarget) * 100).toFixed(1))
          : undefined;

      return {
        id: `product-${target.id}`,
        supplier_id: target.supplier_id,
        supplier_name: supplier?.name || supplierName(data, target.supplier_id),
        srm_code: supplier?.srm_code || '',
        product_name: product.product_name,
        prev_footprint: product.prev_footprint,
        reduction_ratio: product.reduction_ratio,
        target_footprint: targetFootprint,
        monthly_actual: monthlyActual,
        total_actual: totalActual,
        achievement_rate: achievementRate,
      };
    });
}

export function pushReductionTarget(
  data: DemoData,
  targetId: number,
): DemoData {
  return {
    ...data,
    reductionTargets: data.reductionTargets.map(target =>
      target.id === targetId ? { ...target, status: 'pushed' } : target,
    ),
  };
}

export function confirmReductionTarget(
  data: DemoData,
  targetId: number,
): DemoData {
  const next: DemoData = {
    ...data,
    reductionTargets: data.reductionTargets.map(target =>
      target.id === targetId ? { ...target, status: 'confirmed' } : target,
    ),
  };
  return generateMonthlyPlansForTarget(next, targetId);
}

export function modifyReductionTarget(
  data: DemoData,
  targetId: number,
): DemoData {
  const next: DemoData = {
    ...data,
    reductionTargets: data.reductionTargets.map(target =>
      target.id === targetId ? { ...target, status: 'modified' } : target,
    ),
  };
  return generateMonthlyPlansForTarget(next, targetId);
}

function defaultMonthlyPlanName(month: number) {
  return `${month}月减排计划`;
}

/** 目标确认或修改后，为对应目标补齐 1–12 月减排计划（初始状态：待填报） */
export function generateMonthlyPlansForTarget(
  data: DemoData,
  targetId: number,
): DemoData {
  const target = data.reductionTargets.find(item => item.id === targetId);
  if (!target) return data;

  const existingForTarget = data.reductionPlans.filter(
    plan => plan.target_id === targetId,
  );
  const lockedStatuses: ReductionPlanStatus[] = [
    'pending',
    'approved',
    'rejected',
  ];

  let next = data;

  for (let month = 1; month <= 12; month += 1) {
    const existing = existingForTarget.find(
      plan => plan.reduction_month === month,
    );

    if (existing) {
      if (lockedStatuses.includes(existing.status)) continue;
      if (existing.status === 'to_fill' || existing.status === 'draft') {
        next = updateReductionPlan(next, existing.id, {
          status: 'to_fill',
          plan_name: existing.plan_name || defaultMonthlyPlanName(month),
          submitted_at: null,
        });
      }
      continue;
    }

    next = addReductionPlan(next, {
      target_id: targetId,
      supplier_id: target.supplier_id,
      plan_name: defaultMonthlyPlanName(month),
      reduction_month: month,
      measures: '',
      status: 'to_fill',
      submitted_at: null,
    });
  }

  return next;
}

export function reviewReductionPlan(
  data: DemoData,
  planId: number,
  status: 'approved' | 'rejected',
  review_comment?: string,
): DemoData {
  const reviewedAt = new Date().toISOString().slice(0, 10);
  return {
    ...data,
    reductionPlans: data.reductionPlans.map(plan =>
      plan.id === planId
        ? {
            ...plan,
            status,
            review_comment,
            reviewed_at: reviewedAt,
            updated_at: reviewedAt,
          }
        : plan,
    ),
  };
}

export function canSupplierEditPlan(status: ReductionPlanStatus): boolean {
  return status === 'to_fill' || status === 'draft' || status === 'rejected';
}

export function canSupplierManagePlan(status: ReductionPlanStatus): boolean {
  return canSupplierEditPlan(status);
}

export function updateReductionPlan(
  data: DemoData,
  planId: number,
  payload: Partial<
    Omit<DemoReductionPlan, 'id' | 'created_at' | 'supplier_id'>
  >,
): DemoData {
  const updatedAt = new Date().toISOString().slice(0, 10);
  return {
    ...data,
    reductionPlans: data.reductionPlans.map(plan =>
      plan.id === planId
        ? { ...plan, ...payload, updated_at: updatedAt }
        : plan,
    ),
  };
}

export function deleteReductionPlan(data: DemoData, planId: number): DemoData {
  return {
    ...data,
    reductionPlans: data.reductionPlans.filter(plan => plan.id !== planId),
  };
}

export function updateReductionTarget(
  data: DemoData,
  targetId: number,
  payload: Partial<Omit<DemoReductionTarget, 'id' | 'created_at'>>,
): DemoData {
  return {
    ...data,
    reductionTargets: data.reductionTargets.map(target =>
      target.id === targetId ? { ...target, ...payload } : target,
    ),
  };
}

export function addReductionTarget(
  data: DemoData,
  payload: Omit<DemoReductionTarget, 'id' | 'created_at'>,
): DemoData {
  const id = data.nextId.reductionTarget ?? data.reductionTargets.length + 1;
  return {
    ...data,
    nextId: { ...data.nextId, reductionTarget: id + 1 },
    reductionTargets: [
      ...data.reductionTargets,
      { ...payload, id, created_at: new Date().toISOString().slice(0, 10) },
    ],
  };
}

export function addReductionPlan(
  data: DemoData,
  payload: Omit<DemoReductionPlan, 'id' | 'created_at'>,
): DemoData {
  const id = data.nextId.reductionPlan ?? data.reductionPlans.length + 1;
  const createdAt = new Date().toISOString().slice(0, 10);
  return {
    ...data,
    nextId: { ...data.nextId, reductionPlan: id + 1 },
    reductionPlans: [
      ...data.reductionPlans,
      {
        ...payload,
        id,
        created_at: createdAt,
        updated_at: payload.updated_at || createdAt,
      },
    ],
  };
}

export function addProgressReport(
  data: DemoData,
  payload: Omit<DemoProgressReport, 'id' | 'created_at'>,
): DemoData {
  const id = data.nextId.progressReport ?? data.progressReports.length + 1;
  return {
    ...data,
    nextId: { ...data.nextId, progressReport: id + 1 },
    progressReports: [
      ...data.progressReports,
      { ...payload, id, created_at: new Date().toISOString().slice(0, 10) },
    ],
  };
}

export function seedReductionTargets(): DemoReductionTarget[] {
  return [
    {
      id: 1,
      supplier_id: 1,
      target_value: '2025年范围1/2排放降低15%',
      baseline_year: 2023,
      deadline: '2025-12-31',
      suggestions: '建议推进绿电采购、产线节能改造与工艺优化。',
      status: 'confirmed',
      created_at: '2025-01-05',
      categories: ['org'],
      org_carbon: {
        scope1_prev_emission: 1000,
        scope1_reduction_ratio: 15,
        scope1_target_emission: 850,
        scope2_prev_emission: 2000,
        scope2_reduction_ratio: 12,
        scope2_target_emission: 1760,
      },
    },
    {
      id: 2,
      supplier_id: 1,
      target_value: '2026年产品碳强度降低10%',
      baseline_year: 2024,
      deadline: '2026-12-31',
      suggestions: '建议提升再生料比例并优化物流路径。',
      status: 'pushed',
      created_at: '2025-02-10',
      categories: ['product'],
      product_carbon: {
        product_name: '锂电池正极材料',
        prev_footprint: 12.5,
        functional_unit: 'kg',
        reduction_ratio: 10,
        target_footprint: 11.25,
      },
    },
    {
      id: 3,
      supplier_id: 2,
      target_value: '2025年范围1/2排放降低12%',
      baseline_year: 2023,
      deadline: '2025-12-31',
      suggestions: '建议实施余热回收与清洁运输替代。',
      status: 'draft',
      created_at: '2025-01-08',
      categories: ['org'],
      org_carbon: {
        scope1_prev_emission: 820,
        scope1_reduction_ratio: 12,
        scope1_target_emission: 721.6,
        scope2_prev_emission: 1560,
        scope2_reduction_ratio: 10,
        scope2_target_emission: 1404,
      },
    },
    {
      id: 4,
      supplier_id: 2,
      target_value: '2025年单位产值碳排放降低8%',
      baseline_year: 2024,
      deadline: '2025-09-30',
      suggestions: '建议开展能源管理体系认证。',
      status: 'confirmed',
      created_at: '2025-01-20',
      categories: ['org'],
      org_carbon: {
        scope1_prev_emission: 680,
        scope1_reduction_ratio: 8,
        scope1_target_emission: 625.6,
        scope2_prev_emission: 1320,
        scope2_reduction_ratio: 8,
        scope2_target_emission: 1214.4,
      },
    },
    {
      id: 5,
      supplier_id: 3,
      target_value: '2025年生产过程碳排放降低10%',
      baseline_year: 2023,
      deadline: '2025-12-31',
      suggestions: '建议优化溶剂回收系统并提高绿电占比。',
      status: 'confirmed',
      created_at: '2025-01-12',
      categories: ['org'],
      org_carbon: {
        scope1_prev_emission: 540,
        scope1_reduction_ratio: 10,
        scope1_target_emission: 486,
        scope2_prev_emission: 980,
        scope2_reduction_ratio: 10,
        scope2_target_emission: 882,
      },
    },
    {
      id: 6,
      supplier_id: 3,
      target_value: '2025年供应链范围3降低6%',
      baseline_year: 2024,
      deadline: '2025-06-30',
      suggestions: '建议与上游原料供应商协同降碳。',
      status: 'pushed',
      created_at: '2025-03-01',
      categories: ['product'],
      product_carbon: {
        product_name: '电解液溶剂',
        prev_footprint: 8.6,
        functional_unit: 'L',
        reduction_ratio: 6,
        target_footprint: 8.08,
      },
    },
    {
      id: 7,
      supplier_id: 1,
      target_value: '2025年包装环节碳排放降低5%',
      baseline_year: 2024,
      deadline: '2025-10-31',
      suggestions: '建议优化包装材质并推进循环周转箱。',
      status: 'draft',
      created_at: '2025-03-18',
      categories: ['product'],
      product_carbon: {
        product_name: '包装辅材',
        prev_footprint: 3.2,
        functional_unit: '套',
        reduction_ratio: 5,
        target_footprint: 3.04,
      },
    },
    {
      id: 8,
      supplier_id: 2,
      target_value: '2025年煅烧工序碳强度降低9%',
      baseline_year: 2023,
      deadline: '2025-11-30',
      suggestions: '建议开展石墨化余热深度回收利用。',
      status: 'modified',
      created_at: '2025-03-12',
      categories: ['org'],
      org_carbon: {
        scope1_prev_emission: 760,
        scope1_reduction_ratio: 9,
        scope1_target_emission: 691.6,
        scope2_prev_emission: 1480,
        scope2_reduction_ratio: 9,
        scope2_target_emission: 1346.8,
      },
    },
    {
      id: 9,
      supplier_id: 3,
      target_value: '2025年溶剂回收率提升至98%',
      baseline_year: 2024,
      deadline: '2025-08-31',
      suggestions: '建议升级蒸馏回收装置并完善计量台账。',
      status: 'draft',
      created_at: '2025-03-22',
      categories: ['product'],
      product_carbon: {
        product_name: 'NMP回收溶剂',
        prev_footprint: 6.8,
        functional_unit: 'kg',
        reduction_ratio: 8,
        target_footprint: 6.26,
      },
    },
  ];
}

export function seedReductionPlans(): DemoReductionPlan[] {
  return [
    {
      id: 1,
      target_id: 1,
      supplier_id: 1,
      plan_name: '正极产线绿电替代计划',
      reduction_month: 2,
      reduce_this_month: 'yes',
      actual_emission: 1250.5,
      reduction_category: 'org',
      monthly_reduction: 320,
      measures:
        '1. 屋顶光伏扩容 2MW\n2. 外购绿电协议续签\n3. 高耗能设备变频改造',
      time_nodes: '2025年Q1启动，Q4完成主体改造',
      expected_reduction: '320吨',
      responsible_person: '王工',
      status: 'approved',
      submitted_at: '2025-02-15',
      reviewed_at: '2025-02-20',
      created_at: '2025-02-01',
    },
    {
      id: 2,
      target_id: 1,
      supplier_id: 1,
      plan_name: '回收料提升专项',
      reduction_month: 3,
      reduce_this_month: 'yes',
      actual_emission: 980,
      reduction_category: 'org',
      monthly_reduction: 45,
      measures: '提升再生锂、再生钴使用比例，建立供应商追溯台账。',
      time_nodes: '2025年Q2–Q3',
      expected_reduction: '180吨',
      responsible_person: '李经理',
      status: 'pending',
      submitted_at: '2025-03-05',
      created_at: '2025-02-28',
    },
    {
      id: 3,
      target_id: 1,
      supplier_id: 1,
      plan_name: '物流路线优化（草稿）',
      reduction_month: 4,
      measures: '短途运输电动化、包装减重方案评估。',
      time_nodes: '2025年下半年',
      expected_reduction: '90吨',
      responsible_person: '张主管',
      status: 'to_fill',
      submitted_at: null,
      created_at: '2025-03-10',
    },
    {
      id: 4,
      target_id: 1,
      supplier_id: 1,
      plan_name: '锅炉低氮改造（已驳回）',
      reduction_month: 1,
      reduce_this_month: 'yes',
      actual_emission: 560,
      reduction_category: 'org',
      monthly_reduction: 60,
      measures: '天然气锅炉低氮燃烧器改造。',
      time_nodes: '2025年Q1',
      expected_reduction: '60吨',
      responsible_person: '赵工',
      status: 'rejected',
      review_comment: '减排量测算依据不足，请补充第三方核查数据后重新提交。',
      submitted_at: '2025-01-25',
      reviewed_at: '2025-02-01',
      created_at: '2025-01-20',
    },
    {
      id: 5,
      target_id: 4,
      supplier_id: 2,
      plan_name: '负极煅烧余热回收',
      reduction_month: 2,
      measures: '煅烧炉余热用于干燥工序，减少天然气消耗。',
      time_nodes: '2025年Q2完成设备安装',
      expected_reduction: '240吨',
      responsible_person: '陈主任',
      status: 'approved',
      submitted_at: '2025-02-08',
      reviewed_at: '2025-02-12',
      created_at: '2025-02-01',
    },
    {
      id: 6,
      target_id: 4,
      supplier_id: 2,
      plan_name: '石墨化工艺优化',
      reduction_month: 3,
      measures: '优化升温曲线，降低单位产品电耗。',
      time_nodes: '2025年Q3',
      expected_reduction: '150吨',
      responsible_person: '刘工',
      status: 'pending',
      submitted_at: '2025-03-12',
      created_at: '2025-03-01',
    },
    {
      id: 7,
      target_id: 5,
      supplier_id: 3,
      plan_name: '电解液溶剂回收升级',
      reduction_month: 2,
      measures: '溶剂蒸馏回收率由 92% 提升至 97%。',
      time_nodes: '2025年Q2',
      expected_reduction: '110吨',
      responsible_person: '周经理',
      status: 'approved',
      submitted_at: '2025-02-20',
      reviewed_at: '2025-02-25',
      created_at: '2025-02-10',
    },
    {
      id: 8,
      target_id: 5,
      supplier_id: 3,
      plan_name: '冷链运输电动化试点',
      reduction_month: 5,
      measures: '短途配送车辆电动化替换 30%。',
      time_nodes: '2025年Q3–Q4',
      expected_reduction: '70吨',
      responsible_person: '吴主管',
      status: 'to_fill',
      submitted_at: null,
      created_at: '2025-03-08',
    },
    {
      id: 9,
      target_id: 3,
      supplier_id: 2,
      plan_name: '天然气锅炉低氮改造',
      reduction_month: 2,
      measures: '锅炉燃烧器低氮改造及余热回收。',
      time_nodes: '2025年Q1',
      expected_reduction: '55吨',
      responsible_person: '赵工',
      status: 'rejected',
      review_comment: '请补充改造前后排放监测对比数据。',
      submitted_at: '2025-02-18',
      reviewed_at: '2025-02-22',
      created_at: '2025-02-10',
    },
    {
      id: 10,
      target_id: 4,
      supplier_id: 2,
      plan_name: '包装减量化方案（草稿）',
      reduction_month: 6,
      measures: '评估瓦楞箱减重与循环包装试点。',
      time_nodes: '2025年下半年',
      expected_reduction: '40吨',
      responsible_person: '孙主管',
      status: 'to_fill',
      submitted_at: null,
      created_at: '2025-03-16',
    },
    {
      id: 11,
      target_id: 5,
      supplier_id: 3,
      plan_name: '绿电采购扩容计划',
      reduction_month: 3,
      measures: '新增年度绿电采购 800 万 kWh。',
      time_nodes: '2025年Q2签约',
      expected_reduction: '95吨',
      responsible_person: '钱经理',
      status: 'pending',
      submitted_at: '2025-03-25',
      created_at: '2025-03-20',
    },
    {
      id: 12,
      target_id: 6,
      supplier_id: 3,
      plan_name: '原料运输路线优化',
      reduction_month: 3,
      measures: '合并短途运输班次，减少空驶里程。',
      time_nodes: '2025年Q3',
      expected_reduction: '35吨',
      responsible_person: '郑工',
      status: 'rejected',
      review_comment: '减排量测算口径需与范围3边界说明一致。',
      submitted_at: '2025-03-10',
      reviewed_at: '2025-03-14',
      created_at: '2025-03-05',
    },
  ];
}

export function seedProgressReports(): DemoProgressReport[] {
  return [
    {
      id: 1,
      plan_id: 1,
      supplier_id: 1,
      report_date: '2025-03-31',
      completion_status:
        '光伏一期并网完成，绿电采购协议已签署，设备改造进度 65%。',
      current_reduction: '120吨',
      proof_files: ['/uploads/proof-a-1.pdf'],
      created_at: '2025-03-31',
    },
    {
      id: 2,
      plan_id: 1,
      supplier_id: 1,
      report_date: '2025-02-28',
      completion_status: '完成现场勘察与施工招标，变频改造启动。',
      current_reduction: '45吨',
      proof_files: null,
      created_at: '2025-02-28',
    },
    {
      id: 3,
      plan_id: 5,
      supplier_id: 2,
      report_date: '2025-03-15',
      completion_status: '余热锅炉安装完成，进入调试阶段。',
      current_reduction: '80吨',
      proof_files: ['/uploads/proof-b-1.pdf'],
      created_at: '2025-03-15',
    },
    {
      id: 4,
      plan_id: 7,
      supplier_id: 3,
      report_date: '2025-03-20',
      completion_status: '蒸馏塔改造完成，回收率提升至 95%。',
      current_reduction: '55吨',
      proof_files: null,
      created_at: '2025-03-20',
    },
    {
      id: 5,
      plan_id: 2,
      supplier_id: 1,
      report_date: '2025-04-10',
      completion_status: '再生料供应商准入完成，首批再生钴投入使用。',
      current_reduction: '28吨',
      proof_files: ['/uploads/proof-a-2.pdf'],
      created_at: '2025-04-10',
    },
    {
      id: 6,
      plan_id: 6,
      supplier_id: 2,
      report_date: '2025-04-05',
      completion_status: '石墨化升温曲线优化完成首轮验证。',
      current_reduction: '32吨',
      proof_files: null,
      created_at: '2025-04-05',
    },
    {
      id: 7,
      plan_id: 7,
      supplier_id: 3,
      report_date: '2025-02-28',
      completion_status: '溶剂回收系统联调完成，进入试运行。',
      current_reduction: '22吨',
      proof_files: ['/uploads/proof-c-1.pdf'],
      created_at: '2025-02-28',
    },
  ];
}
