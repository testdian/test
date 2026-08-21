import { Select } from 'antd';
import { Dayjs } from 'dayjs';
import { Lunar } from 'lunar-typescript';
import { FC, useEffect, useState } from 'react';

import { CALENDER_DATE_TYPE } from './constans';
import styles from './index.module.less';
import {
  CalenderHeaderType,
  CalenderOptions,
  DateType,
  CalenderHeaderValueType,
} from './type';

const LunarCalendarHeader: FC<
  CalenderHeaderType & {
    currentYear: number;
    nextYear: number;
  }
> = ({ headerValue, onChange, dateType, currentYear, nextYear }) => {
  const [monthOptions, setMonthOptions] = useState<CalenderOptions[]>([]);
  const [options, setOptions] = useState<CalenderOptions[]>([]);
  const [month, setMonth] = useState<number>(0);
  const [year, setYear] = useState<number>(0);

  function getYearLabel(year: number, dateType: DateType) {
    const d = Lunar.fromDate(new Date(year + 1, 0));
    return dateType === CALENDER_DATE_TYPE.lunar
      ? `${d.getYearInChinese()}年（${d.getYearInGanZhi()}${d.getYearShengXiao()}年）`
      : `${d.getYear()}年`;
  }

  function getMonthLabel(month: number, value: Dayjs, dateType: DateType) {
    const d = Lunar.fromDate(new Date(value.year(), month));
    const lunar = d.getMonthInChinese();
    return `${month + 1}月${
      dateType === CALENDER_DATE_TYPE.lunar ? `（${lunar}月）` : ''
    }`;
  }

  function formatOptions(value: CalenderHeaderValueType, dateType: DateType) {
    const start = 0;
    const end = 12;

    let current = value.clone();
    const months = [];
    for (let i = 0; i < 12; i++) {
      current = current.month(i);
      months.push(current.format('MMM'));
    }

    const monthOptions = [];
    for (let i = start; i < end; i++) {
      monthOptions.push({
        label: getMonthLabel(i, value, dateType),
        value: i,
      });
    }
    setMonthOptions(monthOptions);

    const year = value.year();
    const month = value.month();
    setMonth(month);
    setYear(year);

    // 只生成当前年份和下一年的选项
    const options = [
      {
        label: getYearLabel(currentYear, dateType),
        value: currentYear,
      },
      {
        label: getYearLabel(nextYear, dateType),
        value: nextYear,
      },
    ];
    setOptions(options);
  }

  useEffect(() => {
    formatOptions(headerValue, dateType);
  }, [headerValue, dateType, currentYear, nextYear]);

  return (
    <div className={styles.calenderHeader}>
      <div className={styles.selectGroup}>
        <Select
          value={year}
          options={options}
          onChange={newYear => {
            const now = headerValue.clone().year(newYear);
            onChange(now);
          }}
        />
        <Select
          value={month}
          options={monthOptions}
          onChange={newMonth => {
            const now = headerValue.clone().month(newMonth);
            onChange(now);
          }}
        />
      </div>
    </div>
  );
};

export default LunarCalendarHeader;
