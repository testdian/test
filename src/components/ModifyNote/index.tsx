/**
 * @description 原型修改标注：黄色位置图标，点击显示修改说明
 */
import { EnvironmentOutlined } from '@ant-design/icons';
import { Popover } from 'antd';
import { MouseEvent, ReactNode } from 'react';

import styles from './index.module.less';

export const ModifyNote = ({ content }: { content: string }) => {
  const stopClick = (event: MouseEvent<HTMLElement>) => {
    event.stopPropagation();
  };

  return (
    <Popover content={content} trigger='click' placement='top'>
      <EnvironmentOutlined className={styles.icon} onClick={stopClick} />
    </Popover>
  );
};

export const FormLabelWithNote = ({
  label,
  note,
}: {
  label: string;
  note: string;
}) => {
  return (
    <span className={styles.labelWrap}>
      {label}
      <ModifyNote content={note} />
    </span>
  );
};

export const PageActionWithNote = ({
  children,
  note,
}: {
  children: ReactNode;
  note: string;
}) => {
  return (
    <span className={styles.pageActionWithNote}>
      {children}
      <ModifyNote content={note} />
    </span>
  );
};
