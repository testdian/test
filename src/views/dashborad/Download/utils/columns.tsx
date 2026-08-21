/*
 * @@description:
 * @Author: qifeng qifeng@carbonstop.net
 * @Date: 2023-01-09 19:44:27
 * @LastEditors: ljh255 jinhai@carbonstop.net
 * @LastEditTime: 2023-03-29 18:08:38
 */

import I18N from '@src/lang/I18N';
import { Button } from 'antd';
import { compact } from 'lodash-es';
import { TableRenderProps } from 'table-render/dist/src/types';

import { checkAuth } from '@/layout/utills';
import { FileLog } from '@/sdks/systemV2ApiDocs';
import { postSystemFilelogDownloadLogSave } from '@/sdks_v2/new/systemV2ApiDocs';

import { commonRequestDownloadFile } from '@/utils/downBlobFile';
import { CustomTag } from '@/views/components/CustomTag';
import { FileStatus, FileStatusTagColor } from '../const';

export const columns = (): TableRenderProps<FileLog>['columns'] =>
  compact([
    {
      title: I18N.dashborad.fileName,
      dataIndex: 'fileName',
    },
    {
      title: I18N.dashborad.fileStatus,
      dataIndex: 'fileStatus',
      render(type: keyof typeof FileStatus) {
        return FileStatus[type] ? (
          <CustomTag color={FileStatusTagColor[type]} text={FileStatus[type]} />
        ) : (
          '-'
        );
      },
    },
    {
      title: I18N.dashborad.operator,
      dataIndex: 'createByName',
    },
    {
      title: I18N.dashborad.creationTime,
      dataIndex: 'createTime',
    },
    checkAuth('/download/save', {
      title: I18N.Factors.operation,
      dataIndex: 'fileUrl',
      render(url, row) {
        return url ? (
          <Button
            type='link'
            // download={row.fileName}
            target='_blank'
            rel='noreferrer'
            onClick={async () => {
              await postSystemFilelogDownloadLogSave({
                req: {
                  id: row?.id || 0,
                },
              });
              commonRequestDownloadFile(url, row?.fileName, false);
            }}
          >
            {I18N.dashborad.download}
          </Button>
        ) : (
          '-'
        );
      },
    }),
  ]);
