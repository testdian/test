import { request, ResponseData } from '@/api/request';

import { ForecastInfoData } from './type';

/**
 * /computation/reductionPlan/prediction
 * @description 预测减排/减排预测
 */

export const getPredictionEmissionReductionApi = (params: {
  scopeType: string;
}) =>
  request<ResponseData<ForecastInfoData>>({
    url: '/computation/reductionPlan/prediction',
    method: 'GET',
    params,
  });
