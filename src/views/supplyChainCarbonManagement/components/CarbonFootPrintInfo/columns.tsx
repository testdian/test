import I18N from '@src/lang/I18N';
import type { ColumnsType } from 'antd/es/table';
import { compact } from 'lodash-es';

import { TargetTable } from '../../CarbonDataFill/Info/CarbonFootPrintFill/type';

export const columns = ({
  isAllCycle,
}: {
  isAllCycle?: boolean;
}): ColumnsType<TargetTable> => {
  if (!isAllCycle) {
    return compact([
      {
        title: I18N.carbonFootPrintLCA.number,
        dataIndex: 'index',
        fixed: 'left',
        width: 58,
        render: (_, __, index) => index + 1,
      },
      {
        title: I18N.certificationReviewCenter.evaluatingIndicator,
        dataIndex: 'assessmentTargetName',
        fixed: 'left',
        width: 140,
      },
      {
        title: I18N.Factors.unit,
        dataIndex: 'unit',
        fixed: 'left',
        width: 80,
      },
      {
        title: I18N.supplyChainCarbonManagement.unitProductEnvironment,
        dataIndex: 'resultData',
        fixed: 'left',
        width: 140,
      },
      {
        title: I18N.supplyChainCarbonManagement.rawMaterialStage,
        dataIndex: 'rawMaterialStage',
        width: 140,
      },
      {
        title: I18N.supplyChainCarbonManagement.packagingMaterialLevel,
        dataIndex: 'packagingMaterialStage',
        width: 140,
      },
      {
        title: I18N.supplyChainCarbonManagement.entryTransportationStage,
        dataIndex: 'entranceTransportationStage',
        width: 140,
      },
      {
        title: I18N.carbonFootPrintLCA.productionAndManufacturing,
        dataIndex: 'productionManufacturing',
        width: 140,
      },
      {
        title: I18N.supplyChainCarbonManagement.wasteStage,
        dataIndex: 'wasteStage',
        width: 140,
      },
    ]);
  }
  // 半生命周期
  return compact([
    {
      title: I18N.carbonFootPrintLCA.number,
      dataIndex: 'index',
      fixed: 'left',
      width: 58,
      render: (_, __, index) => index + 1,
    },
    {
      title: I18N.certificationReviewCenter.evaluatingIndicator,
      dataIndex: 'assessmentTargetName',
      fixed: 'left',
      width: 140,
    },
    {
      title: I18N.Factors.unit,
      dataIndex: 'unit',
      fixed: 'left',
      width: 80,
    },
    {
      title: I18N.supplyChainCarbonManagement.unitProductEnvironment,
      dataIndex: 'resultData',
      fixed: 'left',
      width: 140,
    },
    {
      title: I18N.carbonFootPrintLCA.productProductionStage,
      dataIndex: 'productProductionStage',
      width: 140,
    },
    {
      title: I18N.carbonFootPrintLCA.constructionProcessStage,
      dataIndex: 'constructionProductionStage',
      width: 140,
    },
    {
      title: I18N.supplyChainCarbonManagement.usageStage,
      dataIndex: 'usageStage',
      width: 140,
    },
    {
      title: I18N.supplyChainCarbonManagement.endOfLifeStage,
      dataIndex: 'endStage',
      width: 140,
    },
    {
      title: I18N.carbonFootPrintLCA.additionalBenefitsAnd,
      dataIndex: 'additional',
      width: 140,
    },
  ]);
};
