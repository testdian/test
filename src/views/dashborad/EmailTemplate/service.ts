import { ResponseData, IPageList, request } from '@/api/request';

import {
  EmailInfoListType,
  EmailListType,
  IPage,
  UserInfoListType,
} from './type';
import { UserReq } from '../Users/type';

/**
 * /system/mailTemplate/page
 * desc: 邮件模板列表
 */
export const getEmailTemplateListApi = (params: IPage) =>
  request<ResponseData<IPageList<EmailListType>>>({
    method: 'GET',
    url: '/system/mailTemplate/page',
    params,
  });

/**
 * /system/mailTemplate/{id}
 * desc: 邮件模板详情
 */
export const getEmailTemplateDetailApi = (id: number) =>
  request<ResponseData<EmailInfoListType>>({
    method: 'GET',
    url: `/system/mailTemplate/${id}`,
  });

/**
 * /system/mailTemplate/add
 * desc: 邮件模板新增
 */
export const addEmailTemplateApi = (data: EmailInfoListType) =>
  request<ResponseData<null>>({
    method: 'POST',
    url: '/system/mailTemplate/add',
    data,
  });

/**
 * /system/mailTemplate/copy
 * desc: 邮件模板复制
 */
export const copyEmailTemplateApi = (id: number) =>
  request<ResponseData<null>>({
    method: 'POST',
    url: `/system/mailTemplate/copy`,
    data: { id },
  });

/**
 * /system/mailTemplate/edit
 * desc: 邮件模板修改
 */
export const updateEmailTemplateApi = (data: EmailInfoListType) =>
  request<ResponseData<null>>({
    method: 'POST',
    url: '/system/mailTemplate/edit',
    data,
  });

/**
 * /system/mailTemplate/delete
 * desc: 邮件模板删除
 */
export const deleteEmailTemplateApi = (id: number) =>
  request<ResponseData<null>>({
    method: 'POST',
    url: `/system/mailTemplate/delete`,
    data: { id },
  });

/**
 * /system/role/getUserByRoleIds
 * desc: 获取角色下的用户
 */
export const getRoleUserApi = (ids: number[]) =>
  request<ResponseData<UserInfoListType[]>>({
    method: 'GET',
    url: '/system/role/getUserByRoleIds',
    params: { ids: ids.toString() },
  });

/**
 * /system/user/getByIds
 * desc: 获取选择多个用户后的详细信息
 */
export const getSelectUserInfoApi = (ids: number[]) =>
  request<ResponseData<UserInfoListType[]>>({
    method: 'GET',
    url: '/system/user/getByIds',
    params: { ids: ids.toString() },
  });

/**
 * /system/user/list
 * desc: 获取用户全量列表
 */
export const getAllUserListApi = (params?: UserReq) =>
  request<ResponseData<UserInfoListType[]>>({
    method: 'GET',
    url: '/system/user/list',
    params,
  });
