/*
 * @@description:
 * @Author: qifeng qifeng@carbonstop.net
 * @Date: 2022-12-07 18:31:30
 * @LastEditors: qifeng qifeng@carbonstop.net
 * @LastEditTime: 2023-01-16 14:31:29
 */
import routes, { baseRoute, menuRoutes, Routes } from './config';
import config from '../config';

/**
 * 将路由转换为一维数组
 * @param routeList 路由
 * @param deep 是否深层转化
 * @param auth 根据权限筛选路由
 */
export function flattenRoute(
  routeList: Routes[],
  deep: boolean,
  auth?: boolean,
): Routes[] {
  const isGetAllRoute = Object.is(undefined, auth);
  const result: Routes[] = [];
  // eslint-disable-next-line no-debugger
  // if (auth === false) debugger;
  for (let i = 0; i < routeList.length; i += 1) {
    const route = routeList[i];
    const isNoAuthRoute =
      Object.is(false, route.meta.auth) && Object.is(false, auth);

    if (isGetAllRoute) {
      // 所有的路由
      result.push({
        ...route,
      });
    }
    // 没有权限的路由
    else if (isNoAuthRoute) {
      result.push({
        ...route,
      });
    } else if (auth) {
      result.push({
        ...route,
      });
    }

    if (route.children && deep) {
      result.push(...flattenRoute(route.children, deep, auth));
    }
  }

  return result;
}
/** 获取基础路由 */
function getLayoutRouteList(): Routes[] {
  return flattenRoute(baseRoute, true);
}

/** 有权限的路由 */
function getBusinessRouteList(): Routes[] {
  return flattenRoute(menuRoutes, true, true);
}

/**
 * 这里会将 config 中所有路由解析成三个数组
 * 第一个: 最外层的路由，例如  Layout UserLayout ... Login Register RegisterResult
 * 第二个: 业务路由，为 / 路由下的业务路由
 */

/** 没有权限的路由 */
export const layoutRouteList = getLayoutRouteList();

/** 有权限的路由 */
export const businessRouteList = getBusinessRouteList();
/** 所有的路由 */
export const allRoute = flattenRoute(routes, true);

function findRoutesByPaths(
  pathList: string[],
  routeList: Routes[],
  basename?: string,
): Routes[] {
  return routeList.filter(
    (child: Routes) => pathList.indexOf((basename || '') + child.path) !== -1,
  );
}

export function getPageTitle(routeList: Routes[]): string {
  const route = routeList.find(
    child => child.path === window.location.pathname,
  );
  return (
    (typeof route?.meta.title === 'string'
      ? route.meta.title
      : route?.meta?.title?.()) || ''
  );
}

export function getPagePathList(pathname?: string): string[] {
  return (pathname || window.location.pathname)
    .split('/')
    .filter(Boolean)
    .map((value, index, array) =>
      '/'.concat(array.slice(0, index + 1).join('/')),
    );
}

/**
 * 只有业务路由会有面包屑
 */
export function getBreadcrumbs(): Routes[] {
  return findRoutesByPaths(
    getPagePathList(),
    businessRouteList,
    config.BASENAME,
  );
}
