/*
 * @@description:
 * @Author: liuxinxin xinxin@carbonstop.net
 * @Date: 2023-04-19 14:12:16
 * @LastEditors: liuxinxin xinxin@carbonstop.net
 * @LastEditTime: 2023-06-07 18:02:30
 */
import I18N from '@src/lang/I18N';
import type { ColumnsType } from 'antd/es/table';

import { ComputationProcess } from '@/sdks_v2/new/supplychainV2ApiDocs';

export type TypeComputation = ComputationProcess & {
  ghgCategory_name?: string;
  isoCategory_name?: string;
};

export const columns = (): ColumnsType<TypeComputation> => [
  {
    title: I18N.eca.emissionSourceName,
    dataIndex: 'sourceName',
  },
  {
    title: I18N.eca.emissionFacilityActivity,
    dataIndex: 'facility',
  },
  {
    title: I18N.eca.activityData,
    dataIndex: 'dataValue',
  },
  {
    title: I18N.Factors.emissionFactors,
    dataIndex: 'factorDesc',
  },
  {
    title: I18N.carbonData.emissionsTC,
    dataIndex: 'carbonEmission',
  },
  {
    title: I18N.eca.ghgClassification,
    dataIndex: 'ghgClassify_name',
    render: (text, record) => {
      return `${record?.ghgCategory_name}, ${text}`;
    },
  },
  {
    title: I18N.eca.isoClassification,
    dataIndex: 'isoClassify_name',
    render: (text: string, record) => {
      return `${record?.isoCategory_name},${text}`;
    },
  },
  {
    title: I18N.eca.emissionSourceId,
    dataIndex: 'sourceCode',
  },
];
