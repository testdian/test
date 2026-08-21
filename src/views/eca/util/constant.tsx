import I18N from '@/lang/I18N';

/** 参数属性格式的类型 */
export const COMMON_PARAM_TYPE = {
  /** 文本 */
  TEXT: 1,
  /** 数值 */
  NUMBER: 2,
  /** 选项 */
  SELECT: 3,
  /** 时间 */
  TIME: 4,
  /** 地址 */
  ADDRESS: 5,
} as const;

/** 参数 code 表示 */
export const PARAM_CODE = 'code_';

/** 模版标识 */
export const TEMPLATE_CODE = I18N.components.templateFlagName;
