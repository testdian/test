import type {
  DemoReductionTarget,
  OrgCarbonTarget,
  ProductCarbonTarget,
  ReductionCategory,
} from '@/views/supplyChainCarbon/data/demo-supply-chain';

export const REDUCTION_TARGET_FORM_NOTE =
  '新增、编辑、查看减排目标：供应商名称，下拉选项，枚举值是所有供应商名称（供应商编码），单选，必选，允许模糊搜索；减排类别，复选框，组织碳、产品碳，勾选组织碳后，出现范围一上一年度排放量、减排比例（%）、目标排放量（tCO2e），范围二上一年度排放量、减排比例（%）、目标排放量（tCO2e），勾选产品碳后，出现产品名称、上一年度产品碳足迹（tCO2e/功能单位）、功能单位、减排比例（%）、目标产品碳足迹（tCO2e/功能单位），上述除功能单位外，均为数值框，必输，目标值=上一年度值*（1-减排比例%），功能单位为文本框，必输，不超过100个字符；低碳改善建议，文本框，必输，不超过500个字符。';

export const SUPPLIER_NAME_NOTE =
  '供应商名称，下拉选项，枚举值是所有供应商名称（供应商编码），单选，必选，允许模糊搜索';

export const TARGET_YEAR_NOTE =
  '目标年度，必选，下拉选项，年份下拉，2026-2099';

export const TARGET_YEAR_MIN = 2026;
export const TARGET_YEAR_MAX = 2099;

export const REDUCTION_CATEGORY_NOTE = '减排类别，必选';

export const SUGGESTIONS_NOTE =
  '低碳改善建议，文本框，必输，不超过500个字符';

export const PRODUCT_NAME_NOTE =
  '产品名称，文本框，必输，不超过100个字符';

export const PUSH_TARGET_CONFIRM_NOTE =
  '是否确认推送给供应商：供应商名称，该减排目标？';

export function buildPushTargetConfirmContent(supplierName: string) {
  return `是否确认推送给供应商：${supplierName}，该减排目标？`;
}

export const MAX_FUNCTIONAL_UNIT_LENGTH = 100;
export const MAX_PRODUCT_NAME_LENGTH = 100;
export const MAX_SUGGESTIONS_LENGTH = 500;

export function buildTargetYearOptions() {
  return Array.from(
    { length: TARGET_YEAR_MAX - TARGET_YEAR_MIN + 1 },
    (_, index) => {
      const year = TARGET_YEAR_MIN + index;
      return { label: String(year), value: year };
    },
  );
}

export type ReductionTargetFormValues = {
  supplier_id: number;
  target_year: number;
  categories: ReductionCategory[];
  org_carbon?: OrgCarbonTarget;
  product_carbon?: ProductCarbonTarget;
  suggestions: string;
};

export function calcTargetValue(prev?: number, ratio?: number) {
  if (prev === undefined || prev === null || ratio === undefined || ratio === null) {
    return undefined;
  }
  return Number((prev * (1 - ratio / 100)).toFixed(2));
}

export function syncOrgCarbonTargets(org?: OrgCarbonTarget): OrgCarbonTarget | undefined {
  if (!org) return org;
  return {
    ...org,
    scope1_target_emission: calcTargetValue(
      org.scope1_prev_emission,
      org.scope1_reduction_ratio,
    ),
    scope2_target_emission: calcTargetValue(
      org.scope2_prev_emission,
      org.scope2_reduction_ratio,
    ),
  };
}

export function syncProductCarbonTarget(
  product?: ProductCarbonTarget,
): ProductCarbonTarget | undefined {
  if (!product) return product;
  return {
    ...product,
    target_footprint: calcTargetValue(
      product.prev_footprint,
      product.reduction_ratio,
    ),
  };
}

export function buildTargetSummary(payload: {
  categories?: ReductionCategory[];
  org_carbon?: OrgCarbonTarget;
  product_carbon?: ProductCarbonTarget;
}) {
  const parts: string[] = [];
  if (payload.categories?.includes('org') && payload.org_carbon) {
    const { scope1_target_emission, scope2_target_emission } = payload.org_carbon;
    parts.push(
      `组织碳：范围一${scope1_target_emission ?? '-'}tCO₂e，范围二${scope2_target_emission ?? '-'}tCO₂e`,
    );
  }
  if (payload.categories?.includes('product') && payload.product_carbon) {
    const { product_name, target_footprint, functional_unit } =
      payload.product_carbon;
    parts.push(
      `产品碳：${product_name || '-'} ${target_footprint ?? '-'}tCO₂e/${functional_unit || '功能单位'}`,
    );
  }
  return parts.join('；') || '-';
}

export function targetToFormValues(
  target: DemoReductionTarget,
): ReductionTargetFormValues {
  return {
    supplier_id: target.supplier_id,
    target_year: target.baseline_year ?? TARGET_YEAR_MIN,
    categories: target.categories?.length
      ? target.categories
      : inferLegacyCategories(target),
    org_carbon: target.org_carbon,
    product_carbon: target.product_carbon,
    suggestions: target.suggestions || '',
  };
}

function inferLegacyCategories(
  target: DemoReductionTarget,
): ReductionCategory[] {
  const text = target.target_value || '';
  const categories: ReductionCategory[] = [];
  if (/范围|组织|范围一|范围二|tCO/i.test(text)) {
    categories.push('org');
  }
  if (/产品|碳足迹|功能单位/i.test(text)) {
    categories.push('product');
  }
  return categories.length ? categories : ['org'];
}

export function formValuesToPayload(values: ReductionTargetFormValues) {
  const org_carbon = values.categories.includes('org')
    ? syncOrgCarbonTargets(values.org_carbon)
    : undefined;
  const product_carbon = values.categories.includes('product')
    ? syncProductCarbonTarget(values.product_carbon)
    : undefined;

  return {
    supplier_id: values.supplier_id,
    baseline_year: values.target_year,
    categories: values.categories,
    org_carbon,
    product_carbon,
    suggestions: values.suggestions.trim(),
    target_value: buildTargetSummary({
      categories: values.categories,
      org_carbon,
      product_carbon,
    }),
  };
}
