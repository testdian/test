import I18N from '@src/lang/I18N';
import { compact } from 'lodash-es';
import { TableContext, TableRenderProps } from 'table-render/dist/src/types';

import { TableActions } from '@/components/Table/TableActions';
import { checkAuth } from '@/layout/utills';
import { modal } from '@/store/module/notification';
import { modalText } from '@/utils';

import { deleteParameterAPi } from './service';
import { Param } from './type';

export const columns = ({
  refresh,
  onView,
  onEdit,
  onCopy,
}: {
  refresh: TableContext['refresh'];
  onView: (row: Param) => void;
  onEdit: (row: Param) => void;
  onCopy: (row: Param) => void;
}): TableRenderProps<any>['columns'] => {
  return [
    {
      title: I18N.eca.parameter,
      dataIndex: 'paramName',
      fixed: 'left',
    },
    {
      title: I18N.eca.parameterId1,
      dataIndex: 'paramCode',
    },
    {
      title: I18N.eca.parameterFormat1,
      dataIndex: 'paramType_name',
    },
    {
      title: I18N.Factors.unit,
      dataIndex: 'unitType_name',
    },
    {
      title: I18N.eca.type,
      dataIndex: 'paramScope_name',
    },
    {
      title: I18N.eca.parameterDescription,
      dataIndex: 'paramDesc',
    },
    {
      title: I18N.Factors.updatedBy,
      dataIndex: 'updateByName',
    },
    {
      title: I18N.Factors.updateTime,
      dataIndex: 'updateTime',
      width: 180,
    },
    {
      title: I18N.Factors.operation,
      dataIndex: 'action',
      width: 220,
      render(_, row) {
        const { id, paramName } = row || {};
        // const paramTypeBack: string = paramType as unknown as string;
        return (
          <TableActions
            menus={compact([
              checkAuth('/parameter/edit', {
                label: I18N.Factors.edit,
                key: I18N.Factors.edit,
                onClick: async () => {
                  if (row.id) onEdit(row);
                },
              }),
              checkAuth('/parameter/copy', {
                label: I18N.carbonFootPrintLCA.copy,
                key: I18N.carbonFootPrintLCA.copy,
                onClick: async ev => {
                  ev.stopPropagation();
                  if (row.id) onCopy(row);
                },
              }),
              checkAuth('/parameter/show', {
                label: I18N.Factors.check,
                key: I18N.Factors.check,
                onClick: async ev => {
                  ev.stopPropagation();
                  if (row.id) onView(row);
                },
              }),
              checkAuth('/parameter/delete', {
                label: I18N.Factors.delete,
                key: I18N.Factors.delete,
                onClick: async () => {
                  if (!id) return;
                  modal.confirm({
                    title: I18N.Factors.prompt,
                    icon: '',
                    content: (
                      <>
                        确认删除该参数：
                        <span className={modalText}>{paramName}?</span>
                      </>
                    ),
                    onOk: async () => {
                      await deleteParameterAPi(id);
                      refresh?.({ stay: true, tab: 1 });
                    },
                  });
                },
              }),
            ])}
          />
        );
      },
    },
  ];
};
