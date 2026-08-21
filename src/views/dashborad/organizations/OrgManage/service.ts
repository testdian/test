import { request, ResponseData } from '@src/api/request';

/**
 * @description 组织管理-启用禁用
 */
export const postOrgStatus = (data: { id: number; status: number }) =>
  request<ResponseData<{ [key: string]: any }>>({
    method: 'POST',
    url: '/system/org/status',
    data,
  });
