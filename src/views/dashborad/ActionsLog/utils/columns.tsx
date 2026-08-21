import I18N from '@src/lang/I18N';
import { TableRenderProps } from 'table-render/dist/src/types';

export const columns = (): TableRenderProps<any>['columns'] => [
  {
    title: I18N.dashborad.operatingUsers,
    dataIndex: 'username',
    width: 120,
  },
  {
    title: I18N.dashborad.operationModule,
    dataIndex: 'moduleType_name',
    width: 120,
  },
  {
    title: I18N.dashborad.operationTime,
    dataIndex: 'createTime',
    width: 120,
  },
  {
    title: I18N.dashborad.operationLog,
    dataIndex: 'content',
    width: 200,
  },
];
