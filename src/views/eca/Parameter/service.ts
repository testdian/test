import { IPageList, request, ResponseData } from '@/api/request';

import { Param, ParameterRequest } from './type';

/**
 *
 * @param params
 * @returns  获取参数列表
 */
export const getParameterListAPi = (params: ParameterRequest) =>
  request<ResponseData<IPageList<Param>>>({
    method: 'GET',
    url: '/computation/param/page',
    params,
  });

/**
 * @param params
 * @returns  获取全量的参数列表
 */
export const getParameterAllListAPi = (params: {
  likeParamName?: string;
  notGlobal?: number;
}) =>
  request<ResponseData<Param[]>>({
    method: 'GET',
    url: '/computation/param/list',
    params,
  });

/**
 * @param params
 * @returns  获取全量的参数列表-排放源用
 */
export const getEmissionSourceParameterAllListAPi = (params: {
  likeParamName?: string;
  notGlobal?: number;
}) =>
  request<ResponseData<Param[]>>({
    method: 'GET',
    url: '/computation/param/listNotFollowLang',
    params,
  });

/**
 *
 * @param params
 * @returns  获取参数详情
 */
export const getParameterDetailAPi = (id: string) =>
  request<ResponseData<Param>>({
    method: 'GET',
    url: `/computation/param/${id}`,
  });

/**
 *
 * @param params
 * @returns  新增参数
 */
export const addParameterAPi = (data: Param) =>
  request<ResponseData<Param>>({
    method: 'POST',
    url: '/computation/param/add',
    data,
  });

/**
 * @param params
 * @returns  修改参数
 * */
export const editParameterAPi = (data: Param) =>
  request<ResponseData<Param>>({
    method: 'POST',
    url: '/computation/param/edit',
    data,
  });

/**
 * @param params
 * @returns  删除参数
 * */
export const deleteParameterAPi = (id: string) =>
  request<ResponseData<Param>>({
    method: 'POST',
    url: '/computation/param/delete',
    data: {
      id,
    },
  });
