import { CarbonVerifyRouteMaps } from './carbonVerifyEnum';
import { RouteMaps } from './enums';

/** 原型阶段隐藏的菜单路径 */
export const HIDDEN_PROTOTYPE_MENU_PATHS: string[] = [
  CarbonVerifyRouteMaps.carbonVerify,
  RouteMaps.CodeConfiguration,
  RouteMaps.PageConfiguration,
];

export const HIDDEN_PROTOTYPE_MENU_NOTE =
  '去掉菜单：碳核查、Code码管理、页面配置';

export const isHiddenPrototypeMenu = (path?: string) =>
  !!path && HIDDEN_PROTOTYPE_MENU_PATHS.includes(path);
