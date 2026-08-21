/**
 * @description GHG数据卡片
 */
import { FC } from 'react';

import { TrendChartResp } from '@/sdks_v2/new/computationV2ApiDocs';

import DataCard from './DataCard';
import style from './index.module.less';
import { COMMON_COLOR } from '../../constant';

const GHGCards: FC<{ options?: TrendChartResp }> = ({ options }) => {
  return (
    <div className={style.flexCards}>
      {options?.dataX?.map((title, index) => (
        <div className={style.ghgCard} key={title}>
          <div
            className={style.ghgTitle}
            style={{ background: COMMON_COLOR[index] }}
          >
            {title}
          </div>
          <DataCard option={options?.dataY || []} index={index} />
        </div>
      ))}
    </div>
  );
};

export default GHGCards;
