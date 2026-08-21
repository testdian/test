/*
 * @@description: 导入文件历史-表头
 * @Author: liuxinxin xinxin@carbonstop.net
 * @Date: 2023-02-28 16:59:23
 * @LastEditors: liuxinxin xinxin@carbonstop.net
 * @LastEditTime: 2023-06-06 15:15:29
 */

import I18N from '@src/lang/I18N';
import { compact } from 'lodash-es';
import { TableRenderProps } from 'table-render/dist/src/types';

import { CustomTag } from '@/views/components/CustomTag';
import { TableActions } from '@/components/Table/TableActions';
import { ImportLog } from '@/sdks_v2/new/systemV2ApiDocs';
import { commonRequestDownloadFile } from '@/utils/downBlobFile';

export const columns = (): TableRenderProps<ImportLog>['columns'] => [
  {
    title: I18N.dashborad.fileName,
    dataIndex: 'fileName',
  },
  {
    title: I18N.carbonData.affiliatedOrganization,
    dataIndex: 'orgName',
  },
  {
    title: I18N.carbonFootPrint.totalNumberOfEntries,
    dataIndex: 'totalCount',
  },
  {
    title: I18N.carbonFootPrint.numberOfImports,
    dataIndex: 'successCount',
  },
  {
    title: I18N.carbonFootPrint.numberOfExceptions,
    dataIndex: 'failedCount',
  },
  {
    title: I18N.Factors.state,
    dataIndex: 'importStatus_name',
    width: 100,
    render: (value, record) => {
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
    title: I18N.carbonFootPrint.operator,
    dataIndex: 'createByName',
    width: 90,
  },
  {
    title: I18N.carbonFootPrint.importTime,
    dataIndex: 'importTime',
    width: 180,
  },
  {
    title: I18N.Factors.operation,
    dataIndex: 'action',
    fixed: 'right',
    width: 200,
    render: (_, record) => {
      return (
        <TableActions
          menus={compact([
            record.fileUrl && {
              label: I18N.carbonFootPrint.sourceFile,
              key: I18N.carbonFootPrint.sourceFile,
              onClick: async () => {
                commonRequestDownloadFile(
                  record.fileUrl as string,
                  record.fileName,
                  false,
                );
              },
            },

            record?.failedFileUrl && {
              label: I18N.carbonFootPrint.abnormalData,
              key: I18N.carbonFootPrint.abnormalData,
              onClick: async () => {
                const regex = /([^/?#]+\.xlsx)(?:[?#]|$)/i;
                const match = record?.failedFileUrl?.match(regex);
                const fileName = match?.[1];
                commonRequestDownloadFile(
                  record.failedFileUrl as string,
                  fileName,
                  false,
                );
              },
            },
          ])}
        />
      );
    },
  },
];
