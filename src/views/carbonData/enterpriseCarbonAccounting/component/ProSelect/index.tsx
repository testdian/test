/**
 * @description proForm下拉选择框
 */
import { ProFormSelect, ProFormSelectProps } from '@ant-design/pro-components';
import I18N from '@src/lang/I18N';
import { FC } from 'react';

import { getYear } from '@/utils';

/** 今年 */
const currentYear = new Date().getFullYear();

export const ProSelect: FC<{ props: ProFormSelectProps }> = ({ props }) => {
  return <ProFormSelect allowClear={false} {...props} />;
};

/** 核算年度选择框 */
export const ProYearSelect: FC = () => {
  return (
    <ProFormSelect
      name='year'
      placeholder={I18N.carbonData.accountingYear}
      options={getYear().map(item => {
        return { label: item, value: item };
      })}
      initialValue={currentYear}
      allowClear={false}
      width={132}
    />
  );
};
