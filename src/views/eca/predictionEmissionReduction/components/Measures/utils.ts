/** 措施类型。1 能效提升；2 排放源替代；3 供应链减排；4 回收利用；5 其他(1:能效提升; 2:排放源替代; 3:供应链减排; 4:回收利用; 5:其他),可用值:1,2,3,4,5 */
import I18N from '@src/lang/I18N';

import type { EnumOptionResp } from '@/views/eca/hooks';

/** GHGCategory 枚举树（getComputationEnumsEnumName）展平为 Select 选项，value 为叶子节点 code（ghgClassify） */
export const flattenGhgCategoryOptions = (
  nodes: EnumOptionResp[],
  prefix = '',
): { label: string; value: number }[] => {
  const out: { label: string; value: number }[] = [];
  nodes?.forEach(node => {
    const name = node.label ?? '';
    const path = prefix ? `${prefix} / ${name}` : name;
    const children = node.children?.filter(Boolean) ?? [];
    if (children.length > 0) {
      out.push(...flattenGhgCategoryOptions(children, path));
    } else if (node.value != null) {
      out.push({ label: path, value: node.value });
    }
  });
  return out;
};

export const measureTypeOptions = [
  { label: I18N.eca.energyEfficiencyImprovement, value: 1 },
  { label: I18N.eca.substitutionOfEmissionSources, value: 2 },
  { label: I18N.eca.supplyChainEmissionsReduction, value: 3 },
  { label: I18N.eca.recycling, value: 4 },
  { label: I18N.cbam.other, value: 5 },
];

/** 可行性。1 高；2 中；3 低(1:高; 2:中; 3:低),可用值:1,2,3  */
export const feasibilityOptions = [
  { label: I18N.eca.tall, value: 1 },
  { label: I18N.eca.centre, value: 2 },
  { label: I18N.eca.low, value: 3 },
];

/* 影响范围筛选：范围一 / 范围二 / 范围三 */
export const scopeTypeOptions = [
  { label: I18N.eca.scopeOne, value: 1 },
  { label: I18N.eca.scope2, value: 2 },
  { label: I18N.eca.fanWeisan, value: 3 },
];

/** 减排类型。1 绝对值；2 百分比(1:绝对值; 2:百分比),可用值:1,2 */
export const REDUCE_TYPE = {
  /** 绝对值 1 */
  ABSOLUTE: 1,
  /** 百分比 2 */
  PERCENTAGE: 2,
};
/** 减排类型选项。1 绝对值；2 百分比(1:绝对值; 2:百分比),可用值:1,2 */
export const reductionTypeOptions = [
  { label: I18N.eca.absoluteValue2, value: REDUCE_TYPE.ABSOLUTE },
  { label: I18N.carbonFootPrintLCA.percentage, value: REDUCE_TYPE.PERCENTAGE },
];

/** 在 GHGCategory 树中查找叶子节点的完整路径 */
export function findGhgClassifyPath(
  tree: EnumOptionResp[],
  target: number,
  path: number[] = [],
): number[] | undefined {
  return tree.reduce<number[] | undefined>((found, node) => {
    if (found || node.value == null) return found;
    const nextPath = [...path, node.value];
    const children = node.children?.filter(c => c?.value != null) ?? [];
    if (node.value === target && children.length === 0) {
      return nextPath;
    }
    if (children.length > 0) {
      return findGhgClassifyPath(children, target, nextPath);
    }
    return found;
  }, undefined);
}

/** 影响类别 Cascader 第一级取值（支持仅叶子单值时从树反查） */
export function getGhgClassifyFirstLevel(
  value: number[] | number | undefined | null,
  tree: EnumOptionResp[] = [],
): number | undefined {
  if (value == null) return undefined;
  if (Array.isArray(value)) {
    if (value.length > 1) return Number(value[0]);
    if (value.length === 1) {
      const path = findGhgClassifyPath(tree, Number(value[0]));
      return path?.[0] ?? Number(value[0]);
    }
    return undefined;
  }
  const leaf = Number(value);
  if (Number.isNaN(leaf)) return undefined;
  const path = findGhgClassifyPath(tree, leaf);
  return path?.[0];
}

/** 逐年表是否按范围三展示 */
export function isScope3ByGhgClassifyFirst(firstLevel?: number) {
  return firstLevel === 3;
}

/** 提交接口 ghgCategory：范围三 → 3，范围一/二 → 1 */
export function toMeasureGhgCategory(firstLevel?: number): 1 | 3 {
  return firstLevel === 3 ? 3 : 1;
}

/** 明细行衍生指标（列表展示与抽屉计算一致） */
export function computeDetailMetrics(
  detail:
    | {
        annualReduction?: number;
        production?: number;
        carbonPrice?: number;
        costSavings?: number;
        totalCost?: number;
      }
    | undefined,
  isScope3: boolean,
) {
  const ar = Number(detail?.annualReduction) || 0;
  const pr = Number(detail?.production) || 0;
  const cp = Number(detail?.carbonPrice) || 0;
  const cs = Number(detail?.costSavings) || 0;
  const tc = Number(detail?.totalCost) || 0;
  const potentialRevenue = ar * cp + cs;
  const potentialNetRevenue = potentialRevenue - tc;
  const annualRoi = tc > 0 ? (potentialNetRevenue / tc) * 100 : undefined;
  const reductionIntensity = isScope3 && pr > 0 ? ar / pr : undefined;
  return {
    potentialRevenue,
    potentialNetRevenue,
    annualRoi,
    reductionIntensity,
  };
}
