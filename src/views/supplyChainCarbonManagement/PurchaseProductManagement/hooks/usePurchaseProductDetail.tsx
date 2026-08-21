/*
 * @@description: 获取采购产品管理详情
 * @Author: liuxinxin xinxin@carbonstop.net
 * @Date: 2023-05-23 15:48:11
 * @LastEditors: liuxinxin xinxin@carbonstop.net
 * @LastEditTime: 2023-06-15 23:46:01
 */
import { useEffect, useState } from 'react';

import {
  Product,
  getSupplychainProductId,
} from '@/sdks_v2/new/supplychainV2ApiDocs';

import { ProductInfo } from '../type';

export const usePurchaseProductDetail = (id?: string) => {
  const [purchaseProductDetail, setPurchaseProductDetail] =
    useState<ProductInfo>();
  useEffect(() => {
    if (id && id !== 'null') {
      getSupplychainProductId({ id: Number(id) }).then(({ data }) => {
        if (data.code === 200) {
          setPurchaseProductDetail(data?.data as Product & { orgName: string });
        }
      });
    }
  }, [id]);
  return purchaseProductDetail;
};
