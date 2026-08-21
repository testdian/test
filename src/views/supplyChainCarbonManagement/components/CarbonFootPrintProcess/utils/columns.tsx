/*
 * @@description:
 * @Author: liuxinxin xinxin@carbonstop.net
 * @Date: 2023-04-19 14:12:16
 * @LastEditors: liuxinxin xinxin@carbonstop.net
 * @LastEditTime: 2023-06-15 23:36:18
 */
import I18N from '@src/lang/I18N';
import type { ColumnsType } from 'antd/es/table';

import { ProductionMaterials } from '@/sdks/footprintV2ApiDocs';
import { TypeFootprintProcess } from '@/views/supplyChainCarbonManagement/utils/type';

import EmissionAmount from './EmissionAmount';

export const columns = (): ColumnsType<TypeFootprintProcess> => [
  {
    title: I18N.eca.name,
    dataIndex: 'materialName',
  },
  {
    title: I18N.carbonFootPrintLCA.quantity,
    dataIndex: 'weight',
    width: 280,
    render: (_, item) => (
      <EmissionAmount item={item as ProductionMaterials} disabled />
    ),
  },
  {
    title: I18N.carbonFootPrintLCA.type,
    dataIndex: 'materialsType',
  },
  {
    title: I18N.Factors.emissionFactors,
    dataIndex: 'factorValue',
    render: (value, record) => {
      return value && record?.factorUnit
        ? `${value} ${record?.factorUnit}`
        : '-';
    },
  },
  {
    title: I18N.carbonFootPrint.emissionKg2,
    dataIndex: 'discharge',
  },
];
