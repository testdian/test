/**
 * @description:操作日志
 */

import I18N from '@src/lang/I18N';

import { Page } from '@/components/Page';
import { RangePicker } from '@/components/x-render/FormRender/DatePicker';
import { CustomTableRender } from '@/components/x-render/TableRender';
import { useTableRef } from '@/components/x-render/TableRender/hook/useTableRef';
import type { CustomSearchProps } from '@/components/x-render/TableRender/types';
import { useAsyncEnums } from '@/hooks';
import {
  getSystemOperlogPage,
  getSystemOperlogPageProps as SearchApiProps,
  OperLog,
} from '@/sdks/systemV2ApiDocs';

import { columns } from './utils/columns';
import { SearchSchema } from './utils/schemas';

const ActionsLog = () => {
  const moduleType = useAsyncEnums('ModuleType');
  const tableRef = useTableRef();
  const searchApi: CustomSearchProps<OperLog, SearchApiProps> = args => {
    const result = {
      ...args,
    };
    return getSystemOperlogPage(result).then(({ data }) => {
      return data?.data || {};
    });
  };

  return (
    <Page title={I18N.dashborad.operationLog}>
      <CustomTableRender<OperLog, SearchApiProps>
        tableRef={tableRef}
        searchProps={{
          widgets: {
            RangePicker,
          },
          schema: SearchSchema(moduleType),
          api: searchApi,
          searchOnMount: false,
        }}
        tableProps={{
          columns: columns(),
        }}
        autoAddIndexColumn
        autoSaveSearchInfo
        autoFixNoText
      />
    </Page>
  );
};

export default ActionsLog;
