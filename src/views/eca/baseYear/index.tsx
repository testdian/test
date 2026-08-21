/*
 * @@description:基准年
 */
import { PlusOutlined } from '@ant-design/icons';
import I18N from '@src/lang/I18N';
import { useNavigate } from 'react-router-dom';

import { Page } from '@/components/Page';
import { CustomTableRender } from '@/components/x-render/TableRender';
import { useTableRef as useTable } from '@/components/x-render/TableRender/hook/useTableRef';
import type { CustomSearchProps } from '@/components/x-render/TableRender/types';
import { checkAuth } from '@/layout/utills';
import { EcaRouteMaps } from '@/router/utils/ecaEmums';
import {
  PAGE_TYPE_VAR,
  PageTypeInfo,
  virtualLinkTransform,
} from '@/router/utils/enums';
import {
  EmissionStandard,
  getComputationEmissionStandardPage,
  getComputationEmissionStandardPageProps as SearchAPIProps,
} from '@/sdks/computation/computationV2ApiDocs';

import { columns } from './utils/columns';

const BaseYear = () => {
  const { refresh, tableRef } = useTable();
  const navigate = useNavigate();

  const searchApi: CustomSearchProps<
    EmissionStandard,
    SearchAPIProps
  > = args => {
    return getComputationEmissionStandardPage(args).then(({ data }) => {
      return {
        rows: data?.data?.list || [],
        total: data?.data?.total || 0,
      };
    });
  };
  return (
    <Page
      title={I18N.eca.baseYearSetting}
      onBtnClick={async () =>
        navigate(
          virtualLinkTransform(
            EcaRouteMaps.baseYearInfo,
            [PAGE_TYPE_VAR, ':id'],
            [PageTypeInfo.add, 0],
          ),
        )
      }
      actionBtnChild={checkAuth(
        '/baseYear/add',
        <div>
          <PlusOutlined /> {I18N.Factors.newAddition}
        </div>,
      )}
    >
      <CustomTableRender<EmissionStandard, SearchAPIProps>
        tableRef={tableRef}
        searchProps={{
          schema: {},
          hidden: true,
          api: searchApi,
        }}
        tableProps={{
          columns: columns({ refresh, navigate }),
          scroll: { x: 1200 },
          rowKey: 'id',
          pagination: {
            showSizeChanger: true,
            size: 'small',
          },
        }}
        autoSaveSearchInfo
        autoAddIndexColumn
        autoFixNoText
      />
    </Page>
  );
};

export default BaseYear;
