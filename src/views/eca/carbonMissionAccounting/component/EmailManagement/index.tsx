/**
 * @description: 邮件管理弹窗
 */
import { QuestionCircleOutlined } from '@ant-design/icons';
import I18N from '@src/lang/I18N';
import { Button, Modal } from 'antd';
import React, { useState } from 'react';
import { TableContext } from 'table-render';

import { CustomTableRender } from '@/components/x-render/TableRender';
import { useDrawer } from '@/hooks/useDrawer';
import { useEmailActions } from '@/hooks/useEmailActions';
import usePageType from '@/hooks/usePageType';
import { PageTypeInfo } from '@/router/utils/enums';
import EmailSendingDrawer from '@/views/dashborad/EmailSendingRecord/components/EmailSendingDrawer';
import { getEmailSendingRecordListApi } from '@/views/dashborad/EmailSendingRecord/service';
import {
  EmailTemplateListType,
  IPage,
} from '@/views/dashborad/EmailSendingRecord/type';

import { columns } from './columns';

const { add } = PageTypeInfo;

interface EmailManagementModalProps {
  /** 数据源id */
  sourceId: number;
  visible: boolean;
  tableRef: React.RefObject<TableContext | null>;
  onClose: () => void;
}

const EmailManagement: React.FC<EmailManagementModalProps> = ({
  sourceId,
  visible,
  tableRef,
  onClose,
}) => {
  /** 设置页面抽屉状态 */
  const { pageType, setModelAction } = usePageType(add);

  const {
    visible: EmailVisible,
    showDrawer,
    onClose: onEmailClose,
  } = useDrawer();

  const [emailTemplateDetail, setEmailTemplateDetail] =
    useState<EmailTemplateListType>();

  const searchApi = (arg: IPage) => {
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
    <div>
      <Modal
        title={I18N.dashborad.emailManagement1}
        open={visible}
        onCancel={onClose}
        width='80%'
        centered
        maskClosable={false}
        destroyOnClose
        footer={null}
      >
        <CustomTableRender
          tableRef={tableRef}
          searchProps={{
            schema: {},
            api: searchApi,
            hidden: true,
          }}
          tableProps={{
            title: (
              <div>
                <Button type='link' icon={<QuestionCircleOutlined />}>
                  {I18N.dashborad.whenTheEditorIsMarkedWith}
                </Button>
                {/* <Button
                  type='link'
                  onClick={() => {
                    tableRef.current?.refresh();
                  }}
                >
                  点击刷新
                </Button> */}
              </div>
            ),
            columns: columns({ handelActionType }),
            scroll: {
              x: 1600,
              y: 55 * 6,
            },
            size: 'small',
          }}
          autoFixNoText
        />
      </Modal>
      {/* 邮件发送管理抽屉 */}
      <EmailSendingDrawer
        visible={EmailVisible}
        actionType={pageType}
        emailTemplateDetail={emailTemplateDetail as EmailTemplateListType}
        onClose={() => {
          onEmailClose();
          setModelAction(add);
        }}
        onSuccessSave={() => {
          onEmailClose();
          setModelAction(add);
          setEmailTemplateDetail(undefined);
          tableRef?.current?.refresh();
        }}
      />
    </div>
  );
};

export default EmailManagement;
