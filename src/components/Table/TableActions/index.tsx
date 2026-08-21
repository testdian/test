/*
 * @@description:表单的操作 menu
 * @LastEditors:王佳慧
 * @LastEditTime: 2024-12-27
 */

import { Button, Dropdown, DropdownProps } from 'antd';
import { ButtonProps } from 'antd/es/button';
import { ItemType } from 'antd/es/menu/interface';
import classNames from 'classnames';
import { uniqueId } from 'lodash-es';
import { Fragment, memo, ReactNode } from 'react';

import { IconFont } from '@/components/IconFont';

import style from './index.module.less';
import I18N from '../../../lang/I18N';

export type MenuType = {
  key: string;
  label: ReactNode;
  disabled?: boolean;
  onClick?: (ev: MouseEvent) => void;
};

export type TableActionsProps = Omit<DropdownProps, 'menu'> & {
  /** 默认为 「更多」 */
  buttonName?: ReactNode;
  menus: MenuType[];
  buttonProps?: ButtonProps[];
  /** 当前dropdown 的key E2E 测试需要 */
  dropDownKey?: string | number;
};

export const TableActions = memo(
  ({
    buttonName,
    buttonProps,
    menus,
    dropDownKey = 'more',
    ...props
  }: TableActionsProps) => {
    const showActionNum = 4;

    const menuItems = menus?.slice(showActionNum - 1)?.map?.(m => ({
      ...m,
      'aria-label': uniqueId(m?.key),
      onClick: m.onClick ? (ev: MouseEvent) => m.onClick?.(ev) : undefined,
    }));

    const renderButton = (menuList: MenuType[]) => (
      <>
        {menuList.map((m, index) => (
          <Fragment key={`${uniqueId(m?.key)}`}>
            {index > 0 && <span className={style.divider} />}
            <Button
              onClick={ev => {
                if (m?.onClick) {
                  m.onClick(ev as unknown as MouseEvent);
                }
              }}
              type='link'
              disabled={m?.disabled}
              {...(buttonProps?.[index] || {})}
              aria-label={`${uniqueId(m?.key)}`}
            >
              {m?.label}
            </Button>
          </Fragment>
        ))}
      </>
    );

    if (menus.length <= showActionNum) {
      return <div className={style.actionsWrapper}>{renderButton(menus)}</div>;
    }

    return (
      <div className={style.actionsWrapper}>
        {renderButton(menus.slice(0, showActionNum - 1))}
        <span className={style.divider} />
        <Dropdown
          placement='bottomRight'
          {...props}
          menu={{
            items: menuItems as ItemType[],
            className: classNames(
              style.tableDropdownWrapper,
              props?.overlayClassName,
              `table-dropdown-overlay-${dropDownKey}`,
            ),
          }}
        >
          <Button
            type='link'
            aria-label={`table-actions-${uniqueId(dropDownKey.toString())}`}
          >
            {buttonName || I18N.utils.more}
            <IconFont icon='icon-icon-zhankai' />
          </Button>
        </Dropdown>
      </div>
    );
  },
);
