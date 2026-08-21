/*
 * @@description:排放因子路由
 * @Author: qifeng qifeng@carbonstop.net
 * @Date: 2023-02-16 14:24:03
 * @LastEditors: ljh255 jinhai@carbonstop.net
 * @LastEditTime: 2023-04-13 17:27:48
 */
import I18N from '@src/lang/I18N';
import { lazy } from 'react';

import { Routes } from '../config';
import { RouteMaps } from '../utils/enums';
import { routeTypeNameRender } from '../utils/index';

export const factorRoute: Routes[] = [
  {
    path: RouteMaps.factor,
    meta: {
      title: () => I18N.router.emissionFactorLibrary,
      icon: 'icon-icon-wodepaifangyinziku',
    },
    children: [
      {
        path: RouteMaps.factorList,
        meta: {
          title: () => I18N.Factors.emissionFactors,
        },
        component: lazy(() => import('@views/Factors')),
        children: [
          {
            path: RouteMaps.factorInfo,
            meta: {
              showInMenu: false,
              title: () => routeTypeNameRender(I18N.Factors.emissionFactors),
            },
            component: lazy(() => import('@views/Factors/Info')),
          },
        ],
      },
    ],
  },
];
