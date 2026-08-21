import I18N from '@src/lang/I18N';

import { PageTypeInfo } from './enums';

/** （新增、编辑、详情）页面标题自动生成 */
export const routeTypeNameRender = (
  titleMap: Record<PageTypeInfo, string> | string,
) => {
  const { pathname } = window.location;
  let usedMap: Record<PageTypeInfo, string>;
  if (typeof titleMap === 'string') {
    usedMap = {
      [PageTypeInfo.add]: I18N.template(I18N.router.addTit, { val1: titleMap }),
      [PageTypeInfo.show]: I18N.template(I18N.router.title, { val1: titleMap }),
      [PageTypeInfo.edit]: I18N.template(I18N.router.editTit, {
        val1: titleMap,
      }),
      [PageTypeInfo.copy]: I18N.template(I18N.router.copyTit, {
        val1: titleMap,
      }),
    };
  } else usedMap = titleMap;
  return pathname.includes(`/${PageTypeInfo.add}`)
    ? usedMap[PageTypeInfo.add]
    : pathname.includes(`/${PageTypeInfo.edit}`)
    ? usedMap[PageTypeInfo.edit]
    : pathname.includes(`/${PageTypeInfo.show}`)
    ? usedMap[PageTypeInfo.show]
    : usedMap[PageTypeInfo.copy];
};

/** （新增、编辑、详情）页面标题自动生成：页面多层嵌套时 */
export const sccmRouteTypeNameRender = (
  titleMap: Record<PageTypeInfo, string> | string,
  type: string,
) => {
  const { pathname } = window.location;
  let usedMap: Record<PageTypeInfo, string>;
  if (typeof titleMap === 'string') {
    usedMap = {
      [PageTypeInfo.add]: I18N.template(I18N.router.addTit, { val1: titleMap }),
      [PageTypeInfo.show]: I18N.template(I18N.router.title, { val1: titleMap }),
      [PageTypeInfo.edit]: I18N.template(I18N.router.editTit, {
        val1: titleMap,
      }),
      [PageTypeInfo.copy]: I18N.template(I18N.router.copyTit, {
        val1: titleMap,
      }),
    };
  } else usedMap = titleMap;
  return pathname.includes(`${type}/${PageTypeInfo.add}/`)
    ? usedMap[PageTypeInfo.add]
    : pathname.includes(`${type}/${PageTypeInfo.edit}/`)
    ? usedMap[PageTypeInfo.edit]
    : pathname.includes(`${type}/${PageTypeInfo.show}/`)
    ? usedMap[PageTypeInfo.show]
    : usedMap[PageTypeInfo.copy];
};
