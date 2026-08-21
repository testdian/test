/*
 * @@description: 主入口、layout & 全局路由
 * @Author: qifeng qifeng@carbonstop.net
 * @Date: 2022-12-05 15:16:40
 * @LastEditors: Please set LastEditors
 * @LastEditTime: 2024-12-18 17:44:58
 */
import { useUpdate } from 'ahooks';
import { Spin, App as AntdApp } from 'antd';
import { Suspense, ReactElement, useContext, useEffect } from 'react';
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';

import AntGlobalNotification from '@/store/module/notification';

import { AntProvider } from './components/AntdProvider';
import { LocaleContext } from './components/LocaleProvider';
import config from './config';
import Auth from './layout/Auth';
import { layoutRouteList } from './router/utils';
import './styles/index.less';
import 'antd/dist/reset.css';

function App(): ReactElement {
  const { locale } = useContext(LocaleContext);
  const update = useUpdate();
  // 切换语言后 app 层面强制刷新一次
  useEffect(update, [locale, update]);

  return (
    <AntdApp>
      <AntGlobalNotification />
      <AntProvider>
        <BrowserRouter basename={config.BASENAME}>
          <Routes>
            {layoutRouteList.map(route => {
              const Comp = route.component;
              if (Comp) {
                return (
                  <Route
                    key={route.path}
                    path={route.path}
                    errorElement={<div>error</div>}
                    element={
                      <Suspense
                        fallback={
                          <Spin size='large' className='layout__loading' />
                        }
                      >
                        <Auth route={route}>
                          <Comp />
                        </Auth>
                      </Suspense>
                    }
                  />
                );
              }
              return (
                <Route
                  key={route.path}
                  path={route.path}
                  element={<Navigate to={route.meta.redirect || '/'} />}
                />
              );
            })}
          </Routes>
        </BrowserRouter>
      </AntProvider>
    </AntdApp>
  );
}

export default App;
