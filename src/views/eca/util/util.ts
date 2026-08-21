import I18N from '@src/lang/I18N';
import { DefaultOptionType } from 'antd/lib/select';

import { EcaRouteMaps } from '@/router/utils/ecaEmums';

import {
  InitFormilyProps,
  TypeComponentName,
  validatorMessageByComponentName,
} from './type';

/**
 * @description: 获取校验必填的提示内容
 * @param {string} componentName 传入的组件名称
 * @param {string} titleName 字段名称
 * @return {string} 返回对应的提示内容
 */
const getValidatorMessage = (
  componentName: keyof typeof validatorMessageByComponentName,
  titleName: string,
) => {
  const keys = Object.keys(validatorMessageByComponentName);
  if (keys.includes(componentName)) {
    return validatorMessageByComponentName[componentName] + titleName;
  }
  return I18N.template(I18N.eca.noComp, { val1: componentName });
};

/**
 * @description: 组底层的工具，后续拓展的工具需要在该工厂中叠加，轻易不可改动
 * @param {InitFormilyProps} props 基本传参
 */
export const initFormily = (props: InitFormilyProps) => {
  const { titleName, required, componentName, componentProps, noShowTitle } =
    props;
  const defaultProps = {
    title: noShowTitle ? false : titleName,
    required: required || false,
    'x-decorator': 'FormItem',
    'x-component': componentName,
    'x-validator': {
      required: required || false,
      message: getValidatorMessage(componentName, titleName),
    },
    'x-component-props': {
      ...componentProps,
    },
  };
  return defaultProps;
};

export const initFormilyShema = (
  titleName: string,
  componentName: TypeComponentName,
  required?: boolean,
  componentProps?: any,
  noShowTitle?: boolean,
) => {
  const setProps = {
    placeholder: titleName,
    ...componentProps,
  };
  return initFormily({
    titleName,
    componentName,
    componentProps: setProps,
    required,
    noShowTitle,
  });
};

// 遍历proxy
export const mapProxy = (obj: object) => {
  const returnObj: { [key: string]: any } = {};
  // eslint-disable-next-line no-restricted-syntax
  for (const [key, value] of Object.entries(obj)) {
    returnObj[key as string] = value as string;
  }
  return returnObj;
};
// 校验小数点后三位
export const RegChectDoit3 = /^-?\d{0,20}(\.\d{1,3})?$|^0(\.\d{1,3})?$/;
/**
 * 判断是否是排放源
 * **/
export const isEmissionSource = () => {
  return window.location.pathname.indexOf('emissionManage') >= 0;
};
/**
 * 如果是核算模型
 * **/
export const isAccountingModel = () => {
  return (
    window.location.pathname.indexOf('accountingModel/emissionSource') >= 0
  );
};
/** **
 * 判断碳排放-排放源详情
 * **/
export const culComputation = () => {
  return window.location.pathname.indexOf('carbonMissionAccounting') >= 0;
};
/** *
 * 填报数据 选择排排放源
 *
 */
export const culFillDataComputation = () => {
  return window.location.pathname.indexOf('fillData') >= 0;
};
/**
 *
 * *合并单元格方法*
 *data 数据源
 *field 合并的字段
 * */
export const changeDataFn = <T, K extends keyof T>(
  data: (T & { rowSpan?: number })[],
  field: K,
) => {
  // 重复项等第一项
  let count = 0;
  // 下一项
  let indexCount = 1;
  while (indexCount < data.length) {
    const item = data.slice(count, count + 1)[0];
    if (!item.rowSpan) {
      // 初始化为1
      item.rowSpan = 1;
    }
    // 第⼀个对象与后⾯的对象相⽐，有相同项就累加，并且后⾯相同项等rowSpan设置为0
    if (item[field] === data[indexCount][field]) {
      item.rowSpan++;
      data[indexCount].rowSpan = 0;
    } else {
      count = indexCount;
    }
    indexCount++;
  }
  return data;
};
//  filter数组
export const filterArr = (arr: DefaultOptionType[], value: string) => {
  return arr?.filter(item => Number(item.value) === Number(value))[0];
};

export const culHistoryObj = {
  // 碳排放核算
  carbonMissionAccounting: EcaRouteMaps.carbonMissionAccounting,
  // 判断排放源
  AccountingemissionSource:
    '/carbonAccounting/carbonMissionAccounting/emissionSource',
  // 核算模型
  accountingModel: EcaRouteMaps.accountingModel,
  // 核算模型 - 排放源管理
  AccountingModelemissionSource:
    '/carbonAccounting/accountingModel/emissionSource',
  // 排放源填报- 填报数据
  fillData: EcaRouteMaps.fillData,
  // 排放数据 -审核
  approvalManagement: EcaRouteMaps.approvalManage,
  // 碳排放核算  - 核算详情
  carbonMission: EcaRouteMaps.carbonMission,
};
// 判断当前路由  进行连接跳转
export const culHistoryFn = () => {
  // 如果是碳排放核算 - 排放源管理
  if (
    window.location.pathname.indexOf(culHistoryObj.AccountingemissionSource) >=
    0
  ) {
    return culHistoryObj.carbonMissionAccounting;
  }
  // 如果是核算模型 - 排放源管理
  if (
    window.location.pathname.indexOf(
      culHistoryObj.AccountingModelemissionSource,
    ) >= 0
  ) {
    return culHistoryObj.accountingModel;
  }
  // 排放数据填报
  if (window.location.pathname.indexOf(culHistoryObj.fillData) >= 0) {
    return culHistoryObj.fillData;
  }
  // 排放数据审核
  if (window.location.pathname.indexOf(culHistoryObj.approvalManagement) >= 0) {
    return culHistoryObj.approvalManagement;
  }
  // 碳排放核算 - 核算详情
  if (window.location.pathname.indexOf(culHistoryObj.carbonMission) >= 0) {
    return culHistoryObj.carbonMissionAccounting;
  }
  return '';
};
// 除 基础排放源 其他排放源不展示 范围二 范围三
export const filterMessionArr = (arr: any[], currentKey: number) => {
  const newArr =
    currentKey === 0 ? arr : arr?.filter(item => item?.ghgCategory < 2);
  return newArr;
};
