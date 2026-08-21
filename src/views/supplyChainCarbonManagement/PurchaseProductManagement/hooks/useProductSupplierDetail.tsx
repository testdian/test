/*
 * @@description: 获取采购产品管理详情
 * @Author: liuxinxin xinxin@carbonstop.net
 * @Date: 2023-05-23 15:48:11
 * @LastEditors: liuxinxin xinxin@carbonstop.net
 * @LastEditTime: 2023-06-15 23:45:46
 */
import { useEffect, useState } from 'react';

import {
  Supplier,
  getSupplychainProductSupplierSupplierIdProductId,
} from '@/sdks_v2/new/supplychainV2ApiDocs';

export const useProductSupplierDetail = ({
  productId,
  supplierId,
}: {
  productId?: string;
  supplierId?: string;
}) => {
  const [productSupplierDetail, setProductSupplierDetail] =
    useState<Supplier>();
  useEffect(() => {
    if (supplierId && productId) {
      getSupplychainProductSupplierSupplierIdProductId({
        productId: Number(productId),
        supplierId: Number(supplierId),
      }).then(({ data }) => {
        if (data.code === 200) {
          setProductSupplierDetail(data?.data);
        }
      });
    }
  }, [productId, supplierId]);
  return productSupplierDetail;
};
