/**
 * @description 核查计划详情 - 接口
 */
import { request, ResponseData } from '@/api/request';

import { VerificationPlanItem } from '../type';
import {
  AddVerificationPlanDetailReq,
  EditVerificationPlanDetailReq,
  ExportVerificationPlanReq,
  GetSourceGroupsReq,
  GetUsersByGroupIdsReq,
  SourceGroupItem,
  UserItem,
  VerificationPlanDetailItem,
  VerificationPlanDetailListReq,
} from './type';

/**
 * /computation/verificationPlan/{id}
 * 根据ID获取核查计划信息（核算年度、核算组织）
 */
export const getVerificationPlanByIdApi = (params: { id: number }) =>
  request<ResponseData<VerificationPlanItem>>({
    url: `/computation/verificationPlan/${params.id}`,
    method: 'GET',
  });

/**
 * /computation/verificationPlanDetail/list
 * 核查计划详情列表（不分页）
 */
export const getVerificationPlanDetailListApi = (
  params: VerificationPlanDetailListReq,
) =>
  request<ResponseData<VerificationPlanDetailItem[]>>({
    url: `/computation/verificationPlanDetail/list`,
    method: 'GET',
    params,
  });

/**
 * /computation/verificationPlanDetail/add
 * 新增核查计划详情行
 */
export const addVerificationPlanDetailApi = (
  data: AddVerificationPlanDetailReq,
) =>
  request<ResponseData>({
    url: `/computation/verificationPlanDetail/add`,
    method: 'POST',
    data,
  });

/**
 * /computation/verificationPlanDetail/edit
 * 编辑核查计划详情行
 */
export const editVerificationPlanDetailApi = (
  data: EditVerificationPlanDetailReq,
) =>
  request<ResponseData>({
    url: `/computation/verificationPlanDetail/edit`,
    method: 'POST',
    data,
  });

/**
 * /computation/verificationPlanDetail/delete
 * 删除核查计划详情行
 */
export const deleteVerificationPlanDetailApi = (data: { id: number }) =>
  request<ResponseData>({
    url: `/computation/verificationPlanDetail/delete`,
    method: 'POST',
    data,
  });

/**
 * /computation/verificationPlanDetail/export
 * 导出核查计划
 */
export const exportVerificationPlanDetailApi = (
  params: ExportVerificationPlanReq,
) =>
  request<ResponseData>({
    url: `/computation/verificationPlanDetail/export`,
    method: 'GET',
    params,
  });

/**
 * /computation/verificationPlanDetail/sourceGroups
 * 获取排放源组列表
 */
export const getSourceGroupsApi = (params: GetSourceGroupsReq) =>
  request<ResponseData<SourceGroupItem[]>>({
    url: `/computation/verificationPlanDetail/sourceGroups`,
    method: 'GET',
    params,
  });

/**
 * /computation/verificationPlanDetail/usersByGroupIds
 * 根据排放源组查询用户列表
 */
export const getUsersByGroupIdsApi = (params: GetUsersByGroupIdsReq) =>
  request<ResponseData<UserItem[]>>({
    url: `/computation/verificationPlanDetail/usersByGroupIds`,
    method: 'GET',
    params,
  });
