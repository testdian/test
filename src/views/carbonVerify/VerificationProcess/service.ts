/**
 * @description 核查过程管理 - 接口
 */
import { IPageList, request, ResponseData } from '@/api/request';

import {
  UploadVerificationOpinionReq,
  VerificationProcessItem,
  VerificationProcessPageReq,
} from './type';

/**
 * /computation/verificationProcess/page
 * 核查过程管理列表
 */
export const getVerificationProcessPageApi = (
  params: VerificationProcessPageReq,
) =>
  request<ResponseData<IPageList<VerificationProcessItem>>>({
    url: `/computation/verificationProcess/page`,
    method: 'GET',
    params,
  });

/**
 * /computation/verificationProcess/edit
 * 编辑-上传核查意见
 */
export const uploadVerificationOpinionApi = (
  data: UploadVerificationOpinionReq,
) =>
  request<ResponseData>({
    url: `/computation/verificationProcess/edit`,
    method: 'POST',
    data,
  });
