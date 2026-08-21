/**
 * @description antd日期组件-支持多语言
 */

import { DatePicker } from 'antd';
import { RangePickerProps } from 'antd/lib/date-picker';
import dayjs, { Dayjs } from 'dayjs';

import { AntProvider } from '@/components/AntdProvider';

export const RangePicker = (
  props: RangePickerProps & {
    value?: [Dayjs | null | undefined, Dayjs | null | undefined];
  },
) => {
  const { value } = props;
  const [start, end] = value || [null, null];
  const formatValue: [Dayjs | null | undefined, Dayjs | null | undefined] = [
    start ? dayjs(start) : null,
    end ? dayjs(end) : null,
  ];

  return (
    <AntProvider>
      <DatePicker.RangePicker {...props} value={formatValue} />
    </AntProvider>
  );
};
