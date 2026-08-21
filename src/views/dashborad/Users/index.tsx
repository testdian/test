/**
 * @description 用户列表-内部用户
 */
import I18N from '@src/lang/I18N';
import { TreeSelect } from 'antd';
import { useState } from 'react';
import { useNavigate } from 'react-router-dom';

import { Page } from '@/components/Page';
import { CustomTableRender } from '@/components/x-render/TableRender';
import { useTableRef as useTable } from '@/components/x-render/TableRender/hook/useTableRef';
import { checkAuth } from '@/layout/utills';
import {
  PAGE_TYPE_VAR,
  PageTypeInfo,
  RouteMaps,
  virtualLinkTransform,
} from '@/router/utils/enums';
import {
  getSystemUserPageProps as SearchApiProps,
  UserResp,
} from '@/sdks/systemV2ApiDocs';
import { modal } from '@/store/module/notification';
import { getSearchParams, Toast } from '@/utils';

import { userColumns } from './columns';
import { USER_STATUS, USER_TYPE } from './constant';
import { userSearchSchema } from './schemas';
import {
  postUpdateStatusBatchApi,
  exportUserApi,
  getUserListApi,
} from './service';
import { UserReq } from './type';

const { INTERNAL } = USER_TYPE;

const Users = () => {
  const { refresh, tableRef } = useTable();

  const navigate = useNavigate();

  /** 用户状态 */
  // const userStatusEnums = useAsyncEnums('UserStatus');

  /** 选中的数据Key */
  const [selectedRowKeys, setSelectedRowKeys] = useState<React.Key[]>([]);

  const searchApi = (args: UserReq) => {
    return getUserListApi({ ...args, userType: INTERNAL }).then(({ data }) => {
      return data?.data || {};
    });
  };

  /** 查看操作 */
  const handleViewClick = (row: UserResp) => {
    navigate(
      virtualLinkTransform(
        RouteMaps.internalUsersInfo,
        [PAGE_TYPE_VAR, ':id'],
        [PageTypeInfo.show, row.id],
      ),
    );
  };

  /** 编辑操作 */
  const handleEditClick = (row: UserResp) => {
    navigate(
      virtualLinkTransform(
        RouteMaps.internalUsersInfo,
        [PAGE_TYPE_VAR, ':id'],
        [PageTypeInfo.edit, row.id],
      ),
    );
  };

  /** 新增操作 */
  const handleAddClick = () => {
    navigate(
      virtualLinkTransform(
        RouteMaps.internalUsersInfo,
        [PAGE_TYPE_VAR, ':id'],
        [PageTypeInfo.add, 0],
      ),
    );
  };
  /** 选中表格回调 */
  const onSelectChange = (newSelectedRowKeys: React.Key[]) => {
    setSelectedRowKeys(newSelectedRowKeys);
  };

  const rowSelection: {
    selectedRowKeys: React.Key[];
    onChange: (newSelectedRowKeys: React.Key[]) => void;
  } = {
    selectedRowKeys: Object.values(selectedRowKeys).flat() as React.Key[],
    onChange: onSelectChange,
  };

  return (
    <Page
      title='内部用户管理'
      actionBtnChildArr={[
        {
          button: checkAuth('', <div>{I18N.eca.export}</div>),
          click: async () => {
            const searchParam = getSearchParams()[0];
            await exportUserApi({ ...searchParam, userType: INTERNAL });
            modal.confirm({
              title: I18N.dashborad.userExport,
              content: I18N.dashborad.userExportsAny,
              okText: I18N.base.confirm,
              cancelText: I18N.Factors.cancel,
              onOk: async () => {
                navigate(RouteMaps.systemDownload);
              },
            });
          },
        },
        {
          button: <div>{I18N.eca.batchActivation}</div>,
          click: async () => {
            if (selectedRowKeys.length === 0) {
              Toast('warning', I18N.eca.pleaseSelectData2);

              return;
            }
            modal.confirm({
              title: I18N.Factors.prompt,
              content: '确认启用所选用户？',
              onOk: async () => {
                await postUpdateStatusBatchApi({
                  idList: Object.values(selectedRowKeys).flat() as React.Key[],
                  userStatus: USER_STATUS.ENABLE,
                });
                refresh?.();
                setSelectedRowKeys([]);
                Toast('success', '操作成功');
              },
              okText: I18N.base.confirm,
              cancelText: I18N.Factors.cancel,
            });
          },
        },
        {
          button: <div>{I18N.eca.batchDisabling}</div>,
          click: async () => {
            if (selectedRowKeys.length === 0) {
              Toast('warning', I18N.eca.pleaseSelectData2);

              return;
            }
            modal.confirm({
              title: I18N.Factors.prompt,
              content: '确认禁用所选用户？',
              onOk: async () => {
                await postUpdateStatusBatchApi({
                  idList: Object.values(selectedRowKeys).flat() as React.Key[],
                  userStatus: USER_STATUS.DISABLE,
                });
                refresh?.();
                setSelectedRowKeys([]);
                Toast('success', '操作成功');
              },
              okText: I18N.base.confirm,
              cancelText: I18N.Factors.cancel,
            });
          },
        },
        {
          button: checkAuth('', <div>新增</div>),
          buttonType: 'primary',
          click: async () => {
            handleAddClick();
          },
        },
      ]}
    >
      <CustomTableRender<UserResp, SearchApiProps>
        tableRef={tableRef}
        searchProps={{
          schema: userSearchSchema(),
          api: searchApi,
          searchOnMount: false,
          widgets: {
            TreeSelect,
          },
        }}
        tableProps={{
          columns: userColumns({
            refresh,
            onView: handleViewClick,
            onEdit: handleEditClick,
          }),
          rowSelection,
        }}
        autoSaveSearchInfo
        autoAddIndexColumn
        autoFixNoText
      />
    </Page>
  );
};

export default Users;
