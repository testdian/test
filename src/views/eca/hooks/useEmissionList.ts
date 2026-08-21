import { useMount } from 'ahooks';
import { useCallback, useState } from 'react';

import { getEmissionModalSourceListApi } from '../accountingModel/Info/service';
import { EmissionSourceList } from '../accountingModel/Info/type';

/**
 * 获取排放源列表
 * @param mountRequest 是否自动请求
 * @returns [排放源列表, 刷新函数, 是否加载中]
 */
export const useEmissionSourceList = ({
  mountRequest = true,
}: {
  mountRequest?: boolean;
}) => {
  const [emissionList, setEmissionList] = useState<EmissionSourceList[]>([]);
  const [loading, setLoading] = useState(false);

  const refresh = useCallback(async () => {
    setLoading(true);
    try {
      const { data } = await getEmissionModalSourceListApi();
      setEmissionList(data.data || []);
      return data.data || [];
    } finally {
      setLoading(false);
    }
  }, []);

  useMount(() => {
    if (mountRequest) {
      refresh();
    }
  });

  return [emissionList, refresh, loading] as const;
};
