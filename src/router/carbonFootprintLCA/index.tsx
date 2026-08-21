/**
 * @description 产品环境足迹路由
 */
import I18N from '@src/lang/I18N';
import { lazy } from 'react';

import { Routes } from '../config';
import { routeTypeNameRender } from '../utils/index';
import { LCARouteMaps } from '../utils/lcaEnums';

export const carbonFootprintLCARoute: Routes[] = [
  {
    path: LCARouteMaps.lca,
    meta: {
      title: () => I18N.router.theProductEnvironmentIsSufficient,
      icon: 'icon-icon_foot2',
    },
    children: [
      {
        path: LCARouteMaps.lcaProduction,
        meta: {
          title: () => I18N.carbonFootPrintLCA.productInformationManagement,
        },
        component: lazy(
          () => import('@/views/carbonFootPrintLCA/ProductManagement'),
        ),
      },
      {
        path: LCARouteMaps.lcaModel,
        meta: {
          title: () => I18N.carbonFootPrintLCA.carbonFootprintModel,
        },
        component: lazy(
          () => import('@/views/carbonFootPrintLCA/CarbonFootprintModel'),
        ),
        children: [
          {
            path: LCARouteMaps.lcaModelInfo,
            meta: {
              title: () =>
                routeTypeNameRender(
                  I18N.carbonFootPrintLCA.carbonFootprintModel,
                ),
            },
            component: lazy(
              () =>
                import('@/views/carbonFootPrintLCA/CarbonFootprintModel/Info'),
            ),
          },
          {
            path: LCARouteMaps.lcaModelInfoImport,
            meta: {
              title: () => I18N.carbonFootPrint.import,
            },
            component: lazy(
              () =>
                import(
                  '@/views/carbonFootPrintLCA/CarbonFootprintModel/Info/Import'
                ),
            ),
          },
        ],
      },
      {
        path: LCARouteMaps.lcaReport,
        meta: {
          title: () => I18N.carbonFootPrintLCA.carbonFootprintReport,
        },
        component: lazy(
          () => import('@/views/carbonFootPrintLCA/CarbonFootprintReport'),
        ),
      },
      {
        path: LCARouteMaps.lcaProcessLibrary,
        meta: {
          title: () => I18N.carbonFootPrintLCA.processLibrary,
        },
        component: lazy(
          () => import('@/views/carbonFootPrintLCA/ProcessesLibrary'),
        ),
        children: [
          {
            path: LCARouteMaps.lcaProcessLibraryInfo,
            meta: {
              title: () =>
                routeTypeNameRender(I18N.carbonFootPrintLCA.processLibrary),
            },
            component: lazy(
              () => import('@/views/carbonFootPrintLCA/ProcessesLibrary/Info'),
            ),
          },
        ],
      },
    ],
  },
];
