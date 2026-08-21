/**
 * @description 用户列表-外部用户
 */
import { PlusOutlined } from '@ant-design/icons';
import I18N from '@src/lang/I18N';
import { compact } from 'lodash-es';
import { useState } from 'react';
import { useNavigate } from 'react-router-dom';

import { Page } from '@/components/Page';
import { SearchInputWithNote } from '@/components/ModifyNote/SearchInputWithNote';
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

import { externalUserColumns } from './columns';
import { USER_STATUS, USER_TYPE } from './constant';
import { externalUserSearchSchema } from './schemas';
import {
  exportUserApi,
  getUserListApi,
  postUpdateStatusBatchApi,
} from './service';
import { UserReq } from './type';

const { EXTERNAL } = USER_TYPE;

const ExternalUsers = () => {
  const { refresh, tableRef } = useTable();

  const navigate = useNavigate();

  /** 选中的数据Key */
  const [selectedRowKeys, setSelectedRowKeys] = useState<React.Key[]>([]);

  const searchApi = (args: UserReq) => {
    return getUserListApi({ ...args, userType: EXTERNAL }).then(({ data }) => {
      return data?.data || {};
    });
  };

  /** 查看操作 */
  const handleViewClick = (row: UserResp) => {
    navigate(
      virtualLinkTransform(
        RouteMaps.externalUsersInfo,
        [PAGE_TYPE_VAR, ':id'],
        [PageTypeInfo.show, row.id],
      ),
    );
  };

  /** 编辑操作 */
  const handleEditClick = (row: UserResp) => {
    navigate(
      virtualLinkTransform(
        RouteMaps.externalUsersInfo,
        [PAGE_TYPE_VAR, ':id'],
        [PageTypeInfo.edit, row.id],
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
      title='外部用户管理'
      actionBtnChildArr={compact([
        {
          button: checkAuth(
            '/sys/user/add',
            <div>
              <PlusOutlined /> {I18N.Factors.newAddition}
            </div>,
          ),
          click: () => {
            navigate(
              virtualLinkTransform(
                RouteMaps.externalUsersInfo,
                [PAGE_TYPE_VAR, ':id'],
                [PageTypeInfo.add, 'null'],
              ),
            );
          },
        },
        {
          button: checkAuth('', <div>{I18N.eca.export}</div>),
          click: async () => {
            const searchParam = getSearchParams()[0];
            await exportUserApi({ ...searchParam, userType: EXTERNAL });
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
      ])}
    >
      <CustomTableRender<UserResp, SearchApiProps>
        tableRef={tableRef}
        searchProps={{
          schema: externalUserSearchSchema(),
          api: searchApi,
          searchOnMount: false,
          widgets: {
            SearchInputWithNote,
          },
        }}
        tableProps={{
          columns: externalUserColumns({
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

export default ExternalUsers;
