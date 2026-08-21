import { Row } from 'antd';
import { FC } from 'react';

import { CommonColumnsActionType } from '@/views/eca/util/actionType';

import styles from './EnergyEfficiencyCard.module.less';
import { EnergyEfficiencyCardItem } from './EnergyEfficiencyCardItem';
import { MeasuresPageListData } from '../type';

export const EnergyEfficiencyCard: FC<{
  energyEfficiencyData: MeasuresPageListData[];
  handelCardClick: (
    actionType: CommonColumnsActionType,
    record: MeasuresPageListData,
  ) => void;
}> = ({ energyEfficiencyData, handelCardClick }) => {
  return (
    <Row gutter={[24, 24]} className={styles.energyEfficiencyContainer}>
      {energyEfficiencyData?.map(item => {
        return (
          <EnergyEfficiencyCardItem
            item={item}
            key={item.measureName}
            handelCardClick={handelCardClick}
          />
        );
      })}
    </Row>
  );
};
