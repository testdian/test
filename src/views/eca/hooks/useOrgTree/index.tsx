/**
 * @description 获取组织树数据-带模型显示
 */
import { useMount } from 'ahooks';
import { useCallback, useState } from 'react';

import styles from './index.module.less';
import { getOrgTreeApi } from './services';
import { OrgTree } from './type';

const hasModelText = '已有核算模型';

const noModelText = '尚未维护核算模型';

const TitleShow = ({ name, hasModel }: { name: string; hasModel: boolean }) => (
  <div className={styles.titleShowWrapper}>
    <div className={styles.titleName}>{name}</div>
    <div className={styles.titleModelWrapper}>
      {hasModel ? (
        <span className={styles.titleModel}>{hasModelText}</span>
      ) : (
        <span className={styles.titleNoModel}>{noModelText}</span>
      )}
    </div>
  </div>
);

export function TransformTreeData(treeData: OrgTree[]): OrgTree[] {
  return treeData?.map(item => ({
    ...item,
    label: (
      <TitleShow name={item.name} hasModel={!!item.hasModel} key={item.code} />
    ),
    value: item.code,
    children: item.children ? TransformTreeData(item.children) : [],
  }));
}

export const useOrgTree = ({
  orgVersion,
  mountRequest = true,
}: {
  orgVersion: string;
  mountRequest?: boolean;
}) => {
  const [treeData, setTreeData] = useState<OrgTree[]>([]);
  const [loading, setLoading] = useState(false);

  const refresh = useCallback(async (params: { orgVersion: string }) => {
    setLoading(true);
    try {
      if (params.orgVersion) {
        const { data } = await getOrgTreeApi({ version: params.orgVersion });
        const result = TransformTreeData(data.data?.tree || []);
        setTreeData(result);
        return result;
      }
      setTreeData([]);
      return [];
    } finally {
      setLoading(false);
    }
  }, []);

  useMount(() => {
    if (mountRequest) {
      refresh({ orgVersion });
    }
  });

  return [treeData, refresh, loading] as const;
};
