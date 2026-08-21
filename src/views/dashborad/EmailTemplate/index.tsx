/**
 * @description 邮件管理页面
 */
import { PlusOutlined } from '@ant-design/icons';
import I18N from '@src/lang/I18N';
import { useState } from 'react';

import { Page } from '@/components/Page';
import { CustomTableRender } from '@/components/x-render/TableRender';
import { useTableRef as useTable } from '@/components/x-render/TableRender/hook/useTableRef';
import { useDrawer } from '@/hooks/useDrawer';
import usePageType from '@/hooks/usePageType';
import { checkAuth } from '@/layout/utills';
import { PageTypeInfo } from '@/router/utils/enums';
import { modal } from '@/store/module/notification';
import { CommonColumnsActionType } from '@/views/eca/util/actionType';

import { emailColumns } from './columns';
import EmailManageDrawer from './components/EmailManageDrawer';
import {
  copyEmailTemplateApi,
  deleteEmailTemplateApi,
  getEmailTemplateListApi,
} from './service';
import { IPage } from './type';

const { add, edit, show } = PageTypeInfo;

const { COPY, EDIT, DELETE, SHOW } = CommonColumnsActionType;
const EmailTemplate = () => {
  const { refresh, tableRef } = useTable();
  /** 设置页面抽屉状态 */
  const { pageType, setModelAction } = usePageType(add);

  const { visible, showDrawer, onClose } = useDrawer();
  /** 设置数据 id 值 */
  const [emailTemplateDetailId, setEmailTemplateDetailId] = useState<number>();

  const searchApi = (arg: IPage) => {
    return getEmailTemplateListApi(arg).then(({ data }) => {
      return data?.data;
    });
  };

  // 操作处理函数（使用类型判断）
  const handleActionClick = async (
    actionType: CommonColumnsActionType,
    record: { id: number },
  ) => {
    switch (actionType) {
      case SHOW:
        // 处理查看逻辑
        setEmailTemplateDetailId(record.id);
        setModelAction(show);
        showDrawer();
        break;
      case EDIT:
        // 处理编辑逻辑
        setEmailTemplateDetailId(record.id);
        setModelAction(edit);
        showDrawer();
        break;
      case DELETE:
        // 处理删除逻辑
        modal.confirm({
          title: I18N.Factors.prompt,
          content: I18N.dashborad.pleaseConfirmIfItIs2,
          okText: I18N.base.confirm,
          cancelText: I18N.Factors.cancel,
          onOk: async () => {
            await deleteEmailTemplateApi(record.id);
            refresh();
          },
        });
        break;
      case COPY:
        // 处理复制逻辑
        modal.confirm({
          title: I18N.dashborad.pleaseConfirmIfItIs,
          okText: I18N.base.confirm,
          cancelText: I18N.Factors.cancel,
          onOk: async () => {
            await copyEmailTemplateApi(record.id);
            refresh();
          },
        });
        break;
      default:
    }
  };

  return (
    <Page
      title={I18N.router.templateManagement}
      actionBtnChildArr={[
        {
          button: checkAuth(
            '',
            <div>
              <PlusOutlined /> {I18N.Factors.newAddition}
            </div>,
          ),
          click: () => {
            setModelAction(add);
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
          columns: emailColumns({ handleActionClick }),
        }}
        autoSaveSearchInfo
        autoAddIndexColumn
        autoFixNoText
      />

      {/* 新增/编辑邮件抽屉功能 */}
      <EmailManageDrawer
        visible={visible}
        actionType={pageType}
        onClose={() => {
          setEmailTemplateDetailId(undefined);
          setModelAction(PageTypeInfo.add);
          onClose();
          refresh();
        }}
        onSuccessSave={() => {
          setEmailTemplateDetailId(undefined);
          setModelAction(PageTypeInfo.add);
          onClose();
          refresh();
        }}
        emailTemplateDetailId={emailTemplateDetailId as number}
      />
    </Page>
  );
};

export default EmailTemplate;
