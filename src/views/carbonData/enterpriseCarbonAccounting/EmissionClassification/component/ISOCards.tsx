/**
 * @description ISO数据卡片
 */
import { Col, Row } from 'antd';
import { FC } from 'react';

import { TrendChartResp } from '@/sdks_v2/new/computationV2ApiDocs';

import DataCard from './DataCard';
import style from './index.module.less';
import { COMMON_COLOR } from '../../constant';

const ISOCards: FC<{ options?: TrendChartResp }> = ({ options }) => {
  return (
    <Row gutter={[16, 24]}>
      {options?.dataX?.map((title, index) => (
        <Col span={8} key={title}>
          <div
            className={style.isoTitle}
            style={{ background: COMMON_COLOR[index] }}
          >
            {title}
          </div>
          <DataCard option={options?.dataY || []} index={index} />
        </Col>
      ))}
    </Row>
  );
};

export default ISOCards;
