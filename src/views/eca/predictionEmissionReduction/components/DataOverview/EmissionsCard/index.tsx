import styles from './index.module.less';

interface EmissionsData {
  label: string;
  value: string | number;
  children?: EmissionsData[];
}

interface EmissionsCardProps {
  data: EmissionsData[];
  className?: string;
}

export const EmissionsCard: React.FC<EmissionsCardProps> = ({
  data,
  className,
}) => {
  return (
    <div className={`${styles.card} ${className || ''}`}>
      <div className={styles.cardContent}>
        {data.map(item => (
          <div className={styles.dataPointContainer}>
            <div className={styles.dataLabel}>{item.label}</div>
            <div className={styles.dataValue}>{item.value}</div>
            <div className={styles.dataUnit}>
              {item.children &&
                item.children?.map?.(children => {
                  return (
                    <div className={styles.childrenContainer}>
                      <div className={styles.dataLabel}>{children.label}</div>
                      <div className={styles.dataValue}>
                        {Number(children.value) >= 0 ? children.value : '-'}
                      </div>
                    </div>
                  );
                })}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};
