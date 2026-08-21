/**
 * @description 认证审核中心
 */
import { PlusOutlined } from '@ant-design/icons';
import I18N from '@src/lang/I18N';
import { useEffect, useRef, useState, useContext } from 'react';
import { useNavigate } from 'react-router-dom';
import { SearchProps } from 'table-render/dist/src/types';

import { SearchGetAuthDataListApi, getAuthDataListApi } from '@/api/authData';
import { LocaleContext } from '@/components/LocaleProvider';
import { Page } from '@/components/Page';
import { CustomTableRender } from '@/components/x-render/TableRender';
import { useTableRef as useTable } from '@/components/x-render/TableRender/hook/useTableRef';
import { checkAuth } from '@/layout/utills';
import { CertifiCatioinReviewCenterMaps } from '@/router/utils/certificationReviewCenterEmums';
import {
  PAGE_TYPE_VAR,
  PageTypeInfo,
  virtualLinkTransform,
} from '@/router/utils/enums';
import {
  getComputationReportPageProps,
  Report,
} from '@/sdks/Newcomputation/computationV2ApiDocs';
import { changeTableColumnsNoText, getSearchParams, updateUrl } from '@/utils';
import { useIndexColumn } from '@/utils/columns';

import { removeStorageFn } from './Info';
import MyModalComponent from './Info/DownLoadReport';
import { SearchSchema, columns } from './utils/columns';

const Users = () => {
  const { locale } = useContext(LocaleContext);

  const [searchParams, setSearchParams] =
    useState<getComputationReportPageProps>(
      getSearchParams<getComputationReportPageProps>()[0],
    );
  const { refresh, tableRef } = useTable();
  const form = tableRef?.current?.form;
  const navigate = useNavigate();
  const [isVisible, setIsVisible] = useState(false);
  const [importLogList, setImportLogList] = useState<any[]>([]);

  const indexColumn = useIndexColumn<any>(
    (Number(searchParams?.pageNum) - 1) * Number(searchParams?.pageSize),
  );
  useEffect(() => {
    // 清空 认证 缓存的数据
    removeStorageFn();
  }, []);
  // 用于修正第一次页码无法正常设置问题
  const isFirstLoad = useRef(true);
  // @ts-ignore
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
    } as SearchGetAuthDataListApi;
    if (!isFirstLoad.current) {
      newSearch = {
        ...args,
        pageNum,
      } as SearchGetAuthDataListApi;
      updateUrl(args);
    } else {
      form?.setValues(newSearch);
    }
    setSearchParams({
      ...newSearch,
    });
    isFirstLoad.current = false;
    return getAuthDataListApi({
      ...newSearch,
    }).then(({ data }) => {
      return {
        rows: [...(data?.data?.list || [])],
        total: data?.data?.total,
      };
    });
  };
  const reportFn = (record: Report) => {
    setImportLogList([...(record?.importLogList || [])]);
    setIsVisible(true);
  };
  return (
    <Page
      title={I18N.certificationReviewCenter.certificationReviewInProgress}
      onBtnClick={async () =>
        navigate(
          virtualLinkTransform(
            CertifiCatioinReviewCenterMaps.certificationReviewCenterEcaInfo,
            [PAGE_TYPE_VAR, ':id'],
            [PageTypeInfo.add, 0],
          ),
        )
      }
      actionBtnChild={checkAuth(
        '/certificationReviewCenter:add',
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
              ...columns({ refresh, navigate, reportFn, locale }),
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
        }}
      />
      {/* 下载报告和证书 */}
      <MyModalComponent
        isVisible={isVisible}
        handleOk={() => {
          setIsVisible(false);
        }}
        handleCancel={() => {
          setIsVisible(false);
        }}
        importLogList={importLogList || []}
      />
    </Page>
  );
};

export default Users;
