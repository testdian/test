import { request, ResponseData } from '@src/api/request';

import { ComputationOrgTreeResp, ComputationOrgTreeReq } from './type';

/**
 * @description 获取任务列表/核算树列表
 */
export const getTaskTreeListApi = (params: ComputationOrgTreeReq) =>
  request<ResponseData<ComputationOrgTreeResp>>({
    method: 'GET',
    url: `/computation/computation/computation/tree`,
    params,
  });

/**
 * @description 一键发送钉钉通知
 */
export const sendDingTaskApi = (data: {
  computationId: number;
  orgCode?: string;
}) =>
  request<ResponseData<void>>({
    method: 'POST',
    url: `/computation/dataFill/sendFillTaskByDingTalk`,
    data,
  });
