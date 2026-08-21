import { request, ResponseData } from '@/api/request';
import { FileBackParamsType } from '@/api/type';

import {
  ConfigurationRequest,
  ConfigurationListType,
  ConfigurationResp,
  EmissionSourceParam,
  ConfigDataRow,
  RowConfigDataRequest,
} from './type';

/**
 * 配置列表
 */
export const getConfigurationListApi = (params: ConfigurationRequest) =>
  request<ResponseData<ConfigurationListType>>({
    method: 'GET',
    url: '/computation/paramConfig/page',
    params,
  });

/**
 * 配置详情
 */
export const getConfigurationDetailApi = (params: { id: number }) =>
  request<ResponseData<ConfigurationResp>>({
    method: 'GET',
    url: `/computation/paramConfig/${params.id}`,
    params,
  });

/**
 * 配置编辑
 */
export const editConfigurationApi = (data: ConfigurationResp) =>
  request<ResponseData<any>>({
    method: 'POST',
    url: '/computation/paramConfig/edit',
    data,
  });

/**
 * 配置新增
 */
export const addConfigurationApi = (data: ConfigurationResp) =>
  request<ResponseData<any>>({
    method: 'POST',
    url: '/computation/paramConfig/add',
    data,
  });

/**
 * 配置复制
 */
export const copyConfigurationApi = (data: { id: number }) =>
  request<ResponseData<number>>({
    method: 'POST',
    url: '/computation/paramConfig/copy',
    data,
  });

/**
 * 配置删除
 */
export const deleteConfigurationApi = (data: { id: number }) =>
  request<ResponseData<any>>({
    method: 'POST',
    url: '/computation/paramConfig/delete',
    data,
  });

/**
 * 根据排放源获取对应的参数列表
 */
export const getConfigurationListByEmissionSourceApi = (params: {
  emissionSourceId: number;
  paramType?: string;
}) =>
  request<ResponseData<EmissionSourceParam[]>>({
    method: 'GET',
    url: '/computation/paramConfig/paramList',
    params,
  });

/**
 * @description 其他配置/数据管理/下载模板
 */
export const downloadConfigTemplateApi = (data: { id: number }) =>
  request<ResponseData<FileBackParamsType>>({
    method: 'POST',
    url: '/computation/paramConfig/downloadTemplate',
    data,
  });

/**
 * @description 其他配置/数据管理/导入数据
 */
export const importConfigDataApi = (data: {
  paramConfigId: number;
  fileName: string;
  fileUrl: string;
  clearFlag: boolean;
}) =>
  request<ResponseData<FileBackParamsType>>({
    method: 'POST',
    url: '/computation/paramConfig/importData',
    data,
  });

/**
 * @description 其他配置/数据管理/映射关系数据-列表
 */
export const getConfigMappingDataListApi = (params: { id: number }) =>
  request<ResponseData<ConfigDataRow[]>>({
    method: 'GET',
    url: '/computation/paramConfig/data/list',
    params,
  });

/**
 * @description 其他配置/数据管理/映射关系数据-新增
 */
export const addConfigMappingDataApi = (data: RowConfigDataRequest) =>
  request<ResponseData<any>>({
    method: 'POST',
    url: '/computation/paramConfig/data/add',
    data,
  });

/**
 * @description 其他配置/数据管理/映射关系数据-编辑
 */
export const editConfigMappingDataApi = (data: RowConfigDataRequest) =>
  request<ResponseData<any>>({
    method: 'POST',
    url: '/computation/paramConfig/data/edit',
    data,
  });

/**
 * @description 其他配置/数据管理/映射关系数据-删除
 */
export const deleteConfigMappingDataApi = (data: { id: number }) =>
  request<ResponseData<any>>({
    method: 'POST',
    url: '/computation/paramConfig/data/delete',
    data,
  });

/**
 * @description 其他配置/数据管理/导出数据
 */
export const exportConfigDataApi = (data: { id: number }) =>
  request<ResponseData<FileBackParamsType>>({
    method: 'POST',
    url: '/computation/paramConfig/exportData',
    data,
  });
