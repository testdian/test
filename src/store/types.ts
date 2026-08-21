/*
 * @@description: 全局状态中心类型
 * @Author: qifeng qifeng@carbonstop.net
 * @Date: 2022-12-06 15:29:09
 * @LastEditors: qifeng qifeng@carbonstop.net
 * @LastEditTime: 2022-12-06 16:35:01
 */
import store from './index';

export type RootState = ReturnType<typeof store.getState>;
/**
 * @deprecated 使用 RouteState 代替
 */
export type IStoreState = RootState;

export interface IAction<T> {
  type: string;
  payload: T;
}
