/* eslint-disable no-param-reassign */
/*
 * @@description: 通知消息
 */
import { createSlice } from '@reduxjs/toolkit';
import type { PayloadAction } from '@reduxjs/toolkit';
import { BlockProps } from 'antd/lib/typography/Base';

export interface NoticeMessageModule {
  count: number;
  title: string;
  read?: number;
  list: NoticeMessageItem[];
}

export interface NoticeMessageItem {
  title: string;
  message: string;
  route: string;
  time: string;
  read: number;
  extra: {
    text: string;
    level: BlockProps['type'];
  };
}

export interface NoticeState {
  count: [];
  isSubmit: boolean;
}

// /FIXME - 使用时删除notice
const initialState: NoticeState = {
  count: [],
  isSubmit: false,
};

export interface NoticeKeyAndIndexAndCount {
  key: keyof NoticeState;
  index: number;
  count: any[];
  isSubmit: boolean;
}

const fillDataSouce = createSlice({
  name: 'fillDataSouce',
  initialState,
  reducers: {
    updateCount: (state, action: PayloadAction<[]>) => {
      return {
        ...state,
        count: action.payload,
      };
    },
    changeSubmitFalse: state => {
      return {
        ...state,
        isSubmit: false,
      };
    },
    changeSubmitTrue: state => {
      return {
        ...state,
        isSubmit: true,
      };
    },
  },
});
export const fillDataSouceActions = fillDataSouce.actions;
export default fillDataSouce.reducer;
