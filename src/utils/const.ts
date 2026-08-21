/*
 * @@description:全局静态值
 */
export enum constant {
  /** 路由重定向使用的key */
  'redirectURL' = 'redirectURL',
}

export const BUTTON_AUTH = 'React-ant-Admin-Auth';

/** 文件上传地址 */
export const UPLOAD_FILES_URL = import.meta.env.REACT_APP_API_FILE_UPLOAD_URL;

/** 随机文件名-文件上传地址 */
export const UPLOAD_FILES_RANDOM_NAME_URL = import.meta.env
  .REACT_APP_API_FILE_UPLOAD_RANDOMNAME_URL;

/** 文件上传 -漏洞检查 */
export const UPLOAD_FILES_URL_SALE = import.meta.env
  .REACT_APP_API_FILE_UPLOAD_URL_SALE;
/** 随机文件名-文件上传地址 - 漏洞检查 */
export const UPLOAD_FILES_RANDOM_NAME_URL_SALE = import.meta.env
  .REACT_APP_API_FILE_UPLOAD_RANDOMNAME_URL_SALE;

/** 模板文件域名 */
export const TEMPLATE_FILE_URL = import.meta.env
  .REACT_APP_API_TEMPLATE_FILE_URL;

/** 组织状态 */
export const ORG_STATUS = {
  /** 启用 */
  ENABLE: 0,
  /** 禁用 */
  DISABLE: 1,
} as const;

/** 组织类型 */
export const ORG_TYPE = {
  /** 虚拟组织 */
  VIRTUAL: 1,
  /** 真实组织 */
  REAL: 0,
};

/** 操作按钮类型 */
export enum ActionTypeEnum {
  /** 编辑 */
  EDIT = 'edit',
  /** 复制 */
  COPY = 'copy',
  /** 查看 */
  SHOW = 'show',
  /** 删除 */
  DELETE = 'delete',
  /** 数据管理 */
  DATA_MANAGE = 'data_manage',
}
