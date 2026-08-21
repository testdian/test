/** 列表操作按钮的类型 */
import I18N from '@src/lang/I18N';

export const ACTION_BTN_TYPE = {
  /** 新增 */
  ADD: 'add',
  /** 编辑 */
  EDIT: 'edit',
  /** 复制 */
  COPY: 'copy',
  /** 查看 */
  SHOW: 'show',
  /** 删除 */
  DELETE: 'delete',
} as const;

/** 参数类型 */
export const PARAM_TYPE = {
  /** 系统参数 */
  SYSTEM_PARAM: I18N.eca.systemParameter,
  /** 自定义参数 */
  CUSTOM_PARAM: I18N.eca.customParameters,
} as const;
