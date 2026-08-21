import { CaRouteMaps } from './caEmums';
import { DataRouteMaps } from './carbonDataEnums';
import { CarbonVerifyRouteMaps } from './carbonVerifyEnum';
import { CBAMRouteMaps } from './cbam';
import { CertifiCatioinReviewCenterMaps } from './certificationReviewCenterEmums';
import { EcaRouteMaps } from './ecaEmums';
import { ICARouteMaps } from './icaEnums';
import { LCARouteMaps } from './lcaEnums';
import { ProRouteMaps } from './prodEmums';
import { SccmRouteMaps } from './sccmEnums';

export { CarbonVerifyRouteMaps } from './carbonVerifyEnum';

/* 页面类型 路由占位符 */
export const PAGE_TYPE_VAR = ':pageTypeInfo';
/** 选择减排场景**/
export const CHOOSETYPE = ':chooseType';

/** 页面状态类型函数 */
export type PageType<T extends Record<string, string> = any> = {
  pageTypeInfo: PageTypeInfo;
} & T;

/** 页面状态 */
export enum PageTypeInfo {
  /** 新增 */
  'add' = 'add',
  /** 编辑 */
  'edit' = 'edit',
  /** 详情 */
  'show' = 'show',
  /** 复制 */
  'copy' = 'copy',
}

/** 路由变量 */
export enum RouteMaps {
  'layout' = '/*',
  'home' = '/home',
  /** 登录页 */
  'login' = '/login',
  /** 登录认证页 */
  'loginAuth' = '/loginSuccess',
  /** 登录用户无权限 */
  'loginError' = '/loginError',
  /** 修改密码 */
  'changePWD' = '/pwd-change',
  /** 错误页 */
  'error' = '/error',
  /** 错误页 */
  'error404' = '/error/404',
  /** 错误页 */
  'error403' = '/error/403',
  /** layout 主要结构页 */
  'dashborad' = '/dashborad',
  /** 账号管理 */
  'profile' = '/profile/:id',
  /** 消息中心**/
  'message' = '/home/message',
  /** 系统管理 */
  'system' = '/sys',
  /** 数据字典管理 */
  'systemDict' = '/sys/dicttype',
  /** 审批设置 */
  'systemApproval' = '/sys/approval',
  /** *系统设置***/
  'systemSetting' = '/sys/setting',
  /** 审批详情 */
  'systemApprovalInfo' = '/sys/approval/:pageTypeInfo',
  /** 数据字典分类 */
  'systemDictCategory' = '/sys/dicttype/category/:id',
  /** 数据字典枚举值 */
  'systemDictInfo' = '/sys/dicttype/info/:id',
  /** 操作日志 */
  'systemActionLog' = '/sys/operlog',
  /** 单位换算 */
  'systemUnits' = '/sys/units',
  /** 下载管理 */
  'systemDownload' = '/sys/download',
  /** 邮件管理 */
  'email' = '/sys/email',
  /** 邮件模板 */
  'EmailTemplate' = '/sys/email/emailTemplate',
  /** 邮件发送记录 */
  'EmailSendingRecord' = '/sys/email/emailSendingRecord',
  /** 页面配置 */
  'PageConfiguration' = '/sys/pageConfiguration',
  /** 接口管理 */
  'InterfaceManagement' = '/sys/interfaceManagement',
  /** 接口管理详情 */
  'InterfaceManagementInfo' = '/sys/interfaceManagement/:pageTypeInfo/:id',
  /** code配置 */
  'CodeConfiguration' = '/sys/codeConfiguration',
  /** 其他配置 */
  'OtherConfiguration' = '/sys/otherConfiguration',
  /** 其他配置详情 */
  'OtherConfigurationInfo' = '/sys/otherConfiguration/:pageTypeInfo/:settingType',

  /** 组织架构 */
  'orgs' = '/orgs',
  /** 组织管理 */
  'orgsManage' = '/orgs/manage',
  /** 版本管理 */
  'versionManage' = '/orgs/manage/version',
  /** 组织架构 upOrgId 上级组织信息 */
  'orgsAdd' = '/orgs/manage/:pageTypeInfo/:upOrgId/:pId',

  /** 用户管理 */
  'users' = '/sys/user',
  /** 用户信息详情 */
  'usersInfo' = '/sys/user/info/:pageTypeInfo/:id/:adminFlag',
  /** 内部用户 */
  'internalUsers' = '/sys/user/internal',
  /** 内部用户信息详情 */
  'internalUsersInfo' = '/sys/user/internal/:pageTypeInfo/:id',
  /** 外部用户 */
  'externalUsers' = '/sys/user/external',
  /** 外部用户信息详情 */
  'externalUsersInfo' = '/sys/user/external/:pageTypeInfo/:id',
  /** 角色管理 */
  'roles' = '/sys/roles',
  /** 角色管理 */
  'roleInfo' = '/sys/roles/:pageTypeInfo/:roleId',
  /** 权限管理 */
  'systemAuths' = '/sys/auth',
  /** 排放因子库 */
  'factor' = '/factor',
  /** 排放因子 */
  'factorList' = '/factor/list',
  /** 排放因子 */
  'factorInfo' = '/factor/list/info/:pageTypeInfo/:id',
  /** 行业缺省值 */
  'factorDefaultValues' = '/factor/defaultValues',
  /** 新增缺省值 */
  'factorDefaultValuesAdd' = '/factor/defaultValues/add',
  /** 缺省值管理 */
  'factorDefaultValuesManage' = '/factor/defaultValues/info/manage',
  /** 缺省值详情 */
  'factorDefaultValuesInfo' = '/factor/defaultValues/info/:pageTypeInfo',
  /** 产品碳足迹 */
  'carbonFootPrint' = '/carbonFootPrint',
  /** 产品碳足迹-产品管理 */
  'carbonFootPrintProduct' = '/carbonFootPrint/product',
  /** 产品碳足迹-产品管理详情 */
  'carbonFootPrintProductInfo' = '/carbonFootPrint/product/:pageTypeInfo/:id',
  /** 产品碳足迹-产品管理导入 */
  'carbonFootPrintProductImport' = '/carbonFootPrint/product/import',
  /** 产品碳足迹-碳足迹报告 */
  'carbonFootPrintReport' = '/carbonFootPrint/report',
  /** 产品碳足迹-碳足迹报告详情 */
  'carbonFootPrintReportInfo' = '/carbonFootPrint/report/:pageTypeInfo/:id/:functionUnitId',
  /** 产品碳足迹-碳足迹核算 */
  'carbonFootPrintAccounts' = '/carbonFootPrint/accounts',
  /** 产品碳足迹-碳足迹核算详情 */
  'carbonFootPrintAccountsInfo' = '/carbonFootPrint/accounts/:pageTypeInfo/:id',
  /** *产品碳足迹-碳足迹核算详情***/
  'carbonFootPrintAccountsDetail' = '/carbonFootPrint/accounts/modalShow/:modelId',
  /** 产品碳足迹-碳足迹核算模型 */
  'carbonFootPrintAccountsModel' = '/carbonFootPrint/accounts/model/:modelId',
  /** 产品碳足迹-碳足迹核算模型详情 */
  'carbonFootPrintAccountsModelDetail' = '/carbonFootPrint/accounts/model/detail/:pageTypeInfo/:modelId',
  /** 产品碳足迹-碳足迹核算模型详情 */
  'carbonFootPrintAccountsModelInfo' = '/carbonFootPrint/accounts/model/:modelId/:pageTypeInfo/:id/:stage/:stageName',
  /** 产品碳足迹-碳足迹核算导入排放源 */
  'carbonFootPrintAccountsModelImport' = '/carbonFootPrint/accounts/model/:modelId/import',
  /** 产品碳足迹-碳足迹核算选择排放因子 */
  'carbonFootPrintAccountsSelectEmissionFactor' = '/carbonFootPrint/accounts/model/:modelId/:pageTypeInfo/:id/:stage/:stageName/selectFactor',
  /** 产品碳足迹-碳足迹核算-核算模型-详情-选择供应商数据 */
  'carbonFootPrintAccountsSelectSupplierData' = '/carbonFootPrint/accounts/model/:modelId/:pageTypeInfo/:id/:stage/:stageName/selectSupplierData',
  /** 产品碳足迹-碳足迹核算-核算模型-详情-选择供应商数据-详情 */
  'carbonFootPrintAccountsSelectSupplierDataInfo' = '/carbonFootPrint/accounts/model/:modelId/:pageTypeInfo/:id/:stage/:stageName/selectSupplierData/:applyInfoId',
}
export type TypeMapRoute =
  | RouteMaps
  | EcaRouteMaps
  | SccmRouteMaps
  | ICARouteMaps
  | ProRouteMaps
  | CaRouteMaps
  | LCARouteMaps
  | DataRouteMaps
  | CertifiCatioinReviewCenterMaps
  | CBAMRouteMaps
  | CarbonVerifyRouteMaps;
/** 路由动态参数转换 */
export const virtualLinkTransform = (
  virtualLink: TypeMapRoute,
  replaces: string[],
  news: (string | number | undefined)[],
) => {
  let res: string = virtualLink;
  replaces.forEach((key, index) => {
    res = res.replace(key, String(news[index] ?? ''));
  });

  /** 移除链接末尾多余的 / */
  while (res.endsWith('/')) {
    res = res.slice(0, -1);
  }

  return res;
};
