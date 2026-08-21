import { request, ResponseData } from '@/api/request';

import { RawDataExportApiParams } from './type';

/**
 * /computation/computationSource/table/rawDataExport
 *  原始数据下载
 */
export const rawDataExportApi = (data: RawDataExportApiParams) =>
  request<ResponseData<RawDataExportApiParams>>({
    method: 'POST',
    url: `/computation/computationSource/table/rawDataExport`,
    data,
  });
