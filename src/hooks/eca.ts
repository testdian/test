import { useEffect, useState } from 'react';

import { getLvmhOrgListApi } from '@/api/orgBrand';
import { getSystemDictenumListAllByDictTypeBatch } from '@/sdks/systemV2ApiDocs';
import {
  DictEnumResp,
  getSystemDictenumPage,
} from '@/sdks_v2/new/systemV2ApiDocs';

/** 获取组织类型数据 */
export const useOrgsType = () => {
  const [orgsTypes, setOrgsTypes] = useState<DictEnumResp[]>([]);
  useEffect(() => {
    getSystemDictenumListAllByDictTypeBatch({
      dictTypes: 'OrganizationType',
    }).then(({ data }: { code?: number; data?: any; msg?: string }) => {
      const result = data?.data?.OrganizationType;
      setOrgsTypes(result || []);
    });
  }, [location.pathname]);
  return orgsTypes;
};

/** 获取品牌类型数据 */
export const useBrandsType = () => {
  const [brandsTypes, setBrandsTypes] = useState<DictEnumResp[]>([]);
  useEffect(() => {
    getSystemDictenumPage({
      dictType: 'brand',
      pageNum: 1,
      pageSize: 10000000,
    }).then(({ data }) => {
      setBrandsTypes(data?.data?.list || []);
    });
  }, [location.pathname]);
  return brandsTypes;
};

/** 获取带有lvmh 一级组织的组织数据 */
export const useLvmhOrgsType = () => {
  const [lvmhOrgsTypes, setLvmhOrgsTypes] = useState<
    { code: string; value: string }[]
  >([]);
  useEffect(() => {
    getLvmhOrgListApi().then(({ data }) => {
      setLvmhOrgsTypes(data?.data || []);
    });
  }, [location.pathname]);
  return lvmhOrgsTypes;
};
