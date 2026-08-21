import { Dayjs } from 'dayjs';

export type LunarDatePickerMode = 'lunar' | 'normal';

export type DateType = 'lunar' | 'normal';

export type LunarDatePickerType = {
  value?: Dayjs[] | string[];
  onChange?: (value: string[]) => void;
  onDateTypeChange?: (type: DateType) => void;
  onDateChange?: (value: Dayjs) => void;
};

export type CalenderHeaderType = {
  headerValue: CalenderHeaderValueType;
  type: 'year' | 'month';
  onChange: (date: CalenderHeaderValueType) => void;
  onTypeChange: (type: 'year' | 'month') => void;
  dateType: DateType;
  // onDateTypeChange: (value: DateType) => void;
};

export type CalenderOptions = {
  label: string;
  value: number;
};

export type LunarCalendarType = LunarDatePickerType;

export interface CalenderHeaderValueType extends Dayjs {
  localeData?: any;
}
