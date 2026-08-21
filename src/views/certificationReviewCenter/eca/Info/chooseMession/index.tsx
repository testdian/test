/*
 * @@description: 排放源填报
 */
import I18N from '@src/lang/I18N';
import { Button } from 'antd';
import Modal from 'antd/lib/modal/Modal';
import { FC, useRef, useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { SearchProps } from 'table-render/dist/src/types';

import { CustomTableRender } from '@/components/x-render/TableRender';
import { useTableRef as useTable } from '@/components/x-render/TableRender/hook/useTableRef';
import { Computation } from '@/sdks/Newcomputation/computationV2ApiDocs';
import {
  getComputationComputationPage,
  getComputationDataPageProps,
} from '@/sdks/computation/computationV2ApiDocs';
import { changeTableColumnsNoText, getSearchParams, updateUrl } from '@/utils';
import { useIndexColumn } from '@/utils/columns';
import { ChooseInputOutputLibrary } from '@/views/carbonFootPrintLCA/components/ProcessManageDrawer/type';
import {
  chooseCarbonMissionColumns,
  SearchSchema,
} from '@/views/eca/carbonMissionAccounting/utils/columns';

import { AssessmentResp } from '../ModelPlanInfo/type';
// import { EmissionListModel } from '@/views/eca/carbonMissionAccounting/utils/model';

type ModelPlanInfoProps = {
  /** 弹窗显隐 */
  open: boolean;
  /** 确定按钮loading */
  confirmLoading: boolean;
  /** 点击取消按钮的方法 */
  handleCancel: () => void;
  /** 点击确定按钮的方法 */
  handleOk: (data?: {
    selectRows?: AssessmentResp[];
    selectedRowKeys?: React.Key[];
  }) => void;
};
const ChooseMession: FC<ModelPlanInfoProps> = ({
  open,
  confirmLoading,
  handleCancel,
  handleOk,
}) => {
  /** 表格选中项 */
  const [selectRows, setSelectRows] = useState<ChooseInputOutputLibrary[]>();

  /** 选中的数据Key */
  const [selectedRowKeys, setSelectedRowKeys] = useState<React.Key[]>([]);

  const [searchParams, setSearchParams] = useState<getComputationDataPageProps>(
    getSearchParams<getComputationDataPageProps>()[0],
  );
  const { pageTypeInfo, id } = useParams<{
    pageTypeInfo: string;
    id: string;
  }>();
  const { tableRef } = useTable();
  const form = tableRef.current?.form;
  const navigate = useNavigate();

  const indexColumn = useIndexColumn<any>(
    (Number(searchParams?.pageNum) - 1) * Number(searchParams?.pageSize),
  );
  // 用于修正第一次页码无法正常设置问题
  const isFirstLoad = useRef(true);
  // @ts-ignore
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
    // changeOpen(true);
    console.log(record, 'record-record');
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
    <Modal
      title={I18N.router.chooseCarbonEmissions}
      open={open}
      width='70%'
      centered
      maskClosable={false}
      destroyOnClose
      onCancel={() => {
        /** 关闭弹窗取消弹窗表格选中 */
        setSelectedRowKeys([]);
        handleCancel();
      }}
      footer={[
        <Button
          onClick={() => {
            /** 关闭弹窗取消弹窗表格选中 */
            setSelectedRowKeys([]);
            handleCancel();
          }}
        >
          {I18N.Factors.cancel}
        </Button>,
        <Button
          loading={confirmLoading}
          onClick={async () => {
            handleOk({ selectRows, selectedRowKeys });
            /** 关闭弹窗取消弹窗表格选中 */
            setSelectedRowKeys([]);
          }}
          type='primary'
        >
          {I18N.carbonFootPrintLCA.confirm}
        </Button>,
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
              {
                title: I18N.eca.accountingName,
                dataIndex: 'computationName',
                fixed: 'left',
                width: 160,
              },
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
    </Modal>
  );
};

export default ChooseMession;
