import { ResponseData, IPageList, request } from '@/api/request';

import { EmailListType, IPage, SendEmailInfoListType } from './type';

/**
 * /system/mailTask/page
 * desc: 邮件发送管理列表
 */
export const getEmailSendingRecordListApi = (
  params: IPage & { sourceId?: number },
) =>
  request<ResponseData<IPageList<EmailListType>>>({
    method: 'GET',
    url: '/system/mailTask/page',
    params,
  });

/**
 * @param data /system/mailTask/edit
 * desc: 编辑邮件发送管理
 */
export const editEmailSendingRecordApi = (data: SendEmailInfoListType) =>
  request<ResponseData<null>>({
    method: 'POST',
    url: '/system/mailTask/edit',
    data,
  });

/**
 * /system/mailTask/editDetail
 * desc: 编辑邮件发送明细
 */
export const editEmailSendingRecordDetailApi = (data: SendEmailInfoListType) =>
  request<ResponseData<null>>({
    method: 'POST',
    url: '/system/mailTask/editDetail',
    data,
  });

/**
 * /system/mailTask/add
 * desc: 新增邮件发送管理
 */
export const addEmailSendingRecordApi = (data: SendEmailInfoListType) =>
  request<ResponseData<null>>({
    method: 'POST',
    url: '/system/mailTask/add',
    data,
  });

/**
 * /system/mailTask/cancelDetail
 * desc: 取消邮件发送明细
 */
export const cancelEmailSendingRecordApi = (data: { id: number }) =>
  request<ResponseData<null>>({
    method: 'POST',
    url: '/system/mailTask/cancelDetail',
    data,
  });

/**
 * /system/mailTask/cancelTask
 * desc: 取消邮件发送任务
 */
export const cancelEmailSendingTaskApi = (data: { id: number }) =>
  request<ResponseData<null>>({
    method: 'POST',
    url: '/system/mailTask/cancelTask',
    data,
  });

/**
 * /system/mailTask/resendDetail
 * desc: 重新发送邮件
 */
export const resendEmailSendingRecordApi = (data: { id: number }) =>
  request<ResponseData<null>>({
    method: 'POST',
    url: '/system/mailTask/resendDetail',
    data,
  });

/**
 * /system/mailTask/{id}
 * desc: 邮件发送管理详情
 */
export const getEmailSendingRecordDetailApi = (id: number) =>
  request<ResponseData<EmailListType>>({
    method: 'GET',
    url: `/system/mailTask/${id}`,
  });

/**
 * /system/mailTask/{id}
 * desc: 邮件发送管理详情
 */
export const getEmailSendingRecordDetailListApi = (
  id: number,
  childrenFlag?: number,
) =>
  request<ResponseData<SendEmailInfoListType>>({
    method: 'GET',
    url: `/system/mailTask/detail`,
    params: {
      id,
      /** 查询子节点。0 否；1 是 */
      childrenFlag,
    },
  });
