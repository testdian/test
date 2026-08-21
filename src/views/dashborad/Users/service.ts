import { request, ResponseData } from '@/api/request';

import { ExportUserReq, UserReq } from './type';
/**
 *
 * @returns 获取用户列表
 */
export const getUserListApi = (params: UserReq) =>
  request<ResponseData<UserReq>>({
    url: `/system/user/page`,
    method: 'get',
    params,
  });

/**
 *
 * @returns 新增用户信息
 */
export const addUserApi = (data: UserReq) =>
  request<ResponseData<any>>({
    url: `/system/user/add`,
    method: 'POST',
    data,
  });

/**
 * @description 编辑用户信息
 */
export const updateUserApi = (data: UserReq) =>
  request<ResponseData<UserReq>>({
    url: `/system/user/edit`,
    method: 'POST',
    data,
  });

/**
 * @description 查看用户信息
 */
export const getUserInfoApi = (id: string) =>
  request<ResponseData<UserReq>>({
    url: `/system/user/${id}`,
    method: 'get',
  });

/**
 * 用户导出
 */
export const exportUserApi = (params: ExportUserReq) =>
  request<ResponseData<object>>({
    method: 'GET',
    url: '/system/user/user/export',
    params,
  });

/**
 * @description 更新用户状态
 */
export const updateUserStatusApi = (data: { id: string; userStatus: number }) =>
  request<ResponseData<any>>({
    url: '/system/user/status',
    method: 'POST',
    data,
  });

/**
 * @description 批量启用禁用用户
 */
export const postUpdateStatusBatchApi = (data: {
  idList: React.Key[];
  userStatus: number;
}) => {
  return request<ResponseData<any>>({
    url: `/system/user/updateStatusBatch`,
    method: 'POST',
    data,
  });
};
