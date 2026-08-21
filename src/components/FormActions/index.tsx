/*
 * @@description:底部的按钮区域
 * @Author: qifeng qifeng@carbonstop.net
 * @Date: 2022-12-30 15:37:06
 * @LastEditors: qifeng qifeng@carbonstop.net
 * @LastEditTime: 2023-03-22 10:53:44
 */
import classNames from 'classnames';
import { FC } from 'react';
import { useSelector } from 'react-redux';

import { checkAuth } from '@/layout/utills';
import { RootState } from '@/store/types';

import style from './index.module.less';
import { Button, ButtonProps } from '../Form/Button';

export type FormActionsProps = {
  buttons: (ButtonProps & { title: string; promisstion?: string })[];
  className?: string;
  place?: 'center' | 'right';
};

export const FormActions: FC<FormActionsProps> = ({
  className,
  buttons,
  place = 'right',
}) => {
  const app = useSelector<RootState, RootState['systemOperations']>(
    s => s.systemOperations,
  );
  return (
    <div
      className={classNames(style.wrapper, className, style[place], {
        [style.sidebarOpen]: app.sidebar.opened,
      })}
    >
      {buttons.map(({ title, className: cla, promisstion, ...btn }) => {
        const btns = () => (
          <Button
            className={classNames(style.button, cla)}
            {...btn}
            key={title}
          >
            {title}
          </Button>
        );
        return promisstion ? checkAuth(promisstion, btns()) : btns();
      })}
    </div>
  );
};
