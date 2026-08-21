/** 状态 */
import I18N from '@src/lang/I18N';

export const STATUS = {
  /** 启用 */
  ENABLE: 0,
  /** 禁用 */
  DISABLE: 1,
};

/** 状态枚举 */
export const STATUS_ENUM = [
  {
    label: I18N.base.enable,
    value: STATUS.ENABLE,
  },
  {
    label: I18N.base.disabled,
    value: STATUS.DISABLE,
  },
];

/** 操作拦的状态 */
export const STATUS_ACTION_ENUM = {
  [STATUS.DISABLE]: I18N.base.enable,
  [STATUS.ENABLE]: I18N.base.disabled,
};
