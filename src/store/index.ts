/*
 * @@description: 全局状态中心
 * @Author: qifeng qifeng@carbonstop.net
 * @Date: 2022-12-05 15:16:40
 * @LastEditors: qifeng qifeng@carbonstop.net
 * @LastEditTime: 2022-12-06 19:25:58
 */
import { configureStore } from '@reduxjs/toolkit';

import fillDataSource from './module/fillDataSource';
import systemNotices from './module/notice';
import systemOperations from './module/systemOperations';
import systemSettings from './module/systemSettings';
import userInfo from './module/user';

const store = configureStore({
  reducer: {
    systemSettings,
    systemOperations,
    systemNotices,
    userInfo,
    fillDataSource,
  },
});

export default store;
