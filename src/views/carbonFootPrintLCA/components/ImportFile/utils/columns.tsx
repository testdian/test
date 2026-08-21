/*
 * @@description: 导入文件历史-表头
 */

import I18N from '@src/lang/I18N';
import { compact } from 'lodash-es';
import { TableRenderProps } from 'table-render/dist/src/types';

import { COLOR, ColorTag } from '@/components/ColorTag';
import { TableActions } from '@/components/Table/TableActions';
import { ImportLog } from '@/sdks_v2/new/systemV2ApiDocs';
import { downloadFile } from '@/views/supplyChainCarbonManagement/components/Import/utils';

export const columns = (): TableRenderProps<ImportLog>['columns'] => [
  {
    title: I18N.carbonFootPrintLCA.number,
    dataIndex: 'allIndex',
    width: '68px',
  },
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
  // {
  //   title: I18N.carbonFootPrint.numberOfImports,
  //   dataIndex: 'successCount',
  // },
  {
    title: I18N.carbonFootPrint.numberOfExceptions,
    dataIndex: 'failedCount',
  },
  {
    title: I18N.Factors.state,
    dataIndex: 'importStatus',
    render: (value, record) => {
      const status = {
        0: COLOR.orange,
        1: COLOR.green,
        [-1]: COLOR.red,
      } as {
        [key: number]: keyof typeof COLOR;
      };
      return (
        <ColorTag
          color={status[Number(value)]}
          text={record?.importStatus_name}
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
                downloadFile(record.fileUrl as string, record.fileName);
              },
            },

            record?.failedFileUrl && {
              label: I18N.carbonFootPrint.abnormalData,
              key: I18N.carbonFootPrint.abnormalData,
              onClick: async () => {
                downloadFile(record.failedFileUrl as string, record.fileName);
              },
            },
          ])}
        />
      );
    },
  },
];
