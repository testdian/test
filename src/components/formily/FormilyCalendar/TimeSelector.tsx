import classNames from 'classnames';
import { Dayjs } from 'dayjs';
import React, { useState, useEffect, FC } from 'react';

import { useCalendarStyle } from './hook';

interface TimeSelectorProps {
  value: Dayjs;
  onChange: (time: Dayjs) => void;
}

const TimeSelector: FC<TimeSelectorProps> = ({ value, onChange }) => {
  const { styles } = useCalendarStyle();
  const [hours, setHours] = useState<number[]>([]);
  const [minutes, setMinutes] = useState<number[]>([]);
  const [seconds, setSeconds] = useState<number[]>([]);
  const [selectedHour, setSelectedHour] = useState<number>();
  const [selectedMinute, setSelectedMinute] = useState<number>();
  const [selectedSecond, setSelectedSecond] = useState<number>();

  // 初始化时分秒数据
  useEffect(() => {
    const hoursData = Array.from({ length: 24 }, (_, i) => i);
    const minutesData = Array.from({ length: 60 }, (_, i) => i);
    const secondsData = Array.from({ length: 60 }, (_, i) => i);

    setHours(hoursData);
    setMinutes(minutesData);
    setSeconds(secondsData);
  }, []);

  // 监听值变化，更新选中状态
  useEffect(() => {
    setSelectedHour(value.hour());
    setSelectedMinute(value.minute());
    setSelectedSecond(value.second());
  }, [value]);

  // 处理小时点击
  const handleHourClick = (hour: number) => {
    setSelectedHour(hour);
    onChange(value.hour(hour));
  };

  // 处理分钟点击
  const handleMinuteClick = (minute: number) => {
    setSelectedMinute(minute);
    onChange(value.minute(minute));
  };

  // 处理秒钟点击
  const handleSecondClick = (second: number) => {
    setSelectedSecond(second);
    onChange(value.second(second));
  };

  // 格式化数字为两位数
  const formatNumber = (num: number) => {
    return num < 10 ? `0${num}` : num.toString();
  };

  return (
    <div className={styles.timeSelector}>
      <div className={styles.timeColumn}>
        <div className={styles.timeLabel}>时</div>
        <div className={styles.timeWheel}>
          {hours.map(hour => (
            <div
              key={hour}
              className={classNames(styles.timeItem, {
                [styles.timeItemSelected]: hour === selectedHour,
              })}
              onClick={() => handleHourClick(hour)}
            >
              {formatNumber(hour)}
            </div>
          ))}
        </div>
      </div>

      <div className={styles.timeColumn}>
        <div className={styles.timeLabel}>分</div>
        <div className={styles.timeWheel}>
          {minutes.map(minute => (
            <div
              key={minute}
              className={classNames(styles.timeItem, {
                [styles.timeItemSelected]: minute === selectedMinute,
              })}
              onClick={() => handleMinuteClick(minute)}
            >
              {formatNumber(minute)}
            </div>
          ))}
        </div>
      </div>

      <div className={styles.timeColumn}>
        <div className={styles.timeLabel}>秒</div>
        <div className={styles.timeWheel}>
          {seconds.map(second => (
            <div
              key={second}
              className={classNames(styles.timeItem, {
                [styles.timeItemSelected]: second === selectedSecond,
              })}
              onClick={() => handleSecondClick(second)}
            >
              {formatNumber(second)}
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default TimeSelector;
