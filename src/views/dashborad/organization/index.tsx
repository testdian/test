/**
 * @description 组织管理
 */
import { Spin } from 'antd';
import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';

import { PageHeader } from '@/components/PageHeader';
import { useOrgTreeData } from '@/hooks/useOrgTreeData';
import { RouteMaps } from '@/router/utils/enums';
import { OrganizationTree } from '@/views/components/OrganizationTree';

import { OrgInfo } from './Info';
import styles from './index.module.less';
import { OrgTree } from './type';

export const Organization = () => {
  const navigate = useNavigate();

  const [selectedKeys, setSelectedKeys] = useState<React.Key[]>([]);
  const [selectedNode, setSelectedNode] = useState<OrgTree | undefined>(
    undefined,
  );

  const [treeData, refresh, loading] = useOrgTreeData();

  // tranData 更新时需要更新 selectedNode
  useEffect(() => {
    function depthGetSelectedNodeInfo(
      transTreeData: OrgTree[],
      transSelectedKeys: React.Key[],
    ) {
      let selectedNodeInfo: any;
      transTreeData.forEach(item => {
        if (item.code === transSelectedKeys[0]) {
          selectedNodeInfo = item;
        } else if (item?.children && item?.children?.length > 0) {
          const result = depthGetSelectedNodeInfo(
            item.children,
            transSelectedKeys,
          );
          if (result) {
            selectedNodeInfo = result;
          }
        }
      });
      return selectedNodeInfo;
    }
    const node = depthGetSelectedNodeInfo(treeData, selectedKeys);
    if (selectedKeys) {
      setSelectedNode(node);
    }
  }, [treeData]);

  return (
    <div className={styles.wrapper}>
      <PageHeader title='组织管理' />
      <div className={styles.mainWrapper}>
        <div className={styles.leftWrapper}>
          <Spin spinning={loading}>
            <OrganizationTree
              treeData={treeData}
              refresh={() => {
                refresh();
              }}
              selectedKeys={selectedKeys}
              onSelect={(keys, info: { selected: boolean; node: OrgTree }) => {
                if (info.selected) {
                  setSelectedNode(info.node);
                } else {
                  setSelectedNode(undefined);
                }
                setSelectedKeys(keys);
              }}
              headerTitle='组织列表'
              showActionBtn
              onVersionManageClick={() => {
                navigate(RouteMaps.versionManage);
              }}
            />
          </Spin>
        </div>
        <div className={styles.contentWrapper}>
          {selectedNode && (
            <OrgInfo
              refresh={refresh}
              id={selectedNode?.id}
              treeData={treeData}
              selectedNode={selectedNode}
            />
          )}
        </div>
      </div>
    </div>
  );
};

export default Organization;
