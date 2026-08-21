/**
 * @description flex数据卡片
 */
import classNames from 'classnames';
import { FC } from 'react';

import downIcon from '@/image/carbonDataIcon/down-icon.svg';
import upIcon from '@/image/carbonDataIcon/up-icon.svg';

import style from './index.module.less';
import { GROWTH } from '../../constant';

type OptionType = {
  label: string;
  unit: string;
  value?: number | string;
  growth?: number;
};

const FlexCards: FC<{ options: OptionType[] }> = ({ options }) => {
  return (
    <div className={style.flexCards}>
      {options?.map(item => (
        <div className={style.flexCard} key={item.label}>
          <div className={style.label}>
            {item.label || '-'}
            <span className={style.unit}> {item.unit || '-'}</span>
          </div>
          <div
            className={classNames(style.value, {
              [style.redValue]:
                item?.growth === GROWTH.UP && Number(item.value) > 0,
              [style.greenValue]:
                item?.growth === GROWTH.DOWN && Number(item.value) < 0,
            })}
          >
            {item?.growth === GROWTH.UP && Number(item.value) > 0 && '+'}
            {item.value ?? '-'}
            {item?.growth && item.value ? (
              <img
                src={item?.growth === GROWTH.UP ? upIcon : downIcon}
                alt=''
              />
            ) : (
              ''
            )}
          </div>
        </div>
      ))}
    </div>
  );
};

export default FlexCards;
