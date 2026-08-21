import { request, ResponseData } from '@src/api/request';

import { ApprovalConfigReq, ApprovalConfigResp } from './type';

/**
 * @description 审批配置列表
 */
export const getApprovalConfigList = (params: ApprovalConfigReq) =>
  request<ResponseData<ApprovalConfigResp[]>>({
    method: 'GET',
    url: `/computation/auditConfig/model/listAll`,
    params,
  });
