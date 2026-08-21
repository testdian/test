import I18N from '@src/lang/I18N';
import { compact } from 'lodash-es';
import { TableRenderProps } from 'table-render/dist/src/types';

import { TableActions } from '@/components/Table/TableActions';
import { checkAuth } from '@/layout/utills';

import { VersionResp } from './type';

export const columns = ({
  onView,
}: {
  onView: (row: VersionResp) => void;
}): TableRenderProps<VersionResp>['columns'] => [
  {
    title: '版本号',
    dataIndex: 'version',
  },
  {
    title: '版本状态',
    dataIndex: 'versionStatus',
  },
  {
    title: '更新人',
    dataIndex: 'updateByName',
  },
  {
    title: '更新时间',
    dataIndex: 'updateTime',
  },
  {
    title: '变更说明',
    dataIndex: 'changeLog',
  },
  {
    title: I18N.Factors.operation,
    width: 100,
    dataIndex: 'id',
    render(_, row: VersionResp) {
      return (
        <TableActions
          menus={compact([
            checkAuth('/sys/user/detail', {
              label: I18N.Factors.check,
              key: I18N.Factors.check,
              onClick: () => {
                onView(row);
              },
            }),
          ])}
        />
      );
    },
  },
];
