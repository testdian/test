/**
 * @description 审批设置列表页面
 */

import I18N from '@src/lang/I18N';
import { useState } from 'react';
import { useNavigate } from 'react-router-dom';

import { Page } from '@/components/Page';
import { CustomTableRender } from '@/components/x-render/TableRender';
import { useTableRef } from '@/components/x-render/TableRender/hook/useTableRef';
import type { CustomSearchProps } from '@/components/x-render/TableRender/types';
import { useActionType } from '@/hooks/useActionType';
import { useDrawer } from '@/hooks/useDrawer';
import usePageType from '@/hooks/usePageType';
import {
  PageTypeInfo,
  PAGE_TYPE_VAR,
  RouteMaps,
  virtualLinkTransform,
} from '@/router/utils/enums';

import ApprovalInfoDrawer from './ApprovalInfoDrawer';
import { columns } from './columns';
import { getAuditSetList } from './service';
import { AuditResp, Request } from './type';

const Approval = () => {
  const navigate = useNavigate();

  const { refresh, tableRef } = useTableRef();

  const { pageType, setModelAction: setActionBtnType } = usePageType(
    PageTypeInfo.add,
  );

  const { visible, showDrawer, onClose } = useDrawer();

  const { onView, onEdit } = useActionType(showDrawer);

  const [auditType, setAuditType] = useState<number>();

  const searchApi: CustomSearchProps<AuditResp, Request> = args =>
    getAuditSetList(args).then(({ data }) => {
      return data?.data || {};
    });

  /** 查看操作 */
  const handleViewClick = (row: AuditResp) => {
    setActionBtnType(PageTypeInfo.show);
    setAuditType(row?.auditType);
    onView();
  };
  /** 编辑操作 */
  const handleEditClick = (row: AuditResp) => {
    setActionBtnType(PageTypeInfo.edit);
    setAuditType(row?.auditType);
    onEdit();
  };

  /** 关闭操作 */
  const onInit = () => {
    setAuditType(undefined);
    setActionBtnType(PageTypeInfo.add);
    onClose();
  };

  return (
    <Page
      title={I18N.dashborad.approvalSettings}
      onBtnClick={async () => {
        navigate(
          virtualLinkTransform(
            RouteMaps.systemApprovalInfo,
            [PAGE_TYPE_VAR, ':orgId', ':auditType'],
            [PageTypeInfo.add, 'null', 'null'],
          ),
        );
      }}
    >
      <CustomTableRender<AuditResp, Request>
        tableRef={tableRef}
        searchProps={{
          schema: {},
          hidden: true,
          api: searchApi,
          searchOnMount: false,
        }}
        tableProps={{
          columns: columns({
            onView: handleViewClick,
            onEdit: handleEditClick,
          }),
          pagination: false,
        }}
        autoSaveSearchInfo
        autoAddIndexColumn
        autoFixNoText
      />
      <ApprovalInfoDrawer
        auditType={Number(auditType)}
        actionType={pageType}
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

export default Approval;
