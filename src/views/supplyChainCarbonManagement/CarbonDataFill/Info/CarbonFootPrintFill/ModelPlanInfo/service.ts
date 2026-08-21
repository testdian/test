import { IPageList, request, ResponseData } from '@src/api/request';

import { AssessmentRequest, AssessmentResp } from './type';

/**
 * @description 选择评价方案弹窗列表数据
 */
export const getAssessmentListApi = (params: AssessmentRequest) =>
  request<ResponseData<IPageList<AssessmentResp>>>({
    method: 'GET',
    url: '/lca/assessment/supplier/page',
    params,
  });
