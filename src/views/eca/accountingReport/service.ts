import { request, ResponseData } from '@src/api/request';

/**
 * @description 获取核算年度列表
 */

export const getAuditYearListApi = () =>
  request<ResponseData<{ year: number; id: number }[]>>({
    method: 'GET',
    url: `/computation/computation/list`,
  });

/**
 * @description 新增核算报告 /computation/report/add
 */
export const addAccountingReportApi = (data: any) =>
  request<ResponseData<any>>({
    method: 'POST',
    url: `/computation/report/add`,
    data,
  });

/**
 * @description 编辑核算报告 /computation/report/edit
 */
export const editAccountingReportApi = (data: any) =>
  request<ResponseData<any>>({
    method: 'POST',
    url: `/computation/report/edit`,
    data,
  });

/**
 * @description 上传报告及清册
 */
export const uploadReportAndClearanceApi = (data: {
  reportId: number;
  lastVersionUrl: string;
}) =>
  request<ResponseData<any>>({
    method: 'POST',
    url: `/computation/report/uploadLastFile`,
    data,
  });

/**
 * @description 生成报告及清册
 */
export const generateAccountingReportApi = (data: { id: number }) =>
  request<ResponseData<any>>({
    method: 'POST',
    url: `/computation/report/generate`,
    data,
  });

/**
 * @description 获取对应年份的核算组织列表
 */

export const getComputationComputationOrgListApi = (params: { year: number }) =>
  request<ResponseData<{ orgName: string; orgCode: string }[]>>({
    method: 'GET',
    url: `/computation/computation/computationOrgList/${params.year}`,
    params,
  });
