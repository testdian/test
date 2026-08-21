import { request, ResponseData } from '@/api/request';
import { Permission } from '@/sdks/systemV2ApiDocs';

/**
 * /system/permission/add
 * 新增权限点
 */
export const addPermission = (data: Permission) =>
  request<ResponseData<any>>({
    method: 'POST',
    url: `/system/permission/add`,
    data,
  });

/**
 * /system/permission/edit
 * 编辑权限点
 */
export const editPermission = (data: Permission) =>
  request<ResponseData<any>>({
    method: 'POST',
    url: `/system/permission/edit`,
    data,
  });

/**
 * /system/permission/delete
 * 删除权限点
 */
export const deletePermission = (id: number) =>
  request<ResponseData<any>>({
    method: 'POST',
    url: `/system/permission/delete`,
    data: { id },
  });
