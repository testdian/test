import I18N from '@src/lang/I18N';
import type { ColumnsType } from 'antd/es/table';

import { Supplier } from '@/sdks_v2/new/supplychainV2ApiDocs';

export const columns = (): ColumnsType<Supplier> => [
  {
    title: I18N.certificationReviewCenter.evaluatingIndicator,
    dataIndex: 'evaluationIndex',
    fixed: 'left',
  },
  {
    title: I18N.Factors.unit,
    dataIndex: 'unit',
    fixed: 'left',
  },
  {
    title: I18N.supplyChainCarbonManagement.unitProductEnvironment,
    dataIndex: 'unitProductEnvironmentalImpactEvaluationResult',
    fixed: 'left',
  },
  {
    title: I18N.supplyChainCarbonManagement.rawMaterialStage,
    dataIndex: 'rawMaterialStage',
  },
  {
    title: I18N.supplyChainCarbonManagement.packagingMaterialLevel,
    dataIndex: 'packagingMaterialStage',
  },
  {
    title: I18N.supplyChainCarbonManagement.entryTransportationStage,
    dataIndex: 'entranceTransportationStage',
  },
  {
    title: I18N.carbonFootPrintLCA.productionAndManufacturing,
    dataIndex: 'productionManufacturing',
  },
  {
    title: I18N.supplyChainCarbonManagement.wasteStage,
    dataIndex: 'wasteStage',
  },
  {
    title: I18N.supplyChainCarbonManagement.distributionStage,
    dataIndex: 'distributionStage',
  },
  {
    title: I18N.supplyChainCarbonManagement.usageStage,
    dataIndex: 'usageStage',
  },
];
