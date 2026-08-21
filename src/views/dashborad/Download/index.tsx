/*
 * @@description: 下载管理
 */
import I18N from '@src/lang/I18N';

import { Page } from '@/components/Page';
import { CustomTableRender } from '@/components/x-render/TableRender';
import { useTableRef as useTable } from '@/components/x-render/TableRender/hook/useTableRef';
import {
  getSystemFilelogPage,
  getSystemFilelogPageProps,
} from '@/sdks/systemV2ApiDocs';

import { columns } from './utils/columns';
import { searchSchema } from './utils/schemas';

const Dict = () => {
  const { tableRef } = useTable();
  const searchApi = async (arg: getSystemFilelogPageProps) => {
    const { data } = await getSystemFilelogPage(arg);
    return data?.data;
  };

  return (
    <Page title={I18N.dashborad.downloadManagement}>
      <CustomTableRender
        tableRef={tableRef}
        searchProps={{
          schema: searchSchema(),
          api: searchApi,
        }}
        tableProps={{
          columns: columns(),
        }}
        autoAddIndexColumn
        autoFixNoText
      />
    </Page>
  );
};

export default Dict;
