/**
 * @description 碳核查
 */
import { lazy } from 'react';

import { Routes } from '../config';
import { CarbonVerifyRouteMaps } from '../utils/carbonVerifyEnum';

export const carbonVerifyRoute: Routes[] = [
  {
    path: CarbonVerifyRouteMaps.carbonVerify,
    meta: {
      title: () => '碳核查',
      icon: 'icon-icon-hesuanyinqing',
      showInMenu: false,
    },
    children: [
      {
        path: CarbonVerifyRouteMaps.verificationPlan,
        meta: {
          title: () => '核查计划管理',
        },
        component: lazy(() => import('@/views/carbonVerify/VerificationPlan')),
        children: [
          {
            path: CarbonVerifyRouteMaps.verificationPlanInfo,
            meta: {
              title: () => '核查计划详情',
            },
            component: lazy(
              () => import('@/views/carbonVerify/VerificationPlan/Info'),
            ),
          },
        ],
      },
      {
        path: CarbonVerifyRouteMaps.verificationProcess,
        meta: {
          title: () => '核查过程管理',
        },
        component: lazy(
          () => import('@/views/carbonVerify/VerificationProcess'),
        ),
      },
      {
        path: CarbonVerifyRouteMaps.verificationProblem,
        meta: {
          title: () => '问题整改跟踪',
        },
        component: lazy(
          () => import('@/views/carbonVerify/VerificationProblem'),
        ),
        children: [
          {
            path: CarbonVerifyRouteMaps.verificationProblemInfo,
            meta: {
              title: () => '问题整改详情',
            },
            component: lazy(
              () => import('@/views/carbonVerify/VerificationProblem/Info'),
            ),
          },
        ],
      },
    ],
  },
];
