import { request, ResponseData } from '@/api/request';

import type {
  FileUploadResp,
  IPageReductionMeasure,
  ReductionMeasureAddReq,
  ReductionMeasureCurveChartMeasureResp,
  ReductionMeasureCurveChartResp,
  ReductionMeasureEditReq,
  IPageComputationImportLog,
  ReductionMeasureImportReq,
  ReductionMeasureImportRecordsParams,
  ReductionMeasureExportParams,
  ReductionMeasureOverviewResp,
  ReductionMeasurePageParams,
  ReductionMeasureWithDetailResp,
} from './type';

/** GET /computation/reductionMeasure/overview */
export const getReductionMeasureOverviewApi = (params: {
  orgCode: string;
  scopeType: number;
}) =>
  request<ResponseData<ReductionMeasureOverviewResp>>({
    url: '/computation/reductionMeasure/overview',
    method: 'GET',
    params,
  });

/** GET /computation/reductionMeasure/page */
export const getReductionMeasurePageApi = (
  params: ReductionMeasurePageParams,
) =>
  request<ResponseData<IPageReductionMeasure>>({
    url: '/computation/reductionMeasure/page',
    method: 'GET',
    params,
  });

/** 曲线图 data：stage1List / stage2List 为两阶段目标线；兼容旧版 targetList */
export function normalizeReductionMeasureCurveChartResp(
  raw: ReductionMeasureCurveChartResp | null | undefined,
): ReductionMeasureCurveChartResp | null {
  if (!raw) return null;
  const hasStageLists =
    (raw.stage1List?.length ?? 0) > 0 || (raw.stage2List?.length ?? 0) > 0;
  if (hasStageLists) {
    return {
      ...raw,
      stage1List: raw.stage1List ?? [],
      stage2List: raw.stage2List ?? [],
    };
  }
  const legacy = (
    raw as ReductionMeasureCurveChartResp & {
      targetList?: ReductionMeasureCurveChartResp['stage1List'];
    }
  ).targetList;
  if (!legacy?.length) {
    return { ...raw, stage1List: [], stage2List: [] };
  }
  return {
    ...raw,
    stage1List: legacy.filter(t => t.stageNo === 1),
    stage2List: legacy.filter(t => t.stageNo === 2),
  };
}

/** GET /computation/reductionMeasure/curveChart */
export const getReductionMeasureCurveChartApi = (params: {
  orgCode: string;
  scopeType: number;
  isAll: boolean;
  measureIdList?: number[];
}) =>
  request<ResponseData<ReductionMeasureCurveChartResp>>({
    url: '/computation/reductionMeasure/curveChart',
    method: 'GET',
    params: {
      orgCode: params.orgCode,
      scopeType: params.scopeType,
      isAll: params.isAll,
      ...(params.isAll === false
        ? { measureIdList: params.measureIdList ?? [] }
        : {}),
    },
  }).then(res => {
    if (res?.data?.data) {
      res.data.data =
        normalizeReductionMeasureCurveChartResp(res.data.data) ?? res.data.data;
    }
    return res;
  });

/** GET /computation/reductionMeasure/curveChartMeasures */
export const getReductionMeasureCurveChartMeasuresApi = (params: {
  orgCode: string;
  scopeType: number;
  year: number;
}) =>
  request<ResponseData<ReductionMeasureCurveChartMeasureResp[]>>({
    url: '/computation/reductionMeasure/curveChartMeasures',
    method: 'GET',
    params,
  });

/** GET /computation/reductionMeasure/export */
export const getReductionMeasureExportApi = (
  params: ReductionMeasureExportParams,
) =>
  request<ResponseData<FileUploadResp>>({
    url: '/computation/reductionMeasure/export',
    method: 'GET',
    params,
  });

/** POST /computation/reductionMeasure/import */
export const postReductionMeasureImportApi = (
  data: ReductionMeasureImportReq,
) =>
  request<ResponseData<void>>({
    url: '/computation/reductionMeasure/import',
    method: 'POST',
    data,
  });

/** GET /computation/reductionMeasure/importRecords */
export const getReductionMeasureImportRecordsApi = (
  params: ReductionMeasureImportRecordsParams,
) =>
  request<ResponseData<IPageComputationImportLog>>({
    url: '/computation/reductionMeasure/importRecords',
    method: 'GET',
    params,
  });

/** POST /computation/reductionMeasure/add */
export const postReductionMeasureAddApi = (data: ReductionMeasureAddReq) =>
  request<ResponseData<number>>({
    url: '/computation/reductionMeasure/add',
    method: 'POST',
    data,
  });

/** POST /computation/reductionMeasure/edit */
export const postReductionMeasureEditApi = (data: ReductionMeasureEditReq) =>
  request<ResponseData<void>>({
    url: '/computation/reductionMeasure/edit',
    method: 'POST',
    data,
  });

/** POST /computation/reductionMeasure/delete */
export const postReductionMeasureDeleteApi = (data: { id: number }) =>
  request<ResponseData<void>>({
    url: '/computation/reductionMeasure/delete',
    method: 'POST',
    data,
  });

/** GET /computation/reductionMeasure/{id} */
export const getReductionMeasureDetailApi = (id: number) =>
  request<ResponseData<ReductionMeasureWithDetailResp>>({
    url: `/computation/reductionMeasure/${id}`,
    method: 'GET',
  });
