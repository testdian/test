/** 用户类型 */
export const USER_TYPE = {
  /** 内部用户 */
  INTERNAL: '0',
  /** 外部用户 */
  EXTERNAL: '1',
} as const;

/** 用户状态 */
export const USER_STATUS = {
  /** 启用 */
  ENABLE: 0,
  /** 禁用 */
  DISABLE: 1,
} as const;
