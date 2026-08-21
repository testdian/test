import I18N from '@src/lang/I18N';
import { Tag, Typography } from 'antd';
import { compact } from 'lodash-es';
import { ProColumnsType } from 'table-render';

import { TableActions } from '@/components/Table/TableActions';
import { checkAuth } from '@/layout/utills';
import { EmailTemplateListType } from '@/views/dashborad/EmailSendingRecord/type';
import { emailStatusMap } from '@/views/eca/carbonMissionAccounting/config';

import { EMAIL_ACTION_TYPE } from './constant';

const { Text } = Typography;

/** 父级模板操作 cancelBtnFlag false ：如果子级邮件状态都成功是 查看按钮 */

/** 父级模板操作 cancelBtnFlag true ：如果子级邮件状态有一个不成功就是 查看按钮、编辑按钮、重新发送按钮 */
const { EDIT, SHOW, RESEND, CANCEL } = EMAIL_ACTION_TYPE;
const getTemplateActions = (
  record: EmailTemplateListType,
  handelActionType: (actionType: string, record: EmailTemplateListType) => void,
) => {
  /** 父级有children字段，用有没有children字段判断 */
  if (record?.children) {
    const { cancelBtnFlag } = record;
    return compact([
      // 始终显示查看按钮
      checkAuth('', {
        label: I18N.Factors.check,
        key: SHOW,
        onClick: () => handelActionType(SHOW, record),
      }),
      // 如果子级邮件状态不成功时显示编辑按钮
      ...[
        cancelBtnFlag &&
          checkAuth('', {
            label: I18N.Factors.edit,
            key: EDIT,
            onClick: () => handelActionType(EDIT, record),
          }),

        // 如果子级邮件状态不成功时显示取消发送
        cancelBtnFlag &&
          checkAuth('', {
            label: I18N.dashborad.cancelSending,
            key: CANCEL,
            onClick: () => handelActionType(CANCEL, record),
          }),
      ],
    ]);
  }
  const { emailStatus } = record;
  const recordInfo = { ...record, childrenFlag: 1 };
  return compact([
    // 始终显示查看按钮
    checkAuth('', {
      label: I18N.Factors.check,
      key: SHOW,
      onClick: () => handelActionType(SHOW, recordInfo),
    }),

    ...[
      emailStatus !== emailStatusMap.SEND_SUCCESS &&
        checkAuth('', {
          label: I18N.Factors.edit,
          key: EDIT,
          onClick: () => handelActionType(EDIT, recordInfo),
        }),
      // 发送失败展示重新发送
      emailStatus === emailStatusMap.SEND_FAIL &&
        checkAuth('', {
          label: I18N.dashborad.resend,
          key: RESEND,
          onClick: () => handelActionType(RESEND, recordInfo),
        }),
      emailStatus !== emailStatusMap.SEND_SUCCESS &&
        checkAuth('', {
          label: I18N.dashborad.cancelSending,
          key: CANCEL,
          onClick: () => handelActionType(CANCEL, recordInfo),
        }),
    ],
  ]);
};

export const columns = ({
  handelActionType,
}: {
  handelActionType: (actionType: string, record: EmailTemplateListType) => void;
}): ProColumnsType<EmailTemplateListType> => {
  return [
    {
      title: I18N.dashborad.subject,
      dataIndex: 'subject',
      render: (text, record) => {
        return (
          <div style={{ display: 'flex', gap: 8 }}>
            <div>
              {record?.children && (
                <Tag color='blue'>{I18N.dashborad.template}</Tag>
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
            color={
              record?.emailStatus === emailStatusMap.SEND_SUCCESS
                ? 'green'
                : 'warning'
            }
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
        <TableActions menus={getTemplateActions(record, handelActionType)} />
      ),
    },
  ];
};
