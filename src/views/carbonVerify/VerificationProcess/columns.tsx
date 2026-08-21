/**
 * @description 核查过程管理 - 列定义
 */
import { compact } from 'lodash-es';
import { TableContext, TableRenderProps } from 'table-render/dist/src/types';

import { UploadFile } from '@/api/type';
import { TableActions } from '@/components/Table/TableActions';
import { checkAuth } from '@/layout/utills';
import { safeParseJson } from '@/views/eca/util/transJson';

import style from './index.module.less';
import { VerificationProcessItem } from './type';

export const columns = ({
  onUpload,
}: {
  refresh: TableContext['refresh'];
  onUpload: (record: VerificationProcessItem) => void;
}): TableRenderProps<VerificationProcessItem>['columns'] => [
  {
    title: '核算年度',
    dataIndex: 'year',
  },
  {
    title: '最终版报告及清册',
    dataIndex: 'lastVersionUrl',
    render: lastVersionUrl => {
      const fileList = (safeParseJson(lastVersionUrl) as UploadFile[]) || [];

      if (fileList.length === 0) {
        return <div>-</div>;
      }

      return (
        <div>
          {fileList.map(item => (
            <div key={item.name} className={style.fileItem}>
              <a
                className={style.fileHref}
                href={item.url}
                target='_blank'
                rel='noreferrer'
              >
                <span className={style.name}>{item.name}</span>
              </a>
            </div>
          ))}
        </div>
      );
    },
  },
  {
    title: '更新人',
    dataIndex: 'updateByName',
  },
  {
    title: '更新时间',
    dataIndex: 'updateTime',
    width: 200,
  },
  {
    title: '核查意见',
    dataIndex: 'opinion',
    render: opinion => {
      const fileList = (safeParseJson(opinion) as UploadFile[]) || [];

      if (fileList.length === 0) {
        return <div>-</div>;
      }

      return (
        <div>
          {fileList.map(item => (
            <div key={item.name} className={style.fileItem}>
              <a
                className={style.fileHref}
                href={item.url}
                target='_blank'
                rel='noreferrer'
              >
                <span className={style.name}>{item.name}</span>
              </a>
            </div>
          ))}
        </div>
      );
    },
  },
  {
    title: '操作',
    dataIndex: 'id',
    width: 140,
    render: (_id, record) => (
      <TableActions
        menus={compact([
          checkAuth('', {
            label: '上传核查意见',
            key: '上传核查意见',
            onClick: async () => {
              onUpload(record);
            },
          }),
        ])}
      />
    ),
  },
];
