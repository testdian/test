/**
 * @description 碳减排管理
 */
import { lazy } from 'react';

import { Routes } from '../config';
import { CarbonReductionRouteMaps } from '../utils/carbonReductionEnum';

export const carbonReductionRoute: Routes[] = [
  {
    path: CarbonReductionRouteMaps.carbonReduction,
    meta: {
      title: () => '碳减排管理',
      icon: 'icon-icon_zhibiaoguanli',
      showInMenu: false,
    },
    component: lazy(() => import('@views/eca/predictionEmissionReduction')),
  },
];
