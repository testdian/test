import { CloseOutlined } from '@ant-design/icons';
import { Field } from '@formily/core';
import { connect, mapProps, mapReadPretty, useField } from '@formily/react';
import { Tag } from 'antd';
import dayjs, { Dayjs } from 'dayjs';
import { FC, useEffect, useState } from 'react';

import I18N from '@/lang/I18N';
import { Toast } from '@/utils';

import LunarCalendar from './LanarCalender';
import { useCalendarStyle } from './hook';
import { LunarDatePickerType } from './type';

const FormilyCalendar: FC<LunarDatePickerType> = ({ value, onChange }) => {
  const { styles } = useCalendarStyle();
  const field = useField<Field>();
  const isReadPretty = field.readPretty;

  const [selectedDate, setSelectedDate] = useState<dayjs.Dayjs>(dayjs());
  const [timeItems, setTimeItems] = useState<dayjs.Dayjs[]>([]);

  // 获取当前年份和下一年
  const currentYear = dayjs().year();
  const nextYear = currentYear + 1;

  // 设置日期范围：仅允许选择当前年份和下一年
  const disabledDate = (current: dayjs.Dayjs | null) => {
    if (!current) return false;
    const year = current.year();
    return year < currentYear || year > nextYear;
  };

  const handleDateChange = (date: dayjs.Dayjs) => {
    setSelectedDate(date);
  };

  const handleTimeChange = (time: dayjs.Dayjs) => {
    setSelectedDate(time);
  };

  const handleAddTime = () => {
    // 检查是否已有相同的时间
    const isDuplicate = timeItems.some(item =>
      item.isSame(selectedDate, 'second'),
    );
    if (isDuplicate) {
      Toast('warning', I18N.components.sameHasBeenSelected);
    }

    if (!isDuplicate) {
      setTimeItems([...(timeItems as dayjs.Dayjs[]), selectedDate]);
      onChange?.(
        [...timeItems, selectedDate]?.map?.(item =>
          (item as Dayjs)?.format('YYYY-MM-DD HH:mm:ss'),
        ),
      );
    }
  };

  const handleRemoveTime = (index: number) => {
    const newTimeItems = timeItems.filter((_, i) => i !== index);
    onChange?.(newTimeItems as unknown as string[]);
  };

  useEffect(() => {
    if (value) {
      const newTimeItems = value?.map(item => dayjs(item));
      setTimeItems(newTimeItems);
    }
  }, [value]);

  return (
    <div className={styles.datePickerWrapper}>
      {!isReadPretty && (
        <LunarCalendar
          value={value}
          onChange={onChange}
          onDateChange={handleDateChange}
          selectedDate={selectedDate}
          onTimeChange={handleTimeChange}
          disabledDate={disabledDate}
          currentYear={currentYear}
          nextYear={nextYear}
          onAddTime={handleAddTime}
        />
      )}
      {timeItems.length > 0 && (
        <div className={styles.timeItemsContainer}>
          <div className={styles.timeItemsList}>
            {timeItems.map((item, index) => (
              <Tag
                className={styles.timeItemTag}
                color='blue'
                key={item.toString()}
              >
                <span>{dayjs(item)?.format('YYYY-MM-DD HH:mm:ss')}</span>
                {!isReadPretty && (
                  <CloseOutlined onClick={() => handleRemoveTime(index)} />
                )}
              </Tag>
            ))}
          </div>
        </div>
      )}
    </div>
  );
};

export default connect(
  FormilyCalendar,
  mapProps(),
  mapReadPretty(FormilyCalendar),
);
