import { ProColumns } from '@ant-design/pro-components';
import I18N from '@src/lang/I18N';
import { compact } from 'lodash-es';

import { CustomTag } from '@/views/components/CustomTag';
import { TableActions } from '@/components/Table/TableActions';
import { ImportLog } from '@/sdks_v2/new/systemV2ApiDocs';
import { downloadFile } from '@/views/supplyChainCarbonManagement/components/Import/utils';

export const columns = (
  isView: boolean,
  isEn?: boolean,
): ProColumns<
  ImportLog & {
    importFileStatus: number;
  }
>[] => [
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
      /** 0 导入中 1 已导入 -1 导入失败 */
      const status = {
        0: 'orange',
        1: 'green',
        [-1]: 'red',
      };
      return (
        <CustomTag
          color={status[record?.importStatus as unknown as keyof typeof status]}
          text={value}
        />
      );
    },
  },
  {
    title: I18N.dashborad.dataStatus,
    dataIndex: 'importFileStatus_name',
    width: 100,
    renderText: (value, record) => {
      /** 导入文件状态。0 未删除；1 已删除(0:未删除; 1:已删除),可用值:0,1 */
      const status = {
        0: 'orange',
        1: 'green',
      };
      return (
        <CustomTag
          color={
            status[record?.importFileStatus as unknown as keyof typeof status]
          }
          text={value}
        />
      );
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
    width: isView ? 160 : isEn ? 540 : 330,
    render: (_, record) => {
      /**
       * 导入文件状态。0 未删除；1 已删除(0:未删除; 1:已删除),可用值:0,1
       */
      return (
        <TableActions
          menus={compact([
            record.fileUrl && {
              label: I18N.eca.downloadSourceFiles,
              key: I18N.eca.downloadSourceFiles,
              onClick: async () => {
                downloadFile(record.fileUrl as string, record.fileName);
              },
            },
            record?.failedFileUrl &&
              !isView && {
                label: I18N.eca.numberOfDownloadExceptions,
                key: I18N.eca.numberOfDownloadExceptions,
                onClick: async () => {
                  const regex = /([^/?#]+\.xlsx)(?:[?#]|$)/i;
                  const match = record?.failedFileUrl?.match(regex);
                  const fileName = match?.[1];
                  downloadFile(record.failedFileUrl as string, fileName);
                },
              },
          ])}
        />
      );
    },
  },
];
