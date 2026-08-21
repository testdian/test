import { ResponseData, IPageList, request } from '@/api/request';

import {
  ExportParams,
  InterFaceList,
  IPage,
  EnergyPageItem,
  KtmsPageItem,
  OaPageItem,
} from './type';

/**
 * /computation/dataTransLog/page
 * desc: 接口管理-分页查询
 */
export const getInterfaceListApi = (params: IPage) =>
  request<ResponseData<IPageList<InterFaceList>>>({
    method: 'GET',
    url: '/computation/dataTransLog/page',
    params,
  });

/**
 * 接口导出
 */
export const exportInterfaceApi = (params: ExportParams) =>
  request<ResponseData<object>>({
    method: 'GET',
    url: '/computation/dataTransLog/export',
    params,
  });

/**
 * /system/dataTransLog/{id}
 * desc: 接口管理-详情
 */
export const getInterfaceDetailApi = (id: number) =>
  request<ResponseData<InterFaceList>>({
    method: 'GET',
    url: `/computation/dataTransLog/${id}`,
  });

/**
 * /computation/dataTransLog/energyPage
 * desc: 接口管理-能源系统详情
 */
export const getEnergyApi = (params: {
  id: number;
  pageNum: number;
  pageSize: number;
}) =>
  request<ResponseData<IPageList<EnergyPageItem>>>({
    method: 'GET',
    url: '/computation/dataTransLog/energyPage',
    params,
  });

/**
 * /computation/dataTransLog/ktmsPage
 * desc: 接口管理-KTMS详情
 */
export const getKtmsApi = (params: {
  id: number;
  pageNum: number;
  pageSize: number;
}) =>
  request<ResponseData<IPageList<KtmsPageItem>>>({
    method: 'GET',
    url: '/computation/dataTransLog/ktmsPage',
    params,
  });

/**
 * /computation/dataTransLog/oaPage
 * desc: 接口管理-OA 分页（行字段见 OaPageItem）
 */
export const getOaPageApi = (params: {
  id: number;
  pageNum: number;
  pageSize: number;
}) =>
  request<ResponseData<IPageList<OaPageItem>>>({
    method: 'GET',
    url: '/computation/dataTransLog/oaPage',
    params,
  });

/** 以下为旧接口，已废弃 */
/**
 * /system/dataTransLog/getData
 * desc: 接口管理-获取数据
 */
export const getInterfaceDataApi = (params: { id: number }) =>
  request<ResponseData<InterFaceList>>({
    method: 'GET',
    url: '/system/dataTransLog/getData',
    params,
  });

/**
 * /computation/dataTrans/carbonAccountPage
 * desc: 接口管理-碳账户详情接口
 */
export const getCarbonAccountApi = (params: {
  id: number;
  pageNum: number;
  pageSize: number;
}) =>
  request<ResponseData<IPageList<InterFaceList>>>({
    method: 'GET',
    url: '/computation/dataTrans/carbonAccountPage',
    params,
  });

/**
 * /computation/dataTrans/carePage
 * desc: 接口管理-care详情接口
 */
export const getCareApi = (params: {
  id: number;
  pageNum: number;
  pageSize: number;
}) =>
  request<ResponseData<IPageList<InterFaceList>>>({
    method: 'GET',
    url: '/computation/dataTrans/carePage',
    params,
  });

/**
 * /computation/dataTrans/wmsReturn
 * desc: 接口管理-WMS退货详情接口
 */
export const getWmsReturnApi = (params: {
  id: number;
  pageNum: number;
  pageSize: number;
}) =>
  request<ResponseData<IPageList<InterFaceList>>>({
    method: 'GET',
    url: '/computation/dataTrans/wmsReturn',
    params,
  });

/**
 * /computation/dataTrans/wmsShipping
 * desc: 接口管理-WMS发货详情接口
 */
export const getWmsShippingApi = (params: {
  id: number;
  pageNum: number;
  pageSize: number;
}) =>
  request<ResponseData<IPageList<InterFaceList>>>({
    method: 'GET',
    url: '/computation/dataTrans/wmsShipping',
    params,
  });
