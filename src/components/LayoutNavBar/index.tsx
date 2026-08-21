/*
 * @@description: 导航栏右侧按钮
 * @Author: qifeng qifeng@carbonstop.net
 * @Date: 2022-12-05 15:16:40
 * @LastEditors: ljh255 jinhai@carbonstop.net
 * @LastEditTime: 2023-03-22 10:34:53
 */
import classNames from 'classnames';
import { memo } from 'react';
import './index.less';
import { useSelector } from 'react-redux';

// import NoticeIcon from '../NoticeIcon';
import { RootState } from '@/store/types';

import AvatarDropdown from './AvatarDropdown';

export type LayoutNavBarProps = {
  justShowUser?: boolean;
};

function LayoutNavBar() {
  const selector = useSelector((s: RootState) => s);
  const { theme } = selector.systemSettings;

  return (
    <div className='layout__navbar'>
      <div className='layout__navbar__menu'>
        {/* {!justShowUser && <NoticeIcon />} */}
        <AvatarDropdown
          classNames={classNames(
            'layout__navbar__menu-item',
            `layout__navbar__menu-item--${theme}`,
          )}
        />
      </div>
    </div>
  );
}

export default memo(LayoutNavBar);
