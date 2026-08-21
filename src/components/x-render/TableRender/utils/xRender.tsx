/*
 * @@description: xrender 辅助方法
 * @Author: qifeng qifeng@carbonstop.net
 * @Date: 2023-01-12 18:17:16
 * @LastEditors: qifeng qifeng@carbonstop.net
 * @LastEditTime: 2023-02-03 15:23:07
 */
import { FC } from 'react';
import { SearchProps } from 'table-render/dist/src/types';

/**
 * 生成 xrender search 表单数据
 * @param properties 字段描述
 */
export const xRenderSeachSchema = <RecordType = any,>(
  properties: SearchProps<RecordType>['schema'],
): SearchProps<RecordType>['schema'] => {
  return {
    width: 240,
    /** 作用于列的样式，类型里没有暴露这个 */
    // @ts-ignore
    style: {
      paddingRight: 20,
    },
    ...properties,
  };
};

export type XRenderFormItemProps = {
  component: FC;
  // xrender 返回的类型就是any ，有点坑
  form: any;
  key: string;
};
/**
 *  for antd v5
 *  fixme 目前xrender 这里适配有问题，等待他们后续解决 select 数值不能赋上 , rangePicker
 */
export const XRenderFormItem = ({
  component,
  form,
  key,
}: XRenderFormItemProps): FC => {
  const Comp = component;
  return props => {
    const val = form.getValues()?.[key];
    // @ts-ignore
    return <Comp {...props} value={val} />;
  };
};
