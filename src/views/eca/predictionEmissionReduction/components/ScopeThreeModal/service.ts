import { request, ResponseData } from '@/api/request';

/**
 *  /computation/enums/ghgClassify
 *  @description 预测减排/减排目标/获取范围3枚举
 */
export const getComputationEnumsGhgClassifyApi = (params: {
  ghgCategory: number;
}) =>
  request<ResponseData<{ name: string; code: number }[]>>({
    url: '/computation/enums/ghgClassify',
    method: 'GET',
    params,
  });
