/**
 * @description: 版本管理
 */

import { useState } from 'react';
import { useNavigate } from 'react-router-dom';

import { FormActions } from '@/components/FormActions';
import { Page } from '@/components/Page';
import { CustomTableRender } from '@/components/x-render/TableRender';
import { useTableRef as useTable } from '@/components/x-render/TableRender/hook/useTableRef';
import { useDrawer } from '@/hooks/useDrawer';
import { RouteMaps } from '@/router/utils/enums';

import VersionInfoDrawer from './Info';
import { columns } from './columns';
import style from './index.module.less';
import { searchSchema } from './schemas';
import { getVersionListApi } from './service';
import { VersionResp, VersionReq } from './type';

const VersionManage = () => {
  const navigate = useNavigate();
  const { tableRef } = useTable();

  /** 版本信息抽屉状态 */
  const { visible, showDrawer, onClose } = useDrawer();

  /** 当前查看的版本信息 */
  const [versionInfo, setVersionInfo] = useState<VersionResp>({});

  const searchApi = (args: VersionReq) => {
    return getVersionListApi(args).then(({ data }) => {
      return data?.data || {};
    });
  };

  /** 查看操作 */
  const onView = (row: VersionResp) => {
    setVersionInfo(row || {});
    showDrawer();
  };

  return (
    <Page title='版本管理' wrapperClass={style.wrapper}>
      <CustomTableRender<VersionResp, VersionReq>
        tableRef={tableRef}
        searchProps={{
          schema: searchSchema(),
          api: searchApi,
          searchOnMount: false,
        }}
        tableProps={{
          columns: columns({
            onView,
          }),
        }}
        autoSaveSearchInfo
        autoAddIndexColumn
        autoFixNoText
      />

      <VersionInfoDrawer
        title='版本详情'
        open={visible}
        onClose={onClose}
        versionInfo={versionInfo}
      />

      <FormActions
        place='center'
        buttons={[
          {
            title: '返回',
            type: 'default',
            onClick: async () => {
              navigate(RouteMaps.orgsManage);
            },
          },
        ]}
      />
    </Page>
  );
};

export default VersionManage;
