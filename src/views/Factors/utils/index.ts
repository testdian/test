/*
 * @@description:公共方法
 */

import { NavigateFunction } from 'react-router-dom';

import { updateUrl } from '@/utils';

import {
  PAGE_TYPE_VAR,
  PageTypeInfo,
  TypeMapRoute,
  virtualLinkTransform,
} from '../../../router/utils/enums';

/** 发布年份 */
export const publishYear = (start?: number, end?: number) => {
  const startT = start ?? 1990;
  const endT = end ?? new Date().getFullYear();
  let result = [startT];
  while (result[result.length - 1] < endT) {
    result = result.concat(result[result.length - 1] + 1);
  }
  return result.reverse();
};
//

/** 页面跳转 */
export const pageTo = (
  navigate: NavigateFunction,
  path: TypeMapRoute,
  page: PageTypeInfo,
  id?: number,
  extraParams?: { [key: string]: string | number },
) => {
  navigate(virtualLinkTransform(path, [PAGE_TYPE_VAR], [page]));
  updateUrl({
    id,
    ...extraParams,
  });
};
