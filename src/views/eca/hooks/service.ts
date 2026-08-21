import { request, ResponseData } from '@/api/request';

import { ComputationSourceGroupResp } from './type';
/**
 * 查看排放源详情接口
 */
export const getEmissionSourceDetailApi = ({ id }: { id: number }) =>
  request<ResponseData<ComputationSourceGroupResp>>({
    url: `/computation/computationSource/emissionSource/view/${id}`,
    method: 'GET',
  });

/**
 * 查看排放源组详情接口
 */
export const getEmissionSourceGroupDetailApi = ({ id }: { id: number }) =>
  request<ResponseData<ComputationSourceGroupResp>>({
    url: `/computation/computationSourceGroup/emissionSource/view/${id}`,
    method: 'GET',
  });
