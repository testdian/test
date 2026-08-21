/*
 * @@description:核算配置路由
 */
import I18N from '@src/lang/I18N';
import { lazy } from 'react';

import { Routes } from '../config';
import { EcaRouteMaps } from '../utils/ecaEmums';
import { routeTypeNameRender } from '../utils/index';

export const accountingAllocationRoute: Routes[] = [
  {
    path: EcaRouteMaps.accountingAllocation,
    meta: {
      title: () => I18N.router.accountingConfigurationModule,
      icon: 'icon-icon-wodepaifangyinziku',
    },
    children: [
      {
        path: EcaRouteMaps.factor,
        meta: {
          title: () => I18N.router.emissionFactorLibrary,
        },
        component: lazy(() => import('@views/Factors')),
        children: [
          {
            path: EcaRouteMaps.factorInfo,
            meta: {
              showInMenu: false,
              title: () => routeTypeNameRender(I18N.Factors.emissionFactors),
            },
            component: lazy(() => import('@views/Factors/Info')),
          },
        ],
      },
      {
        path: EcaRouteMaps.ecaParameter,
        meta: {
          title: () => I18N.eca.parameterManagement,
        },
        component: lazy(() => import('@views/eca/Parameter')),
      },
      {
        path: EcaRouteMaps.emissionManage,
        meta: {
          title: () => I18N.eca.emissionSourceRepository,
        },
        component: lazy(() => import('@views/eca/emissionManage/emissionList')),
        children: [
          {
            path: EcaRouteMaps.emissionManagInfo,
            meta: {
              showInMenu: false,
              title: () => routeTypeNameRender(I18N.carbonData.emissionSources),
            },
            component: lazy(() => import('@views/eca/emissionManage/Info')),
          },
        ],
      },
      {
        path: EcaRouteMaps.accountingModel,
        meta: {
          title: () => I18N.Factors.accountingModel,
        },
        component: lazy(() => import('@views/eca/accountingModel')),
        children: [
          {
            path: EcaRouteMaps.accountingModelInfo,
            meta: {
              showInMenu: false,
              title: () => I18N.router.accountingModelInformation,
            },
            component: lazy(() => import('@/views/eca/accountingModel/Info')),
          },
          {
            path: EcaRouteMaps.emissionManagInfo,
            meta: {
              showInMenu: false,
              title: () => routeTypeNameRender(I18N.carbonData.emissionSources),
            },
            component: lazy(() => import('@views/eca/emissionManage/Info')),
          },
          // {
          //   path: EcaRouteMaps.accountingModelEmissionSource,
          //   meta: {
          //     showInMenu: false,
          //     title: () => I18N.eca.emissionSourceManagement,
          //   },
          //   component: lazy(
          //     () => import('@views/eca/accountingModel/emissionSource'),
          //   ),
          //   children: [
          //     {
          //       path: EcaRouteMaps.accountingModelEmissionSourceInfo,
          //       meta: {
          //         showInMenu: false,
          //         title: () => I18N.eca.selectingEmissionSources,
          //       },
          //       component: lazy(() => import('@views/eca/emissionManage')),
          //     },
          //     {
          //       path: EcaRouteMaps.accountingModelEmissionSourceInfoShow,
          //       meta: {
          //         showInMenu: false,
          //         title: () => I18N.router.emissionSourceDetails,
          //       },
          //       component: lazy(
          //         () => import('@views/eca/component/emissionSourceDetail'),
          //       ),
          //     },
          //   ],
          // },
        ],
      },
      {
        path: EcaRouteMaps.pom,
        meta: {
          title: () => I18N.eca.indexManagement,
        },
        component: lazy(() => import('@/views/eca/indicatorManagement')),
      },
      {
        path: EcaRouteMaps.dataDictionary,
        meta: {
          title: () => I18N.dashborad.dataDictionary,
        },
        component: lazy(() => import('@views/dashborad/Dicts')),
        children: [
          {
            path: EcaRouteMaps.systemDictCategory,
            meta: {
              title: () => I18N.router.classificationManagement,
              showInMenu: false,
            },
            component: lazy(() => import('@views/dashborad/Dicts/Category')),
          },
          {
            path: EcaRouteMaps.systemDictInfo,
            meta: {
              title: () => I18N.router.enumerationValueManagement,
              showInMenu: false,
            },
            component: lazy(() => import('@views/dashborad/Dicts/Enums')),
          },
        ],
      },
    ],
  },
];
