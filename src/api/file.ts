import { request, ResponseData } from './request';

/**
 * /file/fileapi/downloadFile
 * 下载文件流
 */
export const downloadBlobFileApi = (data: {
  file: string;
  fileName?: string;
}) =>
  request<ResponseData<any>>({
    url: `/file/fileapi/downloadFilePost`,
    method: 'POST',
    data,
    responseType: 'blob',
  });

/**
 * /file/template/download
 * 下载模板文件（按枚举 code）
 */
export const downloadTemplateFileApi = (params: { templateType: number }) =>
  request<any>({
    url: '/file/template/download',
    method: 'GET',
    params,
    responseType: 'blob',
  });
