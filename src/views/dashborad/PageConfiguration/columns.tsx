import { ColumnsType } from 'antd/es/table';
import { compact } from 'lodash-es';
import { TableContext } from 'table-render';

import { TableActions } from '@/components/Table/TableActions';
import I18N from '@/lang/I18N';
import { checkAuth } from '@/layout/utills';
import { modal } from '@/store/module/notification';
import { modelFooterBtnStyle } from '@/utils';

import { deletePageConfigurationApi } from './service';
import { PageConfigurationListType } from './type';

export const columns = ({
  refresh,
  onView,
  onEdit,
}: {
  refresh: TableContext['refresh'];
  onView: (row: PageConfigurationListType) => void;
  onEdit: (row: PageConfigurationListType) => void;
}): ColumnsType<any> => {
  return [
    {
      title: I18N.dashborad.pageName1,
      dataIndex: 'pageName',
      width: 500,
    },
    {
      title: I18N.dashborad.sort,
      dataIndex: 'sort',
      // width: 200,
    },
    {
      title: I18N.Factors.updatedBy,
      dataIndex: 'updateByName',
      // width: 200,
    },
    {
      title: I18N.Factors.updateTime,
      dataIndex: 'updateTime',
      width: 200,
    },
    {
      title: I18N.Factors.operation,
      key: 'action',
      width: 180,
      fixed: 'right',
      render: (_, record) => {
        const { id } = record;
        return (
          <TableActions
            menus={compact([
              checkAuth('/pageConfiguration/edit', {
                label: I18N.Factors.edit,
                key: I18N.Factors.edit,
                onClick: async () => {
                  if (id) onEdit(record);
                },
              }),
              checkAuth('/pageConfiguration/delete', {
                label: I18N.Factors.delete,
                key: I18N.Factors.delete,
                onClick: async () => {
                  if (id) {
                    modal.confirm({
                      title: I18N.Factors.prompt,
                      icon: '',
                      content: <div>{I18N.dashborad.pleaseConfirmIfItIs3}</div>,
                      ...modelFooterBtnStyle,
                      okText: I18N.base.confirm,
                      cancelText: I18N.Factors.cancel,
                      onOk: async () => {
                        await deletePageConfigurationApi(id);
                        refresh?.({ stay: true, tab: 1 });
                      },
                    });
                  }
                },
              }),
              checkAuth('/pageConfiguration/show', {
                label: I18N.Factors.check,
                key: I18N.Factors.check,
                onClick: async ev => {
                  ev.stopPropagation();
                  if (id) onView(record);
                },
              }),
            ])}
          />
        );
      },
    },
  ];
};
