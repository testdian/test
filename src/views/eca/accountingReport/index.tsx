/*
 * @@description:核算报告
 */
import { PlusOutlined } from '@ant-design/icons';
import I18N from '@src/lang/I18N';
import { message } from 'antd';
import { useRef, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { SearchProps } from 'table-render/dist/src/types';

import { Page } from '@/components/Page';
import UploadFileDrawer from '@/components/UploadFileDrawer';
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
  getComputationReportPage,
  getComputationReportPageProps,
  Report,
} from '@/sdks/Newcomputation/computationV2ApiDocs';
import { changeTableColumnsNoText, getSearchParams, updateUrl } from '@/utils';
import { useIndexColumn } from '@/utils/columns';

import { uploadReportAndClearanceApi } from './service';
import { columns, SearchSchema } from './utils/columns';
import { safeParseJson } from '../util/transJson';

const AccountingReport = () => {
  const [searchParams, setSearchParams] =
    useState<getComputationReportPageProps>(
      getSearchParams<getComputationReportPageProps>()[0],
    );
  const { refresh, tableRef } = useTable();
  const form = tableRef?.current?.form;
  const navigate = useNavigate();

  const indexColumn = useIndexColumn<any>(
    (Number(searchParams?.pageNum) - 1) * Number(searchParams?.pageSize),
  );
  // 用于修正第一次页码无法正常设置问题
  const isFirstLoad = useRef(true);
  const searchApi: SearchProps<getComputationReportPageProps>['api'] = ({
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
    } as getComputationReportPageProps;
    if (!isFirstLoad.current) {
      newSearch = {
        ...args,
        pageNum,
      } as getComputationReportPageProps;
      updateUrl(args);
    } else {
      form?.setValues(newSearch);
    }
    setSearchParams({
      ...newSearch,
    });
    isFirstLoad.current = false;
    return getComputationReportPage({
      ...newSearch,
    }).then(({ data }) => {
      return {
        rows: data?.data?.list,
        total: data?.data?.total,
      };
    });
  };

  /** 上传报告及清册抽屉显示状态 */
  const [rowUploadFileVisible, setRowUploadFileVisible] = useState(false);

  /** 当前操作的行数据 */
  const [currentRowData, setCurrentRowData] = useState<Report | null>(null);

  /** 当前行的文件列表 */
  const [currentRowFileList, setCurrentRowFileList] = useState<
    {
      name: string;
      url: string;
      uid: string;
    }[]
  >([]);

  /** 点击上传报告及清册的方法 */
  const handleUploadReportAndClearance = (record: Report) => {
    setCurrentRowData(record);
    setCurrentRowFileList(safeParseJson(record?.lastVersionUrl));
    setRowUploadFileVisible(true);
  };

  return (
    <Page
      title={I18N.eca.accountingReport}
      onBtnClick={async () =>
        navigate(
          virtualLinkTransform(
            EcaRouteMaps.accountingReportInfo,
            [PAGE_TYPE_VAR, ':id'],
            [PageTypeInfo.add, 0],
          ),
        )
      }
      actionBtnChild={checkAuth(
        '/accountingReportInfo/Add',
        <div>
          <PlusOutlined /> {I18N.Factors.newAddition}
        </div>,
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
                refresh,
                navigate,
                handleUploadReportAndClearance,
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
        }}
      />

      {/* 上传报告及清册抽屉 */}
      <UploadFileDrawer
        title='上传报告及清册'
        maxCount={5}
        filesList={currentRowFileList}
        visible={rowUploadFileVisible}
        onClose={() => {
          setRowUploadFileVisible(false);
          setCurrentRowData(null);
          setCurrentRowFileList([]);
        }}
        onSave={async files => {
          const { id: reportId } = currentRowData || {};
          if (!reportId) return;

          const lastVersionUrlStr = JSON.stringify(files);

          await uploadReportAndClearanceApi({
            reportId,
            lastVersionUrl: lastVersionUrlStr,
          });
          message.success(I18N.eca.uploadSuccessful);
          refresh?.();
          setRowUploadFileVisible(false);
          setCurrentRowData(null);
          setCurrentRowFileList([]);
        }}
      />
    </Page>
  );
};

export default AccountingReport;
