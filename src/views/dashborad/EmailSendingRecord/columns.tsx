import I18N from '@src/lang/I18N';
import { Tag, Typography } from 'antd';
import { ProColumnsType } from 'table-render';

import { MenuType, TableActions } from '@/components/Table/TableActions';
import { checkAuth } from '@/layout/utills';
import { emailStatusMap } from '@/views/eca/carbonMissionAccounting/config';

import { SEND_ACTION_TYPE } from './constant';
import { EmailTemplateListType } from './type';
import { CustomTag } from '@/views/components/CustomTag';

const { Text } = Typography;

/** 父级模板操作 cancelBtnFlag false ：如果子级邮件状态都成功是 查看按钮 */

/** 父级模板操作 cancelBtnFlag true ：如果子级邮件状态有一个不成功就是 查看按钮、编辑按钮、重新发送按钮 */
const { EDIT, SHOW, RESEND, CANCEL } = SEND_ACTION_TYPE;

const { SEND_FAIL, SEND_SUCCESS } = emailStatusMap;

// 权限校验+按钮创建统一方法（保留原checkAuth逻辑）
const createAuthButton = (
  authPath: string,
  config: {
    label: string;
    key: 'edit' | 'show' | 'cancel' | 'resend';
    onClick: () => void;
  },
) => {
  return checkAuth(authPath, { ...config });
};

// 子级记录（有children）的按钮生成逻辑
const getChildRecordButtons = (
  record: EmailTemplateListType,
  handleAction: (actionType: string, record: EmailTemplateListType) => void,
) => {
  const { cancelBtnFlag } = record;
  return [
    // 编辑按钮：仅当cancelBtnFlag为true且有权限时显示
    cancelBtnFlag &&
      createAuthButton('/emailSendingRecord/edit', {
        label: I18N.Factors.edit,
        key: EDIT,
        onClick: () => handleAction(EDIT, record),
      }),
    // 取消发送：仅当cancelBtnFlag为true且有权限时显示
    cancelBtnFlag &&
      createAuthButton('/emailSendingRecord/cancel', {
        label: I18N.dashborad.cancelSending,
        key: CANCEL,
        onClick: () => handleAction(CANCEL, record),
      }),
  ];
};

// 普通记录（无children）的按钮生成逻辑
const getNormalRecordButtons = (
  record: EmailTemplateListType,
  handleAction: (actionType: string, record: EmailTemplateListType) => void,
) => {
  const { emailStatus } = record;
  const recordInfo = { ...record, childrenFlag: 1 }; // 保留原childrenFlag逻辑

  return [
    // 编辑按钮：非发送成功且有权限时显示
    emailStatus !== SEND_SUCCESS &&
      createAuthButton('/emailSendingRecord/edit', {
        label: I18N.Factors.edit,
        key: EDIT,
        onClick: () => handleAction(EDIT, recordInfo),
      }),
    // 重新发送：仅发送失败且有权限时显示（关键保留逻辑）
    emailStatus === SEND_FAIL &&
      createAuthButton('/emailSendingRecord/reload', {
        label: I18N.dashborad.resend,
        key: RESEND,
        onClick: () => handleAction(RESEND, recordInfo),
      }),
    // 取消发送：非发送成功且有权限时显示
    emailStatus !== SEND_SUCCESS &&
      createAuthButton('/emailSendingRecord/cancel', {
        label: I18N.dashborad.cancelSending,
        key: CANCEL,
        onClick: () => handleAction(CANCEL, recordInfo),
      }),
  ];
};

const getTemplateActions = (
  record: EmailTemplateListType,
  handleActionType: (actionType: string, record: EmailTemplateListType) => void,
) => {
  // 基础按钮：始终显示的查看按钮（保留原逻辑）
  const baseButton = [
    createAuthButton('/emailSendingRecord/show', {
      label: I18N.Factors.check,
      key: SHOW,
      onClick: () => {
        const targetRecord = record.children
          ? record
          : { ...record, childrenFlag: 1 };
        handleActionType(SHOW, targetRecord);
      },
    }),
  ];

  // 根据是否存在子级分支处理（保留原判断逻辑）
  const actionButtons = record.children
    ? getChildRecordButtons(record, handleActionType)
    : getNormalRecordButtons(record, handleActionType);

  // 过滤空值并合并基础按钮（与原compact逻辑一致）
  return [...baseButton, ...actionButtons].filter(Boolean);
};
export const columns = ({
  handelActionType,
}: {
  handelActionType: (actionType: string, record: EmailTemplateListType) => void;
}): ProColumnsType<EmailTemplateListType> => {
  return [
    {
      title: I18N.utils.allIndex,
      dataIndex: 'allIndex',
      fixed: 'left',
      ellipsis: true,
      width: 100,
    },
    {
      title: I18N.dashborad.subject,
      dataIndex: 'subject',
      render: (text, record) => {
        return (
          <div style={{ display: 'flex', gap: 8 }}>
            <div>
              {record?.children && (
                // <Tag color='blue'>{I18N.dashborad.template}</Tag>
                <CustomTag color='blue' text={I18N.dashborad.template} />
              )}
            </div>
            <div style={{ width: '120px', overflow: 'hidden' }}>
              <Text ellipsis={{ tooltip: text }}>{text}</Text>
            </div>
          </div>
        );
      },
    },
    {
      title: I18N.dashborad.whenPlanningToSend,
      dataIndex: 'sendTime',
    },
    {
      title: I18N.dashborad.recipient,
      dataIndex: 'toNames',
    },
    {
      title: I18N.dashborad.ccTo,
      dataIndex: 'ccNames',
    },
    {
      title: I18N.dashborad.sendStatus,
      dataIndex: 'emailStatus_name',
      render: (text, record) => {
        if (!text) return '-';
        return (
          <Tag
            color={record?.emailStatus === SEND_SUCCESS ? 'green' : 'warning'}
          >
            {text}
          </Tag>
        );
      },
    },
    {
      title: I18N.dashborad.whenActuallySent,
      dataIndex: 'lastTime',
    },
    {
      title: I18N.Factors.operation,
      key: 'action',
      width: 180,
      fixed: 'right',
      render: (_, record) => (
        <TableActions
          menus={getTemplateActions(record, handelActionType) as MenuType[]}
        />
      ),
    },
  ];
};
