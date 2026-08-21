/**
 * @description 邮件发送管理页面
 */
import { PlusOutlined, QuestionCircleOutlined } from '@ant-design/icons';
import I18N from '@src/lang/I18N';
import { Button } from 'antd';
import { FC, useState } from 'react';

import { Page } from '@/components/Page';
import { CustomTableRender } from '@/components/x-render/TableRender';
import { useTableRef as useTable } from '@/components/x-render/TableRender/hook/useTableRef';
import { useDrawer } from '@/hooks/useDrawer';
import { useEmailActions } from '@/hooks/useEmailActions';
import usePageType from '@/hooks/usePageType';
import { checkAuth } from '@/layout/utills';
import { PageTypeInfo } from '@/router/utils/enums';

import { columns } from './columns';
import EmailSendingDrawer from './components/EmailSendingDrawer';
import { emailSendingRecordSearchSchema } from './searchSchemas';
import { getEmailSendingRecordListApi } from './service';
import style from './index.module.less';
import { EmailTemplateListType, IPage } from './type';

const { add } = PageTypeInfo;

/** 使用自定义 Hook 中的逻辑 */
const EmailSendingRecord: FC<{ sourceId: number }> = ({ sourceId }) => {
  const { tableRef } = useTable();
  /** 设置页面抽屉状态 */
  const { pageType, setModelAction } = usePageType(add);

  const { visible, showDrawer, onClose } = useDrawer();

  const [emailTemplateDetail, setEmailTemplateDetail] =
    useState<EmailTemplateListType>();

  /** 列表数据 */
  const searchApi = (arg: IPage & { sourceId?: number }) => {
    return getEmailSendingRecordListApi({ ...arg, sourceId }).then(
      ({ data }) => {
        return data?.data;
      },
    );
  };

  const { handelActionType } = useEmailActions(
    tableRef,
    setModelAction,
    showDrawer,
    setEmailTemplateDetail,
  );

  return (
    <Page
      title={I18N.router.sendManagement}
      onBtnClick={async () => {
        setModelAction(add);
        showDrawer();
      }}
      actionBtnChild={checkAuth(
        '/emailSendingRecord/add',
        <div>
          <PlusOutlined /> {I18N.Factors.newAddition}
        </div>,
      )}
    >
      <CustomTableRender
        tableRef={tableRef}
        searchProps={{
          schema: emailSendingRecordSearchSchema(),
          api: searchApi,
        }}
        tableProps={{
          title: (
            <Button
              type='link'
              icon={<QuestionCircleOutlined />}
              className={style.questionCircleOutlined}
            >
              {I18N.dashborad.whenTheEditorIsMarkedWith}
            </Button>
          ),
          columns: columns({ handelActionType }),
        }}
        autoSaveSearchInfo
        autoFixNoText
      />
      {/* 邮件发送管理抽屉 */}
      <EmailSendingDrawer
        visible={visible}
        actionType={pageType}
        emailTemplateDetail={emailTemplateDetail as EmailTemplateListType}
        onClose={() => {
          onClose();
          setModelAction(add);
        }}
        onSuccessSave={() => {
          onClose();
          setModelAction(add);
          setEmailTemplateDetail(undefined);
          tableRef?.current?.refresh();
        }}
      />
    </Page>
  );
};

export default EmailSendingRecord;
