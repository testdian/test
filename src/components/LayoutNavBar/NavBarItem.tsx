/*
 * @@description: 导航栏元素
 * @Author: qifeng qifeng@carbonstop.net
 * @Date: 2022-12-05 15:16:40
 * @LastEditors: qifeng qifeng@carbonstop.net
 * @LastEditTime: 2022-12-07 16:21:47
 */
import { GithubOutlined, BellOutlined } from '@ant-design/icons';
import { Badge } from 'antd';
import classNames from 'classnames';
import { memo } from 'react';

import styles from './navBarItem.module.less';

interface NavBarItemProps {
  onClick: () => void;
  className?: string;
  icon: string;
  count: number;
  overflowCount?: number;
}

function SwtichIcon({ icon }: { icon: string }) {
  if (icon === 'github') {
    return <GithubOutlined />;
  }

  if (icon === 'bell') {
    return <BellOutlined />;
  }

  return null;
}

function NavBarItem({ className, onClick, icon, ...badge }: NavBarItemProps) {
  return (
    <div className={classNames(className, styles.wrapper)} onClick={onClick}>
      <Badge {...badge} style={{ boxShadow: 'none' }}>
        <div className={styles.iconWrapper}>
          <SwtichIcon icon={icon} />
        </div>
      </Badge>
    </div>
  );
}

export default memo(NavBarItem);
