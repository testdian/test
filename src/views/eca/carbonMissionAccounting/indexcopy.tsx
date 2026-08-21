/*
 * @@description: 排放源填报 20250416 这个页面lv项目用不上 注释掉
 */
import { PlusOutlined } from '@ant-design/icons';
import I18N from '@src/lang/I18N';
import { Key, useContext, useRef, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { SearchProps } from 'table-render/dist/src/types';

import {
  computationVerifyApi,
  postDeleteComputationDeleteApi,
} from '@/api/compution';
import { LocaleContext } from '@/components/LocaleProvider';
import { Page } from '@/components/Page';
import { CustomTableRender } from '@/components/x-render/TableRender';
import { useTableRef as useTable } from '@/components/x-render/TableRender/hook/useTableRef';
// import submitSuccess from '@/image/submitSuccess.png';
import { checkAuth } from '@/layout/utills';
import { EcaRouteMaps } from '@/router/utils/ecaEmums';
import {
  PAGE_TYPE_VAR,
  PageTypeInfo,
  virtualLinkTransform,
} from '@/router/utils/enums';
import { Computation } from '@/sdks/Newcomputation/computationV2ApiDocs';
import {
  getComputationComputationPage,
  getComputationDataPageProps,
} from '@/sdks/computation/computationV2ApiDocs';
import {
  Toast,
  changeTableColumnsNoText,
  getSearchParams,
  updateUrl,
} from '@/utils';
import { useIndexColumn } from '@/utils/columns';

import { columns, SearchSchema } from './utils/columns';
import {
  DelEmissionMOdel,
  DelMoreEmissionMOdel,
  EmissionListModel,
} from './utils/model';

const Users = () => {
  /** 表格选中项 */
  const { locale } = useContext(LocaleContext);

  /** 选中的数据Key */
  const [selectedRowKeys, setSelectedRowKeys] = useState<React.Key[]>([]);

  const [open, changeOpen] = useState(false);
  const [catchRecord, getCatchRecord] = useState<Computation>({});

  const [searchParams, setSearchParams] = useState<getComputationDataPageProps>(
    getSearchParams<getComputationDataPageProps>()[0],
  );
  const { refresh, tableRef } = useTable();
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
  // const returnExportStrfn = () => {
  //   return (
  //     <div style={{ marginLeft: '-30px' }}>
  //       {/* <img className={style.icon} src={submitSuccess} alt='' /> */}
  //       <p>{I18N.eca.exportEmissions}</p>
  //       <p>{I18N.eca.clickOkToJump}</p>
  //     </div>
  //   );
  // };
  // const exportFn = () => {
  //   getComputationComputationExport({
  //     orgId: searchParams?.orgId,
  //     year: searchParams?.year,
  //   }).then(({ data }) => {
  //     if (data.code === 200) {
  //       modal.confirm({
  //         title: I18N.eca.exportEmissions2,
  //         ...returnNoIconModalStyle,
  //         content: returnExportStrfn(),
  //         onOk: async () => {
  //           navigate(RouteMaps.systemDownload);
  //         },
  //         okText: I18N.utils.ok,
  //         cancelText: I18N.Factors.cancel,
  //       });
  //     }
  //   });
  // };
  /** 选中表格 */
  const onSelectChange = (newSelectedRowKeys: React.Key[]) => {
    setSelectedRowKeys(newSelectedRowKeys);
  };

  const rowSelection = {
    selectedRowKeys,
    onChange: onSelectChange,
    preserveSelectedRowKeys: true,
  };
  const [delModalOpen, setDelModalOpen] = useState(false);
  const [delMoreModalOpen, setDelMoreModalOpen] = useState(false);

  const deleteModalFn = (id: Key, record: Computation) => {
    setDelModalOpen(true);
    getCatchRecord({ ...record });
  };
  return (
    <Page
      title={I18N.eca.carbonEmissionAccounting}
      actionBtnChildArr={[
        {
          button: checkAuth(
            '/carbonMissionAccountingInfo/add',
            <div>
              <PlusOutlined /> {I18N.Factors.newAddition}
            </div>,
          ),
          click: () =>
            navigate(
              virtualLinkTransform(
                EcaRouteMaps.carbonMissionAccountingInfo,
                [PAGE_TYPE_VAR, ':id'],
                [PageTypeInfo.add, 0],
              ),
            ),
        },
        // {
        //   button: checkAuth(
        //     '/carbonMissionAccountingInfo/allDel',
        //     <div>{I18N.eca.batchDeletion}</div>,
        //   ),
        //   click: async () => {
        //     if (selectedRowKeys.length === 0) {
        //       Toast('warning', I18N.eca.pleaseSelectData2);
        //       return;
        //     }
        //     setDelMoreModalOpen(true);
        //   },
        // },
        // {
        //   button: checkAuth(
        //     '/carbonMissionAccountingInfo/Export',
        //     <div>{I18N.eca.export}</div>,
        //   ),
        //   click: () => {
        //     exportFn();
        //   },
        // },
      ]}
    >
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
              ...columns({
                deleteModalFn,
                navigate,
                showEmissionListFn,
                refresh,
                locale,
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
          scroll: { x: 1400 },
          rowSelection: {
            type: 'checkbox',
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
      <DelEmissionMOdel
        open={delModalOpen}
        record={{ ...catchRecord }}
        onCancel={() => {
          setDelModalOpen(false);
          getCatchRecord({});
        }}
        onOk={async () => {
          await computationVerifyApi({ idList: [catchRecord.id || 0] });

          await postDeleteComputationDeleteApi({
            idList: [catchRecord.id || 0],
          }).then(({ data }) => {
            if (data.code === 200) {
              Toast('success', I18N.Factors.deleteSuccessful);
              refresh?.();
              setDelModalOpen(false);
              getCatchRecord({});
            }
          });
        }}
      />
      {/* 批量删除 */}
      <DelMoreEmissionMOdel
        open={delMoreModalOpen}
        onCancel={() => {
          setDelMoreModalOpen(false);
          getCatchRecord({});
        }}
        onOk={async () => {
          await computationVerifyApi({ idList: selectedRowKeys });

          await postDeleteComputationDeleteApi({
            idList: selectedRowKeys,
          });
          Toast('success', I18N.Factors.deleteSuccessful);
          setSelectedRowKeys([]);
          setDelMoreModalOpen(false);
          refresh?.();
        }}
      />
    </Page>
  );
};

export default Users;
