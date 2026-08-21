/**
 * @description 参数管理
 */
import { PlusOutlined } from '@ant-design/icons';
import I18N from '@src/lang/I18N';
import { useState } from 'react';

import { Page } from '@/components/Page';
import { CustomTableRender } from '@/components/x-render/TableRender';
import { useTableRef } from '@/components/x-render/TableRender/hook/useTableRef';
import { useActionType } from '@/hooks/useActionType';
import { useDrawer } from '@/hooks/useDrawer';
import usePageType from '@/hooks/usePageType';
import { checkAuth } from '@/layout/utills';
import { PageTypeInfo } from '@/router/utils/enums';

import { FieldPropertiesInfo } from './Info';
import { columns } from './columns';
import { searchSchema } from './searchSchema';
import { getParameterListAPi } from './service';
import { Param, ParameterRequest } from './type';

const Parameter = () => {
  const { refresh, tableRef } = useTableRef();

  const { pageType, setModelAction: setActionBtnType } = usePageType(
    PageTypeInfo.add,
  );

  const { visible, showDrawer, onClose } = useDrawer();
  const { onView, onEdit } = useActionType(showDrawer);

  /** 参数id */
  const [dataFiledId, setDataFiledId] = useState<number>();

  /** 查看操作 */
  const handleViewClick = (row: Param) => {
    setActionBtnType(PageTypeInfo.show);
    setDataFiledId(row?.id);
    onView();
  };
  /** 编辑操作 */
  const handleEditClick = (row: Param) => {
    setActionBtnType(PageTypeInfo.edit);
    setDataFiledId(row?.id);
    onEdit();
  };
  /** 复制操作 */
  const handleCopyClick = (row: Param) => {
    setActionBtnType(PageTypeInfo.copy);
    setDataFiledId(row?.id);
    onEdit();
  };
  /** 列表数据 */
  const searchApi = (arg: ParameterRequest) => {
    return getParameterListAPi({ ...arg }).then(({ data }) => {
      return data?.data;
    });
  };

  /** 关闭操作 */
  const onInit = () => {
    setDataFiledId(undefined);
    setActionBtnType(PageTypeInfo.add);
    onClose();
  };

  return (
    <div>
      <Page
        title={I18N.eca.parameterManagement}
        actionBtnChildArr={[
          {
            button: checkAuth(
              '',
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
          searchProps={{
            schema: searchSchema(),
            api: searchApi,
            searchOnMount: false,
          }}
          tableProps={{
            columns: columns({
              refresh,
              onView: handleViewClick,
              onEdit: handleEditClick,
              onCopy: handleCopyClick,
            }),
            scroll: { x: 1600 },
          }}
          autoSaveSearchInfo
          autoAddIndexColumn
          autoFixNoText
          tableRef={tableRef}
        />
      </Page>
      <FieldPropertiesInfo
        actionBtnType={pageType}
        dataFiledId={dataFiledId}
        open={visible}
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
    </div>
  );
};
export default Parameter;
