/* eslint-disable no-param-reassign */
/*
 * @@description: 系统配置
 * @Author: qifeng qifeng@carbonstop.net
 * @Date: 2022-12-06 15:38:59
 * @LastEditors: qifeng qifeng@carbonstop.net
 * @LastEditTime: 2022-12-06 16:48:08
 */
import { createSlice } from '@reduxjs/toolkit';
import type { PayloadAction } from '@reduxjs/toolkit';

import { Routes } from '@/router/config';
import { allRoute } from '@/router/utils';
import LocalStore from '@/utils/store';

export interface AppState {
  sidebar: {
    opened: boolean;
  };
  routes: Routes[];

  flattenRoutes: Routes[];

  init: boolean;
}

const SIDEBAR_KEY = 'React-ant-Admin-SideBar-Opened';

const opened = LocalStore.getValue<boolean>(SIDEBAR_KEY, true);

const initialState: AppState = {
  sidebar: {
    opened: typeof opened === 'boolean' ? opened : true,
  },
  routes: [],
  flattenRoutes: [],
  init: false,
};

const systemOperations = createSlice({
  name: 'systemOperations',
  initialState,
  reducers: {
    updateSideBarOpen: (state, action: PayloadAction<boolean>) => {
      state.sidebar.opened = action.payload;
      LocalStore.setValue(SIDEBAR_KEY, state.sidebar.opened);
    },
    setSideBarRoutes: (state, action: PayloadAction<Routes[]>) => {
      state.routes = action.payload;
      state.init = true;
      state.flattenRoutes = allRoute;
    },
    removeSideBarRoutes: state => {
      const sideBarOpened = LocalStore.getValue<boolean>(SIDEBAR_KEY, true);
      Object.entries(initialState).forEach(([k, val]) => {
        // @ts-ignore
        state[k] = val;
      });
      state.sidebar.opened =
        typeof sideBarOpened === 'boolean' ? sideBarOpened : true;
    },
  },
});

export const { updateSideBarOpen, setSideBarRoutes, removeSideBarRoutes } =
  systemOperations.actions;

export default systemOperations.reducer;
