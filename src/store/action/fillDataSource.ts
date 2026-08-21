import LocalStore from '@/utils/store';

import store from '..';
import { fillDataSouceActions } from '../module/fillDataSource';

export const DATASOUTCE = 'dataSource';
/**
 * 更新填报数据
 * */
export const changeDataSource = async (data: any) => {
  try {
    const deepCopy = JSON.parse(JSON.stringify(data));
    LocalStore.setValue(DATASOUTCE, deepCopy);
    store.dispatch(fillDataSouceActions.updateCount(deepCopy));
  } catch (error) {
    throw new Error(String(error) || '');
  }
};
/**
 *
 * 获取最新填报数据
 */
export const getDataSource = async (data: any) => {
  const deepCopy = JSON.parse(JSON.stringify(data));
  LocalStore.setValue(DATASOUTCE, deepCopy);
  store.dispatch(fillDataSouceActions.updateCount(deepCopy));
};
export const changeSubmitFalseAction = () => {
  store.dispatch(fillDataSouceActions.changeSubmitFalse());
};
export const changeSubmitTrueAction = () => {
  store.dispatch(fillDataSouceActions.changeSubmitTrue());
};
