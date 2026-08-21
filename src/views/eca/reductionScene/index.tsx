/*
 * @@description:减排场景
 */
import { PlusOutlined } from '@ant-design/icons';
import I18N from '@src/lang/I18N';
import { compact } from 'lodash-es';
import { useRef, useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { SearchProps } from 'table-render/dist/src/types';

import { FormActions } from '@/components/FormActions';
import { Page } from '@/components/Page';
import { CustomTableRender } from '@/components/x-render/TableRender';
import { useTableRef as useTable } from '@/components/x-render/TableRender/hook/useTableRef';
import { checkAuth } from '@/layout/utills';
import { EcaRouteMaps } from '@/router/utils/ecaEmums';
import {
  PAGE_TYPE_VAR,
  PageTypeInfo,
  virtualLinkTransform,
} from '@/router/utils/enums';
import {
  getComputationReductionScenePage,
  getComputationReductionScenePageProps,
} from '@/sdks/computation/computationV2ApiDocs';
import { changeTableColumnsNoText, getSearchParams, updateUrl } from '@/utils';
import { useIndexColumn } from '@/utils/columns';
import { CHOOSE_FACTOR } from '@/views/components/EmissionSource/utils/constant';

import { columns, SearchSchema } from './utils/columns';

const ReductionScene = () => {
  const formValues = new URLSearchParams(window.location.search).get(
    CHOOSE_FACTOR.FORM_VALUES,
  );
  const { pageTypeInfo, id, chooseScreen, chooseType } = useParams<{
    pageTypeInfo?: PageTypeInfo;
    id: string;
    chooseScreen: string;
    chooseType: string;
  }>();
  const [selectedRowKeys, changeSselectedRowKeys] = useState<React.Key[]>([]);
  const [searchParams, setSearchParams] =
    useState<getComputationReductionScenePageProps>(
      getSearchParams<getComputationReductionScenePageProps>()[0],
    );
  const { refresh, tableRef } = useTable();
  const form = tableRef?.current?.form;
  const navigate = useNavigate();

  const indexColumn = useIndexColumn<any>(
    (Number(searchParams?.pageNum) - 1) * Number(searchParams?.pageSize),
  );
  // 用于修正第一次页码无法正常设置问题
  const isFirstLoad = useRef(true);
  const searchApi: SearchProps<getComputationReductionScenePageProps>['api'] =
    ({ current, ...args }: { current: number }) => {
      const pageNum =
        (isFirstLoad.current ? searchParams.pageNum : current) || current;
      let newSearch = {
        ...args,
        ...searchParams,
        pageNum,
      } as getComputationReductionScenePageProps;
      if (!isFirstLoad.current) {
        newSearch = {
          ...args,
          pageNum,
        } as getComputationReductionScenePageProps;
        updateUrl(args);
      } else {
        form?.setValues(newSearch);
      }
      setSearchParams({
        ...newSearch,
      });
      isFirstLoad.current = false;
      return getComputationReductionScenePage({
        ...newSearch,
      }).then(({ data }) => {
        return {
          rows: data?.data?.list,
          total: data?.data?.total,
        };
      });
    };
  const returnUrl = () => {
    return formValues
      ? `?${CHOOSE_FACTOR.FORM_VALUES}=${formValues}&${CHOOSE_FACTOR.SCREEN_ID}=${selectedRowKeys}`
      : `?${CHOOSE_FACTOR.SCREEN_ID}=${selectedRowKeys}`;
  };
  return (
    <Page
      title={I18N.eca.emissionReductionScenarios}
      onBtnClick={async () =>
        navigate(
          virtualLinkTransform(
            EcaRouteMaps.reductionSceneInfo,
            [PAGE_TYPE_VAR, ':id'],
            [PageTypeInfo.add, 0],
          ),
        )
      }
      actionBtnChild={checkAuth(
        '/reductionScene/add',
        window.location.pathname.indexOf('reductionScene') >= 0 && (
          <div>
            <PlusOutlined /> {I18N.Factors.newAddition}
          </div>
        ),
      )}
    >
      <CustomTableRender
        tableRef={tableRef}
        searchProps={{
          schema: SearchSchema(),
          api: searchApi,
        }}
        tableProps={{
          columns: changeTableColumnsNoText(
            [
              ...indexColumn,
              ...columns({
                pageTypeInfo,
                refresh,
                navigate,
                chooseScreen,
                reportId: id,
                chooseType,
              }),
            ],
            '-',
          ),
          pagination: {
            pageSize: searchParams?.pageSize
              ? +searchParams.pageSize
              : undefined,
            current: searchParams?.pageNum ? +searchParams.pageNum : undefined,
            size: 'small',
            showSizeChanger: true,
          },
          rowSelection: chooseType
            ? {
                type: 'checkbox',
                selectedRowKeys,
                onChange: selectRowKeys => {
                  changeSselectedRowKeys(selectRowKeys);
                },
              }
            : undefined,
        }}
      />
      {window.location.pathname.indexOf('/ecaReport/reductionScene') === -1 && (
        <FormActions
          place='center'
          buttons={compact([
            {
              title: I18N.Factors.preserve,
              type: 'primary',
              disabled: selectedRowKeys.length === 0,
              onClick: async () => {
                const urlParamsData = returnUrl();
                const baseUrl = `${virtualLinkTransform(
                  EcaRouteMaps.accountingReportInfo,
                  [PAGE_TYPE_VAR, ':id'],
                  [pageTypeInfo, id],
                )}`;
                navigate(baseUrl + urlParamsData);
              },
            },
            {
              title: I18N.Factors.cancel,
              onClick: async () => {
                const urlParamsData = returnUrl();
                const baseUrl = `${virtualLinkTransform(
                  EcaRouteMaps.accountingReportInfo,
                  [PAGE_TYPE_VAR, ':id'],
                  [pageTypeInfo, id],
                )}`;
                navigate(baseUrl + urlParamsData);
              },
            },
          ])}
        />
      )}
    </Page>
  );
};

export default ReductionScene;
