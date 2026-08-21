import I18N from '@src/lang/I18N';
import { ColumnsType } from 'antd/lib/table';

type RecordType = {
  orgName: string;
  emission: number;
  proportion: string | number;
};

export const columns: ColumnsType<RecordType> = [
  {
    title: I18N.carbonData.organizationName,
    dataIndex: 'orgName',
  },
  {
    title: I18N.eca.accountingName,
    dataIndex: 'computationName',
  },
  {
    title: I18N.carbonData.emissionsTC,
    dataIndex: 'emission',
  },
  {
    title: I18N.carbonData.emissionProportion2,
    dataIndex: 'proportion',
  },
];
