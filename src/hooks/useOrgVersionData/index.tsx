/**
 * @description 获取组织版本数据
 */
import { useMount } from 'ahooks';
import dayjs from 'dayjs';
import { useCallback, useState } from 'react';

import { getOrgTreeVersionApi } from './services';
import { VersionResp } from './type';

export function TransformVersionData(
  versionData: VersionResp[],
): VersionResp[] {
  return versionData?.map(item => {
    const updateTime = dayjs(item.updateTime).format('YYYYMMDD') || '';

    const label = `组织树${item.version || ''}-${updateTime}-${
      item.versionStatus || ''
    }`;

    return {
      ...item,
      label,
      value: item.version,
    };
  });
}

export const useOrgVersionData = (mountRequest = true) => {
  const [versionData, setVersionData] = useState<VersionResp[]>([]);
  const [loading, setLoading] = useState(false);

  const refresh = useCallback(async () => {
    setLoading(true);
    try {
      const { data } = await getOrgTreeVersionApi();
      setVersionData(TransformVersionData(data?.data || []));
    } finally {
      setLoading(false);
    }
  }, []);

  useMount(() => {
    if (mountRequest) {
      refresh();
    }
  });

  return [versionData, refresh, loading] as const;
};
