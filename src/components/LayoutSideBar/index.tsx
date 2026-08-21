/*
 * @@description: 菜单栏
 */
import { ConfigProvider, Menu } from 'antd';
import { ItemType } from 'antd/es/menu/interface';
import classnames from 'classnames';
import { FC, useEffect, useState } from 'react';
import { useSelector } from 'react-redux';
import { useNavigate } from 'react-router-dom';

import { menuRoutes } from '@/router/config';
import { SupplyChainSupplierRouteMaps } from '@/router/utils/supplyChainSupplierEnums';
import { HIDDEN_PROTOTYPE_MENU_NOTE } from '@/router/utils/hiddenPrototypeMenus';
import { getSystemPermissionRouter } from '@/sdks/systemV2ApiDocs';
import { ModifyNote } from '@/components/ModifyNote';
import { BUTTON_AUTH } from '@/utils/const';
import LocalStore from '@/utils/store';
import { isPrototypeDemo } from '@/utils/prototypeDemo';

import MenuUserPopover from './menuUser';
import { RouterKeyArr, transformPortalGroupedMenu } from './utils';
import { getPagePathList } from '../../router/utils';
import { RootState } from '../../store/types';
import {
  CARBON_USER_ROLE_CHANGED_EVENT,
  readStoredUserRole,
  writeStoredUserRole,
} from '@/views/supplyChainCarbon/hooks/useUserRole';
import './index.less';

export const LayoutSideBar: FC = () => {
  const navigator = useNavigate();
  const inlineCollapsed: {
    inlineCollapsed?: boolean;
  } = {};

  const selector = useSelector<RootState, RootState>(state => state);
  const { layout, theme } = selector.systemSettings;
  const { sidebar } = selector.systemOperations;

  if (layout === 'side') {
    inlineCollapsed.inlineCollapsed = !sidebar.opened;
  }

  const { pathname } = window.location;
  // const dispatch = useDispatch();
  // const onTrigger = useCallback(() => {
  //   dispatch(updateSideBarOpen(!sidebar.opened));
  // }, [sidebar, updateSideBarOpen]);

  const [authMenu, setAuthMenu] = useState<ItemType[]>();
  // getRoter
  const getRouterFn = async () => {
    if (isPrototypeDemo()) {
      LocalStore.setValue(BUTTON_AUTH, []);
      setAuthMenu(transformPortalGroupedMenu(menuRoutes, []));
      return;
    }
    await getSystemPermissionRouter({}).then(({ data }) => {
      /** 所有权限 */
      const allPerms = data?.data;

      /** 按钮权限用 */
      const permsArray = allPerms?.map(item => item?.perms);

      LocalStore.setValue(BUTTON_AUTH, permsArray);

      /** 菜单权限 */
      if (allPerms?.length) {
        setAuthMenu(transformPortalGroupedMenu(menuRoutes, allPerms));
      } else {
        setAuthMenu([]);
      }
    });
  };
  // 通过接口拿到可用的菜单权限；角色切换时刷新菜单
  useEffect(() => {
    getRouterFn();
    const onRoleChanged = () => {
      getRouterFn();
    };
    window.addEventListener(CARBON_USER_ROLE_CHANGED_EVENT, onRoleChanged);
    return () => {
      window.removeEventListener(CARBON_USER_ROLE_CHANGED_EVENT, onRoleChanged);
    };
  }, []);
  return (
    <aside
      className={classnames(
        'layout__side-bar',
        `layout__side-bar--${theme}`,
        `layout__side-bar--${layout}`,
        {
          'layout__side-bar--close': !sidebar.opened && layout === 'side',
        },
      )}
    >
      <div className='layout__side-bar__menu'>
        <div className='layout__side-bar__menu-note'>
          <ModifyNote content={HIDDEN_PROTOTYPE_MENU_NOTE} />
        </div>
        <ConfigProvider
          theme={{
            components: {
              Menu: {
                darkItemColor: '#fff',
                darkItemBg: '#001428',
                /** 暗色模式下的子菜单项背景 */
                darkSubMenuItemBg: '#001428',
                /** 暗色模式下的菜单项选中颜色 */
                darkItemSelectedColor: '#fff',
                darkItemHoverBg: 'rgba(255, 255, 255, 0.10)',
                darkItemSelectedBg: 'rgba(255, 255, 255, 0.10)',
              },
            },
          }}
        >
          <Menu
            selectedKeys={[
              ...RouterKeyArr.filter(item => pathname.indexOf(item) >= 0),
            ]}
            defaultOpenKeys={
              layout === 'side' && sidebar.opened
                ? getPagePathList(pathname)
                : []
            }
            mode={layout === 'side' ? 'inline' : 'horizontal'}
            theme={theme}
            {...inlineCollapsed}
            items={authMenu}
            onClick={selectInfo => {
              const isSupplierMenu =
                selectInfo.key ===
                  SupplyChainSupplierRouteMaps.supplierPortal ||
                selectInfo.key.startsWith(
                  `${SupplyChainSupplierRouteMaps.supplierPortal}/`,
                );
              const currentRole = readStoredUserRole();
              if (isSupplierMenu && currentRole === 'admin') {
                writeStoredUserRole('supplierA');
              } else if (!isSupplierMenu && currentRole !== 'admin') {
                writeStoredUserRole('admin');
              }
              navigator(selectInfo.key);
            }}
          />
        </ConfigProvider>
      </div>

      {/* 用户名Popover */}
      <MenuUserPopover />
      {/* {layout === 'side' && (
        <Hamburger isActive={sidebar.opened} onTrigger={onTrigger} />
      )} */}
    </aside>
  );
};
