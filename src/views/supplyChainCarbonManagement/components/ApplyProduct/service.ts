import { request, ResponseData } from '@src/api/request';

import { ApplyRequest } from './type';

/**
 * @description 申请产品碳足迹
 */
export const postProductApply = (data: ApplyRequest) =>
  request<ResponseData<{ [key: string]: any }>>({
    method: 'POST',
    url: '/supplychain/product/footprint/apply',
    data,
  });
