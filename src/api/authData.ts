import { AxiosPromise } from 'axios';

import { request } from './request';
import { EncryptedLoginData } from './type';

export type SearchGetAuthDataListApi = {
  likeReportName?: string | null | undefined;
  orgId?: number | null | undefined;
  pageNum: number;
  pageSize: number;
  year?: number | null | undefined;
};
// 认证审核 - 排放数据列表
export const getAuthDataListApi = (
  params: SearchGetAuthDataListApi,
): AxiosPromise<{
  data: { code: number; name: string; list: any[]; total: number };
}> => {
  return request({
    url: `/system/authData/page`,
    method: 'GET',
    params,
  });
};

// 新增 认证审核
export const PostAuthData = (
  data: any,
): AxiosPromise<{
  message: string;
  code: number;
  data: {
    list: any[];
  };
}> => {
  return request({
    url: `/system/authData/add`,
    method: 'POST',
    data,
  });
};
// 编辑 - 认证审核
export const PostEditAuthData = (
  data: any,
): AxiosPromise<{
  message: string;
  code: number;
  data: {
    list: any[];
  };
}> => {
  return request({
    url: `/system/authData/edit`,
    method: 'POST',
    data,
  });
};
// 认证 - 查看详情
export const PostAuthDataDetail = (params: {
  id: number;
}): AxiosPromise<{
  message: string;
  code: number;
  data: any;
}> => {
  return request({
    url: `/system/authData/${params.id}`,
    method: 'GET',
  });
};
// 查询企业碳核算 认证审核详情
export const getAuthComputationInfo = (params: {
  id?: number;
}): AxiosPromise<{
  message: string;
  code: number;
  data: any;
}> => {
  return request({
    url: `/computation/authData/getAuthComputationInfo`,
    method: 'GET',
    params,
  });
};

/**
 * @description 认证审核详情-CBAM
 */
export const getAuthCbamDetail = (params: {
  id: number;
}): AxiosPromise<{
  message: string;
  code: number;
  data: any;
}> =>
  request({
    method: 'GET',
    url: `/cbam/authCbam/getAuthCbam`,
    params,
  });

// 排放源列表-树形
export const getSourceTree = (params: {
  computationDataId?: string;
  relateEmission?: string;
  authNo?: string;
}): AxiosPromise<{
  message: string;
  code: number;
  data: any;
}> => {
  return request({
    url: `/computation/authData/data/source/tree`,
    method: 'GET',
    params,
  });
};

// 提交审批
export const getSubmitAuthData = (data: {
  computationDataId?: string;
  authAuditStatus?: number;
  authId?: number;
}): AxiosPromise<{
  message: string;
  code: number;
  data: any;
}> => {
  return request({
    url: `/system/authData/submitAuthData`,
    method: 'POST',
    data,
  });
};
// 删除审批单据
export const geAuthDataDel = (data: {
  id: string;
}): AxiosPromise<{
  message: string;
  code: number;
  data: any;
}> => {
  return request({
    url: `/system/authData/delete`,
    method: 'POST',
    data,
  });
};
// 认证中心 审核记录
export const getAuthLogPage = (params: {
  authDataId?: string;
  pageNum?: number;
  pageSize?: number;
}): AxiosPromise<{
  message: string;
  code: number;
  data: any;
}> => {
  return request({
    url: `/system/authLog/page`,
    method: 'GET',
    params,
  });
};
// token/account/login/losePass
export const getLosePassApi = (params: {
  username?: string;
  langType?: number;
}): AxiosPromise<{
  message: string;
  code: number;
  data: any;
}> => {
  return request({
    url: `/auth/token/forgot/captcha`,
    method: 'GET',
    params,
  });
};
export const postLoginInnerModifyPasswordApi = (
  data: EncryptedLoginData,
): AxiosPromise<{
  message: string;
  code: number;
  data: any;
}> => {
  return request({
    url: `/auth/token/forgot/modifyPassword`,
    method: 'POST',
    data,
  });
};
