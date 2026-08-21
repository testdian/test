import { request, ResponseData, IPageList } from '@src/api/request';

import {
  AuditDetailDto,
  AuditNode,
  AuditLog,
  DataFillPageRequest,
  ComputationSourceResp,
  ComputationTemplateResp,
  FillDataRow,
} from './type';

/**
 * @description 查询审批配置
 */
export const getAuditConfig = (params: { orgId: number }) =>
  request<ResponseData<AuditDetailDto>>({
    method: 'GET',
    url: `/computation/audit/${params.orgId}`,
    params,
  });

/**
 * @description 审批流程列表
 */
export const getAuditProcessList = (params: { computationDataId: number }) =>
  request<ResponseData<AuditNode[]>>({
    method: 'GET',
    url: `/computation/audit/node/list/curr`,
    params,
  });

/**
 * @description 审批记录列表
 */

export const getAuditRecordList = (params: { computationDataId: number }) =>
  request<ResponseData<AuditLog[]>>({
    method: 'GET',
    url: `/computation/audit/log/list`,
    params,
  });

/**
 * @description 企业碳核算/数据填报/排放数据填报
 * /computation/dataFill/page
 */
export const getComputationDataFillPageApi = (params: DataFillPageRequest) =>
  request<ResponseData<IPageList<ComputationSourceResp>>>({
    method: 'GET',
    url: `/computation/dataFill/page`,
    params,
  });

/**
 * /computation/dataFill/editRow
 * @description 企业碳核算/数据填报/编辑排放数据填报
 */
export const editComputationDataFillApi = (data: ComputationSourceResp) =>
  request<ResponseData<ComputationSourceResp>>({
    method: 'POST',
    url: `/computation/dataFill/editRow`,
    data,
  });

/**
 * /computation/dataFill/sendFillTask
 * @description 企业碳核算/数据填报/发送邮件通知
 */
export const sendComputationDataFillTaskApi = (data: ComputationSourceResp) =>
  request<ResponseData<ComputationSourceResp>>({
    method: 'POST',
    url: `/computation/dataFill/sendFillTask`,
    data,
  });

/**
 *  /computation/dataFill/submit
 * @description 企业碳核算/数据填报/提交审核
 */
export const submitComputationDataFillApi = (data: { id: number }) =>
  request<ResponseData<ComputationSourceResp>>({
    method: 'POST',
    url: `/computation/dataFill/submit`,
    data,
  });
/**
 * /computation/dataFill/updateAttachment
 * @description 企业碳核算/数据填报/更新模板附件
 */
export const updateComputationDataFillAttachmentApi = (
  data: ComputationSourceResp,
) =>
  request<ResponseData<ComputationSourceResp>>({
    method: 'POST',
    url: `/computation/dataFill/updateAttachment`,
    data,
  });

/**
 * /computation/dataFill/data/page
 * @description 企业碳核算/数据填报/填报数据抽屉中的数据列表
 */
export const getComputationDataFillDataPageApi = (
  params: DataFillPageRequest,
) =>
  request<ResponseData<IPageList<FillDataRow>>>({
    method: 'GET',
    url: `/computation/dataFill/data/page`,
    params,
  });

/**
 * /computation/dataFill/templateList/{computationId}/{computationSourceId}
 * @description 企业碳核算/数据填报/获取模板表头
 */
export const getComputationDataFillTemplateListApi = (
  computationId: number,
  computationSourceId: number,
) =>
  request<ResponseData<ComputationTemplateResp[]>>({
    method: 'GET',
    url: `/computation/dataFill/templateList/${computationId}/${computationSourceId}`,
  });

/**
 * /computation/dataFill/batchDeleteRow
 * @description 企业碳核算/数据填报/批量删除数据
 */
export const batchDeleteComputationDataFillRowApi = (data: {
  idList: number[];
  computationId: number;
}) =>
  request<ResponseData<ComputationSourceResp>>({
    method: 'POST',
    url: `/computation/dataFill/batchDeleteRow`,
    data,
  });

/**
 * /computation/dataFill/addRow
 * @description 企业碳核算/数据填报/新增数据
 */
export const addComputationDataFillRowApi = (data: ComputationSourceResp) =>
  request<ResponseData<ComputationSourceResp>>({
    method: 'POST',
    url: `/computation/dataFill/addRow`,
    data,
  });

/**
 * /computation/dataFill/editRow
 * @description 企业碳核算/数据填报/编辑数据
 */
export const editComputationDataFillRowApi = (data: ComputationSourceResp) =>
  request<ResponseData<ComputationSourceResp>>({
    method: 'POST',
    url: `/computation/dataFill/editRow`,
    data,
  });

/**
 * /computation/dataFill/rowCheck
 * @description 企业碳核算/数据填报/数据校验
 */
export const checkComputationDataFillRowApi = (data: ComputationSourceResp) =>
  request<ResponseData<ComputationSourceResp>>({
    method: 'POST',
    url: `/computation/dataFill/rowCheck`,
    data,
  });

/**
 * /computation/dataFill/updateAttachment
 * @description 企业碳核算/数据填报/更新数据附件
 */
export const updateComputationDataFillRowAttachmentApi = (data: {
  attachmentUrl: string;
  computationId: number;
  computationSourceId: number;
  emissionSourceTemplateId: number;
}) =>
  request<ResponseData<ComputationSourceResp>>({
    method: 'POST',
    url: `/computation/dataFill/updateAttachment`,
    data,
  });

/**
 * @description 企业碳核算/数据填报/批量下载模板附件
 */
export const downloadComputationDataFillRowDataAttachmentApi = (params: {
  computationSourceId: number;
  emissionSourceTemplateId: number;
}) =>
  request<ResponseData<ComputationSourceResp>>({
    method: 'GET',
    url: `/computation/dataFill/downloadAttachment`,
    params,
  });

/**
 * @description 企业碳核算/数据填报/更新行列表处的附件
 */
export const updateComputationDataFillRowDataAttachmentApi = (data: {
  attachmentUrl: string;
  id: number;
  computationSourceId: number;
  emissionSourceTemplateId: number;
}) =>
  request<ResponseData<ComputationSourceResp>>({
    method: 'POST',
    url: `/computation/dataFill/updateRowAttachment`,
    data,
  });
