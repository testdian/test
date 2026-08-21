import { ProColumns } from '@ant-design/pro-components';
import { compact } from 'lodash-es';

import { TableActions } from '@/components/Table/TableActions';
import I18N from '@/lang/I18N';
import { checkAuth } from '@/layout/utills';
import { modal } from '@/store/module/notification';
import { modelFooterBtnStyle } from '@/utils';

import { EmissionSourceList } from '../type';

export const sourceColumns = (
  isDetail: boolean,
  onDelete: (record: EmissionSourceList) => void,
  onEdit: (record: EmissionSourceList) => void,
  onDetailClick: (record: EmissionSourceList) => void,
): ProColumns<EmissionSourceList, 'text'>[] => [
  {
    title: I18N.eca.emissionSourceName,
    dataIndex: 'sourceName',
    ellipsis: true,
  },
  {
    title: I18N.eca.emissionFacilityActivity,
    dataIndex: 'facility',
    ellipsis: true,
  },
  {
    title: I18N.Factors.operation,
    dataIndex: 'action',
    render: (_, record) => {
      return (
        <TableActions
          menus={compact([
            !isDetail &&
              checkAuth('', {
                label: I18N.Factors.edit,
                key: I18N.Factors.edit,
                onClick: () => {
                  onEdit(record);
                },
              }),
            !isDetail &&
              checkAuth('', {
                label: I18N.Factors.delete,
                key: I18N.Factors.delete,
                onClick: async () => {
                  modal.confirm({
                    title: I18N.Factors.prompt,
                    icon: '',
                    content: <div>{I18N.eca.doYouWantToDeleteThis}</div>,
                    ...modelFooterBtnStyle,
                    okText: I18N.base.confirm,
                    cancelText: I18N.Factors.cancel,
                    onOk: async () => {
                      if (record.id) {
                        onDelete(record);
                      }
                    },
                  });
                },
              }),
            checkAuth('', {
              label: I18N.Factors.check,
              key: I18N.Factors.check,
              onClick: () => {
                onDetailClick(record);
              },
            }),
          ])}
        />
      );
    },
  },
];
