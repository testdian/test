import I18N from '@src/lang/I18N';
import { ColumnsType } from 'antd/es/table';
import { compact } from 'lodash-es';

import { TableActions } from '@/components/Table/TableActions';
import { checkAuth } from '@/layout/utills';
import { CommonColumnsActionType } from '@/views/eca/util/actionType';

const { SHOW, EDIT, DELETE, COPY } = CommonColumnsActionType;

/**
 * 操作配置映射表
 */
const actionTypeData = [
  { type: SHOW, label: I18N.Factors.check, auth: '' },
  { type: EDIT, label: I18N.Factors.edit, auth: '' },
  { type: DELETE, label: I18N.Factors.delete, auth: '' },
  { type: COPY, label: I18N.carbonFootPrintLCA.copy, auth: '' },
] as const;

/** 邮件管理列表列配置 */
export const emailColumns = ({
  handleActionClick,
}: {
  handleActionClick: (actionType: CommonColumnsActionType, record: any) => void;
}): ColumnsType<any> => {
  return [
    {
      title: I18N.dashborad.templateName,
      dataIndex: 'templateName',
    },
    {
      title: I18N.Factors.updatedBy,
      dataIndex: 'updateByName',
    },
    {
      title: I18N.Factors.updateTime,
      dataIndex: 'updateTime',
    },
    {
      title: I18N.Factors.operation,
      key: 'action',
      fixed: 'right',
      render: (_, record) => {
        return (
          <TableActions
            menus={compact(
              actionTypeData.map(({ type, label, auth }) =>
                checkAuth(auth, {
                  label,
                  key: type,
                  onClick: () => handleActionClick(type, record),
                }),
              ),
            )}
          />
        );
      },
    },
  ];
};
