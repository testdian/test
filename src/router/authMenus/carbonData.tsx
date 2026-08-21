/**
 * @description 数据看板路由
 */
import I18N from '@src/lang/I18N';
import { lazy } from 'react';

import { Routes } from '../config';
import { DataRouteMaps } from '../utils/carbonDataEnums';

export const carbonDataRoute: Routes[] = [
  {
    path: DataRouteMaps.dataDashboard,
    meta: {
      title: () => I18N.dataDashboard.dataBoard,
      icon: 'icon-icon_zhibiaoguanli',
    },
    component: lazy(() => import('@views/dataDashboard/index')),
  },
];
