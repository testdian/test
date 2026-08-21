/**
 * @description 页面配置页面
 */
import { PlusOutlined } from '@ant-design/icons';
import I18N from '@src/lang/I18N';
import { useState } from 'react';

import { Page } from '@/components/Page';
import { CustomTableRender } from '@/components/x-render/TableRender';
import { useTableRef as useTable } from '@/components/x-render/TableRender/hook/useTableRef';
import { CustomSearchProps } from '@/components/x-render/TableRender/types';
import { useActionType } from '@/hooks/useActionType';
import { useDrawer } from '@/hooks/useDrawer';
import usePageType from '@/hooks/usePageType';
import { checkAuth } from '@/layout/utills';
import { PageTypeInfo } from '@/router/utils/enums';

import { columns } from './columns';
import PageConfigurationDrawer from './components/PageConfigurationDrawer';
import { getPageConfigurationListApi } from './service';
import { PageConfigurationListType, PageConfigurationParams } from './type';

const PageConfiguration = () => {
  const { refresh, tableRef } = useTable();

  const { pageType, setModelAction: setActionBtnType } = usePageType(
    PageTypeInfo.add,
  );

  const { visible, showDrawer, onClose } = useDrawer();
  const { onView, onEdit } = useActionType(showDrawer);

  /** 参数id */
  const [dataFiledId, setDataFiledId] = useState<number>();

  const searchApi: CustomSearchProps<
    PageConfigurationListType,
    PageConfigurationParams
  > = args =>
    getPageConfigurationListApi(args).then(({ data }) => {
      return data?.data || [];
    });

  /** 查看操作 */
  const handleViewClick = (row: PageConfigurationListType) => {
    setActionBtnType(PageTypeInfo.show);
    setDataFiledId(row?.id);
    onView();
  };
  /** 编辑操作 */
  const handleEditClick = (row: PageConfigurationListType) => {
    setActionBtnType(PageTypeInfo.edit);
    setDataFiledId(row?.id);
    onEdit();
  };

  /** 关闭操作 */
  const onInit = () => {
    setDataFiledId(undefined);
    setActionBtnType(PageTypeInfo.add);
    onClose();
  };

  return (
    <Page
      title={I18N.dashborad.pageConfiguration}
      actionBtnChildArr={[
        {
          button: checkAuth(
            '/pageConfiguration/add',
            <div>
              <PlusOutlined /> {I18N.Factors.newAddition}
            </div>,
          ),
          click: () => {
            setActionBtnType(PageTypeInfo.add);
            showDrawer();
          },
        },
      ]}
    >
      <CustomTableRender
        tableRef={tableRef}
        searchProps={{
          schema: { type: 'void', properties: {} },
          hidden: true,
          api: searchApi,
        }}
        tableProps={{
          columns: columns({
            refresh,
            onView: handleViewClick,
            onEdit: handleEditClick,
          }),
        }}
        autoSaveSearchInfo
        autoAddIndexColumn
        autoFixNoText
      />
      {/* 页面配置抽屉 */}
      <PageConfigurationDrawer
        dataFiledId={dataFiledId as number}
        pageConfigurationActionType={pageType}
        visible={visible}
        onOk={() => {
          onInit();
          if (pageType === PageTypeInfo.add) {
            refresh?.();
          } else {
            refresh?.({ stay: true, tab: 1 });
          }
        }}
        onClose={() => {
          onInit();
        }}
      />
    </Page>
  );
};

export default PageConfiguration;
