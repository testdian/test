/**
 * @description 问题整改跟踪
 */
import { useNavigate } from 'react-router-dom';

import { Page } from '@/components/Page';
import { CustomTableRender } from '@/components/x-render/TableRender';
import { useTableRef as useTable } from '@/components/x-render/TableRender/hook/useTableRef';
import type { CustomSearchProps } from '@/components/x-render/TableRender/types';

import { columns } from './columns';
import { getVerificationProblemPageApi } from './service';
import { VerificationProblemItem, VerificationProblemPageReq } from './type';

const VerificationProblemPage = () => {
  const { refresh, tableRef } = useTable();
  const navigate = useNavigate();

  const searchApi: CustomSearchProps<
    VerificationProblemItem,
    VerificationProblemPageReq
  > = async args => {
    const { data } = await getVerificationProblemPageApi(args);
    return {
      rows: data?.data?.list || [],
      total: data?.data?.total || 0,
    };
  };

  return (
    <Page title='问题整改跟踪'>
      <CustomTableRender<VerificationProblemItem, VerificationProblemPageReq>
        tableRef={tableRef}
        searchProps={{
          schema: {},
          hidden: true,
          api: searchApi,
        }}
        tableProps={{
          columns: columns({ refresh, navigate }),
          scroll: { x: 1000 },
          rowKey: 'id',
          pagination: {
            showSizeChanger: true,
            size: 'small',
          },
        }}
        autoAddIndexColumn
        autoFixNoText
      />
    </Page>
  );
};

export default VerificationProblemPage;
