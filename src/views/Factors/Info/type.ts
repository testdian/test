/*
 * @@description:
 * @Author: qifeng qifeng@carbonstop.net
 * @Date: 2023-02-24 17:21:37
 * @LastEditors: qifeng qifeng@carbonstop.net
 * @LastEditTime: 2023-02-24 17:48:01
 */
type Options = {
  label: string | number;
  value: string | number;
  children?: Options[];
};

export type FactorUnitMTransformMap = {
  [k: string]: Options;
};
