import { request, ResponseData } from '@/api/request';

import {
  AccountModelInfoReqRequest,
  AccountModelInfoTreeDatum,
  EmissionSourceList,
  EmissionSourceListRequest,
} from './type';

/**
 * /computation/model/add
 * 新增核算模型接口
 */
export const addAccountModelApi = (data: AccountModelInfoReqRequest) =>
  request<ResponseData>({
    url: `/computation/model/add`,
    method: 'POST',
    data,
  });

/**
 * /computation/model/edit
 * 编辑核算模型接口
 */
export const editAccountModelApi = (data: AccountModelInfoReqRequest) =>
  request<ResponseData>({
    url: `/computation/model/edit`,
    method: 'POST',
    data,
  });

/**
 * /computation/model/{id}
 * 核算模型详情接口
 */
export const getAccountModelDetailApi = (id: number) =>
  request<ResponseData<AccountModelInfoReqRequest>>({
    url: `/computation/model/${id}`,
    method: 'GET',
  });

/**
 * /computation/model/EmissionSourceTree
 * 核算模型-排放源tree
 */
export const getAccountModelEmissionSourceTreeApi = (modelId: number) =>
  request<ResponseData<AccountModelInfoTreeDatum[]>>({
    url: `/computation/model/EmissionSourceTree`,
    method: 'GET',
    params: {
      modelId,
    },
  });

/**
 * /computation/model/deleteEmissionSource
 * 删除核算模型-排放源
 * @param modelId 核算模型id
 * @param emissionSourceId 排放源id
 */
export const deleteAccountModelEmissionSourceApi = (
  modelId: number,
  emissionSourceId: number,
) =>
  request<ResponseData>({
    url: `/computation/model/deleteEmissionSource`,
    method: 'POST',
    data: {
      modelId,
      emissionSourceId,
    },
  });

/**
 * /computation/model/ghgEmissionSourceList
 * 查询排放源弹窗中的排放源列表
 * @param modelId 核算模型id
 * @param ghgClassify 排放类型 1,1
 */
export const getAccountModelEmissionSourceListApi = (
  modelId: string,
  ghgClassify: string,
) =>
  request<ResponseData<EmissionSourceList[]>>({
    url: `/computation/model/ghgEmissionSourceList`,
    method: 'GET',
    params: {
      modelId,
      ghgClassify,
    },
  });

/**
 * /computation/model/selectEmissionSource
 * 添加核算模型-保存排放源
 * @param emissionSourceCodeList 排放源code列表
 * @param ghgClassify 类别
 * @param modelId 模型id
 */
export const addAccountModelEmissionSourceApi = (data: {
  emissionSourceCodeList: string[];
  ghgClassify: number;
  modelId: string;
}) =>
  request<ResponseData>({
    url: `/computation/model/selectEmissionSource`,
    method: 'POST',
    data,
  });

/**
 * /computation/emissionSource/list
 * 排放源列表全量
 */
export const getEmissionModalSourceListApi = (
  params?: EmissionSourceListRequest,
) =>
  request<ResponseData<EmissionSourceList[]>>({
    url: `/computation/emissionSource/list`,
    method: 'GET',
    params,
  });
