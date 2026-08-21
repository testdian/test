/**
 * @description 查看版本抽屉
 */
import { Drawer, Spin } from 'antd';
import { FC, useEffect, useState } from 'react';

import { OrganizationTree } from '@/views/components/OrganizationTree';

import { TransformTreeData } from '../../../../../hooks/useOrgTreeData';
import { getOrgTreeApi } from '../../services';
import { OrgTree } from '../../type';
import { VersionResp } from '../type';

interface VersionInfoDrawerProps {
  title: string;
  open: boolean;
  onClose: () => void;
  versionInfo: VersionResp;
}

const VersionInfoDrawer: FC<VersionInfoDrawerProps> = ({
  title,
  open,
  onClose,
  versionInfo,
}) => {
  const { version } = versionInfo || {};

  const [treeData, setTreeData] = useState<OrgTree[]>([]);
  const [loading, setLoading] = useState(false);

  /** 获取版本信息 */
  const getVersionInfo = async (currentVersion?: string) => {
    setLoading(true);
    try {
      const { data } = await getOrgTreeApi({ version: currentVersion });
      setTreeData(TransformTreeData(data.data?.tree || []));
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    getVersionInfo(version);
  }, [version]);

  return (
    <Drawer
      title={title}
      width={700}
      open={open}
      onClose={onClose}
      destroyOnHidden
    >
      <Spin spinning={loading}>
        <OrganizationTree
          treeData={treeData}
          refresh={() => {
            getVersionInfo();
          }}
          headerTitle='组织列表'
          showActionBtn={false}
        />
      </Spin>
    </Drawer>
  );
};

export default VersionInfoDrawer;
