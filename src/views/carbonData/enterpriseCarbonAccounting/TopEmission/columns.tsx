/**
 * @description 排放源清单columns
 */
import I18N from '@src/lang/I18N';
import { ColumnsType } from 'antd/lib/table';

import { EmissionSourceResp } from '@/sdks_v2/new/computationV2ApiDocs';

export type EmissionListType = EmissionSourceResp & {
  categoryNameRowSpan?: number;
  classifyNameRowSpan?: number;
};

export const columns = (): ColumnsType<EmissionListType> => {
  return [
    {
      title: I18N.carbonData.emissionClassification,
      dataIndex: 'categoryName',
      onCell: record => {
        return { rowSpan: record.categoryNameRowSpan };
      },
    },
    {
      title: I18N.carbonData.emissionCategories,
      dataIndex: 'classifyName',
      onCell: record => {
        return { rowSpan: record.classifyNameRowSpan };
      },
    },
    {
      title: I18N.carbonData.emissionSources,
      dataIndex: 'sourceName',
    },
    {
      title: I18N.carbonData.emissionsTC,
      dataIndex: 'emission',
    },
    {
      title: I18N.carbonData.emissionProportion2,
      dataIndex: 'emissionProportion',
    },
  ];
};
