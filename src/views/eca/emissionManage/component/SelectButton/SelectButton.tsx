/*
 * @@description:
 * @Author: ljh255 jinhai@carbonstop.net
 * @Date: 2023-02-28 19:34:01
 * @LastEditors: liuxinxin xinxin@carbonstop.net
 * @LastEditTime: 2023-04-14 11:58:10
 */
import { Field } from '@formily/core';
import { useField } from '@formily/react';
// import selectImg from '@image/tabSelect.png';
import classNames from 'classnames';

import { IconFont } from '@/components/IconFont';

import styles from './index.module.less';
import { Paifangyinxi, Xinjianyinzi } from './svg';

export const SelectButton = (props: {
  enums: { label: string; value: string; icon: string }[];
  disabled: boolean;
  onChange: (value: string) => void;
}) => {
  const { onChange, enums, disabled } = props;
  const filed = useField<Field>();
  const culShow = () => {
    return window.location.pathname.indexOf('show') >= 0;
  };
  return (
    <div className={styles.buttonSelectContainer}>
      {enums?.map(({ value: optionValue, label, icon }) =>
        !culShow() ? (
          <div
            className={classNames(styles.defaultBtn, {
              [styles.activeBtn]: filed.value === optionValue,
              [styles.disabledBtn]: disabled,
            })}
            key={optionValue}
            onClick={() => {
              if (!disabled) {
                onChange(optionValue);
              }
            }}
          >
            {/* <IconFont className={styles.icon} icon={icon} /> */}
            <div className={styles.icon}>
              {icon.indexOf('baifangyinzi') >= 0 ? (
                <Paifangyinxi />
              ) : (
                <Xinjianyinzi />
              )}
            </div>

            <span>{label}</span>
            {filed.value === optionValue && (
              <IconFont
                className={styles.selectImg}
                icon='icon-icon-chenggong1'
              />
            )}
          </div>
        ) : (
          <div
            className={classNames(styles.defaultBtn, {
              [styles.disabledBtn]: disabled,
              [styles.displayBtn]: filed.value !== optionValue,
            })}
            key={optionValue}
            onClick={() => {
              if (!disabled) {
                onChange(optionValue);
              }
            }}
          >
            {/* <IconFont className={styles.icon} icon={icon} /> */}
            <div className={styles.icon}>
              {icon.indexOf('baifangyinzi') >= 0 ? (
                <Paifangyinxi />
              ) : (
                <Xinjianyinzi />
              )}
            </div>
            <span>{label}</span>
          </div>
        ),
      )}
    </div>
  );
};
