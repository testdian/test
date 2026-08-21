import { FC, PropsWithChildren, ReactNode } from 'react';

import styles from './index.module.less';

const ChartCard: FC<
  PropsWithChildren<{
    title?: ReactNode;
    unit?: string;
    extra?: ReactNode;
  }>
> = ({ title, unit, extra, children }) => {
  return (
    <div className={styles.chartCard}>
      <div className={styles.cardHeader}>
        <div className={styles.cardTitle}>{title}</div>
        <div className={styles.cardExtra}>
          {unit && <span className={styles.cardUnit}>单位：{unit}</span>}
          {extra}
        </div>
      </div>
      {children}
    </div>
  );
};

export default ChartCard;
