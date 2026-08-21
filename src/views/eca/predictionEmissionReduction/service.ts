import { request, ResponseData } from '@/api/request';

import type { OrgWithStandardYearResp, StandardYearEditReq } from './type';

/**
 * GET /computation/reductionPlan/orgList
 * @description 减排计划 — 组织列表（openapi `/reductionPlan/orgList`，网关前缀 computation）
 */
export const getReductionPlanOrgListApi = () =>
  request<ResponseData<OrgWithStandardYearResp[]>>({
    url: '/computation/reductionPlan/orgList',
    method: 'GET',
  });

/**
 * POST /computation/reductionPlan/standardYear/edit
 * @description 编辑基准年（openapi `/reductionPlan/standardYear/edit`）
 */
export const postReductionPlanStandardYearEditApi = (
  data: StandardYearEditReq,
) =>
  request<ResponseData<void>>({
    url: '/computation/reductionPlan/standardYear/edit',
    method: 'POST',
    data,
  });
