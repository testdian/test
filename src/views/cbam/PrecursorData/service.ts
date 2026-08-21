import { IPageList, request, ResponseData } from '@src/api/request';

import { PrecursorDataRequest, PrecursorDataResp } from './type';

/**
 * @description 前体数据列表
 */
export const getPrecursorDataList = (params: PrecursorDataRequest) =>
  request<ResponseData<IPageList<PrecursorDataResp>>>({
    method: 'GET',
    url: '/cbam/supplyInfo/findAuditPage',
    params,
  });

/**
 * @description 关闭任务
 */
export const postCloseSupplyApply = (data: { id: number }) =>
  request<ResponseData<{ [key: string]: any }>>({
    method: 'POST',
    url: '/cbam/supplyInfo/close',
    data,
  });
