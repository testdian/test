import { ReactNode } from 'react';

import styles from '../styles.module.less';

type PageActionLabelProps = {
  icon: ReactNode;
  children: ReactNode;
};

/** Page 头部操作按钮文案（避免嵌套 Button，统一图标间距） */
export function PageActionLabel({ icon, children }: PageActionLabelProps) {
  return (
    <div className={styles.pageActionLabel}>
      <span className={styles.pageActionIcon}>{icon}</span>
      <span>{children}</span>
    </div>
  );
}
