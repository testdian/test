/*
 * @@description:
 * @Author: lijinhai jinhai@carbonstop.net>
 * @Date: 2022-12-19 17:29:21
 * @LastEditors: ljh255 jinhai@carbonstop.net
 * @LastEditTime: 2023-03-28 20:23:46
 */
import { CSSProperties } from 'react';

import styles from './index.module.less';

export const Division = () => {
  return (
    <div className={styles.division}>
      <div />
    </div>
  );
};
export const H4Compont = ({
  children,
  style,
}: {
  children: string;
  style?: CSSProperties;
}) => {
  return (
    <h4 style={style || {}} className={styles.titleH4}>
      {children}
    </h4>
  );
};
export const H4CompontStyle = ({
  title,
  style,
}: {
  style?: CSSProperties;
  title: string;
}) => {
  return (
    <h4 style={{ ...style }} className={styles.titleH4}>
      {title}
    </h4>
  );
};
export const Median = (props: { text: string }) => {
  return <span>{props.text}</span>;
};
