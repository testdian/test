/*
 * @@description:
 * @Author: ljh255 jinhai@carbonstop.net
 * @Date: 2023-02-27 11:39:46
 * @LastEditors: ljh255 jinhai@carbonstop.net
 * @LastEditTime: 2023-03-30 15:02:23
 */
import I18N from '@src/lang/I18N';

export const validatorMessageByComponentName = {
  Input: I18N.eca.pleaseFillIn,
  Select: I18N.Factors.pleaseSelect,
  'Radio.Group': I18N.Factors.pleaseSelect,
  Cascader: I18N.Factors.pleaseSelect,
  'DatePicker.RangePicker': I18N.Factors.pleaseSelect,
  'Input.TextArea': I18N.base.pleaseEnter,
  NumberPicker: I18N.base.pleaseEnter,
};
export type TypeComponentName = keyof typeof validatorMessageByComponentName;
export interface InitFormilyProps {
  /** 表单名称/label */
  titleName: string;
  /** 引用的组件名称 */
  componentName: keyof typeof validatorMessageByComponentName;
  /** 组件的props */
  componentProps?: any;
  /** 是否必填校验 */
  required?: boolean;
  /** 是否显示label */
  noShowTitle?: boolean;
}
export const InputTextLength50 = 50;
export const InputTextLength100 = 100;
export const InputTextLength20 = 20;
export const InputTextLength200 = 200;
export const TextAreaMaxLength1000 = 1000;
export const TextAreaMaxLength3000 = 3000;
export const TextAreaMaxLength5000 = 5000;
export const TextAreaMaxLength500 = 500;
export const NumberMain = 0;
export const NumberMax = 999999999999.999;
export const RegEmail = [
  // { required: true, message: '请输入邮编' },
  {
    pattern:
      /^[a-zA-Z0-9_.-]+@[a-zA-Z0-9-]+(\.[a-zA-Z0-9-]+)*\.[a-zA-Z0-9]{2,6}$/,
    message: I18N.eca.pleaseInputCorrectly5,
  },
];
export const RegPhone = (value: string) => {
  if (value && value.length < 5) {
    return I18N.eca.reportManager5;
  }
  if (value && value.length > 15) {
    return I18N.eca.reportManager5;
  }
  if (/^(0\d{2,3})-?(\d{7,8})$/.test(value)) {
    return I18N.eca.reportManager5;
  }
  return '';
};
// 校验小数点后三位
export const RegChectDoit3 = /^-?\d{0,20}(\.\d{1,3})?$|^0(\.\d{1,3})?$/;
// 校验小数点后四位
export const RegChectDoit4 = /^-?\d{0,20}(\.\d{1,4})?$|^0(\.\d{1,4})?$/;
export const RegChectDoit10 = /^-?\d{0,20}(\.\d{1,10})?$|^0(\.\d{1,10})?$/;

/**
 * 最大值999999999999.999 最小值0 小数点后3位
 * **/
export const RegNumber = [
  { pattern: RegChectDoit3, message: I18N.eca.supportDecimalPoint3 },
  { min: 0, message: I18N.eca.pleaseInputCorrectly3 },
  { max: 999999999999.999, message: I18N.eca.pleaseInputCorrectly3 },
];
export const RegUnitNumber = [
  { pattern: RegChectDoit3, message: I18N.eca.supportDecimalPoint3 },
  { min: 0, message: I18N.eca.pleaseInputCorrectly4 },
  { max: 999999999999.999, message: I18N.eca.pleaseInputCorrectly4 },
];
/** *
 * 取值区间：0.0000000001-99999999999.9999999999；
 */
export const RegNumberTwo = [
  { pattern: RegChectDoit10, message: I18N.eca.supportDecimalPoint2 },
  { min: 0.0000000001, message: I18N.eca.pleaseInputCorrectly3 },
  { max: 100000000000, message: I18N.eca.pleaseInputCorrectly3 },
];

/**
 * 因子树枝
 */
export const RegNumberThree = [
  { pattern: RegChectDoit10, message: I18N.eca.supportDecimalPoint2 },
  { min: 0, message: I18N.eca.pleaseInputCorrectly2 },
  { max: 100000000000, message: I18N.eca.pleaseInputCorrectly2 },
];
export const RegNumberFive = [
  { pattern: RegChectDoit10, message: I18N.eca.supportDecimalPoint2 },
  { min: 0.0000000001, message: I18N.eca.pleaseInputCorrectly },
  { max: 100000000000, message: I18N.eca.pleaseInputCorrectly },
];

// 支持数字和字母
export const RegNumAndLetters = {
  pattern: /^[a-zA-Z0-9]*$/,
  message: I18N.eca.onlySupportsLetters,
};

export const girdStyle = {
  type: 'void',
  'x-component': 'FormGrid',
  'x-component-props': {
    rowGap: 2,
    columnGap: 24,
    maxColumns: 3,
    minColumns: 1,
  },
};
export const reg = /\.(png|jpeg|jpg|PNG|JPEG|JPG|GIF|png|jpg|jpeg|gif)$/;
export const maxSize = 5 * 1024 * 1024;
