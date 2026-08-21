import { request, ResponseData } from '@/api/request';

import { ReductionBau, ReductionBauEditReq } from './type';

/**
 * BAU 列表
 * openapi: GET `/reductionBau/list` → 网关 `/computation/reductionBau/list`
 */
export const getBauListApi = (params: { orgCode: string; scopeType: 1 | 3 }) =>
  request<ResponseData<ReductionBau[]>>({
    url: '/computation/reductionBau/list',
    method: 'GET',
    params,
  });

/**
 * 编辑单条 BAU
 * openapi: POST `/reductionBau/edit` → 网关 `/computation/reductionBau/edit`
 */
export const postBauEditApi = (data: ReductionBauEditReq) =>
  request<ResponseData<unknown>>({
    url: '/computation/reductionBau/edit',
    method: 'POST',
    data,
  });
