import { IPageList, ResponseData, request } from '@/api/request';

import {
  CodeConfigurationExportParams,
  CodeConfigurationListParams,
  CodeConfigurationListType,
} from './type';

/**
 * @description code列表
 */
export const getCodeConfigurationListApi = (
  params: CodeConfigurationListParams,
) =>
  request<ResponseData<IPageList<CodeConfigurationListType>>>({
    method: 'GET',
    url: '/system/code/page',
    params,
  });

/**
 * @description code详情
 * @param id
 *
 * */
export const getCodeConfigurationDetailApi = (id: number) =>
  request<ResponseData<CodeConfigurationListType>>({
    method: 'GET',
    url: `/system/code/${id}`,
  });

/**
 * @description code编辑
 * @param data
 * */
export const editCodeConfigurationApi = (data: CodeConfigurationListType) =>
  request<ResponseData<CodeConfigurationListType>>({
    method: 'POST',
    url: '/system/code/edit',
    data,
  });
/**
 * /system/code/export
 * @description code导出
 */
export const exportCodeConfigurationApi = (
  params: CodeConfigurationExportParams,
) =>
  request<ResponseData<CodeConfigurationListType>>({
    method: 'GET',
    url: '/system/code/export',
    params,
  });
