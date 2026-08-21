/**
 * @description CBAM报表列表页
 */
import { PlusOutlined } from '@ant-design/icons';
import I18N from '@src/lang/I18N';
import { useNavigate } from 'react-router-dom';

import { Page } from '@/components/Page';
import { CustomTableRender } from '@/components/x-render/TableRender';
import { useTableRef as useTable } from '@/components/x-render/TableRender/hook/useTableRef';
import type { CustomSearchProps } from '@/components/x-render/TableRender/types';
import { checkAuth } from '@/layout/utills';
import { CBAMRouteMaps } from '@/router/utils/cbam';
import { PageTypeInfo } from '@/router/utils/enums';

import { columns } from './columns';
import { searchSchema } from './schemas';
import { getCbamList } from './service';
import { GeneralInfoProps, CbamRequest } from './type';

const ReportForm = () => {
  const navigate = useNavigate();
  const { refresh, tableRef } = useTable();

  const searchApi: CustomSearchProps<GeneralInfoProps, CbamRequest> = args =>
    getCbamList(args).then(({ data }) => {
      return data?.data;
    });

  return (
    <Page
      title={I18N.cbam.cbamNews}
      onBtnClick={async () => {
        navigate({
          pathname: CBAMRouteMaps.cbamReportInfo.replace(
            ':pageTypeInfo',
            `${PageTypeInfo.add}`,
          ),
        });
      }}
      actionBtnChild={checkAuth(
        '/cbam/report/add',
        <div>
          <PlusOutlined /> {I18N.Factors.newAddition}
        </div>,
      )}
    >
      <CustomTableRender<GeneralInfoProps, CbamRequest>
        tableRef={tableRef}
        searchProps={{
          schema: searchSchema(),
          api: searchApi,
        }}
        tableProps={{
          columns: columns({ refresh, navigate }),
          scroll: { x: 1500 },
        }}
        autoSaveSearchInfo
        autoAddIndexColumn
        autoFixNoText
      />
    </Page>
  );
};
export default ReportForm;
