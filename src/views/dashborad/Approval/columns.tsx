import I18N from '@src/lang/I18N';
import { compact } from 'lodash-es';
import { TableRenderProps } from 'table-render/dist/src/types';

import { TableActions } from '@/components/Table/TableActions';
import { checkAuth } from '@/layout/utills';

import { AuditResp } from './type';

export const columns = ({
  onView,
  onEdit,
}: {
  onView: (row: AuditResp) => void;
  onEdit: (row: AuditResp) => void;
}): TableRenderProps<AuditResp>['columns'] => [
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
    dataIndex: 'content',
    width: 200,
    render(_, row) {
      const { auditType } = row || {};
      return (
        <TableActions
          menus={compact([
            checkAuth('/sys/approval/edit', {
              label: I18N.Factors.edit,
              key: I18N.Factors.edit,
              onClick: async () => {
                if (auditType) onEdit(row);
              },
            }),
            checkAuth('/sys/approval/info', {
              label: I18N.Factors.check,
              key: I18N.Factors.check,
              onClick: async () => {
                if (auditType) onView(row);
              },
            }),
          ])}
        />
      );
    },
  },
];
