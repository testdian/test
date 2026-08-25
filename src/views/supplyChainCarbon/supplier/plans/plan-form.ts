import type {
  DemoReductionPlan,
  ReductionCategory,
} from '@/views/supplyChainCarbon/data/demo-supply-chain';

export const SUPPLIER_PLAN_FORM_NOTE =
  '减排计划按目标中的减排类别和月份分别生成，计划所属减排类别固定不可切换。组织碳分别展示范围一、范围二的当月实际排放量和当月减排量；产品碳仅展示当月实际产品碳足迹。供应商填报页、查看页与管理员计划审核页使用同一字段布局。';

export const MAX_PLAN_NAME_LENGTH = 100;
export const MAX_PLAN_MEASURES_LENGTH = 1000;

export type ReduceThisMonth = 'yes' | 'no';

export type SupplierPlanFormValues = {
  reduce_this_month?: ReduceThisMonth;
  actual_emission?: number;
  scope1_actual_emission?: number;
  scope1_monthly_reduction?: number;
  scope2_actual_emission?: number;
  scope2_monthly_reduction?: number;
  actual_product_footprint?: number;
  plan_name?: string;
  reduction_category?: ReductionCategory;
  reduction_month?: number;
  measures?: string;
  monthly_reduction?: number;
};

type PlanFormSource = DemoReductionPlan & {
  reduction_targets?: {
    categories?: ReductionCategory[];
  };
};

export const REDUCE_THIS_MONTH_OPTIONS = [
  { label: '是', value: 'yes' as const },
  { label: '否', value: 'no' as const },
];

export const PLAN_REDUCTION_CATEGORY_OPTIONS = [
  { label: '组织碳', value: 'org' as const },
  { label: '产品碳', value: 'product' as const },
];

export const REDUCE_THIS_MONTH_LABELS: Record<ReduceThisMonth, string> = {
  yes: '是',
  no: '否',
};

export const PLAN_CATEGORY_LABELS: Record<ReductionCategory, string> = {
  org: '组织碳',
  product: '产品碳',
};

export function inferReduceThisMonth(
  plan: DemoReductionPlan,
): ReduceThisMonth | undefined {
  if (plan.reduce_this_month) return plan.reduce_this_month;
  if (plan.status === 'to_fill' || plan.status === 'draft') return undefined;
  if (
    plan.plan_name ||
    plan.measures ||
    plan.monthly_reduction != null ||
    plan.reduction_category ||
    plan.scope1_actual_emission != null ||
    plan.scope2_actual_emission != null ||
    plan.actual_product_footprint != null
  ) {
    return 'yes';
  }
  if (plan.actual_emission != null) return 'no';
  return undefined;
}

export function planToFormValues(plan: PlanFormSource): SupplierPlanFormValues {
  const targetCategories = plan.reduction_targets?.categories || [];
  const inferredCategory =
    plan.reduction_category ||
    (targetCategories.length === 1 ? targetCategories[0] : undefined);
  return {
    reduce_this_month: inferReduceThisMonth(plan),
    actual_emission: plan.actual_emission,
    plan_name: plan.plan_name,
    reduction_category: inferredCategory,
    scope1_actual_emission:
      plan.scope1_actual_emission ??
      (inferredCategory === 'org' ? plan.actual_emission : undefined),
    scope1_monthly_reduction:
      plan.scope1_monthly_reduction ??
      (inferredCategory === 'org' ? plan.monthly_reduction : undefined),
    scope2_actual_emission: plan.scope2_actual_emission,
    scope2_monthly_reduction: plan.scope2_monthly_reduction,
    actual_product_footprint:
      plan.actual_product_footprint ??
      (inferredCategory === 'product' ? plan.actual_emission : undefined),
    reduction_month: plan.reduction_month,
    measures: plan.measures,
    monthly_reduction: plan.monthly_reduction,
  };
}

export function formValuesToPlanPayload(
  values: SupplierPlanFormValues,
): Partial<DemoReductionPlan> {
  if (values.reduce_this_month === 'no') {
    return {
      reduce_this_month: 'no',
      actual_emission: undefined,
      monthly_reduction: undefined,
      reduction_category: values.reduction_category,
      scope1_actual_emission: values.scope1_actual_emission,
      scope1_monthly_reduction: values.scope1_monthly_reduction,
      scope2_actual_emission: values.scope2_actual_emission,
      scope2_monthly_reduction: values.scope2_monthly_reduction,
      actual_product_footprint: values.actual_product_footprint,
      plan_name: '',
      measures: '',
    };
  }

  return {
    reduce_this_month: 'yes',
    actual_emission: undefined,
    monthly_reduction: undefined,
    plan_name: values.plan_name?.trim() || '',
    reduction_category: values.reduction_category,
    scope1_actual_emission: values.scope1_actual_emission,
    scope1_monthly_reduction: values.scope1_monthly_reduction,
    scope2_actual_emission: values.scope2_actual_emission,
    scope2_monthly_reduction: values.scope2_monthly_reduction,
    actual_product_footprint: values.actual_product_footprint,
    measures: values.measures?.trim() || '',
  };
}

export function positiveNumberRule(message = '需大于0') {
  return {
    validator: (_: unknown, value?: number | null) => {
      if (value == null || value <= 0) {
        return Promise.reject(new Error(message));
      }
      return Promise.resolve();
    },
  };
}

export function formatReductionMonthLabel(month?: number) {
  return month ? `${month}月` : '-';
}
