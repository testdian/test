/**
 * @description: 供应链商户管理-详情-审核记录
 */
import { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';

import {
  getSupplychainSupplierAuditListSupplierId,
  SupplierAuditLogDto,
} from '@/sdks_v2/new/supplychainV2ApiDocs';
import TableList from '@/views/supplyChainCarbonManagement/components/Table';

import { columns } from './utils/columns';

function ApprovalRecord() {
  const { id } = useParams<{
    id: string;
  }>();

  /** 表格数据 */
  const [tableData, setTableData] = useState<SupplierAuditLogDto[]>();

  /** 表格表头 */
  const column = [...columns()];

  useEffect(() => {
    if (id) {
      getSupplychainSupplierAuditListSupplierId({
        supplierId: Number(id),
      }).then(({ data }) => {
        if (data.code === 200) {
          setTableData(data.data);
        }
      });
    }
  }, [id]);

  return <TableList columns={column} dataSource={tableData} />;
}
export default ApprovalRecord;
