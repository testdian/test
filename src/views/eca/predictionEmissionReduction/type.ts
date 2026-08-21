/**
 * /computation/reductionPlan/orgList — 组织列表（含基准年）
 * @see apiDocs ApiResultListOrgWithStandardYearResp / OrgWithStandardYearResp
 */
export interface OrgWithStandardYearResp {
  /** id */
  id?: number;
  /** 组织名称 */
  orgName?: string;
  /** 组织编码 */
  orgCode?: string;
  /** 上级组织编码 */
  pcode?: string;
  /** 基准年 */
  standardYear?: number;
}

/**
 * POST /reductionPlan/standardYear/edit — 编辑基准年
 * @see apiDocs StandardYearEditReq
 */
export interface StandardYearEditReq {
  /** 组织编码 */
  orgCode: string;
  /** 基准年 */
  standardYear: number;
}
