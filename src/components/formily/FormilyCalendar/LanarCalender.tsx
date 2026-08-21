import { Calendar, CalendarProps, Button } from 'antd';
import classNames from 'classnames';
import dayjs, { Dayjs } from 'dayjs';
import { HolidayUtil, Lunar } from 'lunar-typescript';
import React, { useEffect, useState, useMemo } from 'react';

import I18N from '@/lang/I18N';

import LunarCalendarHeader from './LunarCalendarHeader';
import TimeSelector from './TimeSelector';
import { useCalendarStyle } from './hook';
import { getHoliday } from './service';
import { LunarCalendarType } from './type';

const LunarCalendar: React.FC<
  LunarCalendarType & {
    selectedDate: dayjs.Dayjs;
    onTimeChange: (time: dayjs.Dayjs) => void;
    disabledDate: (current: Dayjs | null) => boolean;
    currentYear: number;
    nextYear: number;
    onAddTime: () => void;
  }
> = ({
  onDateChange,
  selectedDate,
  onTimeChange,
  disabledDate,
  currentYear,
  nextYear,
  onAddTime,
}) => {
  const { styles } = useCalendarStyle();

  // 高亮日期
  const [highlightDates, setHighlightDates] = useState<
    { date: string; type: string }[]
  >([]);
  useEffect(() => {
    getHoliday().then(({ data }) => {
      setHighlightDates(data?.data || []);
    });
  }, []);

  // 高亮日期映射
  const highlightMap = useMemo(() => {
    const map = new Map();
    highlightDates?.forEach(item => {
      map.set(item.date, item.type);
    });
    return map;
  }, [highlightDates]);

  /**
   * 渲染日历单元格
   * @param date
   * @param info
   */
  const cellRender: CalendarProps<Dayjs>['fullCellRender'] = (date, info) => {
    const formatDate = Lunar.fromDate(date.toDate());
    const lunar = formatDate.getDayInChinese();
    const solarTerm = formatDate.getJieQi();
    const holiday = HolidayUtil.getHoliday(
      date.get('year'),
      date.get('month') + 1,
      date.get('date'),
    );
    const displayHoliday =
      holiday?.getTarget() === holiday?.getDay() ? holiday?.getName() : '';

    const isDisabled = disabledDate(date);

    const dateStr = date.format('YYYY-MM-DD');
    const highlightType = highlightMap.get(dateStr);

    const isHoliday = highlightType === 'holiday';
    const isWorkday = highlightType === 'workday';
    const isWeekend =
      (date.day() === 0 || date.day() === 6) && !isHoliday && !isWorkday;

    let tag = null;
    if (highlightType === 'holiday')
      tag = <span className={styles.holidayTag}>休</span>;
    if (highlightType === 'workday')
      tag = <span className={styles.workdayTag}>班</span>;

    if (info.type === 'date') {
      return React.cloneElement(info.originNode, {
        ...info.originNode.props,
        className: classNames(styles.dateCell, {
          [styles.current]: selectedDate.isSame(date, 'date'),
          [styles.today]: date.isSame(dayjs(), 'date'),
          [styles.disabled]: isDisabled,
          [styles.weekend]: isWeekend,
          [styles.holiday]: isHoliday,
          [styles.workday]: isWorkday,
        }),
        children: (
          <div className={styles.text} style={{ position: 'relative' }}>
            {date.get('date')}
            {tag}
            {info.type === 'date' && (
              <div className={styles.lunar}>
                {displayHoliday || solarTerm || lunar}
              </div>
            )}
          </div>
        ),
        onClick: isDisabled
          ? undefined
          : (e: any) => {
              info.originNode.props.onClick?.(e);
              onDateChange?.(date);
            },
      });
    }

    if (info.type === 'month') {
      const dateForMonth = Lunar.fromDate(
        new Date(date.get('year'), date.get('month')),
      );
      const month = dateForMonth.getMonthInChinese();
      return (
        <div
          className={classNames(styles.monthCell, {
            [styles.monthCellCurrent]: selectedDate.isSame(date, 'month'),
          })}
        >
          {date.get('month') + 1}月（{month}月）
        </div>
      );
    }
    return info.originNode;
  };

  const handleDateChange: CalendarProps<Dayjs>['onSelect'] = date => {
    onDateChange?.(date);
  };

  // @ts-ignore
  const headerRender = ({ value, onChange, onTypeChange }) => {
    return (
      <LunarCalendarHeader
        dateType='normal'
        currentYear={currentYear}
        nextYear={nextYear}
        headerValue={value}
        type='month'
        onChange={onChange}
        onTypeChange={onTypeChange}
      />
    );
  };
  return (
    <div className={styles.container}>
      <div className={styles.wrapper}>
        <Calendar
          fullCellRender={cellRender}
          fullscreen={false}
          onSelect={handleDateChange}
          disabledDate={disabledDate}
          headerRender={headerRender}
        />
      </div>
      <div className={styles.timeSelectorContainer}>
        <TimeSelector value={selectedDate} onChange={onTimeChange} />
        <Button
          type='primary'
          size='small'
          className={styles.addTimeButton}
          onClick={onAddTime}
        >
          {I18N.utils.ok}
        </Button>
      </div>
    </div>
  );
};

export default LunarCalendar;
