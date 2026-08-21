import { useEffect, useState } from 'react';

import { SUPPLIER_STATUS, SUPPLIER_TYPE } from '../SupplierManagement/constant';
import { getSupplierList } from '../SupplierManagement/service';
import { SupplierResp } from '../SupplierManagement/type';

/**
 * @description 获取供应链商户列表-客户&启用
 */
export const useSupplyList = () => {
  const [list, setList] = useState<SupplierResp[]>([]);
  useEffect(() => {
    getSupplierList({
      pageNum: 1,
      pageSize: 1000,
      supplierStatus: SUPPLIER_STATUS.ENABLE,
      supplierType: SUPPLIER_TYPE.CUSTOMER,
    }).then(({ data }) => setList(data?.data?.list || []));
  }, []);
  return list;
};
