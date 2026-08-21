/**
 * @description 单位换算比例
 */

import { ResponseData, request } from '@/api/request';

export const getUnitConvert = (params: { unitFrom: string; unitTo: string }) =>
  request<ResponseData<{ [key: string]: any }>>({
    method: 'GET',
    url: '/system/lib/unit/unitConvert',
    params,
  });
