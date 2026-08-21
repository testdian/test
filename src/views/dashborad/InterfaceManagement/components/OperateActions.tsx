import { compact } from 'lodash-es';
import { TableContext } from 'table-render';

import { TableActions } from '@/components/Table/TableActions';
import I18N from '@/lang/I18N';
import { checkAuth } from '@/layout/utills';
import { modal } from '@/store/module/notification';
import { modelFooterBtnStyle, modalText } from '@/utils';

export const OperateActions = ({
  record,
  refresh,
  navigate,
}: {
  record: any;
  refresh: TableContext['refresh'];
  navigate: (params: any) => void;
}) => {
  const { id = 0, reportName } = record || {};
  return (
    <TableActions
      menus={compact([
        checkAuth('/cbam/report/edit', {
          label: I18N.Factors.edit,
          key: I18N.Factors.edit,
          onClick: () => {
            navigate({
              pathname: '',
              search: id,
            });
          },
        }),
        checkAuth('/cbam/report/delete', {
          label: I18N.Factors.delete,
          key: I18N.Factors.delete,
          onClick: async () => {
            if (id) {
              modal.confirm({
                title: I18N.Factors.prompt,
                icon: '',
                content: (
                  <div>
                    {I18N.dashborad.confirmWhetherToDelete}
                    <span className={modalText}>{reportName}？</span>
                  </div>
                ),
                ...modelFooterBtnStyle,
                okText: I18N.base.confirm,
                cancelText: I18N.Factors.cancel,
                onOk: async () => {
                  refresh?.({ stay: true, tab: 1 });
                },
              });
            }
          },
        }),
        checkAuth('/cbam/report/detail', {
          label: I18N.Factors.check,
          key: I18N.Factors.check,
          onClick: () => {
            navigate({
              pathname: '',
              search: id,
            });
          },
        }),
      ])}
    />
  );
};
