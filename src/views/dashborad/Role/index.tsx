/*
 * @@description:角色列表
 */
import { PlusOutlined } from '@ant-design/icons';
import I18N from '@src/lang/I18N';
import { useRef, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { SearchProps } from 'table-render/dist/src/types';

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
  getSystemRolePage,
  getSystemRolePageProps,
} from '@/sdks/systemV2ApiDocs';
import { getSearchParams, updateUrl } from '@/utils';

import RoleUsersModal from './components/RoleUsersModal';
import { useRoles } from './hooks';
import { searchSchema } from './schemas';
import { columns } from './utils/columns';

const Users = () => {
  /** 角色列表 */
  const roleList = useRoles();

  const [searchParams, setSearchParams] = useState<getSystemRolePageProps>(
    getSearchParams<getSystemRolePageProps>()[0],
  );
  const { refresh, tableRef } = useTable();
  const form = tableRef?.current?.form;
  const navigate = useNavigate();

  // 用户列表弹窗状态
  const [usersModalVisible, setUsersModalVisible] = useState(false);
  const [selectedRole, setSelectedRole] = useState<{
    id: number;
    name: string;
  } | null>(null);

  // 用于修正第一次页码无法正常设置问题
  const isFirstLoad = useRef(true);
  // @ts-ignore
  const searchApi: SearchProps<getSystemRolePageProps>['api'] = ({
    current,
    ...args
  }: {
    current: number;
  }) => {
    const pageNum =
      (isFirstLoad.current ? searchParams.pageNum : current) || current;
    let newSearch = {
      ...args,
      ...searchParams,
      pageNum,
    } as getSystemRolePageProps;
    if (!isFirstLoad.current) {
      newSearch = {
        ...args,
        pageNum,
      } as getSystemRolePageProps;
      updateUrl(args);
    } else {
      form?.setValues(newSearch);
    }
    setSearchParams({
      ...newSearch,
    });
    isFirstLoad.current = false;
    return getSystemRolePage({
      ...newSearch,
    }).then(({ data }) => {
      return {
        rows: data?.data?.list,
        total: data?.data?.total,
      };
    });
  };
  return (
    <Page
      title={I18N.dashborad.roleManagement}
      onBtnClick={async () =>
        navigate(
          virtualLinkTransform(
            RouteMaps.roleInfo,
            [PAGE_TYPE_VAR, ':roleId'],
            [PageTypeInfo.add, 0],
          ),
        )
      }
      actionBtnChild={checkAuth(
        '/sys/role/add',
        <div>
          <PlusOutlined /> {I18N.Factors.newAddition}
        </div>,
      )}
    >
      <CustomTableRender
        tableRef={tableRef}
        searchProps={{
          schema: searchSchema({ roleList }),
          api: searchApi,
          searchOnMount: false,
        }}
        tableProps={{
          columns: columns({
            refresh,
            navigate,
            onUserNumClick: record => {
              setSelectedRole({
                id: record.id as number,
                name: record.roleName || '',
              });
              setUsersModalVisible(true);
            },
          }),
        }}
        autoFixNoText
        autoAddIndexColumn
        autoSaveSearchInfo
      />

      {/* 角色关联用户列表弹窗 */}
      <RoleUsersModal
        visible={usersModalVisible}
        roleId={selectedRole?.id}
        roleName={selectedRole?.name}
        onClose={() => {
          setUsersModalVisible(false);
          setSelectedRole(null);
        }}
      />
    </Page>
  );
};

export default Users;
