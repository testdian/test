import { useEffect, useState } from 'react';

import { getGwpTypeListApi } from '@/api/compution';
import {
  getComputationComputationPage,
  getComputationModelPage,
} from '@/sdks/computation/computationV2ApiDocs';

// 获取GWP版本
export const GwpListFn = () => {
  const [gwpList, setGwpList] = useState([]);
  const getGwpList = async () => {
    const { data } = await getGwpTypeListApi();
    setGwpList([...data.data]);
  };
  useEffect(() => {
    getGwpList();
  }, []);
  return gwpList;
};
export const ModelListFn = async (orgId?: number, year?: number) => {
  const { data } = await getComputationModelPage({
    pageNum: 1,
    pageSize: 1000,
    orgId: orgId || undefined,
    year: year || undefined,
  });

  return data;
};
export const computationListFn = async (orgId?: number) => {
  const { data } = await getComputationComputationPage({
    pageNum: 1,
    pageSize: 1000,
    orgId: orgId || undefined,
  });

  return data;
};
