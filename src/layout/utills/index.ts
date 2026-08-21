/*
 * @@description:
 * @Author: qifeng qifeng@carbonstop.net
 * @Date: 2022-12-30 15:42:14
 * @LastEditors: qifeng qifeng@carbonstop.net
 * @LastEditTime: 2023-02-08 17:16:26
 */
import { RouteMaps } from '@/router/utils/enums';
import store from '@/store';
import { BUTTON_AUTH } from '@/utils/const';
import LocalStore from '@/utils/store';
import { isPrototypeDemo } from '@/utils/prototypeDemo';

export type AuthProps<AuthResult> = {
  /** 路由path 或 权限点, 如果未提供，默认为有权限 */
  flag?: string;
  node: AuthResult;
  /** 权限类型，默认为 route */
  type?: 'Menu' | 'Route';
};
/**
 *  权限检查
 *  同时具备 菜单和路由权限检测
 * */
export const checkAuth = <AuthResult = any>(
  flag: string,
  node: AuthResult,
  type?: 'Menu' | 'Route',
): AuthResult | null => {
  if (flag === '') return node;
  if (!flag) return null;
  if (isPrototypeDemo()) return node;
  // 没有token -> 登录
  if (!store.getState().userInfo.accessToken)
    window.location.href = RouteMaps.login;
  // 检查路由权限
  if (type === 'Route') {
    // fixme 暂时用不到, 已经在 src/components/LayoutSideBar/index.tsx 文件控制
    if (
      true ||
      store.getState().userInfo?.permissions?.includes(flag as string)
    )
      return node;
    return null;
  }
  // 检查菜单权限

  /** 按钮权限 */
  const btnAuth: string[] = LocalStore.getValue(BUTTON_AUTH) || [];
  if (btnAuth?.includes(flag)) {
    return node;
  }
  return null;
};
