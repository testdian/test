/**
 * @description 问题整改跟踪 - 列定义
 */
import { compact } from 'lodash-es';
import { NavigateFunction } from 'react-router-dom';
import { TableContext, TableRenderProps } from 'table-render/dist/src/types';

import { TableActions } from '@/components/Table/TableActions';
import { checkAuth } from '@/layout/utills';
import { CarbonVerifyRouteMaps } from '@/router/utils/carbonVerifyEnum';
import { PageTypeInfo, virtualLinkTransform } from '@/router/utils/enums';

import { VerificationProblemItem } from './type';

export const columns = ({
  navigate,
}: {
  refresh: TableContext['refresh'];
  navigate: NavigateFunction;
}): TableRenderProps<VerificationProblemItem>['columns'] => [
  {
    title: '核算年度',
    dataIndex: 'year',
  },
  {
    title: '更新人',
    dataIndex: 'updateByName',
  },
  {
    title: '更新时间',
    dataIndex: 'updateTime',
    width: 200,
  },
  {
    title: '操作',
    dataIndex: 'id',
    width: 160,
    render: id => (
      <TableActions
        menus={compact([
          checkAuth('', {
            label: '编辑',
            key: '编辑',
            onClick: async () => {
              navigate(
                virtualLinkTransform(
                  CarbonVerifyRouteMaps.verificationProblemInfo,
                  [':pageTypeInfo', ':id'],
                  [PageTypeInfo.edit, id],
                ),
              );
            },
          }),
          checkAuth('', {
            label: '查看',
            key: '查看',
            onClick: async () => {
              navigate(
                virtualLinkTransform(
                  CarbonVerifyRouteMaps.verificationProblemInfo,
                  [':pageTypeInfo', ':id'],
                  [PageTypeInfo.show, id],
                ),
              );
            },
          }),
        ])}
      />
    ),
  },
];
