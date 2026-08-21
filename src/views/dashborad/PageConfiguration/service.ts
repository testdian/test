import { IPageList, ResponseData, request } from '@/api/request';

import { PageConfigurationListType, PageConfigurationParams } from './type';

/**
 * @description 页面配置列表
 */
export const getPageConfigurationListApi = (params: PageConfigurationParams) =>
  request<ResponseData<IPageList<PageConfigurationListType>>>({
    method: 'GET',
    url: '/system/page/page',
    params,
  });

/**
 * @description 页面配置详情
 */
export const getPageConfigurationDetailApi = (id: string) =>
  request<ResponseData<PageConfigurationListType>>({
    method: 'GET',
    url: `/system/page/${id}`,
  });

/**
 * @description 页面配置新增
 * */
export const addPageConfigurationApi = (
  data: Pick<PageConfigurationListType, 'content' | 'pageName'>,
) =>
  request<ResponseData<null>>({
    method: 'POST',
    url: '/system/page/add',
    data,
  });

/**
 * @description 页面配置编辑
 * */
export const editPageConfigurationApi = (data: PageConfigurationListType) =>
  request<ResponseData<null>>({
    method: 'POST',
    url: `/system/page/edit`,
    data,
  });

/**
 * @description 页面配置删除
 * */
export const deletePageConfigurationApi = (id: number) =>
  request<ResponseData<null>>({
    method: 'POST',
    url: `/system/page/delete`,
    data: {
      id,
    },
  });
