/*
 * @@description: 主要权限路由解析
 * @Author: qifeng qifeng@carbonstop.net
 * @Date: 2022-12-05 15:16:40
 * @LastEditors: ljh255 jinhai@carbonstop.net
 * @LastEditTime: 2023-06-20 15:39:04
 */
import { Spin } from 'antd';
import { compact } from 'lodash-es';
import { Suspense } from 'react';
import { Navigate, Route, Routes } from 'react-router-dom';

import { RouteMaps } from '@/router/utils/enums';

import Auth from './Auth';
import style from './MainRoutes.module.less';
import { Routes as ConfigRouteType } from '../router/config';
import { businessRouteList } from '../router/utils';

function renderRoute(route: ConfigRouteType) {
  const { component: Component } = route;
  if (!Component) return null;

  return (
    <Route
      caseSensitive
      key={route.path}
      path={route.path}
      element={
        <Auth route={route}>
          <Suspense
            fallback={
              <div className={style.center}>
                <Spin delay={200} size='large' />
              </div>
            }
          >
            <Component />
          </Suspense>
        </Auth>
      }
    />
  );
}

function RouteList() {
  const result: (JSX.Element | null)[] = [];

  businessRouteList.forEach(child => {
    result.push(renderRoute(child));
  });

  return (
    <Routes>
      {compact(result).map(C => C)}
      <Route path='/*' element={<Navigate to={RouteMaps.error404} />} />
    </Routes>
  );
}

export default RouteList;
