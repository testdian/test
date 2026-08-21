import { Select, SelectProps } from 'antd';

import styles from './index.module.less';
import { ModifyNote } from './index';

export const SelectWithNote = ({
  note,
  className,
  style,
  ...props
}: SelectProps & { note?: string }) => {
  return (
    <div className={`${styles.searchWrap} ${className || ''}`} style={style}>
      <Select {...props} style={{ flex: 1, minWidth: 0, ...props.style }} />
      {note && <ModifyNote content={note} />}
    </div>
  );
};
