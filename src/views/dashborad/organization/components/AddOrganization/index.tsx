/**
 * @description: 新增组织
 */
import { FC, PropsWithChildren, useState } from 'react';

import { OrgDrawer } from '../../Info/OrgDrawer';
import { OrgTree } from '../../type';

interface AddOrganizationProps {
  initPid: string;
  refresh: () => void;
  treeData: OrgTree[];
}

export const AddOrganization: FC<
  PropsWithChildren<AddOrganizationProps>
> = props => {
  const { children, initPid, refresh, treeData } = props;
  const [visible, setVisible] = useState(false);
  return (
    <div>
      <div onClick={() => setVisible(true)}>{children}</div>

      <OrgDrawer
        open={visible}
        onClose={() => setVisible(false)}
        refresh={refresh}
        initPid={initPid}
        treeData={treeData}
      />
    </div>
  );
};
