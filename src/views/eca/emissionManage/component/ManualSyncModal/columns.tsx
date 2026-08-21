import { ProColumns } from '@ant-design/pro-components';

import I18N from '@/lang/I18N';

import { SyncListResponse } from '../../type';

const searchStyle = {
  width: '180px',
};
/** 排放源列表表格列配置 */
export const emissionSourceColumns: ProColumns<SyncListResponse>[] = [
  {
    title: I18N.eca.emissionSourceName,
    dataIndex: 'sourceName',
    fieldProps: {
      placeholder: I18N.eca.emissionSourceName,
      style: searchStyle,
    },
    formItemProps: {
      name: 'likeSourceName',
      label: false,
    },
  },
  {
    title: '周期',
    dataIndex: 'dataPeriod_name',
    hideInSearch: true,
  },
  {
    title: '所属组织',
    dataIndex: 'orgName',
    hideInSearch: true,
  },
];

/** 核算中的排放源列表表格列配置 */
export const accountingEmissionSourceColumns: (
  yearArr: { label: string | number; value: string | number }[],
) => ProColumns<SyncListResponse>[] = yearArr => [
  {
    title: I18N.eca.emissionSourceName,
    dataIndex: 'sourceName',
    fieldProps: {
      placeholder: I18N.eca.emissionSourceName,
      style: searchStyle,
    },
    formItemProps: {
      name: 'likeSourceName',
      label: false,
    },
  },
  {
    title: '周期',
    dataIndex: 'dataPeriod_name',
    hideInSearch: true,
  },
  {
    title: I18N.eca.accountingOrganization,
    dataIndex: 'orgName',
    hideInSearch: true,
  },
  {
    title: '核算年份',
    dataIndex: 'year',
    valueType: 'select',
    fieldProps: {
      placeholder: '核算年份',
      options: yearArr || [],
      style: searchStyle,
      showSearch: true,
    },
    formItemProps: {
      name: 'year',
      label: false,
    },
  },
];
