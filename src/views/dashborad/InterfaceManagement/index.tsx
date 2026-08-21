/**
 * @description 接口管理页面
 */

import I18N from '@src/lang/I18N';
import { useNavigate } from 'react-router-dom';

import { Page } from '@/components/Page';
import { CustomTableRender } from '@/components/x-render/TableRender';
import { useTableRef as useTable } from '@/components/x-render/TableRender/hook/useTableRef';
import { useAsyncEnums } from '@/hooks';
import { checkAuth } from '@/layout/utills';
import {
  PAGE_TYPE_VAR,
  PageTypeInfo,
  RouteMaps,
  virtualLinkTransform,
} from '@/router/utils/enums';
import { modal } from '@/store/module/notification';
import { getSearchParams } from '@/utils';

import { columns } from './columns';
import { interfaceManagementSearchSchema } from './searchSchemas';
import {
  exportInterfaceApi,
  getInterfaceDataApi,
  getInterfaceListApi,
} from './service';
import { IPage } from './type';

const InterfaceManagement = () => {
  const { tableRef } = useTable();
  const navigate = useNavigate();

  /** 接口类型枚举 */
  const interfaceTypeList = useAsyncEnums('InterfaceType');

  // /** 数据状态 */
  // const dataTransStatusList = useAsyncEnums('DataTransStatus');

  const searchApi = (arg: IPage) => {
    return getInterfaceListApi({ ...arg }).then(({ data }) => {
      return data?.data;
    });
  };
  const handleActionsType = async (type: string, id: number) => {
    switch (type) {
      case 'show':
        navigate(RouteMaps.InterfaceManagementInfo);
        navigate(
          virtualLinkTransform(
            RouteMaps.InterfaceManagementInfo,
            [PAGE_TYPE_VAR, ':id'],
            [PageTypeInfo.show, id],
          ),
        );
        break;
      case 'reload':
        await getInterfaceDataApi({
          id,
        });
        tableRef?.current?.refresh();
        break;
      default:
        break;
    }
  };
  return (
    <Page
      title={I18N.dashborad.interfaces}
      onBtnClick={async () => {
        const searchParam = getSearchParams()[0];
        await exportInterfaceApi({ ...searchParam });
        modal.confirm({
          title: I18N.dashborad.interfaceExport,
          content: I18N.dashborad.exportAnyInterface,
          okText: I18N.base.confirm,
          cancelText: I18N.Factors.cancel,
          onOk: async () => {
            navigate(RouteMaps.systemDownload);
          },
        });
      }}
      actionBtnChild={checkAuth(
        '/interfaceManagement/export',
        <div>{I18N.eca.export}</div>,
      )}
    >
      <CustomTableRender
        tableRef={tableRef}
        searchProps={{
          schema: interfaceManagementSearchSchema(interfaceTypeList),
          api: searchApi,
        }}
        tableProps={{
          columns: columns({ onActionsType: handleActionsType }),
          scroll: { x: 1500 },
        }}
        autoSaveSearchInfo
        autoAddIndexColumn
        autoFixNoText
      />
    </Page>
  );
};

export default InterfaceManagement;
