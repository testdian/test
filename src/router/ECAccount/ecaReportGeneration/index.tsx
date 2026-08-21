/*
 * @@description: 企业碳核算-报告生成模块
 */
import I18N from '@src/lang/I18N';
import { lazy } from 'react';

import { EcaRouteMaps } from '@/router/utils/ecaEmums';

import { routeTypeNameRender } from '../../utils/index';

export const ECAReportGenerationRoute = [
  {
    path: EcaRouteMaps.ecaReport,
    meta: {
      title: () => I18N.router.reportGenerationConfiguration,
      icon: 'icon-icon_fankuiliebiao',
    },
    children: [
      {
        path: EcaRouteMaps.baseYear,
        meta: {
          title: () => I18N.eca.baseYearSetting,
        },
        component: lazy(() => import('@views/eca/baseYear')),
        children: [
          {
            path: EcaRouteMaps.baseYearInfo,
            meta: {
              showInMenu: false,
              title: () => routeTypeNameRender(I18N.eca.baseYear2),
            },
            component: lazy(() => import('@views/eca/baseYear/Info')),
          },
        ],
      },
      {
        path: EcaRouteMaps.dataQualityManage,
        meta: {
          title: () => I18N.eca.dataQualityControl3,
        },
        component: lazy(() => import('@views/eca/dataQualityManage/index')),
        children: [
          {
            path: EcaRouteMaps.editDataQualityManage,
            meta: {
              showInMenu: false,
              title: () => routeTypeNameRender(I18N.eca.dataQualityControl2),
            },
            component: lazy(
              () => import('@views/eca/dataQualityManage/controlPlan/index'),
            ),
            children: [
              {
                path: EcaRouteMaps.editDataQualityManageEditDetail,
                meta: {
                  showInMenu: false,
                  title: () => I18N.router.editDataQuality,
                },
                component: lazy(
                  () =>
                    import('@views/eca/dataQualityManage/controlPlan/detail'),
                ),
              },
              {
                path: EcaRouteMaps.editDataQualityManageDetail,
                meta: {
                  showInMenu: false,
                  title: () => I18N.router.viewDataQuality,
                },
                component: lazy(
                  () =>
                    import('@views/eca/dataQualityManage/controlPlan/detail'),
                ),
              },
            ],
          },
        ],
      },
      {
        path: EcaRouteMaps.reductionScene,
        meta: {
          title: () => I18N.eca.emissionReductionScenarios,
        },
        component: lazy(() => import('@views/eca/reductionScene')),
        children: [
          {
            path: EcaRouteMaps.reductionSceneInfo,
            meta: {
              showInMenu: false,
              title: () =>
                routeTypeNameRender(I18N.eca.emissionReductionScenarios),
            },
            component: lazy(() => import('@views/eca/reductionScene/Info')),
          },
        ],
      },
      {
        path: EcaRouteMaps.accountingReport,
        meta: {
          title: () => I18N.eca.accountingReport,
        },
        component: lazy(() => import('@views/eca/accountingReport')),
        children: [
          {
            path: EcaRouteMaps.accountingReportInfo,
            meta: {
              showInMenu: false,
              title: () => routeTypeNameRender(I18N.router.report),
            },
            component: lazy(() => import('@views/eca/accountingReport/Info')),
            children: [
              {
                path: EcaRouteMaps.accountingReportInfoChooseScreen,
                meta: {
                  showInMenu: false,
                  title: () => I18N.eca.chooseAReductionVenue,
                },
                component: lazy(() => import('@views/eca/reductionScene')),
                children: [
                  {
                    path: EcaRouteMaps.accountingReportInfoChooseScreenDetail,
                    meta: {
                      showInMenu: false,
                      title: () =>
                        I18N.router.detailsOfEmissionReductionScenarios,
                    },
                    component: lazy(
                      () => import('@views/eca/reductionScene/Info'),
                    ),
                  },
                ],
              },
            ],
          },
        ],
      },
    ],
  },
];
