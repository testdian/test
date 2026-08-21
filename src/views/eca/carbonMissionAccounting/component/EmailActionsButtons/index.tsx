import I18N from '@src/lang/I18N';
import { Button, Space } from 'antd';
import { FC } from 'react';

import { checkAuth } from '@/layout/utills';

interface ActionButtonsProps {
  /** 发送邮件通知 */
  onSendTask: () => void;
  /** 设置填报截止时间 */
  onSetDeadline: () => void;
  /** 邮件管理 */
  onEmailManagement: () => void;
  /** 一键发送钉钉通知 */
  onDingTask: () => void;
  /** 审批设置 */
  onApprovalSetting: () => void;
}

const EmailActionsButtons: FC<ActionButtonsProps> = ({
  onSendTask,
  onSetDeadline,
  onEmailManagement,
  onDingTask,
  onApprovalSetting,
}) => {
  return (
    <Space>
      {checkAuth(
        'carbonMissionAccounting/sendEmail',
        <Button key='dingTalk' danger onClick={onDingTask}>
          一键发送钉钉通知
        </Button>,
      )}
      {checkAuth(
        'carbonMissionAccounting/sendEmail',
        <Button key='danger' danger onClick={onSendTask}>
          {I18N.eca.sendEmailCommunication}
        </Button>,
      )}
      {checkAuth(
        'carbonMissionAccounting/filldataTime',
        <Button key='show' onClick={onSetDeadline}>
          {I18N.eca.setReportingDeadline}
        </Button>,
      )}
      {checkAuth(
        '/carbonMissionAccounting/emailManage',
        <Button key='emailManagement' onClick={onEmailManagement}>
          {I18N.dashborad.emailManagement1}
        </Button>,
      )}
      {checkAuth(
        '',
        <Button key='approvalSetting' onClick={onApprovalSetting}>
          审批设置
        </Button>,
      )}
    </Space>
  );
};

export default EmailActionsButtons;
