/*
 * @@description: 供应链碳管理-采购产品管理-详情-供应商列表
 * @Author: liuxinxin xinxin@carbonstop.net
 * @Date: 2023-05-24 14:32:46
 * @LastEditors: liuxinxin xinxin@carbonstop.net
 * @LastEditTime: 2023-06-19 00:24:48
 */
import { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';

import {
  Supplier,
  getSupplychainProductSupplierPage,
} from '@/sdks_v2/new/supplychainV2ApiDocs';
import { SearchParamses } from '@/views/components/utils/types';
import TableList from '@/views/supplyChainCarbonManagement/components/Table';

import { columns } from './utils/columns';

function ProductTableList({ hasAction }: { hasAction: boolean }) {
  const { id } = useParams<{
    id: string;
  }>();
  const [searchParams, setSearchParams] = useState<SearchParamses>({
    current: 1,
    pageSize: 10,
  });

  /** 表格数据 */
  const [tableData, setTableData] = useState<Supplier[]>();

  /** 表格数据总数 */
  const [total, setTotal] = useState<number>(0);

  /** 表格删除标志 */
  //   const [deleteFlag, setDeleteFlag] = useState(false);

  /** 加载loading */
  const [loading, changeLoading] = useState(false);

  /** 表格表头 */
  const column = [...columns()];

  /** 获取采购产品管理下的供应商列表 */
  useEffect(() => {
    if (id) {
      changeLoading(true);
      getSupplychainProductSupplierPage({
        pageNum: searchParams.current,
        pageSize: searchParams.pageSize || 10,
        productId: Number(id),
      }).then(({ data }) => {
        if (data.code === 200) {
          setTableData(data?.data?.list);
          setTotal(data?.data?.total || 0);
          changeLoading(false);
        }
      });
    }
  }, [id, searchParams]);

  return (
    <TableList
      loading={loading}
      scroll={{ x: hasAction ? 1400 : 0 }}
      columns={column}
      dataSource={tableData}
      total={total}
      searchParams={searchParams}
      onchange={(current: number, pageSize: number) => {
        setSearchParams({
          current,
          pageSize,
        });
      }}
    />
  );
}
export default ProductTableList;
