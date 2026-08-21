import { request, ResponseData } from '@src/api/request';

import {
  FillAssessmentRequest,
  FillAssessmentResp,
  FootprintFillDataRequest,
  FootprintFillDataResp,
  FootprintFillDataSaveRequest,
} from './type';

/**
 * @description 产品环境足迹填报数据
 */
export const getFootprintFillData = (params: FootprintFillDataRequest) =>
  request<ResponseData<FootprintFillDataResp>>({
    method: 'GET',
    url: `/supplychain/dataFill/apply/result/${params.applyInfoId}`,
    params,
  });

/**
 * @description 选择评价方案-评价方案数据
 */
export const getFillAssessmentData = (params: FillAssessmentRequest) =>
  request<ResponseData<FillAssessmentResp>>({
    method: 'GET',
    url: `/supplychain/dataFill/assessment/${params.applyInfoId}/${params.assessmentId}`,
    params,
  });

/**
 * @description 保存数据填报
 */
export const postFootprintFillDataSave = (data: FootprintFillDataSaveRequest) =>
  request<ResponseData<{ [key: string]: any }>>({
    method: 'POST',
    url: '/supplychain/dataFill/footprint/save',
    data,
  });

/**
 * @description 保存并提交数据填报
 */
export const postFootprintFillDataSaveAndSubmit = (
  data: FootprintFillDataSaveRequest,
) =>
  request<ResponseData<{ [key: string]: any }>>({
    method: 'POST',
    url: '/supplychain/dataFill/footprint/saveAndSubmit',
    data,
  });
