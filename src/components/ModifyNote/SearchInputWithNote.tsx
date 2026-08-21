import { Input, InputProps } from 'antd';

import styles from './index.module.less';
import { ModifyNote } from './index';

export const SearchInputWithNote = ({
  note,
  ...props
}: InputProps & { note?: string }) => {
  return (
    <div className={styles.searchWrap}>
      <Input {...props} />
      {note && <ModifyNote content={note} />}
    </div>
  );
};
