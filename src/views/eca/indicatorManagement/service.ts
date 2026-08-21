import { ResponseData, request } from '@/api/request';

import {
  AddIndicatorInfoType,
  IndicatorInfoDatumType,
  IndicatorInfoTableItemDatum,
} from './type';

/**
 * /computation/operIndex/add
 * desc: 指标计算新增
 */
export const addIndicatorApi = (data: AddIndicatorInfoType) =>
  request<ResponseData<null>>({
    url: '/computation/operIndex/add',
    method: 'POST',
    data,
  });

/**
 * /computation/operIndex/delete
 * desc: 指标计算删除
 */
export const deleteIndicatorApi = (id: number) =>
  request<ResponseData<null>>({
    url: '/computation/operIndex/delete',
    method: 'POST',
    data: { id },
  });

/**
 * /computation/operIndex/edit
 * desc: 指标计算修改
 */
export const updateIndicatorApi = (data: AddIndicatorInfoType) =>
  request<ResponseData<null>>({
    url: '/computation/operIndex/edit',
    method: 'POST',
    data,
  });

/**
 * /computation/operIndex/list
 * desc: 指标计算列表
 */
export const getIndicatorListApi = () =>
  request<ResponseData<IndicatorInfoDatumType[]>>({
    url: '/computation/operIndex/list',
    method: 'GET',
  });

/**
 * /computation/operIndex/{id}
 * desc: 指标计算详情
 */
export const getIndicatorDetailApi = (id: number) =>
  request<ResponseData<IndicatorInfoDatumType>>({
    url: `/computation/operIndex/${id}`,
    method: 'GET',
  });

/**
 * /computation/operIndex/data/delete
 * desc: 指标计算表格删除
 */
export const deleteIndicatorTableApi = (id: number) =>
  request<ResponseData<null>>({
    url: '/computation/operIndex/data/delete',
    method: 'POST',
    data: { id },
  });

/**
 * /computation/operIndex/data/list
 * desc: 指标计算表格列表
 */
export const getIndicatorTableListApi = (operIndexId: number) =>
  request<ResponseData<null>>({
    url: `/computation/operIndex/data/list`,
    method: 'GET',
    params: { operIndexId },
  });

/**
 * /computation/operIndex/dataEdit
 * desc: 指标计算表格修改
 */
export const updateIndicatorTableApi = (data: IndicatorInfoTableItemDatum) =>
  request<ResponseData<null>>({
    url: '/computation/operIndex/dataEdit',
    method: 'POST',
    data,
  });
