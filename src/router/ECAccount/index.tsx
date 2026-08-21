/*
 * @@description: 企业碳核算
 */
import I18N from '@src/lang/I18N';
import { lazy } from 'react';

import { ECAReportGenerationRoute } from './ecaReportGeneration';
import { accountingAllocationRoute } from '../authMenus/accountingAllocation';
import { EcaRouteMaps } from '../utils/ecaEmums';
import { PageTypeInfo } from '../utils/enums';
import { routeTypeNameRender, sccmRouteTypeNameRender } from '../utils/index';

export const ECARoute = [
  {
    path: EcaRouteMaps.eca,
    meta: {
      title: () => I18N.dashborad.enterpriseCarbonAccounting,
      icon: 'icon-icon-qiyetanhesuan',
    },
    children: [
      {
        path: EcaRouteMaps.carbonMissionAccounting,
        meta: {
          title: () => I18N.dashborad.enterpriseCarbonAccounting,
        },
        component: lazy(() => import('@views/eca/carbonMissionAccounting')),
        children: [
          {
            path: EcaRouteMaps.carbonMissionAccountingModelInfo,
            meta: {
              showInMenu: false,
              title: () => I18N.eca.modelDetails,
            },
            component: lazy(
              () =>
                import(
                  '@/views/eca/carbonMissionAccounting/Info/AccountModelDetail'
                ),
            ),
          },
          {
            path: EcaRouteMaps.carbonMissionAccountingInfo,
            meta: {
              showInMenu: false,
              title: () => routeTypeNameRender(I18N.router.businessAccounting),
            },
            component: lazy(
              () => import('@views/eca/carbonMissionAccounting/Info'),
            ),
            children: [
              {
                path: EcaRouteMaps.carbonMissionAccountingInfoEmissionSourceInfo,
                meta: {
                  showInMenu: false,
                  title: () => I18N.router.emissionSourceDetails,
                },
                component: lazy(
                  () =>
                    import(
                      '@/views/eca/carbonMissionAccounting/Info/sourceInfo'
                    ),
                ),
              },
            ],
          },
          {
            path: EcaRouteMaps.carbonMissionAccountingSourceInfo,
            meta: {
              showInMenu: false,
              title: () => I18N.eca.emissionSourceManagement,
            },
            component: lazy(
              () => import('@views/eca/carbonMissionAccounting/Info/source'),
            ),
            children: [
              {
                path: EcaRouteMaps.carbonMissionAccountingSource,
                meta: {
                  showInMenu: false,
                  title: () => I18N.eca.selectingEmissionSources,
                },
                component: lazy(() => import('@views/eca/emissionManage')),
              },
              {
                path: EcaRouteMaps.carbonMissionAccountingSourceInfoDetail,
                meta: {
                  showInMenu: false,
                  title: () => I18N.router.emissionSourceDetails,
                },
                component: lazy(() => import('@views/eca/emissionManage/Info')),
              },
              {
                path: EcaRouteMaps.carbonMissionAccountingSourceInfofactorDetail,
                meta: {
                  showInMenu: false,
                  title: () => I18N.router.emissionSourceDetails,
                },
                component: lazy(
                  () => import('@views/eca/component/emissionSourceDetail'),
                ),
              },
            ],
          },
          {
            path: EcaRouteMaps.carbonMissionAccountingAuditSourceInfo,
            meta: {
              showInMenu: false,
              title: () => I18N.router.emissionSourceDetails,
            },
            component: lazy(
              () => import('@views/eca/carbonMissionAccounting/AuditPage'),
            ),
          },
        ],
      },
      {
        path: EcaRouteMaps.fillData,
        meta: {
          title: () => I18N.supplyChainCarbonManagement.dataReporting,
        },
        component: lazy(() => import('@views/eca/fillData')),
        children: [
          {
            path: EcaRouteMaps.fillDataInfo,
            meta: {
              showInMenu: false,
              title: () =>
                routeTypeNameRender({
                  [PageTypeInfo.add]: I18N.router.fillingInData,
                  [PageTypeInfo.show]: I18N.router.fillInDetailedData,
                  [PageTypeInfo.edit]: I18N.router.fillingInDataCompilation,
                  [PageTypeInfo.copy]: I18N.router.fillingInDataCompilation,
                }),
            },
            component: lazy(() => import('@views/eca/fillData/Info')),
            children: [
              {
                path: EcaRouteMaps.fillDataInfoImport,
                meta: {
                  showInMenu: false,
                  title: () => I18N.carbonFootPrint.import,
                },
                component: lazy(() => import('@views/eca/fillData/Import')),
              },
              {
                path: EcaRouteMaps.fillDataAccountingSource,
                meta: {
                  showInMenu: false,
                  title: () => I18N.eca.selectingEmissionSources,
                },
                component: lazy(() => import('@views/eca/emissionManage')),
              },
              {
                path: EcaRouteMaps.fillDataAccountingSourceInfoDetail,
                meta: {
                  showInMenu: false,
                  title: () => I18N.router.emissionSourceDetails,
                },
                component: lazy(
                  () => import('@views/eca/component/emissionSourceDetail'),
                ),
              },
              {
                path: EcaRouteMaps.fillDataInfoScreen,
                meta: {
                  showInMenu: false,
                  title: () =>
                    sccmRouteTypeNameRender(
                      I18N.carbonData.emissionSources,
                      'detailfactor',
                    ),
                },
                component: lazy(
                  () => import('@views/eca/fillData/Info/emissionSourceInfo'),
                ),
                children: [
                  {
                    path: EcaRouteMaps.fillDataInfoScreenSelectEmissionSource,
                    meta: {
                      showInMenu: false,
                      title: () => I18N.eca.selectingEmissionSources,
                    },
                    component: lazy(
                      () => import('@views/eca/fillData/Info/chooseFactor'),
                    ),
                    children: [
                      {
                        path: EcaRouteMaps.fillDataInfoScreenSelectEmissionSourceDetail,
                        meta: {
                          showInMenu: false,
                          title: () => I18N.router.emissionFactorsDetailed,
                        },
                        component: lazy(
                          () => import('@views/Factors/Info/index'),
                        ),
                      },
                    ],
                  },
                  {
                    path: EcaRouteMaps.fillDataInfoScreenSelectSupplier,
                    meta: {
                      showInMenu: false,
                      title: () => I18N.components.selectSupplier,
                    },
                    component: lazy(
                      () => import('@views/eca/fillData/Info/chooseSupplier'),
                    ),
                    children: [
                      {
                        path: EcaRouteMaps.fillDataInfoScreenSelectSupplierDetail,
                        meta: {
                          title: () => I18N.router.supplierData,
                        },
                        component: lazy(
                          () =>
                            import(
                              '@views/eca/emissionManage/Info/supplierDataIDetail'
                            ),
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
    ],
  },
  // 报告生成配置路由
  ...ECAReportGenerationRoute,
  {
    path: EcaRouteMaps.emissionTarget,
    meta: {
      title: () => '排放目标',
      icon: 'icon-icon_zhibiaoguanli',
      prototypeAddedMenu: true,
      prototypeMenuNote: '在报告下增加同级别菜单：排放目标',
    },
    component: lazy(() => import('@views/eca/emissionTarget')),
  },
  {
    path: EcaRouteMaps.reductionMeasures,
    meta: {
      title: () => '减排措施',
      icon: 'icon-icon_zhibiaoguanli',
      prototypeAddedMenu: true,
      prototypeMenuNote:
        '把碳减排管理里减排措施这页复制出来，单独写一个菜单叫：减排措施，放在排放目标菜单下面，和它同级。',
    },
    component: lazy(() => import('@views/eca/reductionMeasures')),
  },
  // 核算配置路由
  ...accountingAllocationRoute,
];
