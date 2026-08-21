import { OrgTree } from '@/hooks/useOrgTreeData/type';

import { OrgCellMeta, OrgTargetValues } from './type';

/** 扁平化组织树，取全部非虚拟组织作为基地列 */
export const flattenOrgList = (tree: OrgTree[]): OrgTree[] => {
  const result: OrgTree[] = [];

  const walk = (nodes: OrgTree[]) => {
    nodes.forEach(node => {
      if (node.realVirtual !== 1) {
        result.push(node);
      }
      if (node.children?.length) {
        walk(node.children);
      }
    });
  };

  walk(tree);
  return result;
};

const buildOrgYearHash = (orgCode: string, year: number) => {
  let hash = year;
  orgCode.split('').forEach(char => {
    hash += char.charCodeAt(0);
  });
  return hash;
};

/** 原型演示：按组织编码生成稳定的 mock 实际排放量 */
export const getMockActualEmission = (orgCode: string, year: number) => {
  const hash = buildOrgYearHash(orgCode, year);
  return 8000 + (hash % 120) * 100;
};

/** 原型演示：当年实际排放量略低于上一年度（约 88%～96%） */
export const getMockCurrentYearActualEmission = (
  orgCode: string,
  year: number,
  prevYearActual: number,
) => {
  const hash = buildOrgYearHash(orgCode, year);
  const ratio = 0.88 + (hash % 9) * 0.01;
  return Number((prevYearActual * ratio).toFixed(2));
};

/** 目标达成比例（%）= 实际排放量 / 年度目标排放量 */
export const calcAchievementRatio = (
  actualEmission?: number,
  annualTarget?: number,
) => {
  if (!annualTarget || !actualEmission) {
    return undefined;
  }
  return Number(((actualEmission / annualTarget) * 100).toFixed(1));
};

export const buildMonthlyTargets = (annualTarget?: number) => {
  if (!annualTarget) {
    return Array.from({ length: 12 }, () => undefined);
  }
  const monthly = Number((annualTarget / 12).toFixed(2));
  return Array.from({ length: 12 }, () => monthly);
};

export const getOrgValues = (
  store: Record<string, OrgTargetValues>,
  orgCode: string,
) => store[orgCode] || {};

/** 获取上一年度系统汇总的实际排放量（原型用 mock 模拟） */
export const getPrevYearSystemActual = (orgCode: string, year: number) => {
  if (year <= 1991) {
    return undefined;
  }
  return getMockActualEmission(orgCode, year - 1);
};

export const resolvePrevYearActual = (
  values: OrgTargetValues,
  orgCode: string,
  year: number,
) => {
  const autoPrevYearActual = getPrevYearSystemActual(orgCode, year);
  return {
    value: values.prevYearActual ?? autoPrevYearActual,
    autoPrevYearActual,
  };
};

export const resolveMonthlyTargets = (
  values: OrgTargetValues,
  annualTarget?: number,
): (number | undefined)[] => {
  const defaults = buildMonthlyTargets(annualTarget);
  if (!values.monthlyTargets?.length) {
    return defaults;
  }
  return defaults.map((defaultVal, index) => {
    const stored = values.monthlyTargets?.[index];
    return stored !== undefined ? stored : defaultVal;
  });
};

/** 年度目标排放量 = 上一年度实际排放量 × (1 - 年度减排比例%) */
export const calcAnnualTarget = (
  prevYearActual?: number,
  reductionRatio?: number,
) => {
  if (prevYearActual === undefined || reductionRatio === undefined) {
    return undefined;
  }
  return Number((prevYearActual * (1 - reductionRatio / 100)).toFixed(2));
};

export const buildOrgCellMeta = (
  values: OrgTargetValues,
  orgCode: string,
  year: number,
): OrgCellMeta => {
  const prevYear = resolvePrevYearActual(values, orgCode, year);
  const annualTarget = calcAnnualTarget(prevYear.value, values.reductionRatio);
  const actualEmission =
    prevYear.value !== undefined
      ? getMockCurrentYearActualEmission(orgCode, year, prevYear.value)
      : getMockActualEmission(orgCode, year);

  return {
    prevYearActual: prevYear.value,
    autoPrevYearActual: prevYear.autoPrevYearActual,
    reductionRatio: values.reductionRatio,
    annualTarget,
    actualEmission,
    monthlyTargets: resolveMonthlyTargets(values, annualTarget),
    achievementRatio: calcAchievementRatio(actualEmission, annualTarget),
  };
};
