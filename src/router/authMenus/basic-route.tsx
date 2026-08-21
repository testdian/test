/*
 * @@description: 基础框架路由
 */
import I18N from '@src/lang/I18N';
import { lazy } from 'react';

import { RouteMaps } from '../utils/enums';
import { routeTypeNameRender } from '../utils/index';

export const basicRoute = [
  // 以下菜单为系统权限管理
  {
    path: RouteMaps.system,
    meta: {
      title: () => I18N.router.systemManagement,
      icon: 'icon-icon-xitongguanli',
    },
    children: [
      {
        path: RouteMaps.users,
        meta: {
          title: () => I18N.dashborad.userManagement,
        },
        children: [
          {
            path: RouteMaps.internalUsers,
            meta: {
              title: () => '内部用户',
            },
            component: lazy(() => import('@views/dashborad/Users')),
            children: [
              {
                path: RouteMaps.internalUsersInfo,
                meta: {
                  showInMenu: false,
                  title: () => routeTypeNameRender('内部用户'),
                },
                component: lazy(() => import('@views/dashborad/Users/Info')),
              },
            ],
          },
          {
            path: RouteMaps.externalUsers,
            meta: {
              title: () => '外部用户',
            },
            component: lazy(
              () => import('@views/dashborad/Users/externalUser'),
            ),
            children: [
              {
                path: RouteMaps.externalUsersInfo,
                meta: {
                  showInMenu: false,
                  title: () => routeTypeNameRender('外部用户'),
                },
                component: lazy(
                  () => import('@views/dashborad/Users/Info/external'),
                ),
              },
            ],
          },
        ],
      },
      {
        path: RouteMaps.orgsManage,
        meta: {
          title: () => I18N.dashborad.organizationalManagement,
        },
        component: lazy(() => import('@views/dashborad/organization/index')),
        children: [
          {
            path: RouteMaps.versionManage,
            meta: {
              showInMenu: false,
              title: () => '版本管理',
            },
            component: lazy(
              () => import('@views/dashborad/organization/VersionManage'),
            ),
          },
        ],
      },
      {
        path: RouteMaps.roles,
        meta: {
          title: () => I18N.dashborad.roleManagement,
        },
        component: lazy(() => import('@views/dashborad/Role')),
        children: [
          {
            path: RouteMaps.roleInfo,
            meta: {
              showInMenu: false,
              title: () => routeTypeNameRender(I18N.dashborad.role),
            },
            component: lazy(() => import('@views/dashborad/Role/Info')),
          },
        ],
      },
      {
        path: RouteMaps.email,
        meta: {
          title: () => I18N.dashborad.emailManagement,
        },
        children: [
          {
            path: RouteMaps.EmailTemplate,
            meta: {
              title: () => I18N.router.templateManagement,
            },
            component: lazy(() => import('@views/dashborad/EmailTemplate')),
          },
          {
            path: RouteMaps.EmailSendingRecord,
            meta: {
              title: () => I18N.router.sendManagement,
            },
            component: lazy(
              () => import('@views/dashborad/EmailSendingRecord'),
            ),
          },
        ],
      },

      {
        path: RouteMaps.systemApproval,
        meta: {
          title: () => I18N.dashborad.approvalSettings,
        },
        component: lazy(() => import('@views/dashborad/Approval')),
        children: [
          {
            path: RouteMaps.systemApprovalInfo,
            meta: {
              showInMenu: false,
              title: () => routeTypeNameRender(I18N.router.approval),
            },
            component: lazy(() => import('@views/dashborad/Approval/Info')),
          },
        ],
      },
      {
        path: RouteMaps.PageConfiguration,
        meta: {
          title: () => I18N.dashborad.pageConfiguration,
          showInMenu: false,
        },
        component: lazy(() => import('@views/dashborad/PageConfiguration')),
      },
      {
        path: RouteMaps.InterfaceManagement,
        meta: {
          title: () => I18N.dashborad.interfaces,
        },
        component: lazy(() => import('@views/dashborad/InterfaceManagement')),
        children: [
          {
            path: RouteMaps.InterfaceManagementInfo,
            meta: {
              title: () => I18N.router.interfaceManagementDetails,
              showInMenu: false,
            },
            component: lazy(
              () => import('@views/dashborad/InterfaceManagement/Info'),
            ),
          },
        ],
      },
      {
        path: RouteMaps.systemActionLog,
        meta: {
          title: () => I18N.dashborad.operationLog,
        },
        component: lazy(() => import('@views/dashborad/ActionsLog')),
      },
      {
        path: RouteMaps.CodeConfiguration,
        meta: {
          title: () => I18N.router.codeCode,
          showInMenu: false,
        },
        component: lazy(() => import('@views/dashborad/CodeConfiguration')),
      },
      {
        path: RouteMaps.OtherConfiguration,
        meta: {
          title: () => I18N.dashborad.otherConfigurations,
        },
        component: lazy(() => import('@views/dashborad/OtherConfiguration')),
      },
      {
        path: RouteMaps.systemDownload,
        meta: {
          title: () => I18N.dashborad.downloadManagement,
        },
        component: lazy(() => import('@views/dashborad/Download')),
      },
      {
        path: RouteMaps.systemUnits,
        meta: {
          title: '单位换算',
        },
        component: lazy(() => import('@views/dashborad/Units')),
      },
      {
        path: RouteMaps.systemAuths,
        meta: {
          title: I18N.router.permissionManagement,
        },
        component: lazy(() => import('@views/dashborad/routeAuth')),
      },
    ],
  },
];
