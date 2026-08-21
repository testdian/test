import { request, ResponseData } from '@src/api/request';

import { SelectModelRequest } from './type';

/**
 * @description 引用模型
 */
export const selectModelApi = (data: SelectModelRequest) =>
  request<ResponseData<any>>({
    method: 'POST',
    url: `/computation/computationSourceGroup/selectModel`,
    data,
  });
