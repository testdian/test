/**
 * @description 采购产品管理-详情-供应商列表
 */
import { useContext } from 'react';
import { useNavigate, useParams } from 'react-router-dom';

import { LocaleContext } from '@/components/LocaleProvider';
import { CustomTableRender } from '@/components/x-render/TableRender';
import { useTableRef as useTable } from '@/components/x-render/TableRender/hook/useTableRef';
import { CustomSearchProps } from '@/components/x-render/TableRender/types';
import {
  Supplier,
  getSupplychainProductSupplierPage,
  getSupplychainProductSupplierPageProps,
} from '@/sdks_v2/new/supplychainV2ApiDocs';

import { columns } from './columns';

function SupplierList({ hasAction }: { hasAction: boolean }) {
  const { locale } = useContext(LocaleContext);

  const navigate = useNavigate();
  const { refresh, tableRef } = useTable();

  const { id } = useParams<{
    id: string;
  }>();

  /** 获取采购产品管理下的供应商列表 */
  const searchApi: CustomSearchProps<
    Supplier,
    getSupplychainProductSupplierPageProps
  > = args =>
    getSupplychainProductSupplierPage({ ...args, productId: Number(id) }).then(
      ({ data }) => {
        return data?.data;
      },
    );

  return (
    <CustomTableRender<Supplier, getSupplychainProductSupplierPageProps>
      tableRef={tableRef}
      searchProps={{
        hidden: true,
        schema: { type: 'void', properties: {} },
        api: searchApi,
      }}
      tableProps={{
        columns: columns({ refresh, navigate, hasAction, id, locale }),
        scroll: { x: 1400 },
      }}
      autoFixNoText
    />
  );
}
export default SupplierList;
