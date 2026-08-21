/** 排放源库排放源简要信息 */
export interface EmissionSourceSimpleDto {
  id?: number;
  sourceCode?: string;
  sourceName?: string;
  orgCode?: string;
  year?: number;
  /** GHG 分类：1 范围一；2 范围二；3 范围三 */
  ghgCategory?: number;
  ghgCategory_name?: string;
  ghgClassify?: number;
  ghgClassify_name?: string;
}

/** 核算排放源简要信息 */
export interface ComputationSourceGroupSimpleDto {
  id?: number;
  computationId?: number;
  sourceCode?: string;
  sourceName?: string;
  orgCode?: string;
  year?: number;
  ghgCategory?: number;
  ghgCategory_name?: string;
  ghgClassify?: number;
  ghgClassify_name?: string;
  /** 碳排放量 (kgCO2) */
  carbonEmission?: number;
}

/** 因子使用情况：关联的排放源列表 */
export interface FactorUsageDto {
  /** 排放源库排放源列表 */
  emissionSourceList?: EmissionSourceSimpleDto[];
  /** 核算排放源列表 */
  computationSourceGroupList?: ComputationSourceGroupSimpleDto[];
  emissionSourceNames?: string;
}
