import { LeftOutlined, RightOutlined } from '@ant-design/icons';
import { Button, DatePicker } from 'antd';
import dayjs from 'dayjs';
import React from 'react';

import styles from './index.module.less';

const minYear = 2019;
const Format = 'YYYY';
const minDate = dayjs(`${minYear}`, Format);
const maxDate = dayjs(`${new Date().getFullYear()}`, Format);
const YearSwitcher: React.FC<{
  value: number;
  onYearChange?: (value: number) => void;
}> = ({ onYearChange, value }) => {
  // 处理年份切换
  const changeYear = (newYear: number) => {
    onYearChange?.(newYear);
  };

  // 上一年
  const handlePreviousYear = () => changeYear(value - 1);

  // 下一年
  const handleNextYear = () => changeYear(value + 1);

  return (
    <div
      style={{
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
      }}
    >
      <Button
        icon={<LeftOutlined />}
        onClick={handlePreviousYear}
        disabled={value <= minYear}
        className={styles.leftButton}
      />

      <DatePicker
        picker='year'
        value={dayjs(`${value}`, Format)}
        minDate={minDate}
        maxDate={maxDate}
        allowClear={false}
        style={{ width: 120 }}
        onChange={(date, dateString) => changeYear(Number(dateString))}
      />

      <Button
        icon={<RightOutlined />}
        onClick={handleNextYear}
        disabled={value >= new Date().getFullYear()}
        className={styles.rightButton}
      />
    </div>
  );
};

export default YearSwitcher;
