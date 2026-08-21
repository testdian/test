import { IPageList, request, ResponseData } from '@src/api/request';

import type {
  BatchUpdateFactorSubmitRequest,
  ComputationSourceGroupFactorUpdateListParams,
  FactorUpdateResp,
} from '@/views/eca/component/BatchUpdateFactorModal/type';

import {
  AccountYearComputation,
  ComputationSourceGroupResp,
  ComputationSourceReqRequest,
  ComputationSourceReqResponse,
  ComputationSourceRequest,
} from './type';
import { AccountModelInfoTreeDatum } from '../accountingModel/Info/type';

/**
 * /computation/computation/{year}
 * @description 获取核算数据详情
 */
export const getComputationDataDetailApi = (year: string) =>
  request<ResponseData<AccountYearComputation>>({
    method: 'GET',
    url: `/computation/computation/${year}`,
  });

/**
 * /computation/computation/add
 * @description 新增核算数据
 */
export const addComputationDataApi = (data: AccountYearComputation) =>
  request<ResponseData<AccountYearComputation>>({
    method: 'POST',
    url: `/computation/computation/add`,
    data,
  });

/**
 * /computation/computation/edit
 * @description 编辑核算数据
 */
export const editComputationDataApi = (data: AccountYearComputation) =>
  request<ResponseData<AccountYearComputation>>({
    method: 'POST',
    url: `/computation/computation/edit`,
    data,
  });

/**
 * /computation/computationSourceGroup/tree
 * @description 获取清单样式/排放源列表-树状
 */
export const getTaskEmissionSourceTreeApi = (params: {
  computationId: number;
}) =>
  request<ResponseData<AccountModelInfoTreeDatum[]>>({
    method: 'GET',
    url: `/computation/computationSourceGroup/tree`,
    params,
  });

/**
 * @description 删除任务样式/单条排放源
 */
export const deleteTaskEmissionSourceApi = (data: { id: number }) =>
  request<ResponseData<ComputationSourceRequest>>({
    method: 'POST',
    url: `/computation/computationSourceGroup/deleteEmissionSource`,
    data,
  });

/**
 * @description 撤回任务样式/单条排放源
 */
export const withdrawTaskEmissionSourceApi = (data: { idList: number[] }) =>
  request<ResponseData<ComputationSourceRequest>>({
    method: 'POST',
    url: `/computation/audit/rollback`,
    data,
  });

/**
 * @description 任务样式/新增排放源
 */
export const addTaskEmissionSourceApi = (data: ComputationSourceReqRequest) =>
  request<ResponseData<ComputationSourceRequest>>({
    method: 'POST',
    url: `/computation/computationSourceGroup/selectEmissionSource`,
    data,
  });

/**
 * /computation/computationSource/unMatchFactorList
 * @description 任务样式/未匹配因子列表
 */
export const getUnMatchFactorListApi = (params: {
  computationSourceId: number;
}) =>
  request<ResponseData<ComputationSourceReqResponse[]>>({
    method: 'GET',
    url: `/computation/computationSource/unMatchFactorList`,
    params,
  });

/**
 * /computation/computation/roleList
 * @description 任务样式/发送邮件通知/核算所有角色列表
 */
export const getSendEmailTaskAllRoleListApi = (params: {
  computationIdValue: number;
  year: string;
}) =>
  request<ResponseData<{ roleName: string; id: number }[]>>({
    method: 'GET',
    url: `/computation/computation/roleList`,
    params: {
      computationId: params.computationIdValue,
      year: params.year,
    },
  });

/**
 * /computation/computationSourceGroup/page
 * @description 获取任务列表/排放源列表-分页
 */
export const getTaskEmissionSourceListApi = (
  params: ComputationSourceRequest,
) =>
  request<ResponseData<IPageList<ComputationSourceGroupResp>>>({
    method: 'GET',
    url: `/computation/computationSourceGroup/page`,
    params,
  });

/**
 * @description 同步数据
 */
export const syncTaskEmissionSourceApi = (params: {
  computationSourceId: number;
}) =>
  request<ResponseData<ComputationSourceRequest>>({
    method: 'GET',
    url: `/computation/computationSource/syncInterfaceData`,
    params,
  });

/**
 * @description 重算-一级排放源组-手动计算
 */
export const recalculateTaskEmissionSourceGroupApi = (params: {
  groupId: number;
}) =>
  request<ResponseData<ComputationSourceRequest>>({
    method: 'GET',
    url: `/computation/computationSourceGroup/manualCalc`,
    params,
  });

/**
 * @description 重算
 */
export const recalculateTaskEmissionSourceApi = (params: {
  computationSourceId: number;
}) =>
  request<ResponseData<ComputationSourceRequest>>({
    method: 'GET',
    url: `/computation/computationSource/manualCalc`,
    params,
  });

/**
 * @description 删除任务样式/批量排放源
 */
export const batchDeleteTaskEmissionSourceApi = (data: { idList: number[] }) =>
  request<ResponseData<ComputationSourceRequest>>({
    method: 'POST',
    url: `/computation/computationSourceGroup/batchDeleteEmissionSource`,
    data,
  });

/**
 * 核算计算状态
 */
export const getCalcCheckStatus = () => {
  return request<ResponseData<boolean>>({
    method: 'GET',
    url: '/computation/computationSource/calcCheck',
  });
};

/**
 * @description 无需填报
 */
export const noNeedFillTaskEmissionSourceApi = (data: { id: number }) =>
  request<ResponseData<ComputationSourceRequest>>({
    method: 'POST',
    url: `/computation/computationSource/setEnd`,
    data,
  });

/**
 * @description 无需填报-批量
 */
export const batchNoNeedFillTaskEmissionSourceApi = (data: {
  idList: number[];
}) =>
  request<ResponseData<ComputationSourceRequest>>({
    method: 'POST',
    url: `/computation/computationSource/setEndBatch`,
    data,
  });

/**
 * @description 批量复制排放源组到排放源库
 */
export const batchAddToEmissionSourceLibApi = (data: { idList: number[] }) =>
  request<ResponseData<Record<string, never>>>({
    method: 'POST',
    url: `/computation/computationSourceGroup/batchAddToEmissionSourceLib`,
    data,
  });

/**
 * @description 批量更新排放源组因子
 */
export const getBatchUpdateTaskEmissionSourceFactorListApi = (
  params: ComputationSourceGroupFactorUpdateListParams,
) =>
  request<ResponseData<FactorUpdateResp[]>>({
    method: 'GET',
    url: `/computation/computationSourceGroup/factorUpdateList`,
    params,
  });

/**
 * @description 批量更新排放源组因子-确认更新
 */
export const batchUpdateTaskEmissionSourceFactorApi = (
  data: BatchUpdateFactorSubmitRequest,
) =>
  request<ResponseData<void>>({
    method: 'POST',
    url: `/computation/emissionSource/factorUpdate`,
    data,
  });
