import I18N from '@src/lang/I18N';
import { ColumnsType } from 'antd/lib/table';

export const columns: ColumnsType<{ [key: string]: string }> = [
  {
    title: I18N.carbonData.emissionClassification,
    dataIndex: '排放分类',
    fixed: 'left',
    width: 130,
  },
  {
    title: I18N.carbonData.emissionsTC,
    dataIndex: I18N.carbonData.emissions,
    width: 140,
  },
  {
    title: I18N.carbonData.emissionProportion2,
    dataIndex: I18N.carbonData.emissionProportion,
    width: 140,
  },
  {
    title: I18N.carbonData.baseYearEmissions2,
    dataIndex: I18N.carbonData.baseYearEmissions,
    width: 140,
  },
  {
    title: I18N.carbonData.comparedToTheSamePeriodLastYear2,
    dataIndex: I18N.carbonData.comparedToTheSamePeriodLastYear,
    width: 140,
  },
  {
    title: I18N.carbonData.comparedToTheBaseYear2,
    dataIndex: I18N.carbonData.comparedToTheBaseYear,
    width: 140,
  },
];
