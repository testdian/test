/*
 * @@description:
 */
/*
 * @@description: 排放源填报
 */
import I18N from '@src/lang/I18N';
import { compact } from 'lodash-es';
import { useRef, useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { SearchProps } from 'table-render/dist/src/types';

import { FormActions } from '@/components/FormActions';
import { Page } from '@/components/Page';
import { CustomTableRender } from '@/components/x-render/TableRender';
import { useTableRef as useTable } from '@/components/x-render/TableRender/hook/useTableRef';
import { CertifiCatioinReviewCenterMaps } from '@/router/utils/certificationReviewCenterEmums';
import { PAGE_TYPE_VAR, virtualLinkTransform } from '@/router/utils/enums';
import { Computation } from '@/sdks/Newcomputation/computationV2ApiDocs';
import {
  getComputationComputationPage,
  getComputationDataPageProps,
} from '@/sdks/computation/computationV2ApiDocs';
import { changeTableColumnsNoText, getSearchParams, updateUrl } from '@/utils';
import { useIndexColumn } from '@/utils/columns';
import LocalStore from '@/utils/store';
import { ChooseInputOutputLibrary } from '@/views/carbonFootPrintLCA/components/ProcessManageDrawer/type';
import { CHOOSE_FACTOR } from '@/views/components/EmissionSource/utils/constant';

import { chooseCarbonMissionColumns, SearchSchema } from './utils/columns';
import { EmissionListModel } from './utils/model';

const Users = () => {
  /** 表格选中项 */
  const [selectRows, setSelectRows] = useState<ChooseInputOutputLibrary[]>();

  /** 选中的数据Key */
  const [selectedRowKeys, setSelectedRowKeys] = useState<React.Key[]>([]);

  const [open, changeOpen] = useState(false);
  const [catchRecord, getCatchRecord] = useState<Computation>({});

  const [searchParams, setSearchParams] = useState<getComputationDataPageProps>(
    getSearchParams<getComputationDataPageProps>()[0],
  );
  const { pageTypeInfo, id } = useParams<{
    pageTypeInfo: string;
    id: string;
  }>();
  const { tableRef } = useTable();
  const form = tableRef?.current?.form;
  const navigate = useNavigate();

  const indexColumn = useIndexColumn<any>(
    (Number(searchParams?.pageNum) - 1) * Number(searchParams?.pageSize),
  );
  // 用于修正第一次页码无法正常设置问题
  const isFirstLoad = useRef(true);

  const searchApi: SearchProps<getComputationDataPageProps>['api'] = ({
    current,
    ...args
  }: {
    current: number;
  }) => {
    const pageNum =
      (isFirstLoad.current ? searchParams.pageNum : current) || current;
    let newSearch = {
      ...args,
      ...searchParams,
      pageNum,
    } as getComputationDataPageProps;
    if (!isFirstLoad.current) {
      newSearch = {
        ...args,
        pageNum,
      } as getComputationDataPageProps;
      updateUrl(args);
    } else {
      form?.setValues(newSearch);
    }
    setSearchParams({
      ...newSearch,
    });
    isFirstLoad.current = false;
    return getComputationComputationPage({
      ...newSearch,
    }).then(({ data }) => {
      return {
        rows: data?.data?.list,
        total: data?.data?.total,
      };
    });
  };
  const showEmissionListFn = (record: Computation) => {
    changeOpen(true);
    getCatchRecord({ ...record });
  };

  /** 选中表格 */
  const onSelectChange = (
    newSelectedRowKeys: React.Key[],
    selectedRows: ChooseInputOutputLibrary[],
  ) => {
    setSelectedRowKeys(newSelectedRowKeys);
    setSelectRows(selectedRows);
    console.log(
      `selectedRowKeys: ${selectedRowKeys}`,
      `selectedRows: ${selectRows}`,
    );
  };

  const rowSelection = {
    selectedRowKeys,
    onChange: onSelectChange,
    preserveSelectedRowKeys: true,
  };
  return (
    <Page title={I18N.eca.carbonEmissionAccounting}>
      <CustomTableRender
        tableRef={tableRef}
        searchProps={{
          schema: SearchSchema(),
          api: searchApi,
          searchOnMount: false,
        }}
        tableProps={{
          columns: changeTableColumnsNoText(
            [
              ...indexColumn,
              ...chooseCarbonMissionColumns({
                navigate,
                showEmissionListFn,
                pageTypeInfo,
                id,
              }),
            ],
            '-',
          ),
          pagination: {
            pageSize: searchParams?.pageSize
              ? +searchParams.pageSize
              : undefined,
            current: searchParams?.pageNum ? +searchParams.pageNum : undefined,
            size: 'default',
          },
          scroll: { x: 1200 },
          rowSelection: {
            type: 'radio',
            columnWidth: 48,
            ...rowSelection,
          },
        }}
      />
      <EmissionListModel
        onCancel={() => {
          changeOpen(false);
        }}
        open={open}
        catchRecord={{ ...catchRecord }}
      />
      <FormActions
        className='footWrapper'
        place='center'
        buttons={compact([
          {
            title: I18N.carbonFootPrintLCA.confirm,
            type: 'primary',
            onClick: async () => {
              navigate(
                virtualLinkTransform(
                  CertifiCatioinReviewCenterMaps.certificationReviewCenterEcaInfo,
                  [PAGE_TYPE_VAR, ':id'],
                  [pageTypeInfo, id],
                ),
              );
              LocalStore.setValue(
                CHOOSE_FACTOR.CHOOSECARBONMISSIONID,
                selectedRowKeys[0],
              );
              LocalStore.setValue(
                CHOOSE_FACTOR.CHOOSECARBONMISSIONDATA,
                selectRows,
              );
            },
          },
          {
            title: I18N.Factors.cancel,
            onClick: async () => {
              history.go(-1);
              navigate(
                virtualLinkTransform(
                  CertifiCatioinReviewCenterMaps.certificationReviewCenterEcaInfo,
                  [PAGE_TYPE_VAR, ':id'],
                  [pageTypeInfo, id],
                ),
              );
            },
          },
        ])}
      />
    </Page>
  );
};

export default Users;
