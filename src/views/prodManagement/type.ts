/*
 * @@description:
 */
import I18N from '@src/lang/I18N';

export enum TypeChangeProManage {
  operationalData, // 运营数据
  operationalIndicators, // 运营指标
}
export enum TypeCurrenModal {
  ADD = 'ADD',
  EDIT = 'EDIT',
  SHOW = 'SHOW',
}
export const CurrentModalObj = {
  ADD: I18N.Factors.newAddition,
  EDIT: I18N.Factors.edit,
  SHOW: I18N.Factors.check,
};
export type PageType = 'ADD' | 'EDIT' | 'SHOW';
