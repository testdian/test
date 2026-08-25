/*
 * @description 供应商门户路由（原型演示，通过左下角切换角色进入）
 */
import { lazy } from 'react';

import { createRouteRedirect } from '../components/RouteRedirect';
import { Routes } from '../config';
import { routeTypeNameRender } from '../utils/index';
import { SupplyChainSupplierRouteMaps } from '../utils/supplyChainSupplierEnums';

const supplierMeta = (title: string, icon: string) => ({
  title: () => title,
  icon,
  prototypeAddedMenu: true as const,
  prototypePortalRole: 'supplier' as const,
});

/** 供应商端菜单均为一级菜单（与系统管理同级展示） */
export const supplyChainSupplierRoutes: Routes[] = [
  {
    path: SupplyChainSupplierRouteMaps.supplierPortal,
    meta: {
      title: () => '供应商门户',
      showInMenu: false,
      prototypePortalRole: 'supplier',
    },
    component: lazy(async () => ({
      default: createRouteRedirect(SupplyChainSupplierRouteMaps.workbench),
    })),
  },
  {
    path: SupplyChainSupplierRouteMaps.workbench,
    meta: {
      ...supplierMeta('主页', 'icon-icon-gongzuotai'),
      prototypeMenuNote:
        '供应商主页与管理员主页保持一致：列表展示线上培训管理模块配置的资料名称、内容摘要、更新人、更新时间；点击查看后使用与管理员端一致的培训资料详情页面。',
    },
    orderNum: 851,
    component: lazy(() => import('@views/home')),
    children: [
      {
        path: SupplyChainSupplierRouteMaps.trainingInfo,
        meta: {
          showInMenu: false,
          title: () => routeTypeNameRender('培训资料'),
        },
        component: lazy(() => import('@views/supplyChainCarbon/training/Info')),
      },
    ],
  },
  {
    path: SupplyChainSupplierRouteMaps.targets,
    meta: supplierMeta('减排目标', 'icon-icon_zhibiaoguanli'),
    orderNum: 852,
    component: lazy(() => import('@views/supplyChainCarbon/supplier/targets')),
    children: [
      {
        path: SupplyChainSupplierRouteMaps.targetInfo,
        meta: { showInMenu: false, title: () => '减排目标详情' },
        component: lazy(
          () => import('@views/supplyChainCarbon/supplier/targets/Info'),
        ),
      },
    ],
  },
  {
    path: SupplyChainSupplierRouteMaps.plans,
    meta: supplierMeta('减排计划', 'icon-icon-gongshi'),
    orderNum: 853,
    component: lazy(() => import('@views/supplyChainCarbon/supplier/plans')),
    children: [
      {
        path: SupplyChainSupplierRouteMaps.planCreate,
        meta: { showInMenu: false, title: () => '新建减排计划' },
        component: lazy(
          () => import('@views/supplyChainCarbon/supplier/plans/Create'),
        ),
      },
      {
        path: SupplyChainSupplierRouteMaps.planInfo,
        meta: { showInMenu: false, title: () => '减排计划详情' },
        component: lazy(
          () => import('@views/supplyChainCarbon/supplier/plans/Info'),
        ),
      },
    ],
  },
  {
    path: SupplyChainSupplierRouteMaps.questionnaire,
    meta: supplierMeta('调研填报任务', 'icon-icon_bianji'),
    orderNum: 855,
    component: lazy(
      () => import('@views/supplyChainCarbon/supplier/questionnaire'),
    ),
    children: [
      {
        path: SupplyChainSupplierRouteMaps.questionnaireInfo,
        meta: { showInMenu: false, title: () => '调研填报任务详情' },
        component: lazy(
          () => import('@views/supplyChainCarbon/supplier/questionnaire/Info'),
        ),
      },
      {
        path: SupplyChainSupplierRouteMaps.questionnaireFill,
        meta: { showInMenu: false, title: () => '调研填报' },
        component: lazy(
          () => import('@views/supplyChainCarbon/supplier/questionnaire/Fill'),
        ),
      },
    ],
  },
  {
    path: SupplyChainSupplierRouteMaps.certificates,
    meta: supplierMeta('资质证书', 'icon-icon-shangchuan'),
    orderNum: 856,
    component: lazy(
      () => import('@views/supplyChainCarbon/supplier/certificates'),
    ),
  },
];
