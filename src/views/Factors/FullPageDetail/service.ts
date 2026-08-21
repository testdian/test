import { request, ResponseData } from '@/api/request';
import { Factor } from '@/sdks/systemV2ApiDocs';

/**
 * lvmh核算的因子详情接口
 * /computation/factor/{id}
 */
export interface GetComputationFactorIdProps {
  id: number;
}
export const getComputationFactorId = (params: GetComputationFactorIdProps) =>
  request<ResponseData<Factor>>({
    method: 'GET',
    url: `/computation/factor/${params.id}`,
  });
