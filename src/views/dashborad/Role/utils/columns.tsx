/*
 * @@description:
 * @Author: qifeng qifeng@carbonstop.net
 * @Date: 2023-01-09 19:44:27
 * @LastEditors: lichunxiao 1359758885@aa.com
 * @LastEditTime: 2023-04-28 16:12:09
 */

import I18N from '@src/lang/I18N';
import { compact } from 'lodash-es';
import { NavigateFunction } from 'react-router-dom';
import {
  SearchProps,
  TableContext,
  TableRenderProps,
} from 'table-render/dist/src/types';

import { TableActions } from '@/components/Table/TableActions';
import { xRenderSeachSchema } from '@/components/x-render/TableRender/utils/xRender';
import { checkAuth } from '@/layout/utills';
import {
  PAGE_TYPE_VAR,
  PageTypeInfo,
  RouteMaps,
  virtualLinkTransform,
} from '@/router/utils/enums';
import { Role, postSystemRoleDelete } from '@/sdks/systemV2ApiDocs';
import { modal } from '@/store/module/notification';
import { Toast, returnDelModalStyle, returnNoIconModalStyle } from '@/utils';

export const columns = ({
  refresh,
  navigate,
  onUserNumClick,
}: {
  navigate: NavigateFunction;
  refresh: TableContext['refresh'];
  onUserNumClick?: (record: Role) => void;
}): TableRenderProps<Role>['columns'] => [
  {
    title: I18N.dashborad.roleName,
    dataIndex: 'roleName',
  },
  {
    title: I18N.dashborad.characterDescription,
    dataIndex: 'roleInfo',
  },
  {
    title: I18N.dashborad.numberOfAccounts,
    dataIndex: 'userNum',
    render: (userNum, record) => {
      if (!userNum || userNum === 0) {
        return userNum || 0;
      }
      return (
        <span
          style={{ color: '#1890ff', cursor: 'pointer' }}
          onClick={() => {
            onUserNumClick?.(record);
          }}
        >
          {userNum}
        </span>
      );
    },
  },
  {
    title: I18N.Factors.operation,
    width: 240,
    dataIndex: 'id',
    render(id, record) {
      return (
        <TableActions
          menus={compact([
            Number(record?.roleType) !== 0 &&
              checkAuth('/sys/role/edit', {
                label: I18N.Factors.edit,
                key: I18N.Factors.edit,
                onClick: async () => {
                  navigate(
                    virtualLinkTransform(
                      RouteMaps.roleInfo,
                      [PAGE_TYPE_VAR, ':roleId'],
                      [PageTypeInfo.edit, id],
                    ),
                  );
                },
              }),

            Number(record?.roleType) !== 0 &&
              checkAuth('/sys/role/del', {
                label: I18N.Factors.delete,
                key: I18N.Factors.delete,
                onClick: async () => {
                  if (record.linkUser) {
                    Toast('error', I18N.dashborad.pleaseCancelTheUseFirst);
                  } else {
                    modal.confirm({
                      title: I18N.Factors.prompt,
                      content: I18N.dashborad.areYouSureYouWantToDeleteIt,
                      ...returnNoIconModalStyle,
                      ...returnDelModalStyle,
                      onOk: () => {
                        return postSystemRoleDelete({
                          req: { id },
                        }).then(({ data }) => {
                          if (data.code === 200) {
                            Toast('success', I18N.Factors.deleteSuccessful);
                            refresh?.();
                          }
                        });
                      },
                      okText: I18N.base.confirm,
                      cancelText: I18N.Factors.cancel,
                    });
                  }
                },
              }),
            checkAuth('/sys/role/detail', {
              label: I18N.Factors.check,
              key: I18N.Factors.check,
              onClick: async () => {
                navigate(
                  virtualLinkTransform(
                    RouteMaps.roleInfo,
                    [PAGE_TYPE_VAR, ':roleId'],
                    [PageTypeInfo.show, id],
                  ),
                );
              },
            }),
          ])}
        />
      );
    },
  },
];
export const searchSchema = (): SearchProps<any>['schema'] => ({
  type: 'object',
  properties: {
    likeRoleName: xRenderSeachSchema({
      type: 'string',
      placeholder: I18N.dashborad.roleName,
    }),
  },
});
