/*
 * @@description:路由权限
 * @Author: qifeng qifeng@carbonstop.net
 * @Date: 2022-12-05 15:16:40
 * @LastEditors: qifeng qifeng@carbonstop.net
 * @LastEditTime: 2023-03-22 14:28:13
 */

import { memo, ReactNode } from 'react';
import { Navigate } from 'react-router-dom';

import { RouteMaps } from '@/router/utils/enums';

import { checkAuth } from './utills';
import { Routes } from '../router/config';

interface AuthProps {
  route: Routes;
  children: ReactNode;
}

function Auth({ route, ...props }: AuthProps) {
  // 检查授权
  if (
    !Object.is(false, route.meta.auth) &&
    !checkAuth(route.path, true, 'Route')
  ) {
    return <Navigate to={RouteMaps.error403} />;
  }

  if (route.component) {
    // eslint-disable-next-line react/jsx-no-useless-fragment
    return <>{props.children}</>;
  }
  return <Navigate to={route.meta.redirect || RouteMaps.error404} />;
}

export default memo(Auth);
