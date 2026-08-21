/*
 * @@description:首页入口
 * @Author: qifeng qifeng@carbonstop.net
 * @Date: 2022-12-05 15:16:40
 * @LastEditors: Please set LastEditors
 * @LastEditTime: 2023-07-28 16:00:58
 */

import I18N from '@src/lang/I18N';
import classnames from 'classnames';
import { memo } from 'react';
import './index.less';
import { useSelector } from 'react-redux';
import { useNavigate } from 'react-router-dom';

import Breadcrumb from '@/components/Breadcrumb';
import { FormActions } from '@/components/FormActions';
import NewLayoutHeader from '@/components/LayoutHeader/newLayoutHeader';
import { RequirementSpecFab } from '@/components/RequirementSpecDrawer';
import { RootState } from '@/store/types';

import MainRoutes from './MainRoutes';
import { LayoutSideBar as Sidebar } from '../components/LayoutSideBar/index';

function Layout() {
  const navigator = useNavigate();

  const systemSettings = useSelector(
    (state: RootState) => state.systemSettings,
  );

  return (
    <section
      className={classnames({
        layout: true,
        'layout--side-bar': systemSettings.layout === 'side',
        'layout--weak': systemSettings.colorWeak,
      })}
    >
      <section className={classnames('layout__main')}>
        <div className='newSideContainer'>
          <NewLayoutHeader />
          {systemSettings.layout === 'side' && <Sidebar />}
        </div>
        <div
          className={classnames('layout__container', {
            'layout__container--fix': systemSettings.fixedHeader,
            'layout__container--fixed':
              systemSettings.contentWidth === 'fixed' &&
              systemSettings.layout === 'top',
          })}
        >
          <Breadcrumb />
          <MainRoutes />
        </div>
      </section>
      <RequirementSpecFab />
      {/* 自定义布局设置按钮 */}
      {['/home/message'].includes(window.location.pathname) && (
        <FormActions
          place='center'
          buttons={[
            {
              title: I18N.Factors.return,
              onClick: async () => {
                navigator('/home');
              },
            },
          ]}
        />
      )}
    </section>
  );
}

export default memo(Layout);
