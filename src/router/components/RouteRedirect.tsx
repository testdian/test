import { Navigate } from 'react-router-dom';

/** 父级菜单无页面组件时，重定向到首个子路由 */
export function createRouteRedirect(to: string) {
  return function RouteRedirect() {
    return <Navigate to={to} replace />;
  };
}
