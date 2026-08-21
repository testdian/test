/*
 * @description 供应链碳管理迁移路由（与系统管理/设置同级）
 */
import { lazy } from 'react';

import { createRouteRedirect } from '../components/RouteRedirect';
import { Routes } from '../config';
import { routeTypeNameRender } from '../utils/index';
import { SupplyChainRefRouteMaps } from '../utils/supplyChainRefEnums';

const SUPPLY_CHAIN_MENU_NOTE = '供应链碳管理和基础配置为新增模块，请重点关注';

const prototypeMeta = (title: string) => ({
  title: () => title,
  prototypeAddedMenu: true as const,
  prototypePortalRole: 'admin' as const,
});

/** 供应链碳管理 + 基础配置，作为顶级菜单（与系统管理同级） */
export const supplyChainRefRoutes: Routes[] = [
  {
    path: SupplyChainRefRouteMaps.supplyChainCarbon,
    meta: {
      title: () => '供应链碳管理',
      icon: 'icon-icon-gongyingliantanguanli',
      prototypeAddedMenu: true,
      prototypePortalRole: 'admin',
      prototypeMenuNote: SUPPLY_CHAIN_MENU_NOTE,
    },
    orderNum: 900,
    component: lazy(async () => ({
      default: createRouteRedirect(SupplyChainRefRouteMaps.questionnaire),
    })),
    children: [
      {
        path: SupplyChainRefRouteMaps.tasks,
        meta: {
          ...prototypeMeta('供应商管理'),
          showInMenu: false,
        },
        orderNum: 901,
        component: lazy(() => import('@views/supplyChainCarbon/supplierTasks')),
      },
      {
        path: SupplyChainRefRouteMaps.supplierDataFill,
        meta: {
          ...prototypeMeta('供应商数据填报'),
          showInMenu: false,
        },
        orderNum: 902,
        component: lazy(
          () => import('@views/supplyChainCarbon/supplierDataFill'),
        ),
        children: [
          {
            path: SupplyChainRefRouteMaps.supplierDataFillInfo,
            meta: { showInMenu: false, title: () => '核算数据详情' },
            component: lazy(
              () => import('@views/supplyChainCarbon/supplierDataFill/Detail'),
            ),
          },
        ],
      },
      {
        path: SupplyChainRefRouteMaps.questionnaire,
        meta: prototypeMeta('调研填报任务'),
        orderNum: 903,
        component: lazy(() => import('@views/supplyChainCarbon/questionnaire')),
        children: [
          {
            path: SupplyChainRefRouteMaps.questionnaireCreate,
            meta: {
              showInMenu: false,
              title: () => '新增调研填报任务',
            },
            component: lazy(
              () => import('@views/supplyChainCarbon/questionnaire/Create'),
            ),
          },
          {
            path: SupplyChainRefRouteMaps.questionnaireInfo,
            meta: { showInMenu: false, title: () => '调研任务详情' },
            component: lazy(
              () => import('@views/supplyChainCarbon/questionnaire/Detail'),
            ),
          },
          {
            path: SupplyChainRefRouteMaps.questionnaireEdit,
            meta: { showInMenu: false, title: () => '编辑调研任务' },
            component: lazy(
              () => import('@views/supplyChainCarbon/questionnaire/Create'),
            ),
          },
          {
            path: SupplyChainRefRouteMaps.questionnaireResponses,
            meta: { showInMenu: false, title: () => '问卷回复' },
            component: lazy(
              () => import('@views/supplyChainCarbon/questionnaire/Responses'),
            ),
          },
        ],
      },
      {
        path: SupplyChainRefRouteMaps.assessmentReports,
        meta: {
          ...prototypeMeta('碳评估报告'),
          showInMenu: false,
        },
        orderNum: 904,
        component: lazy(
          () => import('@views/supplyChainCarbon/assessmentReports'),
        ),
        children: [
          {
            path: SupplyChainRefRouteMaps.assessmentReportInfo,
            meta: { showInMenu: false, title: () => '报告详情' },
            component: lazy(
              () => import('@views/supplyChainCarbon/assessmentReports/Detail'),
            ),
          },
        ],
      },
      {
        path: SupplyChainRefRouteMaps.targetMgmt,
        meta: prototypeMeta('减排目标管理'),
        orderNum: 905,
        component: lazy(
          () => import('@views/supplyChainCarbon/reductionTargets'),
        ),
        children: [
          {
            path: SupplyChainRefRouteMaps.targetInfo,
            meta: {
              showInMenu: false,
              title: () => routeTypeNameRender('减排目标'),
            },
            component: lazy(
              () => import('@views/supplyChainCarbon/reductionTargets/Info'),
            ),
          },
        ],
      },
      {
        path: SupplyChainRefRouteMaps.plans,
        meta: prototypeMeta('计划审核'),
        orderNum: 906,
        component: lazy(() => import('@views/supplyChainCarbon/plans')),
        children: [
          {
            path: SupplyChainRefRouteMaps.planInfo,
            meta: { showInMenu: false, title: () => '减排计划详情' },
            component: lazy(
              () => import('@views/supplyChainCarbon/plans/Info'),
            ),
          },
        ],
      },
      {
        path: SupplyChainRefRouteMaps.progress,
        meta: prototypeMeta('进度追踪看板'),
        orderNum: 907,
        component: lazy(() => import('@views/supplyChainCarbon/progress')),
      },
      {
        path: SupplyChainRefRouteMaps.certificates,
        meta: prototypeMeta('碳资质认证'),
        orderNum: 908,
        component: lazy(() => import('@views/supplyChainCarbon/certificates')),
      },
    ],
  },
  {
    path: SupplyChainRefRouteMaps.basicConfig,
    meta: {
      title: () => '基础配置',
      icon: 'icon-icon-shujupeizhi',
      prototypeAddedMenu: true,
      prototypePortalRole: 'admin',
      prototypeMenuNote: SUPPLY_CHAIN_MENU_NOTE,
    },
    orderNum: 910,
    component: lazy(async () => ({
      default: createRouteRedirect(SupplyChainRefRouteMaps.training),
    })),
    children: [
      {
        path: SupplyChainRefRouteMaps.training,
        meta: prototypeMeta('线上培训管理'),
        orderNum: 911,
        component: lazy(() => import('@views/supplyChainCarbon/training')),
        children: [
          {
            path: SupplyChainRefRouteMaps.trainingInfo,
            meta: {
              showInMenu: false,
              title: () => routeTypeNameRender('培训资料'),
            },
            component: lazy(
              () => import('@views/supplyChainCarbon/training/Info'),
            ),
          },
        ],
      },
      {
        path: SupplyChainRefRouteMaps.formTemplates,
        meta: prototypeMeta('调研表单配置'),
        orderNum: 912,
        component: lazy(() => import('@views/supplyChainCarbon/formTemplates')),
        children: [
          {
            path: SupplyChainRefRouteMaps.formTemplateCreate,
            meta: { showInMenu: false, title: () => '新增模板' },
            component: lazy(
              () => import('@views/supplyChainCarbon/formTemplates/Create'),
            ),
          },
          {
            path: SupplyChainRefRouteMaps.formTemplateInfo,
            meta: { showInMenu: false, title: () => '配置字段' },
            component: lazy(
              () =>
                import('@views/supplyChainCarbon/formTemplates/FieldEditor'),
            ),
          },
        ],
      },
    ],
  },
];
