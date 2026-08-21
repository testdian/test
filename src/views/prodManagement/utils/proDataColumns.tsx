/*
 * @@description: 运营数据Colums
 */

import I18N from '@src/lang/I18N';
import { compact } from 'lodash-es';
import { NavigateFunction } from 'react-router-dom';
import { TableContext, TableRenderProps } from 'table-render/dist/src/types';

import { TableActions } from '@/components/Table/TableActions';
import { checkAuth } from '@/layout/utills';
import {
  PAGE_TYPE_VAR,
  PageTypeInfo,
  virtualLinkTransform,
} from '@/router/utils/enums';
import { ProRouteMaps } from '@/router/utils/prodEmums';
import {
  OperationMetrics,
  postComputationOperationDataDelete,
} from '@/sdks_v2/new/computationV2ApiDocs';
import { modal } from '@/store/module/notification';
import { Toast, returnDelModalStyle, returnNoIconModalStyle } from '@/utils';

export const prodColumns = ({
  refresh,
  navigate,
}: {
  navigate: NavigateFunction;
  refresh: TableContext['refresh'];
}): TableRenderProps<OperationMetrics>['columns'] => [
  {
    title: I18N.prodManagement.year,
    dataIndex: 'year',
  },
  {
    title: I18N.carbonData.affiliatedOrganization,
    dataIndex: 'orgName',
  },

  {
    title: I18N.Factors.updatedBy,
    dataIndex: 'updateByName',
  },
  {
    title: I18N.Factors.updateTime,
    dataIndex: 'updateTime',
    width: 200,
  },
  {
    title: I18N.prodManagement.operation,
    width: 240,
    dataIndex: 'id',
    render(id, record: OperationMetrics & { orgName?: string; year?: string }) {
      return (
        <TableActions
          menus={compact([
            checkAuth('prodManagementOperationalData/edit', {
              label: I18N.Factors.edit,
              key: I18N.Factors.edit,
              onClick: async () => {
                navigate(
                  virtualLinkTransform(
                    ProRouteMaps.prodManagementOperationalData,
                    [PAGE_TYPE_VAR, ':id'],
                    [PageTypeInfo.edit, id],
                  ),
                );
              },
            }),
            checkAuth('prodManagementOperationalData/show', {
              label: I18N.Factors.check,
              key: I18N.Factors.check,
              onClick: async () => {
                navigate(
                  virtualLinkTransform(
                    ProRouteMaps.prodManagementOperationalData,
                    [PAGE_TYPE_VAR, ':id'],
                    [PageTypeInfo.show, id],
                  ),
                );
              },
            }),

            checkAuth('prodManagementOperationalData/del', {
              label: I18N.Factors.delete,
              key: I18N.Factors.delete,
              onClick: async () => {
                modal.confirm({
                  title: I18N.Factors.prompt,
                  ...returnNoIconModalStyle,
                  ...returnDelModalStyle,
                  content: (
                    <span>
                      {I18N.prodManagement.confirmDeletion}
                      <span>{record?.orgName}</span> : {record?.year}
                      {I18N.prodManagement.operationalData2}
                    </span>
                  ),
                  onOk: async () => {
                    const { data } = await postComputationOperationDataDelete({
                      req: { id },
                    });
                    if (data.code === 200) {
                      Toast('success', I18N.Factors.deleteSuccessful);
                      refresh?.();
                    }
                  },
                  okText: I18N.base.confirm,
                  cancelText: I18N.Factors.cancel,
                });
              },
            }),
          ])}
        />
      );
    },
  },
];
