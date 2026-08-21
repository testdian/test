import { request, ResponseData } from '@src/api/request';

import { FootprintDataRequest, FootprintDataResp } from './type';

/**
 * @description 产品环境足迹数据
 */
export const getFootprintData = (params: FootprintDataRequest) =>
  request<ResponseData<FootprintDataResp>>({
    method: 'GET',
    url: `/supplychain/apply/footprint/${params.applyInfoId}`,
    params,
  });
