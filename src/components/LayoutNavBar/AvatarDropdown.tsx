/*
 * @@description: 用户头像
 * @Author: qifeng qifeng@carbonstop.net
 * @Date: 2022-12-05 15:16:40
 * @LastEditors: lichunxiao 1359758885@aa.com
 * @LastEditTime: 2023-07-17 16:43:50
 */
import { noop } from 'lodash-es';
import { memo, useCallback, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useNavigate } from 'react-router-dom';

import I18N from '@/lang/I18N';
import { RouteMaps, virtualLinkTransform } from '@/router/utils/enums';
import { getAuthTokenLogout } from '@/sdks/authV2ApiDocs';
import { removeSideBarRoutes } from '@/store/module/systemOperations';
import { userInfoActions } from '@/store/module/user';
import { RootState } from '@/store/types';
import { BUTTON_AUTH } from '@/utils/const';
import LocalStore from '@/utils/store';

import NavDropdown from './NavDropdown';
import { IconFont } from '../IconFont';

interface AvatarDropdownProps {
  classNames: string;
}

function AvatarDropdown(props: AvatarDropdownProps) {
  const history = useNavigate();
  const selector = useSelector((s: RootState) => s);
  const dispatch = useDispatch();
  const [dropdownOpen, setDropdownOpen] = useState(false);

  const onMenuClick = useCallback(({ key }: { key: string }) => {
    if (key === 'logout') {
      getAuthTokenLogout({}).catch(noop);
      // fix: 退出登录接口拿不到token
      setTimeout(() => {
        dispatch(userInfoActions.clearUserInfo());
        dispatch(removeSideBarRoutes());
        LocalStore.removeValue(BUTTON_AUTH);
        history(RouteMaps.login);
      });
    }
  }, []);

  return (
    <NavDropdown
      menu={{
        items: [
          {
            label: I18N.utils.accountManagement,
            key: '账号管理',
            onClick: () => {
              history(
                virtualLinkTransform(
                  RouteMaps.profile,
                  [':id'],
                  [selector.userInfo.userId],
                ),
              );
              setDropdownOpen(false);
            },
            // @ts-ignore
            'aria-label': RouteMaps.profile,
          },
          {
            onClick: onMenuClick,
            label: I18N.utils.LogOut,
            key: 'logout',
            // @ts-ignore
            'aria-label': 'logout',
          },
        ],
      }}
      overlayClassName='layout__navbar__avatar-menu'
      trigger={['hover']}
      onOpenChange={stat => {
        setDropdownOpen(stat);
      }}
    >
      <div className={props.classNames}>
        {/* <Avatar size='small' className='' alt='avatar' /> */}
        <IconFont
          className='layout__navbar__avatar'
          icon='icon-icon-yonghutouxiang'
        />
        <span className='layout__navbar__account'>
          {selector.userInfo.username}
        </span>
        <IconFont
          className='action-icon'
          icon={
            dropdownOpen ? 'icon-icon-fucengzhankai' : 'icon-icon-fucengshouqi'
          }
        />
      </div>
    </NavDropdown>
  );
}

export default memo(AvatarDropdown);
