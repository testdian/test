/**
 * /computation/computationSource/list
 * @description 截至时间排放源列表
 */

import { request, ResponseData } from '@/api/request';

import {
  DeadlineRemindResponse,
  EmissionSourceListRequest,
  EmissionSourceListResponse,
  SetDeadlineRemindRequest,
} from './type';

export const getEmissionSourceListApi = (params: EmissionSourceListRequest) =>
  request<ResponseData<EmissionSourceListResponse[]>>({
    method: 'GET',
    url: `/computation/computationSource/list`,
    params,
  });

/**
 * @description 更新截止时间
 * /computation/computationSource/setDeadline
 */
export const updateDeadlineApi = (data: {
  computationId: number;
  deadline: string | null;
  idList: number[];
}) =>
  request<ResponseData<null>>({
    method: 'POST',
    url: `/computation/computationSource/setDeadline`,
    data,
  });

/**
 * @description 设置截止时间提醒
 * /computation/computationSource/setDeadlineRemind
 */
export const setDeadlineRemindApi = (data: SetDeadlineRemindRequest) =>
  request<ResponseData<null>>({
    method: 'POST',
    url: `/computation/computationSource/setDeadlineRemind`,
    data,
  });

/**
 * @description 查询截止时间提醒配置
 * /computation/computationSource/deadlineRemind
 */
export const getDeadlineRemindApi = (params: {
  computationId: number;
  orgCode: string;
}) =>
  request<ResponseData<DeadlineRemindResponse[]>>({
    method: 'GET',
    url: `/computation/computationSource/deadlineRemind`,
    params,
  });
