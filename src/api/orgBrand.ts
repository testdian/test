import { request, ResponseData } from '@src/api/request';

/**
 * @description /system/enums/brandList
 * 获取lvmh 一级组织的组织
 */
export const getLvmhOrgListApi = () =>
  request<
    ResponseData<
      {
        code: string;
        value: string;
      }[]
    >
  >({
    method: 'GET',
    url: `/system/enums/brandList`,
  });
