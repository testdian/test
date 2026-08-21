import { request, ResponseData } from '@/api/request';
import type {
  BatchUpdateFactorSubmitRequest,
  EmissionSourceFactorUpdateListParams,
  FactorUpdateResp,
} from '@/views/eca/component/BatchUpdateFactorModal/type';

import {
  FormulaListResp,
  EditEmissionSourceFormulaBasicInfoReqRequest,
  EmissionSourceFactorSelectReqRequest,
  EmissionSourceParam,
  EmissionSourceParamReq,
  EmissionSourceReqRequest,
  EmissionSourceResp,
  EmissionSourceTemplateResp,
  EmissionSourceTreeType,
  MatchEmissionSourceFactorReq,
  MatchEmissionSourceFactorResp,
  ManualSyncRequest,
  SyncListRequest,
  SyncListResponse,
} from './type';

/** 获取排放源树接口 */
export const getEmissionSourceTreeApi = () =>
  request<ResponseData<EmissionSourceTreeType[]>>({
    url: `/computation/emissionSource/tree`,
    method: 'GET',
  });

/** 新增排放源接口 */
export const addEmissionSourceApi = (data: EmissionSourceReqRequest) =>
  request<ResponseData<EmissionSourceReqRequest>>({
    url: `/computation/emissionSource/add`,
    method: 'POST',
    data,
  });

/**
 * 复制排放源接口
 */
export const copyEmissionSourceApi = (data: { id: string }) =>
  request<ResponseData<EmissionSourceReqRequest>>({
    url: `/computation/emissionSource/copy`,
    method: 'POST',
    data,
  });

/** 编辑排放源接口 */
export const editEmissionSourceApi = (data: EmissionSourceReqRequest) =>
  request<ResponseData<EmissionSourceReqRequest>>({
    url: `/computation/emissionSource/edit`,
    method: 'POST',
    data,
  });

/** 同步排放源校验接口 */
export const syncEmissionSourceCheckApi = (data: {
  id: number;
  year: number;
}) =>
  request<ResponseData<string>>({
    url: `/computation/emissionSource/sync/check`,
    method: 'POST',
    data,
  });

/** 同步排放源接口 */
export const syncEmissionSourceApi = (data: { id: number; year: number }) =>
  request<ResponseData<EmissionSourceResp>>({
    url: `/computation/emissionSource/sync`,
    method: 'POST',
    data,
  });

/** 核算-编辑排放源组接口 */
export const editEmissionSourceGroupApi = (data: EmissionSourceReqRequest) =>
  request<ResponseData<EmissionSourceReqRequest>>({
    url: `/computation/computationSourceGroup/emissionSource/edit`,
    method: 'POST',
    data,
  });

/** 核算-编辑排放源接口 */
export const editEmissionSourceNewApi = (data: EmissionSourceReqRequest) =>
  request<ResponseData<EmissionSourceReqRequest>>({
    url: `/computation/computationSource/emissionSource/edit`,
    method: 'POST',
    data,
  });

/**
 * 查看排放源详情接口
 */
export const getEmissionSourceDetailApi = (id: number) =>
  request<ResponseData<EmissionSourceResp>>({
    url: `/computation/emissionSource/view/${id}`,
    method: 'GET',
  });

/** 新增模板 */
export const addEmissionSourceTemplateApi = (data: {
  emissionSourceId: number;
  templateName: string;
}) =>
  request<ResponseData<EmissionSourceReqRequest>>({
    url: `/computation/emissionSourceTemplate/add`,
    method: 'POST',
    data,
  });

/**
 * 删除模板
 */
export const deleteEmissionSourceTemplateApi = (id: string) =>
  request<ResponseData<EmissionSourceReqRequest>>({
    url: `/computation/emissionSourceTemplate/delete`,
    method: 'POST',
    data: { id },
  });

/**
 * 编辑模板名称
 */
export const editEmissionSourceTemplateNameApi = (data: {
  /** 模板id */
  id: number;
  /** 排放源id */
  emissionSourceId: number;
  /** 模板名称 */
  templateName: string;
}) =>
  request<ResponseData<EmissionSourceReqRequest>>({
    url: `/computation/emissionSourceTemplate/editTemplateName`,
    method: 'POST',
    data,
  });

/**
 * /computation/emissionSourceTemplate/view/{emissionSourceId}/{emissionSourceTemplateId}
 * @param emissionSourceId 排放源id
 * @param emissionSourceTemplateId 模板id
 * @returns
 * 查看模板详情
 */
export const getEmissionSourceTemplateDetailApi = (
  emissionSourceId: number,
  emissionSourceTemplateId: number,
) =>
  request<ResponseData<EmissionSourceTemplateResp>>({
    url: `/computation/emissionSourceTemplate/view/${emissionSourceId}/${emissionSourceTemplateId}`,
    method: 'GET',
  });

/** 获取选择参数弹窗/左侧参数数据列表 */
export const getEmissionSourceParamListApi = (params: {
  emissionSourceId: string;
}) =>
  request<ResponseData<EmissionSourceResp>>({
    url: `/computation/param/page`,
    method: 'GET',
    params,
  });

/**
 * 获取选择参数弹窗/右侧参数数据列表
 */
export const getEmissionSourceParamValueListApi = (
  emissionSourceId: number,
  emissionSourceTemplateId: number,
) =>
  request<ResponseData<EmissionSourceParam[]>>({
    url: `/computation/emissionSourceTemplate/paramList/${emissionSourceId}/${emissionSourceTemplateId}`,
    method: 'GET',
  });

/**
 * 保存参数规则校验
 */
export const saveEmissionSourceParamValueListApi = (
  data: EmissionSourceParamReq,
) =>
  request<ResponseData<EmissionSourceResp>>({
    url: `/computation/emissionSourceTemplate/editCheck`,
    method: 'POST',
    data,
  });

/**
 * 保存参数
 */
export const saveEmissionSourceTemplateApi = (data: EmissionSourceParamReq) =>
  request<ResponseData<EmissionSourceResp>>({
    url: `/computation/emissionSourceTemplate/edit`,
    method: 'POST',
    data,
  });

/**
 * 修改排放源描述、填报描述
 */
export const editEmissionSourceDescApi = (data: {
  /** 排放源id */
  emissionSourceId: number;
  /** 模板id */
  id: number;
  /** 排放源描述 */
  fillDesc: string;
  /** 模板描述 */
  fillTips: string;
  /** 多语言列表 */
  languageSourceList: {
    langType: number;
    sourceType: number;
    sourceValue: any;
    id?: number;
  }[];
}) =>
  request<ResponseData<EmissionSourceResp>>({
    url: `/computation/emissionSourceTemplate/editFillDesc`,
    method: 'POST',
    data,
  });

/**
 * /computation/emissionSourceFormula/checkAndSave
 * 保存公式校验(新增)
 */
export const saveEmissionSourceFormulaApi = (data: FormulaListResp) =>
  request<ResponseData<EmissionSourceResp>>({
    url: `/computation/emissionSourceFormula/checkAndSave`,
    method: 'POST',
    data,
  });

/**
 * /computation/emissionSourceFormula/edit
 * 编辑公式
 */
export const editEmissionSourceFormulaApi = (data: FormulaListResp) =>
  request<ResponseData<EmissionSourceResp>>({
    url: `/computation/emissionSourceFormula/edit`,
    method: 'POST',
    data,
  });

/**
 * 仅校验公式
 */
export const checkEmissionSourceFormulaApi = (data: {
  emissionSourceTemplateId: string;
  formula: string;
}) =>
  request<ResponseData<EmissionSourceResp>>({
    url: `/computation/emissionSourceFormula/check`,
    method: 'POST',
    data,
  });

/**
 * /computation/emissionSourceFormula/list/{emissionSourceId}/{emissionSourceTemplateId}
 * 获取公式列表
 */
export const getEmissionSourceFormulaListApi = (
  emissionSourceId: number,
  emissionSourceTemplateId: number,
) =>
  request<ResponseData<EmissionSourceResp>>({
    url: `/computation/emissionSourceFormula/list/${emissionSourceId}/${emissionSourceTemplateId}`,
    method: 'GET',
  });

/**
 * /computation/emissionSourceFormula/delete
 * 删除公式
 */
export const deleteEmissionSourceFormulaApi = (id: number) =>
  request<ResponseData<EmissionSourceResp>>({
    url: `/computation/emissionSourceFormula/delete`,
    method: 'POST',
    data: { id },
  });
/**
 * 编辑公式基本信息
 */
export const editEmissionSourceFormulaBasicInfoApi = (
  data: EditEmissionSourceFormulaBasicInfoReqRequest,
) =>
  request<ResponseData<EmissionSourceResp>>({
    url: `/computation/emissionSourceFormula/editBase`,
    method: 'POST',
    data,
  });

/**
 * 编辑公式详情（包含活动数据等）
 */
export const editEmissionSourceFormulaDetailApi = (data: {
  id: number;
  activityDataType?: number;
  activityDataSelect?: string;
  activityDataFormula?: string;
  activityDataUnitList?: string[];
  sort?: number;
}) =>
  request<ResponseData<EmissionSourceResp>>({
    url: `/computation/emissionSourceFormula/edit`,
    method: 'POST',
    data,
  });

/**
 * /computation/emissionSourceFactor/add
 * 新增主要参数
 */
/**
 * EmissionSourceFactorReq
 */
export interface EmissionSourceFactorReqRequest {
  /**
   * 副参数ID列表
   */
  associatedParamCodeList?: string[];
  /**
   * 排放源id
   */
  emissionSourceId?: number;
  /**
   * 模板id
   */
  emissionSourceTemplateId?: number;
  /**
   * 主参数ID
   */
  mainParamCode?: string;
  [property: string]: any;
}
export const addEmissionSourceFactorApi = (
  data: EmissionSourceFactorReqRequest,
) =>
  request<ResponseData<EmissionSourceResp>>({
    url: `/computation/emissionSourceFactor/add`,
    method: 'POST',
    data,
  });

/**
 * /computation/emissionSourceFactor/delete
 * 删除主要参数 （传入emissionSourceFactorId）
 */
export const deleteEmissionSourceFactorApi = (id: number) =>
  request<ResponseData<EmissionSourceResp>>({
    url: `/computation/emissionSourceFactor/delete`,
    method: 'POST',
    data: { id },
  });

/**
 * /computation/emissionSourceFactor/deleteFactor
 * 删除因子 传入factorValueId
 */
export const deleteEmissionSourceFactorFactorApi = (id: string) =>
  request<ResponseData<EmissionSourceResp>>({
    url: `/computation/emissionSourceFactor/deleteFactor`,
    method: 'POST',
    data: { id },
  });

/**
 * /computation/emissionSourceFactor/list/{emissionSourceId}/{emissionSourceTemplateId}
 * 获取因子列表
 */
export const getEmissionSourceFactorListApi = (
  emissionSourceId: number,
  emissionSourceTemplateId: number,
) =>
  request<ResponseData<EmissionSourceResp>>({
    url: `/computation/emissionSourceFactor/list/${emissionSourceId}/${emissionSourceTemplateId}`,
    method: 'GET',
  });

/**
 * /computation/emissionSourceFactor/selectFactor
 * 选择因子
 */
export const selectEmissionSourceFactorFactorApi = (
  data: EmissionSourceFactorSelectReqRequest,
) =>
  request<ResponseData<EmissionSourceResp>>({
    url: `/computation/emissionSourceFactor/selectFactor`,
    method: 'POST',
    data,
  });

/**
 * /computation/emissionSourceFactor/editFactor
 * 编辑因子
 */
export const editEmissionSourceFactorApi = (
  data: EmissionSourceFactorSelectReqRequest,
) =>
  request<ResponseData<EmissionSourceResp>>({
    url: `/computation/emissionSourceFactor/editFactor`,
    method: 'POST',
    data,
  });

/**
 * 因子只能匹配-排放源模版step3
 */
export const matchEmissionSourceFactorApi = (
  data: MatchEmissionSourceFactorReq,
) =>
  request<ResponseData<MatchEmissionSourceFactorResp>>({
    url: `/system/factor/match`,
    method: 'POST',
    data,
  });

/** 批量更新排放源因子-获取可更新列表 */
export const getBatchUpdateEmissionSourceFactorListApi = (
  params: EmissionSourceFactorUpdateListParams,
) =>
  request<ResponseData<FactorUpdateResp[]>>({
    url: `/computation/emissionSource/factorUpdateList`,
    method: 'GET',
    params,
  });

/** 批量更新排放源因子-确认更新 */
export const batchUpdateEmissionSourceFactorApi = (
  data: BatchUpdateFactorSubmitRequest,
) =>
  request<ResponseData<void>>({
    url: `/computation/emissionSource/factorUpdate`,
    method: 'POST',
    data,
  });

/**
 * 获取排放源库的排放源列表
 */
export const getEmissionSourceListApi = (params: SyncListRequest) =>
  request<ResponseData<SyncListResponse[]>>({
    url: `/computation/emissionSource/sync2ListAll2`,
    method: 'GET',
    params,
  });

/**
 * 获取核算中的排放源列表
 */
export const getAccountingEmissionSourceListApi = (params: SyncListRequest) =>
  request<ResponseData<SyncListResponse[]>>({
    url: `/computation/emissionSource/sync2ListAll1`,
    method: 'GET',
    params,
  });

/** 手动同步-同步排放源校验接口 */
export const manualSyncEmissionSourceCheckApi = (data: ManualSyncRequest) =>
  request<ResponseData<string>>({
    url: `/computation/emissionSource/sync2/check`,
    method: 'POST',
    data,
  });

/** 手动同步-同步排放源接口 */
export const submitManualSyncApi = (data: ManualSyncRequest) =>
  request<ResponseData<EmissionSourceResp>>({
    url: `/computation/emissionSource/sync2`,
    method: 'POST',
    data,
  });
