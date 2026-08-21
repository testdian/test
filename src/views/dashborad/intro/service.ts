import { IPageList, ResponseData, request } from '@/api/request';

import { PageConfigurationListType, PageConfigurationParams } from './type';

/**
 * @description 工作台列表
 */
export const getPageConfigurationListApi = (params: PageConfigurationParams) =>
  request<ResponseData<IPageList<PageConfigurationListType>>>({
    method: 'GET',
    url: '/system/page/page',
    params,
  });
