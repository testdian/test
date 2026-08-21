import { request, ResponseData } from '@src/api/request';

import { DownloadTemplateParams, FileBackParams, FileListParams } from './type';

/**
 * /computation/computationImportLog/downloadTemplate
 * @description 企业碳核算/数据填报/下载模板
 */
export const downloadComputationImportLogTemplateApi = (
  data: DownloadTemplateParams,
) =>
  request<ResponseData<FileBackParams>>({
    method: 'POST',
    url: '/computation/computationImportLog/downloadTemplate',
    data,
  });

/**
 * /computation/computationImportLog/importData
 * @description 企业碳核算/数据填报/导入数据
 */
export const importComputationImportLogDataApi = (
  data: DownloadTemplateParams,
) =>
  request<ResponseData<FileBackParams>>({
    method: 'POST',
    url: '/computation/computationImportLog/importData',
    data,
  });

/**
 * /computation/computationImportLog/importData/check
 * @description 企业碳核算/数据填报/导入数据校验
 */
export const importComputationImportLogDataCheckApi = (
  data: DownloadTemplateParams,
) =>
  request<ResponseData<FileBackParams>>({
    method: 'POST',
    url: '/computation/computationImportLog/importData/check',
    data,
  });

/**
 *  /computation/computationImportLog/page
 * @description 企业碳核算/数据填报/导入数据列表
 */
export const getComputationImportLogPageApi = (params: FileListParams) =>
  request<ResponseData<FileBackParams>>({
    method: 'GET',
    url: '/computation/computationImportLog/page',
    params,
  });

/**
 * /computation/computationImportLog/delete
 * @description 企业碳核算/数据填报/导入数据删除
 */
export const deleteComputationImportLogApi = (data: { id: number }) =>
  request<ResponseData<FileBackParams>>({
    method: 'POST',
    url: '/computation/computationImportLog/delete',
    data,
  });
