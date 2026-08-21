import { request, ResponseData } from '@src/api/request';

import { ApprovalConfigReq, ApprovalConfigResp } from './type';

/**
 * @description 核算审批列表
 */
export const getApprovalConfigListApi = (params: ApprovalConfigReq) =>
  request<ResponseData<ApprovalConfigResp[]>>({
    method: 'GET',
    url: `/computation/auditConfig/computation/list`,
    params,
  });
