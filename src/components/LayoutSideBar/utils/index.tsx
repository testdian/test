/*
 * @@description:
 * @Author: qifeng qifeng@carbonstop.net
 * @Date: 2022-12-08 15:25:57
 * @LastEditors: Please set LastEditors
 * @LastEditTime: 2024-12-17 15:26:04
 */
import { IconFont } from '@components/IconFont';
import { MenuItemGroupType, ItemType } from 'antd/es/menu/interface';

import { FormLabelWithNote } from '@/components/ModifyNote';
import { Routes } from '@/router/config';
import { EcaRouteMaps } from '@/router/utils/ecaEmums';
import { isHiddenPrototypeMenu } from '@/router/utils/hiddenPrototypeMenus';
import { SupplyChainRefRouteMaps } from '@/router/utils/supplyChainRefEnums';
import { readStoredUserRole } from '@/views/supplyChainCarbon/hooks/useUserRole';
import { Permission } from '@/sdks/systemV2ApiDocs';

/** *
 * 获取路由的key值
 * **/
export const RouterKeyArr: string[] = [];

const getRouteTitle = (route: Routes) =>
  typeof route.meta.title === 'string' ? route.meta.title : route.meta.title();

const getPrototypeMenuOrderNum = (route: Routes, auths?: Permission[]) => {
  if (route.path === EcaRouteMaps.emissionTarget) {
    const reportOrder = auths?.find(
      a => a.perms === EcaRouteMaps.ecaReport,
    )?.orderNum;
    return reportOrder != null ? Number(reportOrder) + 0.5 : 4;
  }
  if (route.path === EcaRouteMaps.reductionMeasures) {
    const reportOrder = auths?.find(
      a => a.perms === EcaRouteMaps.ecaReport,
    )?.orderNum;
    return reportOrder != null ? Number(reportOrder) + 1 : 5;
  }
  return undefined;
};

const buildMenuLabel = (
  route: Routes,
  title: string,
  permissionName?: string,
) => {
  if (route.meta.prototypeMenuNote) {
    return (
      <FormLabelWithNote label={title} note={route.meta.prototypeMenuNote} />
    );
  }
  return permissionName || title;
};

function filterRoutesByPortalRole(
  routes: Routes[],
  portalRole: 'admin' | 'supplier',
  isRoot = true,
): Routes[] {
  return routes
    .filter(route => {
      const role = route.meta.prototypePortalRole;
      if (portalRole === 'supplier') {
        return role === 'supplier';
      }
      if (role === 'supplier') return false;
      if (!isRoot) return true;
      return [
        '/home',
        SupplyChainRefRouteMaps.supplyChainCarbon,
        SupplyChainRefRouteMaps.basicConfig,
      ].includes(route.path);
    })
    .map(route => ({
      ...route,
      children: route.children?.length
        ? filterRoutesByPortalRole(route.children, portalRole, false)
        : route.children,
    }));
}

export function getPortalFilteredMenuRoutes(routes: Routes[]) {
  const portalRole = readStoredUserRole() === 'admin' ? 'admin' : 'supplier';
  return filterRoutesByPortalRole(routes, portalRole);
}

export const getPortalMenuRoutesByRole = (
  routes: Routes[],
  portalRole: 'admin' | 'supplier',
) => filterRoutesByPortalRole(routes, portalRole);

/** 将 路由（route）转换成 菜单（menu） */
export const transformRoutesMenu = (
  routes: Routes[],
  group?: string,
  auths?: Permission[],
): ItemType[] | undefined => {
  const newMenu: (ItemType & { orderNum?: number })[] = [];
  /** menu中添加 group name 字段 */
  const menuGroup: MenuItemGroupType & { orderNum?: number } = {
    type: 'group',
    label: group,
    className: 'p-name',
    children: [],
  };
  routes.forEach((route, index) => {
    if (isHiddenPrototypeMenu(route.path)) {
      return;
    }
    if (route.meta.showInMenu === false) {
      return;
    }
    RouterKeyArr.push(route.path);
    const routeTitle = getRouteTitle(route);
    const menuItemBase = {
      label: buildMenuLabel(route, routeTitle),
      icon: route.meta.icon && <IconFont icon={route.meta.icon} />,
      // 使用title 时 会显示tooltip
      // title: route.meta.title,
      key: route.path,
      popupOffset: [-5],
    };
    // 有权限的子集
    const children: (Routes & {
      orderNum?: number;
      meta?: { title: string };
    })[] = [];
    route.children?.forEach(r => {
      if (isHiddenPrototypeMenu(r.path)) {
        return;
      }
      const hasChildAuth =
        r.meta.prototypeAddedMenu || auths?.some(a => a.perms === r.path);
      if (r.meta.showInMenu !== false && hasChildAuth) {
        children?.push({
          ...r,
          orderNum: r.meta.prototypeAddedMenu
            ? r.orderNum
            : auths?.filter(a => a.perms === r.path)[0]?.orderNum,
          // @ts-ignore
          label:
            auths?.filter(a => a.perms === r.path)[0]?.permissionName ||
            getRouteTitle(r),
        });
      }
    });
    children.sort((a, b) => Number(a.orderNum) - Number(b.orderNum));

    // 有权限才渲染；原型新增菜单无需后端权限
    const hasAuth =
      route.meta.prototypeAddedMenu ||
      auths?.some(a => a.perms === menuItemBase.key);
    //  获取排序
    const orderNum = route.meta.prototypeAddedMenu
      ? route.orderNum ?? getPrototypeMenuOrderNum(route, auths)
      : auths?.filter(a => {
          return a.perms === menuItemBase.key;
        })[0]?.orderNum;
    const menuData = {
      ...menuItemBase,
      children:
        children &&
        // hasAuth &&
        transformRoutesMenu(children, undefined, auths),
      orderNum,
      label: route.meta.prototypeAddedMenu
        ? menuItemBase.label
        : buildMenuLabel(
            route,
            routeTitle,
            auths?.filter(a => a.perms === menuItemBase.key)[0]?.permissionName,
          ),
    };

    if (hasAuth) {
      if (!group) {
        newMenu.push(menuData);
      } else {
        if (index === 0) {
          newMenu.push(menuGroup);
        }
        menuGroup.children = [
          ...(menuGroup.children || []),
          {
            ...menuItemBase,
          },
        ];
      }
    }
  });

  return newMenu.length
    ? newMenu.sort((a, b) => Number(a?.orderNum) - Number(b?.orderNum))
    : undefined;
};

/** 管理员入口中同时展示两类菜单，分组仅负责说明可见角色。 */
export const transformPortalGroupedMenu = (
  routes: Routes[],
  auths?: Permission[],
): ItemType[] => {
  const groups = [
    {
      key: 'admin-visible-menu',
      label: '管理员可见菜单',
      routes: getPortalMenuRoutesByRole(routes, 'admin'),
    },
    {
      key: 'supplier-visible-menu',
      label: '供应商可见菜单',
      routes: getPortalMenuRoutesByRole(routes, 'supplier'),
    },
  ];

  return groups.flatMap(group => {
    const children = transformRoutesMenu(group.routes, undefined, auths) || [];
    if (!children.length) return [];
    return [
      {
        type: 'group' as const,
        key: group.key,
        label: group.label,
        className: 'portal-menu-group',
        children,
      },
    ];
  });
};

/**
 * 这个方法是为了开发环境下 不配置权限的菜单 可以直接显示出来
 * 可以根据自己的需求修改
 * 例如：可以根据环境变量来判断是否显示
 */
export const transformRouteToMenu = (routes: any) => {
  const currentEnv = import.meta.env.MODE;
  return routes
    .filter(
      (route: {
        meta: {
          showInMenu: boolean;
          devEnv?: boolean; // 新增 devEnv 类型
        };
        path: string;
      }) => {
        if (isHiddenPrototypeMenu(route.path)) {
          return false;
        }
        // 原有过滤条件
        const showInMenu = route.meta?.showInMenu !== false;
        // 新增环境判断逻辑
        const shouldShowByEnv = route.meta?.devEnv
          ? currentEnv === 'development' // devEnv=true 时仅在 dev 环境显示
          : true; // 未设置时默认显示
        return showInMenu && shouldShowByEnv;
      },
    )
    .map(
      (route: {
        children: string | any[];
        meta: { title: () => any; icon: string };
        path: any;
      }) => {
        // 先递归处理子节点
        const children = route.children?.length
          ? transformRouteToMenu(route.children)
          : undefined;

        return {
          label:
            typeof route.meta.title === 'string'
              ? route.meta.title
              : route.meta.title(),
          key: route.path,
          icon: route.meta.icon && <IconFont icon={route.meta.icon} />,
          // 只有当子节点存在时才保留children
          ...(children?.length ? { children } : {}),
        };
      },
    );
};
