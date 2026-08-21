import { ResponseData, request } from '@/api/request';

/** 枚举值启用禁用 状态。0 启用 1 禁用(0:启用; 1:禁用),可用值:0,1 */
export const DictEnumStatus = {
  Enable: 0,
  Disable: 1,
};

/**
 * /system/dictenum/status
 * desc: 枚举值启用禁用
 * 状态。0 启用 1 禁用(0:启用; 1:禁用),可用值:0,1
 */
export const enableDisableEnumApi = (data: { id: number; status: number }) =>
  request<ResponseData>({
    method: 'POST',
    url: '/system/dictenum/status',
    data,
  });

/**
 * 删除枚举值
 */
export const deleteEnumApi = (data: { id: number }) =>
  request<ResponseData<any>>({
    url: `/system/dictenum/deleteById`,
    method: 'POST',
    data,
  });
