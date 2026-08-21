/**
 * @description 问题清单 - 接口
 */
import { request, ResponseData } from '@/api/request';

import { IssueTrackingDetail, SaveContentReq, TableContent } from './type';

/**
 * 获取问题整改跟踪详情（核算年度等）
 * GET /computation/verificationIssueTracking/{id}
 */
export const getIssueTrackingDetailApi = (id: number) =>
  request<ResponseData<IssueTrackingDetail>>({
    url: `/computation/verificationIssueTracking/${id}`,
    method: 'GET',
  });

/**
 * 获取表格内容（动态表头 + 行数据）
 * GET /computation/verificationIssueTracking/content/{id}
 */
export const getIssueTrackingContentApi = (id: number) =>
  request<ResponseData<TableContent>>({
    url: `/computation/verificationIssueTracking/content/${id}`,
    method: 'GET',
  });

/**
 * 保存表格内容
 * POST /computation/verificationIssueTracking/saveContent
 */
export const saveIssueTrackingContentApi = (data: SaveContentReq) =>
  request<ResponseData>({
    url: `/computation/verificationIssueTracking/saveContent`,
    method: 'POST',
    data,
  });

/**
 * 导入清单（上传 .xlsx 文件）
 * POST /computation/verificationIssueTracking/parseExcel
 */
export const importIssueTrackingExcelApi = (data: {
  id: number;
  file: File;
}) => {
  return request<ResponseData>({
    url: `/computation/verificationIssueTracking/parseExcel`,
    method: 'POST',
    data,
    headers: { 'Content-Type': 'multipart/form-data' },
  });
};

/**
 * 导出清单
 * GET /computation/verificationIssueTracking/export/{id}
 */
export const exportIssueTrackingApi = (id: number) =>
  request<
    ResponseData<{
      fileName: string;
      filePath: string;
      url: string;
      internalUrl: string;
    }>
  >({
    url: `/computation/verificationIssueTracking/export/${id}`,
    method: 'GET',
  });
