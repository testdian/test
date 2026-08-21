/**
 * @description 核查计划管理 - 接口
 */
import { IPageList, request, ResponseData } from '@/api/request';

import {
  AddVerificationPlanReq,
  EditVerificationPlanReq,
  UpdateDingNotifySwitchReq,
  VerificationPlanItem,
  VerificationPlanPageReq,
} from './type';

/**
 * /computation/verificationPlan/page
 * 核查计划管理列表
 */
export const getVerificationPlanPageApi = (params: VerificationPlanPageReq) =>
  request<ResponseData<IPageList<VerificationPlanItem>>>({
    url: `/computation/verificationPlan/page`,
    method: 'GET',
    params,
  });

/**
 * /carbonVerify/plan/updateDingSwitch
 * 更新钉钉通知发送开关
 */
export const updateDingNotifySwitchApi = (data: UpdateDingNotifySwitchReq) =>
  request<ResponseData>({
    url: `/carbonVerify/plan/updateDingSwitch`,
    method: 'POST',
    data,
  });

/**
 * /computation/verificationPlan/edit
 * 编辑核查计划
 */
export const editVerificationPlanApi = (data: EditVerificationPlanReq) =>
  request<ResponseData>({
    url: `/computation/verificationPlan/edit`,
    method: 'POST',
    data,
  });

/**
 * /computation/verificationPlan/add
 * 新增核查计划
 */
export const addVerificationPlanApi = (data: AddVerificationPlanReq) =>
  request<ResponseData>({
    url: `/computation/verificationPlan/add`,
    method: 'POST',
    data,
  });

/**
 * /computation/verificationPlan/delete
 * 删除核查计划
 */
export const deleteVerificationPlanApi = (data: { id: number }) =>
  request<ResponseData>({
    url: `/computation/verificationPlan/delete`,
    method: 'POST',
    data,
  });
