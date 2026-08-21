import { useState } from 'react';

import { PageTypeInfo } from '@/router/utils/enums';

/**
 * 使用行动类型钩子。
 *
 * 此钩子提供了一种管理操作类型（如查看、编辑）的方式，并相应地更新界面的按钮类型。
 * 它接受一个展示抽屉（Drawer）的函数作为参数，抽屉通常用于显示更详细的信息或进行编辑操作。
 * 返回一个对象，包含当前操作类型的状态以及触发查看和编辑操作的方法。
 *
 * @param showDrawer 展示抽屉的函数，用于触发查看或编辑操作时打开抽屉。
 * @returns 返回一个对象，包含当前操作类型的状态（actionBtnType）以及触发查看（onView）和编辑（onEdit）操作的方法。
 */
export const useActionType = (showDrawer: () => void) => {
  /** 使用状态钩子来管理当前操作类型的状态。初始值为添加（add）操作类型。 */
  const [actionBtnType, setActionBtnType] = useState(PageTypeInfo.add);

  /**
   * 触发查看操作的方法。
   *
   * 调用传入的showDrawer函数以展示抽屉，并将当前操作类型状态更新为查看（show）类型。
   */
  const onView = () => {
    showDrawer();
    setActionBtnType(PageTypeInfo.show);
  };

  /**
   * 触发编辑操作的方法。
   *
   * 调用传入的showDrawer函数以展示抽屉，并将当前操作类型状态更新为编辑（edit）类型。
   */
  const onEdit = () => {
    showDrawer();
    setActionBtnType(PageTypeInfo.edit);
  };

  /** 返回当前操作类型的状态及触发查看和编辑操作的方法。 */
  return { actionBtnType, onView, onEdit };
};
