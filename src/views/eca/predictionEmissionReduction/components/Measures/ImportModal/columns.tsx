import type { ProColumns } from '@ant-design/pro-components';
import I18N from '@src/lang/I18N';
import { compact } from 'lodash-es';

import { TableActions } from '@/components/Table/TableActions';
import { commonRequestDownloadFile } from '@/utils/downBlobFile';
import { CustomTag } from '@/views/components/CustomTag';

import type { ComputationImportLog } from '../type';

export const columns = (): ProColumns<ComputationImportLog>[] => [
  {
    title: I18N.dashborad.fileName,
    dataIndex: 'fileName',
    width: 180,
    ellipsis: true,
  },
  {
    title: I18N.eca.totalNumberOfFiles,
    dataIndex: 'totalCount',
  },
  {
    title: I18N.eca.importSuccessRecord,
    dataIndex: 'successCount',
  },
  {
    title: I18N.eca.importExceptionBar,
    dataIndex: 'failedCount',
  },
  {
    title: I18N.eca.importStatus,
    dataIndex: 'importStatus_name',
    width: 100,
    renderText: (value, record) => {
      const status = {
        0: 'orange',
        1: 'green',
        2: 'blue',
        [-1]: 'red',
      };
      return (
        <CustomTag
          color={status[record?.importStatus as keyof typeof status]}
          text={value}
        />
      );
    },
  },
  {
    title: '原因描述',
    dataIndex: 'failedMsg',
    width: 280,
    ellipsis: true,
    renderText: (value, record) => {
      if (Number(record.importStatus) === -1) {
        return value || '-';
      }
      return '-';
    },
  },
  {
    title: I18N.carbonFootPrint.operator,
    dataIndex: 'updateByName',
    ellipsis: true,
  },
  {
    title: I18N.carbonFootPrint.importTime,
    dataIndex: 'importTime',
    ellipsis: true,
  },
  {
    title: I18N.Factors.operation,
    dataIndex: 'action',
    fixed: 'right',
    width: 200,
    render: (_, record) => (
      <TableActions
        menus={compact([
          record.fileUrl && {
            label: I18N.eca.downloadSourceFiles,
            key: I18N.eca.downloadSourceFiles,
            onClick: () => {
              commonRequestDownloadFile(
                record.fileUrl as string,
                record.fileName,
                false,
              );
            },
          },
          record.failedFileUrl && {
            label: I18N.eca.numberOfDownloadExceptions,
            key: I18N.eca.numberOfDownloadExceptions,
            onClick: () => {
              const regex = /([^/?#]+\.xlsx)(?:[?#]|$)/i;
              const match = record.failedFileUrl?.match(regex);
              commonRequestDownloadFile(
                record.failedFileUrl as string,
                match?.[1],
                false,
              );
            },
          },
        ])}
      />
    ),
  },
];
