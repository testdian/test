import type {
  DemoReductionPlan,
  ReductionCategory,
} from '@/views/supplyChainCarbon/data/demo-supply-chain';

export const SUPPLIER_PLAN_FORM_NOTE =
  '编辑、查看页面字段：目标值、目标年度、本月是否减排、当月实际排放量（tCO2e）、减排方案名称、减排类别、减排月份、减排措施、当月减排量（tCO2e）。目标值、目标年度关联减排目标，自动代入；本月是否减排，下拉选项，枚举值：是、否，如选择否，则需输入当月实际排放量（tCO2e），数值框，必填，需大于0；如选择是，则展示当月实际排放量（tCO2e）、减排方案名称、减排类别、减排月份、减排措施、当月减排量（tCO2e）这些字段：当月实际排放量（tCO2e），数值框，必填，需大于0；减排方案名称，必填，文本框，不超过100个字符；减排类别：单选框，枚举值：组织碳、产品碳；减排月份：自动代入外侧列表月份，不可编辑；减排措施：必填，文本框，不超过1000个字符；当月减排量（tCO2e），数值框，必填。';

export const MAX_PLAN_NAME_LENGTH = 100;
export const MAX_PLAN_MEASURES_LENGTH = 1000;

export type ReduceThisMonth = 'yes' | 'no';

export type SupplierPlanFormValues = {
  reduce_this_month?: ReduceThisMonth;
  actual_emission?: number;
  plan_name?: string;
  reduction_category?: ReductionCategory;
  reduction_month?: number;
  measures?: string;
  monthly_reduction?: number;
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
    plan.reduction_category
  ) {
    return 'yes';
  }
  if (plan.actual_emission != null) return 'no';
  return undefined;
}

export function planToFormValues(
  plan: DemoReductionPlan,
): SupplierPlanFormValues {
  return {
    reduce_this_month: inferReduceThisMonth(plan),
    actual_emission: plan.actual_emission,
    plan_name: plan.plan_name,
    reduction_category: plan.reduction_category,
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
      actual_emission: values.actual_emission,
      plan_name: '',
      reduction_category: undefined,
      monthly_reduction: undefined,
      measures: '',
    };
  }

  return {
    reduce_this_month: 'yes',
    actual_emission: values.actual_emission,
    plan_name: values.plan_name?.trim() || '',
    reduction_category: values.reduction_category,
    measures: values.measures?.trim() || '',
    monthly_reduction: values.monthly_reduction,
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
