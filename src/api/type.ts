export interface ResponseTreeType {
  code: number;
  data: DataItem[];
  msg: string;
}

export interface DataItem {
  children: ChildItem[];
  ghgCategory: number;
  ghgCategory_name: string;
  sumDischarge: string;
}

interface ChildItem {
  children: ActivityItem[];
  ghgClassify: number;
  isoclassifyStr: string;
  ghgClassify_name: string;
  sumDischarge: string;
  dataValue: number;
}

export interface ActivityItem {
  path: any;
  employeeNum: number;
  activityCategory: number;
  activityDept: string;
  activityRecordWay: string;
  activityScore: number;
  activityUnit: string;
  activityUnitName: string;
  carbonEmission: number;
  companyId: number;
  createBy: number;
  createTime: string;
  dataValue: number;
  deleted: boolean;
  emissionStatus: number;
  facility: string;
  factorDesc: string;
  factorId: number;
  factorScore: number;
  factorSource: string;
  factorType: number;
  gasList: GasItem[];
  ghgCategory: number;
  gwpVersion: string;
  id: number;
  isoCategory: number;
  isoClassify: number;
  languageSourceList: LanguageSourceItem[];
  relateEmission: number;
  snapshot: boolean;
  sourceCode: string;
  sourceName: string;
  supportFile: string;
  unitConver: string;
  updateBy: number;
  updateByName: string;
  updateTime: string;
  year: number;
  children: ActivityItem[];
  ghgClassify: number;
  isoclassifyStr: string;
  ghgClassify_name: string;
  sumDischarge: string;
}

interface GasItem {
  createBy: number;
  createTime: string;
  emissionSourceId: number;
  factorId: number;
  factorUnitM: string;
  factorUnitZ: string;
  factorValue: string;
  gas: string;
  gasType: string;
  id: number;
  productName: string;
  updateBy: number;
  updateByName: string;
  updateTime: string;
}

interface LanguageSourceItem {
  classType: string;
  createBy: number;
  createTime: string;
  delFlag: number;
  id: number;
  langType: number;
  sourceId: number;
  sourceType: number;
  sourceValue: string;
  updateBy: number;
  updateByName: string;
  updateTime: string;
}

/** 公共options类型 */
export interface OptionsType {
  label: string;
  value: string | number;
}

/**
 * 支撑材料
 */
export interface UploadFile {
  /**
   * 公司id
   */
  companyId?: number;
  /**
   * 创建者
   */
  createBy?: number;
  /**
   * 创建时间
   */
  createTime?: Date;
  /**
   * 标记删除。0 未删除 1 已删除
   */
  deleted?: boolean;
  /**
   * 文件uuid
   */
  fileId?: string;
  /**
   * 文件名
   */
  fileName?: string;
  /**
   * 文件外网url
   */
  fileUrl?: string;
  /**
   * id
   */
  id?: number;
  /**
   * 过程or输入/输出id
   */
  objectId?: number;
  /**
   * 模块类型: 1 过程; 2 输入/输出(1:过程; 2:输入/输出; 3:过程库; 4:输入/输出库)
   */
  objectType?: number;
  /**
   * 组织id
   */
  orgId?: number;
  /**
   * 更新者
   */
  updateBy?: number;
  /**
   * 更新时间
   */
  updateTime?: Date;
  [property: string]: any;
}

/**
 * 登录相关的加密数据
 */
export interface EncryptedLoginData {
  encryptedLoginData: string;
  encryptedAesKey: string;
  encryptedIv: string;
}

export interface FileBackParamsType {
  fileName: string;
  filePath: string;
  /* url */
  url: string;
  /* 内部url */
  internalUrl?: string;
}
