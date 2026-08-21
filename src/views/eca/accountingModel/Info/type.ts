/**
 * ModelReq
 */
export interface AccountModelInfoReqRequest {
  /**
   * id
   */
  id?: number;
  /**
   * 模型简介
   */
  intro?: string;
  /**
   * 模型名称
   */
  modelName?: string;
  /**
   * 量化方法。0 排放因子法(0:排放因子法)
   */
  quantitativeMethod?: number;
  [property: string]: any;
}

export interface AccountModelInfoTreeDatum {
  code: number;
  name: string;
  num: null;
  children?: AccountModelInfoTreeDatum[];
  emissionSourceList?: EmissionSourceList[];
}

export interface EmissionSourceList {
  id: number;
  createBy: number;
  updateBy: number;
  createTime: Date;
  updateTime: Date;
  updateByName: null;
  snapshot: boolean;
  sourceCode: string;
  sourceName: string;
  sourceNameFull: string;
  facility: string;
  facilityFull: string;
  ghgCategory: number;
  ghgCategory_name: string;
  ghgClassify: number;
  ghgClassify_name: string;
  isoCategory: number;
  isoCategory_name: string;
  isoClassify: number;
  isoClassify_name: string;
  activityCategory: number;
  activityCategory_name: string;
  activityScore: number;
  roleIds: string;
  calcMethod: number;
  calcMethod_name: string;
  remark: null;
  deleted: boolean;
  languageSourceList: null;
  carbonEmission?: number;
}

export interface EmissionSourceListRequest {
  /**
   * GHG分类及类别
   */
  ghg?: string;
  /**
   * iso分类及类别
   */
  iso?: string;
  /**
   * 排放设施
   */
  likeFacility?: string;
  /**
   * 排放源名称
   */
  likeSourceName?: string;
  /**
   * 组织code
   */
  orgCode?: string;
  /**
   * 排放源ID
   */
  sourceCode?: string;
  /**
   * 核算id
   */
  computationId?: number;
  /**
   * 其他属性
   */
  [property: string]: any;
}
