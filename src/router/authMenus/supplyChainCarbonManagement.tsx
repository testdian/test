/**
 * @description 供应链核算管理路由
 */
import I18N from '@src/lang/I18N';
import { lazy } from 'react';

import { Routes } from '../config';
import { PageTypeInfo } from '../utils/enums';
import { routeTypeNameRender } from '../utils/index';
import { SccmRouteMaps } from '../utils/sccmEnums';

export const supplyChainCarbonManagementRoute: Routes[] = [
  {
    path: SccmRouteMaps.sccm,
    meta: {
      title: () => I18N.supplyChainCarbonManagement.supplyChainAccounting,
      icon: 'icon-icon_gongzuotai',
    },
    children: [
      {
        path: SccmRouteMaps.sccmManagement,
        meta: {
          title: () => I18N.supplyChainCarbonManagement.supplyChainMerchants,
        },
        component: lazy(
          () =>
            import('@/views/supplyChainCarbonManagement/SupplierManagement'),
        ),
        children: [
          {
            path: SccmRouteMaps.sccmManagementImport,
            meta: {
              title: () => I18N.supplyChainCarbonManagement.importMerchants,
              showInMenu: false,
            },
            component: lazy(
              () =>
                import(
                  '@/views/supplyChainCarbonManagement/SupplierManagement/Import'
                ),
            ),
          },
          {
            path: SccmRouteMaps.sccmManagementInfo,
            meta: {
              title: () =>
                routeTypeNameRender(I18N.supplyChainCarbonManagement.merchant),
            },
            component: lazy(
              () =>
                import(
                  '@/views/supplyChainCarbonManagement/SupplierManagement/Info'
                ),
            ),
          },
        ],
      },
      {
        path: SccmRouteMaps.sccmProdct,
        meta: {
          title: () => I18N.router.procurementProductManagement,
        },
        component: lazy(
          () =>
            import(
              '@/views/supplyChainCarbonManagement/PurchaseProductManagement'
            ),
        ),
        children: [
          {
            path: SccmRouteMaps.sccmProdctImport,
            meta: {
              title: () => I18N.router.importProcurementProducts,
              showInMenu: false,
            },
            component: lazy(
              () =>
                import(
                  '@/views/supplyChainCarbonManagement/PurchaseProductManagement/Import'
                ),
            ),
          },
          {
            path: SccmRouteMaps.sccmProdctInfo,
            meta: {
              title: () =>
                routeTypeNameRender(I18N.components.purchasingProducts),
            },
            component: lazy(
              () =>
                import(
                  '@/views/supplyChainCarbonManagement/PurchaseProductManagement/Info'
                ),
            ),
            children: [
              {
                path: SccmRouteMaps.sccmProdctInfoCarbonFootPrintInfo,
                meta: {
                  title: () =>
                    routeTypeNameRender(
                      I18N.router.theProductEnvironmentIsSufficient,
                    ),
                },
                component: lazy(
                  () =>
                    import(
                      '@/views/supplyChainCarbonManagement/PurchaseProductManagement/components/CarbonFootPrintList/Info'
                    ),
                ),
                children: [
                  {
                    path: SccmRouteMaps.sccmProdctInfoCarbonFootPrintInfoEmissionSourceInfo,
                    meta: {
                      title: () => I18N.router.emissionSourceDetails,
                    },
                    component: lazy(
                      () =>
                        import(
                          '@/views/supplyChainCarbonManagement/components/CarbonFootPrintEmissionSource'
                        ),
                    ),
                  },
                ],
              },
            ],
          },
          {
            path: SccmRouteMaps.sccmProdctSupplierManagement,
            meta: {
              title: () => I18N.router.supplierManagement,
            },
            component: lazy(
              () =>
                import(
                  '@/views/supplyChainCarbonManagement/PurchaseProductManagement/SupplierManagement'
                ),
            ),
            children: [
              {
                path: SccmRouteMaps.sccmProdctSupplierManagementInfo,
                meta: {
                  title: () => routeTypeNameRender(I18N.router.supplier),
                },
                component: lazy(
                  () =>
                    import(
                      '@/views/supplyChainCarbonManagement/PurchaseProductManagement/SupplierManagement/Info'
                    ),
                ),
              },
              {
                path: SccmRouteMaps.sccmProdctSupplierManagementSelect,
                meta: {
                  title: () => I18N.router.selectSupplier,
                },
                component: lazy(
                  () =>
                    import(
                      '@/views/supplyChainCarbonManagement/PurchaseProductManagement/SupplierManagement/Select'
                    ),
                ),
              },
              {
                path: SccmRouteMaps.sccmProdctSupplierManagementApply,
                meta: {
                  title: () => I18N.router.applyForProductCarbon,
                },
                component: lazy(
                  () =>
                    import(
                      '@/views/supplyChainCarbonManagement/PurchaseProductManagement/SupplierManagement/Apply'
                    ),
                ),
              },
            ],
          },
        ],
      },
      {
        path: SccmRouteMaps.sccmQuestionnaire,
        meta: {
          title: () =>
            I18N.supplyChainCarbonManagement.merchantAssociationReview,
        },
        component: lazy(
          () => import('@/views/supplyChainCarbonManagement/AssociationReview'),
        ),
      },
      {
        path: SccmRouteMaps.sccmCarbonData,
        meta: {
          title: () => I18N.supplyChainCarbonManagement.supplierAccounting,
        },
        component: lazy(
          () =>
            import('@/views/supplyChainCarbonManagement/SupplierCarbonData'),
        ),
        children: [
          {
            path: SccmRouteMaps.sccmCarbonDataInfo,
            meta: {
              title: () =>
                routeTypeNameRender(
                  I18N.supplyChainCarbonManagement.supplierAccounting,
                ),
            },
            component: lazy(
              () =>
                import(
                  '@/views/supplyChainCarbonManagement/SupplierCarbonData/Info'
                ),
            ),
            children: [
              {
                path: SccmRouteMaps.sccmCarbonDataInfoEnterpriseEmissonSourceInfo,
                meta: {
                  title: () => I18N.router.emissionSourceDetails,
                },
                component: lazy(
                  () =>
                    import(
                      '@/views/supplyChainCarbonManagement/components/CarbonAccountingEmissionSource'
                    ),
                ),
              },
              {
                path: SccmRouteMaps.sccmCarbonDataInfoProductEmissonSourceInfo,
                meta: {
                  title: () => I18N.router.emissionFactorsDetailed,
                },
                component: lazy(
                  () =>
                    import(
                      '@/views/supplyChainCarbonManagement/components/CarbonFootPrintEmissionSource'
                    ),
                ),
              },
            ],
          },
        ],
      },
      {
        path: SccmRouteMaps.sccmApproval,
        meta: {
          title: () => I18N.supplyChainCarbonManagement.supplierData2,
        },
        component: lazy(
          () =>
            import('@/views/supplyChainCarbonManagement/CarbonDataApproval'),
        ),
        children: [
          {
            path: SccmRouteMaps.sccmApprovalInfo,
            meta: {
              title: () =>
                routeTypeNameRender({
                  [PageTypeInfo.add]:
                    I18N.supplyChainCarbonManagement.approvalAccountingQuantity,
                  [PageTypeInfo.show]:
                    I18N.supplyChainCarbonManagement.accountingDataDetails,
                  [PageTypeInfo.edit]:
                    I18N.supplyChainCarbonManagement.approvalAccountingQuantity,
                  [PageTypeInfo.copy]:
                    I18N.supplyChainCarbonManagement.copyAccountingQuantity,
                }),
            },
            component: lazy(
              () =>
                import(
                  '@/views/supplyChainCarbonManagement/CarbonDataApproval/Info'
                ),
            ),
            children: [
              {
                path: SccmRouteMaps.sccmApprovalInfoEnterpriseEmissonSourceInfo,
                meta: {
                  title: () => I18N.router.emissionSourceDetails,
                },
                component: lazy(
                  () =>
                    import(
                      '@/views/supplyChainCarbonManagement/components/CarbonAccountingEmissionSource'
                    ),
                ),
              },
              {
                path: SccmRouteMaps.sccmApprovalInfoProductEmissonSourceInfo,
                meta: {
                  title: () => I18N.router.emissionSourceDetails,
                },
                component: lazy(
                  () =>
                    import(
                      '@/views/supplyChainCarbonManagement/components/CarbonFootPrintEmissionSource'
                    ),
                ),
              },
            ],
          },
        ],
      },
      {
        path: SccmRouteMaps.sccmFill,
        meta: {
          title: () => I18N.supplyChainCarbonManagement.supplierData3,
        },
        component: lazy(
          () => import('@/views/supplyChainCarbonManagement/CarbonDataFill'),
        ),
        children: [
          {
            path: SccmRouteMaps.sccmFillInfo,
            meta: {
              title: () =>
                routeTypeNameRender({
                  [PageTypeInfo.add]:
                    I18N.supplyChainCarbonManagement.fillInTheAccountingAmount,
                  [PageTypeInfo.show]:
                    I18N.supplyChainCarbonManagement.accountingDataDetails,
                  [PageTypeInfo.edit]:
                    I18N.supplyChainCarbonManagement.fillInTheAccountingAmount,
                  [PageTypeInfo.copy]:
                    I18N.supplyChainCarbonManagement.copyAccountingQuantity,
                }),
            },
            component: lazy(
              () =>
                import(
                  '@/views/supplyChainCarbonManagement/CarbonDataFill/Info'
                ),
            ),
          },
        ],
      },
    ],
  },
];
