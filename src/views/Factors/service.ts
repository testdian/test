import type { AxiosResponse } from 'axios';

import { request, ResponseData } from '@/api/request';

import type { FactorUsageDto } from './type';

export interface ListFactorEmissionSourcesParams {
  /** 因子 id */
  id: number;
}

/** GET /system/factor/emissionSources — 查询使用该因子的排放源列表 */
export const listFactorEmissionSources = (
  params: ListFactorEmissionSourcesParams,
): Promise<AxiosResponse<ResponseData<FactorUsageDto>>> =>
  request<ResponseData<FactorUsageDto>>({
    method: 'GET',
    url: '/system/factor/emissionSources',
    params,
  });

export async function fetchFactorEmissionSourcesUsage(
  id: number,
): Promise<FactorUsageDto | undefined> {
  const { data } = await listFactorEmissionSources({ id });
  return data?.data;
}
