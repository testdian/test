import { IPageList, request, ResponseData } from '@/api/request';

import { AccountModelRequest, AccountModelResponse } from './type';

/** 获取核算模型列表接口 */
export const getAccountModelPageApi = (params: AccountModelRequest) =>
  request<ResponseData<IPageList<AccountModelResponse>>>({
    url: `/computation/model/page`,
    method: 'GET',
    params,
  });

/**
 * 删除核算模型接口
 */
export const deleteAccountModelApi = (data: { id: number }) =>
  request<ResponseData>({
    url: `/computation/model/delete`,
    method: 'POST',
    data,
  });

/**
 * /computation/model/copy
 * 复制核算模型接口
 *
 */
export const copyAccountModelApi = (data: { id: number }) =>
  request<ResponseData>({
    url: `/computation/model/copy`,
    method: 'POST',
    data,
  });

/** 获取全量核算模型接口 */
export const getAllAccountModelApi = (params: { likeModelName?: string }) =>
  request<ResponseData<AccountModelResponse[]>>({
    url: `/computation/model/list`,
    method: 'GET',
    params,
  });
