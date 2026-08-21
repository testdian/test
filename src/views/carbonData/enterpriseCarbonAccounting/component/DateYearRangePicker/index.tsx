/**
 * @description proForm时间筛选框
 */
import { ProFormDateYearRangePicker } from '@ant-design/pro-components';
import I18N from '@src/lang/I18N';
import moment, { Moment } from 'moment';
import { FC } from 'react';

/** 今年 */
const currentYear = new Date().getFullYear();

export const DateYearRangePicker: FC = () => {
  const disabledDate = (current: { year: () => number }) => {
    const year = current.year();
    return year < 1990 || year > currentYear;
  };

  return (
    <ProFormDateYearRangePicker
      name={['date']}
      width={256}
      placeholder={[I18N.carbonData.startingYear, I18N.carbonData.endYear]}
      initialValue={[moment().subtract(2, 'years'), moment().format('YYYY')]}
      allowClear={false}
      fieldProps={{
        disabledDate,
      }}
      transform={(value: Moment[]) => {
        return {
          startYear: moment(value?.[0]).format('YYYY'),
          endYear: moment(value?.[1]).format('YYYY'),
        };
      }}
    />
  );
};
