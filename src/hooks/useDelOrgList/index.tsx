/**
 * @description 获取已删除的组织列表
 */
import { useMount } from 'ahooks';
import { useCallback, useState } from 'react';

import { getDelOrgListApi } from './services';
import { OrgTree } from './type';

export function TransformTreeData(treeData: OrgTree[]): OrgTree[] {
  return treeData?.map(item => ({
    ...item,
    label: item.orgName,
    value: item.orgCode,
    children: item.children ? TransformTreeData(item.children) : [],
  }));
}

export const useDelOrgList = ({
  mountRequest = true,
}: { mountRequest?: boolean } = {}) => {
  const [delOrgList, setDelOrgList] = useState<OrgTree[]>([]);
  const [loading, setLoading] = useState<boolean>(false);

  const refresh = useCallback(async () => {
    setLoading(true);
    try {
      const { data } = await getDelOrgListApi();
      setDelOrgList(TransformTreeData(data.data || []));
    } finally {
      setLoading(false);
    }
  }, []);

  useMount(() => {
    if (mountRequest) {
      refresh();
    }
  });

  return [delOrgList, refresh, loading] as const;
};
