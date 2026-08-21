import I18N from '@src/lang/I18N';
import { compact } from 'lodash-es';
import { TableRenderProps } from 'table-render/dist/src/types';

import { TableActions } from '@/components/Table/TableActions';

import { ApprovalConfigResp } from './type';

export const columns = ({
  onDetail,
  onEdit,
  isDetail,
}: {
  onDetail: (record: ApprovalConfigResp) => void;
  onEdit: (record: ApprovalConfigResp) => void;
  isDetail: boolean;
}): TableRenderProps<ApprovalConfigResp>['columns'] => {
  return compact([
    {
      title: I18N.carbonFootPrintLCA.number,
      dataIndex: 'allIndex',
      fixed: 'left',
      width: 80,
      render: (_, __, index: number) => index + 1,
    },
    {
      title: '排放源名称',
      dataIndex: 'sourceName',
      width: 200,
    },
    {
      title: '填报人',
      dataIndex: 'roleNames',
      width: 80,
    },
    {
      title: '关联用户',
      dataIndex: 'relUserDesc',
      width: 300,
    },
    {
      title: '审批配置',
      dataIndex: 'auditConfigDesc',
      width: 200,
    },
    {
      title: '操作',
      dataIndex: 'action',
      width: 80,
      render: (_, record) => {
        return (
          <TableActions
            menus={compact([
              isDetail && {
                label: I18N.Factors.check,
                key: I18N.Factors.check,
                onClick: () => {
                  onDetail(record);
                },
              },
              !isDetail && {
                label: I18N.Factors.edit,
                key: I18N.Factors.edit,
                onClick: () => {
                  onEdit(record);
                },
              },
            ])}
          />
        );
      },
    },
  ]);
};
