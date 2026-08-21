/**
 * @description CBAM路由
 */
import I18N from '@src/lang/I18N';
import { lazy } from 'react';

import { Routes } from '../config';
import { CBAMRouteMaps } from '../utils/cbam';
import { routeTypeNameRender } from '../utils/index';

export const cbamRoute: Routes[] = [
  {
    path: CBAMRouteMaps.cbam,
    meta: {
      title: () => 'CBAM',
      icon: 'icon-icon_shebei',
    },
    children: [
      {
        path: CBAMRouteMaps.cbamHome,
        meta: {
          title: () => I18N.cbam.cbamParticipation,
        },
        component: lazy(() => import('@/views/cbam/Home/index')),
      },
      {
        path: CBAMRouteMaps.cbamFactory,
        meta: {
          title: () => I18N.cbam.factoryInformation,
        },
        component: lazy(() => import('@/views/cbam/FactoryInformation/index')),
      },
      {
        path: CBAMRouteMaps.cbamReport,
        meta: {
          title: () => I18N.cbam.cbamNews,
        },
        component: lazy(() => import('@/views/cbam/ReportForm/index')),
        children: [
          {
            path: CBAMRouteMaps.cbamReportInfo,
            meta: {
              title: () => routeTypeNameRender(I18N.cbam.reportForm),
            },
            component: lazy(() => import('@/views/cbam/ReportForm/Info/index')),
          },
        ],
      },
      // {
      //   path: CBAMRouteMaps.cbamParameter,
      //   meta: {
      //     title: () => I18N.cbam.cbamParticipation,
      //   },
      //   component: lazy(() => import('@/views/cbam/ParameterConfig/index')),
      // },
      {
        path: CBAMRouteMaps.cbamPrecursorData,
        meta: {
          title: () => I18N.cbam.beforeCbam,
        },
        component: lazy(() => import('@/views/cbam/PrecursorData/index')),
        children: [
          {
            path: CBAMRouteMaps.cbamPrecursorDataInfo,
            meta: {
              title: () => routeTypeNameRender(I18N.cbam.beforeCbam),
            },
            component: lazy(
              () => import('@/views/cbam/PrecursorData/Info/index'),
            ),
          },
        ],
      },
      {
        path: CBAMRouteMaps.cbamPrecursorDataApproval,
        meta: {
          title: () => I18N.cbam.beforeCbam2,
        },
        component: lazy(
          () => import('@/views/cbam/PrecursorDataApproval/index'),
        ),
        children: [
          {
            path: CBAMRouteMaps.cbamPrecursorDataApprovalInfo,
            meta: {
              title: () => routeTypeNameRender(I18N.cbam.beforeCbam2),
            },
            component: lazy(
              () => import('@/views/cbam/PrecursorDataApproval/Info/index'),
            ),
          },
        ],
      },
      {
        path: CBAMRouteMaps.cbamPrecursorDataFill,
        meta: {
          title: () => I18N.cbam.beforeCbam3,
        },
        component: lazy(() => import('@/views/cbam/PrecursorDataFill/index')),
        children: [
          {
            path: CBAMRouteMaps.cbamPrecursorDataFillInfo,
            meta: {
              title: () => routeTypeNameRender(I18N.cbam.beforeCbam3),
            },
            component: lazy(
              () => import('@/views/cbam/PrecursorDataFill/Info/index'),
            ),
          },
        ],
      },
    ],
  },
];
