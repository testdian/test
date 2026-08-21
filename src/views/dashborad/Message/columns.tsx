import I18N from '@src/lang/I18N';
import classNames from 'classnames';
import { SearchProps, TableRenderProps } from 'table-render/dist/src/types';

import { msgClickFn, getUnreadNumFn } from '@/store/action/noticeAction';

import Style from './index.module.less';

export const columns = (
  refresh:
    | ((
        params?: { stay: boolean; tab: string | number } | undefined,
        search?: any,
      ) => Promise<void>)
    | undefined,
): TableRenderProps['columns'] => {
  return [
    {
      title: I18N.dashborad.module,
      dataIndex: 'bizModule_name',
      ellipsis: true,
      width: 180,
    },
    {
      title: I18N.dashborad.messageContent,
      dataIndex: 'content',
      render: (text, record) => {
        return (
          <span
            className={classNames(Style.text, {
              [Style.noClick]: !record.readFlag,
            })}
            onClick={() => {
              msgClickFn(
                record,
                () => {
                  getUnreadNumFn();
                },
                () => {
                  refresh?.({ stay: false, tab: 0 });
                },
              );
            }}
          >
            {text}
          </span>
        );
      },
    },
    {
      title: I18N.dashborad.creationTime,
      dataIndex: 'createTime',
      width: 200,
    },
  ];
};

export const dictSearchSchema = (): SearchProps<any>['schema'] => ({
  type: 'object',
  properties: {},
});
