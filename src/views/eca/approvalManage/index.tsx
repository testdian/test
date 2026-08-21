/*
 * @@description:
 */
/*
 * @@description:排放数据审核
 */
import I18N from '@src/lang/I18N';
import { useRef, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { SearchProps } from 'table-render/dist/src/types';

import { AuditMoreModal } from '@/components/AuditMoreModal';
import { Page } from '@/components/Page';
import { CustomTableRender } from '@/components/x-render/TableRender';
import { useTableRef as useTable } from '@/components/x-render/TableRender/hook/useTableRef';
import {
  AuditData,
  getComputationAuditPage,
  getComputationAuditPageProps,
} from '@/sdks/Newcomputation/computationV2ApiDocs';
import {
  changeTableColumnsNoText,
  getSearchParams,
  Toast,
  updateUrl,
} from '@/utils';
import { useIndexColumn } from '@/utils/columns';

import { AuditModal, PendReviewModal } from './PendReviewModal';
import { columns, SearchSchema } from './utils/columns';

const Users = () => {
  const [open, getOpen] = useState(false);
  const [auditOpen, setAuditOpen] = useState(false);
  const [auditMoreOpen, setAuditMoreOpen] = useState(false);
  const [catchRecord, getCatcherRecord] = useState<AuditData>({});
  const [searchParams, setSearchParams] =
    useState<getComputationAuditPageProps>(
      getSearchParams<getComputationAuditPageProps>()[0],
    );
  const { refresh, tableRef } = useTable();
  const form = tableRef?.current?.form;
  const navigate = useNavigate();

  const indexColumn = useIndexColumn<any>(
    (Number(searchParams?.pageNum) - 1) * Number(searchParams?.pageSize),
  );
  // 用于修正第一次页码无法正常设置问题
  const isFirstLoad = useRef(true);

  const searchApi: SearchProps<getComputationAuditPageProps>['api'] = ({
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
    } as getComputationAuditPageProps;
    if (!isFirstLoad.current) {
      newSearch = {
        ...args,
        pageNum,
      } as getComputationAuditPageProps;
      updateUrl(args);
    } else {
      form?.setValues(newSearch);
    }
    setSearchParams({
      ...newSearch,
    });
    isFirstLoad.current = false;
    return getComputationAuditPage({
      ...newSearch,
    }).then(({ data }) => {
      return {
        rows: data?.data?.list,
        total: data?.data?.total,
      };
    });
  };
  const PendReviewModalFn = (record: AuditData) => {
    getOpen(true);
    getCatcherRecord(record);
  };
  const [selectedRowKeys, setSelectedRowKeys] = useState<React.Key[]>([]);

  /** 审核弹窗显隐 */
  // const [open, setOpen] = useState(false);
  const onSelectChange = (newSelectedRowKeys: React.Key[]) => {
    setSelectedRowKeys(newSelectedRowKeys);
  };
  const rowSelection: {
    selectedRowKeys: React.Key[];
    onChange: (newSelectedRowKeys: React.Key[]) => void;
    getCheckboxProps: (record: { auditStatus: number }) => any;
  } = {
    selectedRowKeys,
    onChange: onSelectChange,
    getCheckboxProps: (record: { auditStatus: number }) => ({
      disabled: Number(record?.auditStatus) !== 0, // Column configuration not to be checked
    }),
  };
  return (
    <Page
      title={I18N.eca.emissionDataReview}
      actionBtnChildArr={[
        {
          button: (
            <div
              onClick={async () => {
                if (selectedRowKeys.length === 0) {
                  Toast('error', I18N.eca.pleaseSelectData2);
                  return;
                }
                setAuditMoreOpen(true);
                // modal.confirm({
                //   content: '确认启用所选排放源？',
                //   onOk: async () => {
                //     await postUpdateStatusBatchApi({
                //       idList: selectedRowKeys,
                //       status: 0,
                //     });
                //     refresh?.();
                //     setSelectedRowKeys([]);
                //   },
                // });
              }}
            >
              {I18N.eca.batchReview}
            </div>
          ),
        },
      ]}
      wrapperClass='marginBottomFormActionsHeight'
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
              ...columns({ refresh, navigate, PendReviewModalFn }),
            ],
            '-',
          ),
          scroll: { x: 1400 },
          pagination: {
            pageSize: searchParams?.pageSize
              ? +searchParams.pageSize
              : undefined,
            current: searchParams?.pageNum ? +searchParams.pageNum : undefined,
            size: 'default',
          },
          rowSelection,
        }}
      />
      <PendReviewModal
        open={open}
        handleCancel={() => {
          getOpen(false);
        }}
        id={Number(catchRecord?.id)}
      />
      <AuditModal
        open={auditOpen}
        handleCancel={() => {
          setAuditOpen(false);
          refresh?.();
          setSelectedRowKeys([]);
        }}
        handleOk={() => {
          setAuditOpen(false);
          refresh?.();
          setSelectedRowKeys([]);

          // navigator(EcaRouteMaps.approvalManage);
        }}
        id={Number(selectedRowKeys?.[0])}
      />
      {/*  批量审核 */}
      <AuditMoreModal
        open={auditMoreOpen}
        handleCancel={() => {
          setAuditMoreOpen(false);
          refresh?.();
          setSelectedRowKeys([]);
        }}
        handleOk={() => {
          setAuditMoreOpen(false);
          refresh?.();
          setSelectedRowKeys([]);

          // navigator(EcaRouteMaps.approvalManage);
        }}
        formValues={{
          computationSourceIdList: selectedRowKeys as number[],
        }}
      />
    </Page>
  );
};

export default Users;
