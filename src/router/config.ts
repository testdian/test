import I18N from '@src/lang/I18N';
import { ComponentType, lazy } from 'react';

import { ECARoute } from './ECAccount/index';
import { basicRoute } from './authMenus/basic-route';
import { carbonDataRoute } from './authMenus/carbonData';
import { supplyChainRefRoutes } from './authMenus/supplyChainRef';
import { supplyChainSupplierRoutes } from './authMenus/supplyChainSupplier';
import { carbonReductionRoute } from './carbonReduction/index';
import { carbonVerifyRoute } from './carbonVerify/index';
import { RouteMaps } from './utils/enums';

export interface RouteBase {
  // 路由路径
  path: string;
  // 路由组件
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  component?: ComponentType<any>;
  // 路由信息
  meta: RouteMeta;
  orderNum?: number;
}

export interface RouteMeta {
  title: string | ((location?: Location) => string);
  icon?: string;
  // 是否校验权限, false 为不校验, 不存在该属性或者为true 为校验, 子路由会继承父路由的 auth 属性
  auth?: boolean;
  // 302 跳转
  redirect?: string;
  /** 是否在菜单栏展示 undefined 也会视为 true，只有false 视为 false */
  showInMenu?: boolean;
  /** 原型阶段新增菜单：无后端权限时也展示 */
  prototypeAddedMenu?: boolean;
  /** 原型菜单修改说明 */
  prototypeMenuNote?: string;
  /** 原型演示门户：admin=企业端，supplier=供应商端 */
  prototypePortalRole?: 'admin' | 'supplier';
  devEnv?: boolean;
}

export interface Routes extends RouteBase {
  children?: Routes[];
}

/**
 * routes 第一级路由负责最外层的路由渲染，比如 userLayout 和 Layout 的区分
 * 所有系统内部存在的页面路由都要在此地申明引入，而菜单栏的控制是支持异步请求控制的
 * 有权限控制的路由
 */
export const menuRoutes: Routes[] = [
  {
    path: RouteMaps.home,
    component: lazy(() => import('@views/home')),
    orderNum: 0,
    meta: {
      title: () => '主页',
      icon: 'icon-icon-gongzuotai',
      prototypeAddedMenu: true,
      prototypeMenuNote:
        '数据看板上方增加一个主页菜单：列表展示线上培训管理模块配置的资料名称、内容摘要，点击可查看详情。',
    },
    children: [
      {
        path: RouteMaps.profile,
        component: lazy(() => import('@views/dashborad/AccountManage')),
        meta: {
          title: () => I18N.utils.accountManagement,
          showInMenu: false,
        },
      },
      {
        path: RouteMaps.message,
        component: lazy(() => import('@views/dashborad/Message')),
        meta: {
          title: () => I18N.dashborad.messageCenter,
          showInMenu: false,
        },
      },
    ],
  },
  // 数据看板
  ...carbonDataRoute,
  // 企业碳核算路由
  ...ECARoute,
  // 碳核查路由
  ...carbonVerifyRoute,
  // 碳减排管理路由
  ...carbonReductionRoute,
  // 基础框架路由
  ...basicRoute,
  // 供应链碳管理（与系统管理同级）
  ...supplyChainRefRoutes,
  // 供应商门户（原型演示，切换角色后可见）
  ...supplyChainSupplierRoutes,
];

/** 没有layout子集 的路由 */
export const baseRoute: Routes[] = [
  {
    path: RouteMaps.layout,
    component: lazy(() => import('@src/layout/index')),
    meta: {
      title: () => I18N.router.system,
      auth: false,
      redirect: RouteMaps.dashborad,
    },
    // children: [...menuRoutes],
  },
  {
    path: RouteMaps.login,
    component: lazy(() => import('@views/base/Login')),
    meta: {
      title: () => I18N.base.login,
      auth: false,
    },
  },
  {
    path: RouteMaps.loginAuth,
    component: lazy(() => import('@views/base/LoginSuccess')),
    meta: {
      title: () => I18N.router.loginAuthentication,
      auth: false,
    },
  },
  {
    path: RouteMaps.loginError,
    component: lazy(() => import('@views/base/LoginError')),
    meta: {
      title: () => I18N.router.loginError,
      auth: false,
    },
  },
  {
    path: RouteMaps.changePWD,
    component: lazy(() => import('@views/base/ChangePWD')),
    meta: {
      title: () => I18N.router.passwordModification,
      auth: true,
    },
  },
  {
    path: RouteMaps.error,
    meta: {
      title: () => I18N.router.errorPage,
      auth: false,
      redirect: RouteMaps.error404,
    },
    children: [
      {
        path: RouteMaps.error404,
        component: lazy(() => import('@views/error/404')),
        meta: {
          title: () => I18N.router.pageDoesNotExist,
          auth: false,
        },
      },
      {
        path: RouteMaps.error403,
        component: lazy(() => import('@views/error/403')),
        meta: {
          title: () => I18N.router.noPermissionTemporarily,
          auth: false,
        },
      },
    ],
  },
  {
    path: '/',
    meta: {
      title: '',
      auth: false,
      redirect: RouteMaps.home,
    },
  },
  {
    path: '*',
    meta: {
      title: () => I18N.router.errorPage,
      auth: false,
      redirect: RouteMaps.error404,
    },
  },
];

/**
 * 所有的路由
 */
const routes = baseRoute.map(r => {
  if (r.path === RouteMaps.layout) {
    // layout 路由添加子路由
    return {
      ...r,
      children: [...menuRoutes],
    };
  }
  return r;
});

export default routes;
