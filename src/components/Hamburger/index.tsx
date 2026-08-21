/*
 * @@description: 菜单栏展开收起控制按钮
 * @Author: qifeng qifeng@carbonstop.net
 * @Date: 2022-12-05 15:16:40
 * @LastEditors: qifeng qifeng@carbonstop.net
 * @LastEditTime: 2023-02-23 17:37:11
 */
import { MenuFoldOutlined, MenuUnfoldOutlined } from '@ant-design/icons';
import { memo, MouseEventHandler } from 'react';
import './index.less';

interface HamburgerProps {
  isActive: boolean;
  onTrigger: MouseEventHandler<HTMLDivElement>;
}

function Hamburger({ isActive, onTrigger }: HamburgerProps) {
  return (
    <div className='layout__nav-bar__hamburger' onClick={ev => onTrigger(ev)}>
      {isActive ? <MenuFoldOutlined /> : <MenuUnfoldOutlined />}
      {/* {isActive && (
        <span className='layout__nav-bar__hamburger__tip'>收起菜单</span>
      )} */}
    </div>
  );
}

export default memo(Hamburger);
