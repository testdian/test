/**
 * @description 获取组织树数据
 */
import { useMount } from 'ahooks';
import { useCallback, useState } from 'react';

import { getOrgTreeApi } from './services';
import { OrgTree } from './type';

export function TransformTreeData(treeData: OrgTree[]): OrgTree[] {
  return treeData?.map(item => ({
    ...item,
    label: item.name,
    value: item.code,
    children: item.children ? TransformTreeData(item.children) : [],
  }));
}

export const useOrgTreeData = ({
  mountRequest = true,
  orgVersion = '',
  /** 是否过滤掉虚拟组织 */
  filterVirtualOrg = false,
}: {
  mountRequest?: boolean;
  orgVersion?: string;
  filterVirtualOrg?: boolean;
} = {}) => {
  const [treeData, setTreeData] = useState<OrgTree[]>([]);
  const [loading, setLoading] = useState(false);

  const refresh = useCallback(async (currentOrgVersion?: string) => {
    setLoading(true);
    try {
      const { data } = await getOrgTreeApi({ version: currentOrgVersion });
      setTreeData(TransformTreeData(data.data?.tree || []));
    } finally {
      setLoading(false);
    }
  }, []);

  useMount(() => {
    if (mountRequest) {
      refresh(orgVersion);
    }
  });

  if (filterVirtualOrg) {
    return [treeData?.[0]?.children || [], refresh, loading] as const;
  }

  return [treeData, refresh, loading] as const;
};
