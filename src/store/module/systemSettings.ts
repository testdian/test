/*
 * @@description: 系统配置
 * @Author: qifeng qifeng@carbonstop.net
 * @Date: 2022-12-06 15:38:59
 * @LastEditors: qifeng qifeng@carbonstop.net
 * @LastEditTime: 2023-02-03 11:36:53
 */
import { createSlice } from '@reduxjs/toolkit';
import type { PayloadAction } from '@reduxjs/toolkit';

// import { AliasToken } from 'antd/es/theme/interface';
import AdminConfig, { Config, MenuTheme } from '@/config';
import { Colors } from '@/styles/var';
import LocalStore from '@/utils/store';

export interface Settings {
  fixedHeader: boolean;

  layout: Config['layout'];

  theme: MenuTheme;

  contentWidth: Config['contentWidth'];

  colorWeak: boolean;
  /** // todo 系统色调 antdV5 */
  // colorVars: Partial<AliasToken>;
  colorVars: typeof Colors;
}

const SETTINGS_KEY = 'CarbonStop-DCT-Admin-Settings';

const localSettings = LocalStore.getValue<Settings>(SETTINGS_KEY) || {};

const initialState: Settings = {
  fixedHeader: AdminConfig.fixedHeader,

  layout: AdminConfig.layout,

  theme: AdminConfig.theme,

  contentWidth: AdminConfig.contentWidth,

  colorWeak: AdminConfig.colorWeak,
  colorVars: Colors,
  ...localSettings,
};

const settings = createSlice({
  name: 'settingsReducer',
  initialState,
  reducers: {
    updateSettings: (state, action: PayloadAction<Partial<Settings>>) => {
      Object.entries(action.payload).forEach(([k, val]) => {
        // @ts-ignore
        state[k] = val;
      });
      LocalStore.setValue(SETTINGS_KEY, state as Settings);
    },
    updateColorVars: (
      state,
      action: PayloadAction<Partial<Settings['colorVars']>>,
    ) => {
      state.colorVars = { ...state.colorVars, ...action.payload };
      LocalStore.setValue(SETTINGS_KEY, state as Settings);
    },
  },
});

export const { updateSettings, updateColorVars } = settings.actions;

export default settings.reducer;
