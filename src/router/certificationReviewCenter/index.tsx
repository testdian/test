/**
 * @description 产品碳足迹LCA升级版路由
 */
import I18N from '@src/lang/I18N';
import { lazy } from 'react';

import { Routes } from '../config';
import { CertifiCatioinReviewCenterMaps } from '../utils/certificationReviewCenterEmums';
import { routeTypeNameRender } from '../utils/index';

export const certificationReviewCenterRoute: Routes[] = [
  {
    path: CertifiCatioinReviewCenterMaps.certificationReviewCenterEca,
    meta: {
      title: () => I18N.certificationReviewCenter.certificationReviewInProgress,
      icon: 'icon-icon_foot2',
    },
    component: lazy(() => import('@/views/certificationReviewCenter/eca')),
    children: [
      {
        path: CertifiCatioinReviewCenterMaps.certificationReviewCenterEcaInfo,
        meta: {
          showInMenu: false,
          title: () => routeTypeNameRender(I18N.router.reviewDocuments),
        },
        component: lazy(
          () => import('@views/certificationReviewCenter/eca/Info/index'),
        ),
        children: [
          {
            path: CertifiCatioinReviewCenterMaps.certificationReviewCenterEcaCarbonMissionInfo,
            meta: {
              showInMenu: false,
              title: () => I18N.router.carbonEmissionAccounting,
            },
            component: lazy(
              () => import('@views/eca/NewCarbonMissionAccounting/Info'),
            ),
          },
          {
            path: CertifiCatioinReviewCenterMaps.certificationReviewCenterEcaInfoChooseCarbonMission,
            meta: {
              showInMenu: false,
              title: () => I18N.router.chooseCarbonEmissions,
            },
            component: lazy(
              () =>
                import(
                  '@views/eca/carbonMissionAccounting/chooseCarbonAccount'
                ),
            ),
            children: [
              {
                path: CertifiCatioinReviewCenterMaps.certificationReviewCenterEcaInfoChooseCarbonMissionInfo,
                meta: {
                  showInMenu: false,
                  title: () => I18N.router.carbonEmissionAccounting,
                },
                component: lazy(
                  () => import('@views/eca/NewCarbonMissionAccounting/Info'),
                ),
              },
            ],
          },
        ],
      },
      {
        path: CertifiCatioinReviewCenterMaps.certificationReviewCenterFootprintLInfo,
        meta: {
          showInMenu: false,
          title: () => routeTypeNameRender(I18N.router.reviewDocuments),
        },
        component: lazy(
          () => import('@views/certificationReviewCenter/eca/Info/index'),
        ),
        children: [
          {
            path: CertifiCatioinReviewCenterMaps.certificationReviewCenterFootprintInfoChooseReport,
            meta: {
              showInMenu: false,
              title: () => I18N.carbonFootPrintLCA.chooseASolution,
            },
            component: lazy(
              () =>
                import(
                  '@views/certificationReviewCenter/eca/Info/chooseReport'
                ),
            ),
            children: [
              {
                path: CertifiCatioinReviewCenterMaps.certificationReviewCenterFootprintInfoChooseReportInfo,
                meta: {
                  showInMenu: false,
                  title: () => I18N.router.planDetails,
                },
                component: lazy(
                  () => import('@views/certificationReviewCenter/eca/Info/'),
                ),
              },
            ],
          },
          {
            path: CertifiCatioinReviewCenterMaps.certificationReviewCenterEcaInfoChooseCarbonMission,
            meta: {
              showInMenu: false,
              title: () => I18N.router.chooseCarbonEmissions,
            },
            component: lazy(
              () =>
                import(
                  '@views/eca/carbonMissionAccounting/chooseCarbonAccount'
                ),
            ),
            children: [
              {
                path: CertifiCatioinReviewCenterMaps.certificationReviewCenterEcaInfoChooseCarbonMissionInfo,
                meta: {
                  showInMenu: false,
                  title: () => I18N.router.carbonEmissionAccounting,
                },
                component: lazy(
                  () => import('@views/eca/carbonMissionAccounting/Info'),
                ),
              },
            ],
          },
        ],
      },
      {
        path: CertifiCatioinReviewCenterMaps.certificationReviewCenterCbamInfo,
        meta: {
          showInMenu: false,
          title: () => routeTypeNameRender(I18N.router.reviewDocuments),
        },
        component: lazy(
          () => import('@views/certificationReviewCenter/eca/Info/index'),
        ),
        children: [
          {
            path: CertifiCatioinReviewCenterMaps.certificationReviewCenterCbamInfoCbam,
            meta: {
              showInMenu: false,
              title: () => I18N.cbam.reportForm + I18N.eca.details,
            },
            component: lazy(
              () =>
                import(
                  '@views/certificationReviewCenter/cbam/ReportForm/Info/index'
                ),
            ),
          },
          {
            path: CertifiCatioinReviewCenterMaps.certificationReviewCenterCbamInfoOriginCbam,
            meta: {
              title: () => I18N.cbam.reportForm + I18N.eca.details,
            },
            component: lazy(() => import('@/views/cbam/ReportForm/Info/index')),
          },
        ],
      },
    ],
  },
];
