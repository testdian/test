import { request, ResponseData } from '@/api/request';
import { EmissionSourceResp } from '@/sdks/computation/computationV2ApiDocs';
import { EmissionSourceFactorSelectReqRequest } from '@/views/eca/emissionManage/type';

/**
 * /computation/emissionSourceFactor/editFactor
 * 编辑因子
 */
export const editEmissionSourceFactorFactorApi = (
  data: EmissionSourceFactorSelectReqRequest,
) =>
  request<ResponseData<EmissionSourceResp>>({
    url: `/computation/emissionSourceFactor/editFactor`,
    method: 'POST',
    data,
  });

/**
 * 关闭和保存的弹窗都调用这个因子计算接口
 */
export const calcEmissionSourceFactorApi = (params: {
  computationSourceId: number;
}) =>
  request<ResponseData<EmissionSourceResp>>({
    url: `/computation/computationSource/manualCalc`,
    method: 'GET',
    params,
  });

/**
 * 关闭和保存的弹窗都调用这个因子计算接口-排放源组
 * 数据填报/匹配因子弹窗的因子计算接口
 */
export const calcEmissionSourceGroupFactorApi = (params: { groupId: number }) =>
  request<ResponseData<EmissionSourceResp>>({
    url: `/computation/computationSourceGroup/calc`,
    method: 'GET',
    params,
  });
