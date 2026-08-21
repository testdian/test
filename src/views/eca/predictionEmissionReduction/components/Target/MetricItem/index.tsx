import React from 'react';

import styles from './index.module.less';

interface MetricItemProps {
  label: string;
  value: string | number | React.ReactNode;
  className?: string;
  valueClassName?: string;
}

export const MetricItem: React.FC<MetricItemProps> = ({
  label,
  value,
  className,
  valueClassName,
}) => {
  return (
    <div className={className}>
      <div className={styles.metricLabel}>{label}</div>
      <div className={valueClassName || styles.metricValue}>{value}</div>
    </div>
  );
};
