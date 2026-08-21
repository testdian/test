/*
 * @@description:
 * @Author: liuxinxin xinxin@carbonstop.net
 * @Date: 2023-03-10 15:02:24
 * @LastEditors: liuxinxin xinxin@carbonstop.net
 * @LastEditTi me: 2023-03-10 15:16:39
 */
import { Field } from '@formily/core';
import { connect, mapProps, mapReadPretty, useField } from '@formily/react';
import classNames from 'classnames';

import styles from './index.module.less';

type SelectButtonProps = {
  value: number | string;
  options: { value: number | string; label: number | string }[];
  disabled: boolean;
  onChange: (value: number | string) => void;
};
function SelectButton({
  value,
  options,
  disabled,
  onChange,
}: SelectButtonProps) {
  return (
    <div className={styles.radioGroupOptionWrapper}>
      {options.map(({ value: optionValue, label }) => (
        <div
          className={classNames(styles.normalRadioButton, {
            [styles.radioChecked]: value === optionValue,
            [styles.radioDisabled]: disabled,
          })}
          key={optionValue}
          onClick={() => {
            if (!disabled) {
              onChange(optionValue);
            }
          }}
        >
          <span>{label}</span>
        </div>
      ))}
    </div>
  );
}
const SelectButtonReadPretty = (props: { value: number }) => {
  const field = useField<Field>();
  const options = field.dataSource ? field.dataSource : [];
  const selectedItem = options.find(option => option.value === props.value);
  return (
    <div className={styles.readPretty}>
      {selectedItem?.label ? <span>{selectedItem.label}</span> : '-'}
    </div>
  );
};
export default connect(
  SelectButton,
  mapProps({ dataSource: 'options' }, props => {
    return {
      ...props,
    };
  }),
  mapReadPretty(SelectButtonReadPretty),
);
