/*
 * @@description:
 */
/*
 * @description: 消息
 */
import I18N from '@src/lang/I18N';
import { Button } from 'antd';
import { useEffect } from 'react';
import { useSelector } from 'react-redux';

import { Page } from '@/components/Page';
import { CustomTableRender } from '@/components/x-render/TableRender';
import { useTableRef as useTable } from '@/components/x-render/TableRender/hook/useTableRef';
import type { CustomSearchProps } from '@/components/x-render/TableRender/types';
import { usePageNumberInfo } from '@/hooks';
import {
  getSystemMsgPage,
  Msg,
  getSystemMsgPageProps as SearchAPIProps,
} from '@/sdks_v2/new/systemV2ApiDocs';
import { readAllFn } from '@/store/action/noticeAction';
import { RootState } from '@/store/types';

import { columns, dictSearchSchema } from './columns';
import style from './index.module.less';

const Message = () => {
  const selector = useSelector((s: RootState) => s);
  const { refresh, tableRef } = useTable();

  const searchApi: CustomSearchProps<Msg, SearchAPIProps> = args => {
    return getSystemMsgPage({
      ...args,
    }).then(({ data }) => {
      return data?.data;
    });
  };

  useEffect(() => {
    refresh?.({ stay: false, tab: 0 });
  }, [selector.systemNotices.count]);
  const { pageNum } = usePageNumberInfo();
  useEffect(() => {
    if (pageNum === 1) {
      refresh?.({ stay: false, tab: 0 });
    }
  }, [pageNum]);

  return (
    <Page
      title={I18N.dashborad.messageCenter}
      wrapperClass={style.wrapper}
      rightRender={
        <Button
          type='link'
          onClick={() => {
            readAllFn(refresh);
          }}
        >
          {I18N.dashborad.markAllAsCompleted}
        </Button>
      }
    >
      <CustomTableRender<Msg>
        tableRef={tableRef}
        searchProps={{
          hidden: true,
          schema: dictSearchSchema(),
          api: searchApi,
        }}
        tableProps={{
          columns: [...columns(refresh)],
          pagination: {
            size: 'default',
          },
        }}
        autoSaveSearchInfo
        autoAddIndexColumn
        autoFixNoText
      />
    </Page>
  );
};

export default Message;
