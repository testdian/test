/*
 * @@description: 企业碳核算
 */
import I18N from '@src/lang/I18N';
import { lazy } from 'react';

import { routeTypeNameRender } from '../utils/index';
import { ProRouteMaps } from '../utils/prodEmums';

export const ProdManagementRoutes = [
  {
    path: ProRouteMaps.prodManagement,
    meta: {
      title: () => I18N.router.productionOperations,
    },
    component: lazy(() => import('@views/prodManagement/index')),
    children: [
      {
        path: ProRouteMaps.prodManagementOperationalData,
        meta: {
          title: () => routeTypeNameRender(I18N.router.productionOperations),
          showInMenu: false,
        },
        component: lazy(() => import('@views/prodManagement/Info/index')),
      },
    ],
  },
];
