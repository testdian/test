import { request, ResponseData } from '@src/api/request';

import { DownloadTemplateParams, FileBackParams } from './type';

/**
 * @description 导入数据
 */
export const importDictApi = (data: DownloadTemplateParams) =>
  request<ResponseData<FileBackParams>>({
    method: 'POST',
    url: '/system/dicttype/importDict',
    data,
  });
