import { DatePicker } from 'antd';
import enUS from 'antd/es/date-picker/locale/en_US';
import dayjs from 'dayjs';
import { TableRenderProps } from 'table-render';

import I18N from '@/lang/I18N';

import { QUARTER_OPTIONS, MONTH_OPTIONS } from './schemas';
import { EmissionSourceListResponse } from './type';

export const fillDataColumns = (
  handleDateChange: (
    date: dayjs.Dayjs,
    record: EmissionSourceListResponse,
  ) => void,
  isEn?: boolean,
): TableRenderProps<EmissionSourceListResponse>['columns'] => [
  {
    title: I18N.eca.emissionSourceName,
    dataIndex: 'sourceName',
  },
  {
    title: '数据收集周期',
    dataIndex: 'dataPeriodIdx',
    width: 120,
    render: (_, record) => {
      const { dataPeriod, dataPeriodIdx } = record || {};

      // 按年度
      if (dataPeriod === 1) {
        return '年度';
      }

      // 按季度
      if (dataPeriod === 2) {
        const quarterLabel = QUARTER_OPTIONS.find(
          item => item.value === String(dataPeriodIdx),
        )?.label;
        return quarterLabel ? `${quarterLabel}` : '季度';
      }

      // 按月份
      if (dataPeriod === 3) {
        const monthLabel = MONTH_OPTIONS.find(
          item => item.value === String(dataPeriodIdx),
        )?.label;
        return monthLabel ? `${monthLabel}` : '月份';
      }

      return '-';
    },
  },
  {
    title: I18N.eca.informant,
    dataIndex: 'roleNames',
    width: 300,
  },
  {
    title: I18N.eca.deadline,
    dataIndex: 'fillDeadline',
    render: (text, record) => {
      return (
        <DatePicker
          style={{ width: '100%' }}
          value={text ? dayjs(`${text}`, 'YYYY-MM-DD HH:mm:ss') : null}
          showTime
          onChange={date => handleDateChange(date, record)}
          showNow={false}
          placeholder={I18N.eca.pleaseSelectADate}
          locale={isEn ? enUS : undefined}
        />
      );
    },
  },
];
