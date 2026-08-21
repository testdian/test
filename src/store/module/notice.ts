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
  count: number;
}

// /FIXME - 使用时删除notice
const initialState: NoticeState = {
  count: 0,
};

export interface NoticeKeyAndIndexAndCount {
  key: keyof NoticeState;
  index: number;
  count: number;
}

const systemNotices = createSlice({
  name: 'systemNotices',
  initialState,
  reducers: {
    updateCount: (state, action: PayloadAction<number>) => {
      return {
        ...state,
        count: action.payload,
      };
    },
  },
});
export const noticeActions = systemNotices.actions;
export default systemNotices.reducer;
