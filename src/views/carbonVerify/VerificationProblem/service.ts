/**
 * @description 问题整改跟踪 - 接口
 */
import { IPageList, request, ResponseData } from '@/api/request';

import {
  VerificationProblemDetail,
  VerificationProblemItem,
  VerificationProblemPageReq,
} from './type';

/**
 * /computation/verificationIssueTracking/page
 * 问题整改跟踪列表
 */
export const getVerificationProblemPageApi = (
  params: VerificationProblemPageReq,
) =>
  request<ResponseData<IPageList<VerificationProblemItem>>>({
    url: `/computation/verificationIssueTracking/page`,
    method: 'GET',
    params,
  });

/**
 * /carbonVerify/problem/{id}
 * 问题整改详情
 */
export const getVerificationProblemDetailApi = (id: string) =>
  request<ResponseData<VerificationProblemDetail>>({
    url: `/carbonVerify/problem/${id}`,
    method: 'GET',
  });

/**
 * /carbonVerify/problem/edit
 * 编辑问题整改
 */
export const editVerificationProblemApi = (data: VerificationProblemDetail) =>
  request<ResponseData>({
    url: `/carbonVerify/problem/edit`,
    method: 'POST',
    data,
  });
