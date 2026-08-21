export type EmissionTargetRowKey =
  | 'prevYearActual'
  | 'reductionRatio'
  | 'annualTarget'
  | 'actualEmission'
  | 'achievementRatio';

export type OrgTargetValues = {
  /** 无上一年度系统数据时由用户填写；有系统数据时也可覆盖 */
  prevYearActual?: number;
  reductionRatio?: number;
  /** 12 个月度目标，未设置时由年度目标 ÷ 12 自动拆分 */
  monthlyTargets?: (number | undefined)[];
};

export type EmissionTargetTableRow = {
  key: string;
  orgName: string;
  prevYearActual?: number;
  reductionRatio?: number;
  annualTarget?: number;
  actualEmission?: number;
  monthlyTargets?: (number | undefined)[];
  achievementRatio?: number;
};

export type OrgCellMeta = {
  prevYearActual?: number;
  autoPrevYearActual?: number;
  reductionRatio?: number;
  annualTarget?: number;
  actualEmission?: number;
  monthlyTargets?: (number | undefined)[];
  achievementRatio?: number;
};

export type EmissionTargetMetricMeta = {
  key: EmissionTargetRowKey;
  label: string;
  note?: string;
  editable?: boolean;
  field?: keyof OrgTargetValues;
};
