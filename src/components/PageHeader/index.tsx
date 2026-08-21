/**
 * @description 页面头部
 */
import { FC } from 'react';

import styles from './index.module.less';

interface PageHeaderProps {
  title: string;
}

export const PageHeader: FC<PageHeaderProps> = ({ title }) => {
  return (
    <div className={styles.pageHeaderWrapper}>
      <div className={styles.title}>{title}</div>
    </div>
  );
};
