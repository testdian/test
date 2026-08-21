import { request, ResponseData } from '@/api/request';

/**
 * 删除字典-传入dictType
 */
export const deleteDictTypeApi = (data: { value: string }) =>
  request<ResponseData<any>>({
    url: `/system/dicttype/delete`,
    method: 'POST',
    data,
  });
