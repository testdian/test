/**
 * @description 共用数据卡片
 */
import I18N from '@src/lang/I18N';
import { Divider } from 'antd';
import classNames from 'classnames';
import { FC } from 'react';

import downIcon from '@/image/carbonDataIcon/down-icon.svg';
import upIcon from '@/image/carbonDataIcon/up-icon.svg';
import { Classify } from '@/sdks_v2/new/computationV2ApiDocs';

import style from './index.module.less';
import { PERCENT } from '../../constant';

/** 获取对应值 */
const getValue = (option: Classify[], currentName: string, index: number) => {
  const currentValue = option?.find(({ name }) => name === currentName)
    ?.value?.[index];
  return currentValue || '';
};

/** 获取同比文案 */
const getPercentText = (isUp: string) => {
  let percentText;
  switch (isUp) {
    case PERCENT.UP:
      percentText = I18N.carbonData.increase;
      break;
    case PERCENT.DOWN:
      percentText = I18N.carbonData.decline;
      break;
    default:
      percentText = '';
      break;
  }
  return percentText;
};

const DataCard: FC<{ option: Classify[]; index: number }> = ({
  option,
  index,
}) => {
  /** 排放量 */
  const emission = getValue(option, I18N.carbonData.emissions, index);

  /** 上一年排放量 */
  const lastEmission = getValue(option, I18N.carbonData.lastYear, index);

  /** 同比值 */
  const percent = getValue(
    option,
    I18N.carbonData.comparedToTheSamePeriodLastYear,
    index,
  );

  /** 是否增长 */
  const isUp = getValue(option, I18N.carbonData.whetherToIncrease, index);

  return (
    <div className={style.dataCard}>
      <div className={style.dataPart}>
        <div className={style.data}>
          <div className={style.label}>{I18N.carbonData.emissions}</div>
          <div className={style.value}>{emission || '-'}</div>
        </div>
        <Divider type='vertical' className={style.divider} />
        <div className={style.data}>
          <div className={style.label}>{I18N.carbonData.lastYear}</div>
          <div className={style.value}>{lastEmission || '-'}</div>
        </div>
      </div>
      <div className={style.percent}>
        <span>
          {I18N.carbonData.yoY}
          {Number(percent) ? getPercentText(isUp) : ''}
        </span>
        <span
          className={classNames(style.percentValue, {
            [style.percentRed]: isUp === PERCENT.UP && Number(percent) > 0,
            [style.percentGreen]: isUp === PERCENT.DOWN && Number(percent) < 0,
          })}
        >
          {percent ? `${Math.abs(Number(percent))}%` : '-%'}
        </span>
        {Number(percent) && isUp && isUp !== PERCENT.ZERO ? (
          <img src={isUp === PERCENT.UP ? upIcon : downIcon} alt='' />
        ) : (
          ''
        )}
      </div>
    </div>
  );
};

export default DataCard;
