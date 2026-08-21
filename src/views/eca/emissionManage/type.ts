/**
 * EmissionSourceTree
 */
export interface EmissionSourceTreeType {
  code: string;
  /**
   * 子节点
   */
  children?: EmissionSourceTreeType[];
  /**
   * 名称
   */
  name?: string;
  /**
   * 数量
   */
  num?: number;
  [property: string]: any;
}

/**
 * EmissionSourceReq
 */
export interface EmissionSourceReqRequest {
  /**
   * 活动数据类别。1 自动连续测量；2 定期测量；3 自行推估；(1:自动连续测量; 2:定期测量; 3:自行推估)
   */
  activityCategory?: number;
  /**
   * 计算方式。1 公式计算(1:公式计算)
   */
  calcMethod?: number;
  /**
   * 排放设施
   */
  facility?: string;
  /**
   * GHG分类。1 范围一；2 范围二；3 范围三；(1:范围一; 2:范围二; 3:范围三)
   */
  ghgCategory?: number;
  /**
   * GHG类别(1:固定燃烧; 2:移动燃烧; 3:工艺过程; 4:无组织排放; 5:碳封存; 6:电力; 7:蒸汽; 8:压缩空气; 9:冷; 10:热; 11:外购商品和服务;
   * 12:资本商品; 13:燃料和能源相关活动; 14:上游运输和配送; 15:运营中产生的废弃物; 16:商务旅行; 17:雇员通勤; 18:上游租赁资产;
   * 19:售出产品的运输和配送; 20:售出产品的加工; 21:售出产品的使用; 22:处理寿命终止的售出产品; 23:下游租赁资产; 24:特许经营权; 25:投资)
   */
  ghgClassify?: number;
  /**
   * id
   */
  id?: number;
  /**
   * ISO分类。1 直接排放或清除；2 能源间接排放；3 运输间接排放；4 外购产品或服务间接排放；5 供应链下游排放；6 其他间接排放；(1:直接排放或清除; 2:能源间接排放;
   * 3:运输间接排放; 4:外购产品或服务间接排放; 5:供应链下游排放; 6:其他间接排放)
   */
  isoCategory?: number;
  /**
   * ISO类别(1:固定燃烧; 2:移动燃烧; 3:工艺过程; 4:逸散排放; 5:土地利用、土地利用改变和林业; 6:电力; 7:蒸汽; 8:压缩空气; 9:冷; 10:热;
   * 11:员工差旅; 12:员工通勤; 13:上游运输; 14:下游运输; 15:客户拜访; 16:废物处理; 17:购买资本品; 18:采购原材料; 19:运营租赁资产;
   * 20:适用其他服务（运维、清洗、邮政等）; 21:产品使用; 22:产品加工; 23:废弃处置; 24:投资其他资产; 25:出租资产; 26:其他)
   */
  isoClassify?: number;
  /**
   * 多语言
   */
  languageSourceList?: LanguageSourceDto[];
  /**
   * 填报角色（多选）。,分割
   */
  roleIds?: string;
  /**
   * 排放源ID
   */
  sourceCode?: string;
  /**
   * 排放源名称
   */
  sourceName?: string;
  [property: string]: any;
}

/**
 * LanguageSourceDto
 */
export interface LanguageSourceDto {
  /**
   * id
   */
  id?: number;
  /**
   * 语言类型。1 zh；2 en(1:zh; 2:en)
   */
  langType?: number;
  langType_name?: string;
  /**
   * 数据类型(1:sourceName; 2:facility)
   */
  sourceType?: number;
  /**
   * 翻译内容
   */
  sourceValue?: string;
  sourceType_name?: string;

  [property: string]: any;
}

/**
 * 通用接口返回对象«EmissionSourceResp»
 */
export interface Response {
  /**
   * 结果码
   */
  code: number;
  data: EmissionSourceResp;
  /**
   * 返回信息
   */
  msg: string;
  [property: string]: any;
}

/**
 * EmissionSourceResp
 */
export interface EmissionSourceResp {
  /**
   * 活动数据类别。1 自动连续测量；2 定期测量；3 自行推估；(1:自动连续测量; 2:定期测量; 3:自行推估)
   */
  activityCategory?: number;
  /**
   * 活动数据评分
   */
  activityScore?: number;
  /**
   * 计算方式。1 公式计算(1:公式计算)
   */
  calcMethod?: number;
  /**
   * 排放设施
   */
  facility?: string;
  /**
   * 排放设施（全语言）
   */
  facilityFull?: string;
  /**
   * GHG分类。1 范围一；2 范围二；3 范围三；(1:范围一; 2:范围二; 3:范围三)
   */
  ghgCategory?: number;
  /**
   * GHG类别(1:固定燃烧; 2:移动燃烧; 3:工艺过程; 4:无组织排放; 5:碳封存; 6:电力; 7:蒸汽; 8:压缩空气; 9:冷; 10:热; 11:外购商品和服务;
   * 12:资本商品; 13:燃料和能源相关活动; 14:上游运输和配送; 15:运营中产生的废弃物; 16:商务旅行; 17:雇员通勤; 18:上游租赁资产;
   * 19:售出产品的运输和配送; 20:售出产品的加工; 21:售出产品的使用; 22:处理寿命终止的售出产品; 23:下游租赁资产; 24:特许经营权; 25:投资)
   */
  ghgClassify?: number;
  /**
   * id
   */
  id?: number;
  /**
   * ISO分类。1 直接排放或清除；2 能源间接排放；3 运输间接排放；4 外购产品或服务间接排放；5 供应链下游排放；6 其他间接排放；(1:直接排放或清除; 2:能源间接排放;
   * 3:运输间接排放; 4:外购产品或服务间接排放; 5:供应链下游排放; 6:其他间接排放)
   */
  isoCategory?: number;
  /**
   * ISO类别(1:固定燃烧; 2:移动燃烧; 3:工艺过程; 4:逸散排放; 5:土地利用、土地利用改变和林业; 6:电力; 7:蒸汽; 8:压缩空气; 9:冷; 10:热;
   * 11:员工差旅; 12:员工通勤; 13:上游运输; 14:下游运输; 15:客户拜访; 16:废物处理; 17:购买资本品; 18:采购原材料; 19:运营租赁资产;
   * 20:适用其他服务（运维、清洗、邮政等）; 21:产品使用; 22:产品加工; 23:废弃处置; 24:投资其他资产; 25:出租资产; 26:其他)
   */
  isoClassify?: number;
  /**
   * 多语言
   */
  languageSourceList?: LanguageSource[];
  /**
   * 备注
   */
  remark?: string;
  /**
   * 填报角色（多选）。,分割
   */
  roleIds?: string;
  /**
   * 排放源ID
   */
  sourceCode?: string;
  /**
   * 排放源名称
   */
  sourceName?: string;
  /**
   * 排放源名称（全语言）
   */
  sourceNameFull?: string;
  /**
   * 模板列表
   */
  templateList?: EmissionSourceTemplateResp[];
  [property: string]: any;
}

/**
 * LanguageSource
 */
export interface LanguageSource {
  /**
   * 业务数据类型
   */
  classType?: string;
  createBy?: number;
  createTime?: Date;
  /**
   * id
   */
  id?: number;
  /**
   * 语言类型。1 zh；2 en(1:zh; 2:en)
   */
  langType?: number;
  /**
   * 数据id
   */
  sourceId?: number;
  /**
   * 数据类型(1:sourceName; 2:facility)
   */
  sourceType?: number;
  /**
   * 翻译内容
   */
  sourceValue?: string;
  updateBy?: number;
  /**
   * 更新人名称
   */
  updateByName?: string;
  updateTime?: Date;
  [property: string]: any;
}

/**
 * EmissionSourceTemplateResp
 */
export interface EmissionSourceTemplateResp {
  /**
   * 排放源id
   */
  emissionSourceId?: number;
  /**
   * 因子列表
   */
  mainParamList?: EmissionSourceFactorResp[];
  /**
   * 填报描述
   */
  fillDesc?: string;
  /**
   * 填报提示标题颜色
   */
  fillHeaderColor?: string;
  /**
   * 填报提示
   */
  fillTips?: string;
  /**
   * 公式列表
   */
  formulaList?: EmissionSourceFormula[];
  /**
   * id
   */
  id?: number;
  /**
   * 合并维度。参数code按,分割
   */
  mergeDimension?: string;
  /**
   * 不展示的参数列表
   */
  notDisplayPramList?: EmissionSourceParam[];
  /**
   * 展示的参数列表
   */
  paramList?: EmissionSourceParam[];
  [property: string]: any;
}

/**
 * EmissionSourceFactorResp
 */
export interface EmissionSourceFactorResp {
  id: string;
  /**
   * 副参数ID列表
   */
  associatedParamCodes?: string;
  /**
   * 排放源id
   */
  emissionSourceId?: number;
  /**
   * 模板id
   */
  emissionSourceTemplateId?: number;
  /**
   * 因子列表
   */
  factorList?: EmissionSourceFactorValueResp[];
  /**
   * 主参数ID
   */
  mainParamCode?: string;
  /**
   * 主参数名称
   */
  mainParamName?: string;
  [property: string]: any;
}

/**
 * EmissionSourceFactorValueResp
 */
export interface EmissionSourceFactorValueResp {
  /**
   * 副参数字典值列表
   */
  associatedParamValues?: string;
  /**
   * 排放因子id
   */
  factorId?: number;
  /**
   * 排放因子名称
   */
  factorName?: string;
  /**
   * 二氧化碳当量数值
   */
  factorValue?: string;
  /**
   * id
   */
  id?: number;
  /**
   * 参数列表
   */
  paramList?: EmissionSourceParam[];
  /**
   * 备注
   */
  remark?: string;
  /**
   * 单位
   */
  unit?: string;
  paramValueList?: ParamValueList[];
  [property: string]: any;
}

export interface ParamValueList {
  value: string;
  valueName: string;
  paramName: string;
  paramCode: string;
  paramType: number;
  paramType_name: string;
  textType: number | null;
  len: number | null;
  dictEnum: null;
  defaultFlag: number | null;
  defaultFlag_name?: string;
  defaultValue: null;
  textType_name?: string;
}

/**
 * EmissionSourceParam
 */
export interface EmissionSourceParam {
  /**
   * 正确区间
   */
  correctRange?: string;
  /**
   * 创建者
   */
  createBy?: number;
  /**
   * 创建时间
   */
  createTime?: Date;
  /**
   * 是否有默认值。0 无；1 有(0:否; 1:是)
   */
  defaultFlag?: number;
  /**
   * 默认值
   */
  defaultValue?: string;
  /**
   * 标记删除。0 未删除 1 已删除
   */
  deleted?: boolean;
  /**
   * 选项枚举值/地址枚举值
   */
  dictEnum?: string;
  /**
   * 是否展示。0 否；1 是(0:否; 1:是)
   */
  displayFlag?: number;
  /**
   * 排放源id
   */
  emissionSourceId?: number;
  /**
   * 模板id
   */
  emissionSourceTemplateId?: number;
  /**
   * id
   */
  id?: number;
  /**
   * 文本长度/小数位数
   */
  len?: number;
  /**
   * 参数别名
   */
  paramAlias?: string;
  /**
   * 参数ID
   */
  paramCode?: string;
  /**
   * 参数描述
   */
  paramDesc?: string;
  /**
   * 参数名称
   */
  paramName?: string;
  paramNameText?: string;
  /**
   * 参数适用范围。1 全局参数；2 自定义参数(1:全局参数; 2:自定义参数; 3:距离参数)
   */
  paramScope?: number;
  /**
   * 参数类型。1 文本；2 数值；3 选项；4 时间；5 地址(1:文本; 2:数值; 3:选项; 4:时间; 5:地址)
   */
  paramType?: number;
  /**
   * 备注
   */
  remark?: string;
  /**
   * 是否必须。0 否；1 是(0:否; 1:是)
   */
  requiredFlag?: number;
  /**
   * 顺序
   */
  sort?: number;
  /**
   * 文本类型。1 纯文本；2 富文本(1:纯文本; 2:富文本)
   */
  textType?: number;
  /**
   * 时间格式类型。1 YYYY/MM/DD hh:mm:ss；2 YYYY/MM/DD；3 YYYY/MM；4 YYYY(1:YYYY/MM/DD hh:mm:ss;
   * 2:YYYY/MM/DD; 3:YYYY/MM; 4:YYYY)
   */
  timeType?: number;
  /**
   * 普通单位or分子单位
   */
  unit1?: string;
  /**
   * 普通单位or分子单位
   */
  unit1Name?: string;
  /**
   * 分母单位
   */
  unit2?: string;
  /**
   * 分母单位
   */
  unit2Name?: string;
  /**
   * 单位类型。1 普通单位；2 复合单位；3 无单位(1:普通单位; 2:复合单位; 3:无单位)
   */
  unitType?: number;
  /**
   * 更新者
   */
  updateBy?: number;
  /**
   * 更新人名称
   */
  updateByName?: string;
  /**
   * 更新时间
   */
  updateTime?: Date;
  /**
   * 警告区间
   */
  warningRange?: string;
  /**
   * 填报描述
   */
  fillDesc?: string;
  /**
   * 填报提示标题颜色
   */
  fillHeaderColor?: string;
  /**
   * 填报提示
   */
  fillTips?: string;
  [property: string]: any;
}

/**
 * EmissionSourceFormula
 */
export interface EmissionSourceFormula {
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
   * 排放源id
   */
  emissionSourceId?: number;
  /**
   * 模板id
   */
  emissionSourceTemplateId?: number;
  /**
   * 公式
   */
  formula?: string;
  /**
   * id
   */
  id?: number;
  /**
   * 参数code列表。,分割
   */
  paramCodes?: string;
  /**
   * 备注
   */
  remark?: string;
  /**
   * 顺序
   */
  sort?: number;
  /**
   * 更新者
   */
  updateBy?: number;
  /**
   * 更新人名称
   */
  updateByName?: string;
  /**
   * 更新时间
   */
  updateTime?: Date;
  [property: string]: any;
}

/**
 * EmissionSourceTemplateReq
 */
export interface Request {
  /**
   * 排放源id
   */
  emissionSourceId?: number;
  /**
   * 填报描述
   */
  fillDesc?: string;
  /**
   * 填报提示标题颜色
   */
  fillHeaderColor?: string;
  /**
   * 填报提示
   */
  fillTips?: string;
  /**
   * id
   */
  id?: number;
  /**
   * 合并维度。参数code按,分割
   */
  mergeDimension?: string;
  /**
   * 参数列表
   */
  paramList?: EmissionSourceParamReq[];
  /**
   * 备注
   */
  remark?: string;
  /**
   * 顺序
   */
  sort?: number;
  [property: string]: any;
}

/**
 * EmissionSourceParamReq
 */
export interface EmissionSourceParamReq {
  /**
   * 正确区间
   */
  correctRange?: string;
  /**
   * 是否有默认值。0 无；1 有(0:否; 1:是)
   */
  defaultFlag?: number;
  /**
   * 默认值
   */
  defaultValue?: string;
  /**
   * 选项枚举值/地址枚举值
   */
  dictEnum?: string;
  /**
   * 是否展示。0 否；1 是(0:否; 1:是)
   */
  displayFlag?: number;
  /**
   * 文本长度/小数位数
   */
  len?: number;
  /**
   * 参数别名
   */
  paramAlias?: string;
  /**
   * 参数ID
   */
  paramCode?: string;
  /**
   * 参数描述
   */
  paramDesc?: string;
  /**
   * 参数名称
   */
  paramName?: string;
  /**
   * 参数适用范围。1 全局参数；2 自定义参数(1:全局参数; 2:自定义参数; 3:距离参数)
   */
  paramScope?: number;
  /**
   * 参数类型。1 文本；2 数值；3 选项；4 时间；5 地址(1:文本; 2:数值; 3:选项; 4:时间; 5:地址)
   */
  paramType?: number;
  /**
   * 是否必须。0 否；1 是(0:否; 1:是)
   */
  requiredFlag?: number;
  /**
   * 顺序
   */
  sort?: number;
  /**
   * 文本类型。1 纯文本；2 富文本(1:纯文本; 2:富文本)
   */
  textType?: number;
  /**
   * 时间格式类型。1 YYYY/MM/DD hh:mm:ss；2 YYYY/MM/DD；3 YYYY/MM；4 YYYY(1:YYYY/MM/DD hh:mm:ss;
   * 2:YYYY/MM/DD; 3:YYYY/MM; 4:YYYY)
   */
  timeType?: number;
  /**
   * 普通单位or分子单位
   */
  unit1?: string;
  /**
   * 分母单位
   */
  unit2?: string;
  /**
   * 单位类型。1 普通单位；2 复合单位；3 无单位(1:普通单位; 2:复合单位; 3:无单位)
   */
  unitType?: number;
  /**
   * 警告区间
   */
  warningRange?: string;
  [property: string]: any;
}

/**
 * EmissionSourceFactorSelectReq
 */
export interface EmissionSourceFactorSelectReqRequest {
  /**
   * 因子表id
   */
  emissionSourceFactorId?: number;
  /**
   * 排放源id
   */
  emissionSourceId?: number;
  /**
   * 模板id
   */
  emissionSourceTemplateId?: number;
  /**
   * 因子id
   */
  factorId?: number;
  /**
   * 因子值id
   */
  id?: number;
  /**
   * 副参数值列表。字典传value值，字符串直接传
   */
  valueList?: string[];
  /**
   * 核算排放源关系id
   */
  computationSourceId?: number;
  [property: string]: any;
}

/**
 * 编辑公式基本信息
 */
export interface EditEmissionSourceFormulaBasicInfoReqRequest {
  /**
   * 数据来源参数code
   */
  dataSourceParamCode?: string;
  /**
   * 排放源id
   */
  emissionSourceId: number;
  /**
   * 排放源名称参数code
   */
  emissionSourceParamCode?: string;
  /**
   * 排放量单位。2 tCO₂e；1 kgCO₂e；3 gCO₂e (1000000 : tCO₂e : 2； 1000 : kgCO₂e : 1； 1 : gCO₂e : 3)
   */
  emissionUnit?: number;
  /**
   * 填报描述
   */
  fillDesc?: string;
  /**
   * 填报提示
   */
  fillTips?: string;
  /**
   * id
   */
  id?: number;
  /**
   * 多语言
   */
  languageSourceList?: LanguageSourceDto[];
  /**
   * 合并维度。参数code按,分割
   */
  mergeDimension?: string;
  /**
   * 参数列表
   */
  paramList?: EmissionSourceParamReq[];
  /**
   * 备注
   */
  remark?: string;
  /**
   * 顺序
   */
  sort?: number;
  [property: string]: any;
}

/**
 * 公式列表参数
 */
export interface FormulaListResp {
  /**
   * 活动数据参数/公式
   */
  activityDataFormula: string;
  /**
   * 活动数据类型。0 选择参数；1 公式计算 (选择参数 : 0； 公式计算 : 1)
   */
  activityDataType: number;
  /**
   * 活动数据单位列表
   */
  activityDataUnitList: string[];
  createBy?: number;
  createTime?: Date;
  /**
   * 模板id
   */
  emissionSourceTemplateId: number;
  /**
   * 公式
   */
  formula: string;
  /**
   * id
   */
  id?: number;
  orgName?: string;
  /**
   * 顺序
   */
  sort: number;
  updateBy?: number;
  /**
   * 更新人名称
   */
  updateByName?: string;
  updateTime?: Date;
  [property: string]: any;
}

/**
 * 因子只能匹配-排放源模版step3和核算的匹配因子
 */
export interface MatchEmissionSourceFactorReq {
  key1List?: string[];
  key1?: string;
  key2?: string;
  key3?: string;
  key4?: string;
  key5?: string;
  key6?: string;
  key7?: string;
  key8?: string;
  key9?: string;
  key10?: string;
  [property: string]: any;
}

/**
 * Factor，Factor
 */
export interface MatchEmissionSourceFactorResp {
  /**
   * 地理代表性
   */
  areaRepresent?: string;
  /**
   * 地理代表性-详细
   */
  areaRepresentDetail?: string;
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
   * 场景描述
   */
  description?: string;
  /**
   * 二氧化碳当量数值
   */
  factorValue?: string;
  /**
   * 一级分类（简体中文）
   */
  firstClassify?: string;
  /**
   * id
   */
  id?: number;
  /**
   * 发布机构(全称)-字典
   */
  institution?: string;
  /**
   * 翻译字段
   */
  languageSourceList?: LanguageSource[];
  /**
   * 排放因子名称
   */
  name?: string;
  orgName?: string;
  /**
   * 产品信息
   */
  productInfo?: string;
  /**
   * 产品名称
   */
  productName?: string;
  /**
   * 二级分类（简体中文）
   */
  secondClassify?: string;
  /**
   * 来源文件名称
   */
  source?: string;
  /**
   * 源语言。字典值 1中文 2英语 3法语 4德语
   */
  sourceLanguage?: string;
  /**
   * 源语言名称
   */
  sourceLanguageName?: string;
  /**
   * 来源类别-字典
   */
  sourceLevel?: string;
  /**
   * 0 启用 1 禁用 (启用 : 0； 禁用 : 1)
   */
  status?: number;
  /**
   * 系统边界
   */
  systemBoundary?: string;
  /**
   * 技术代表性
   */
  techRepresent?: string;
  /**
   * 单位
   */
  unit?: string;
  /**
   * 更新者
   */
  updateBy?: number;
  /**
   * 更新人名称
   */
  updateByName?: string;
  /**
   * 更新时间
   */
  updateTime?: Date;
  /**
   * 网址/文献
   */
  url?: string;
  /**
   * 发布年份
   */
  year?: string;
  [property: string]: any;
}

/**
 * 手动同步请求参数
 */
export interface ManualSyncRequest {
  /**
   * 排放源id
   */
  id?: number;
  /**
   * 	核算id列表
   */
  groupIdList?: number[];
  /**
   * 	排放源库id列表
   */
  emissionSourceIdList?: number[];
}

/**
 * 分页请求参数
 */
export interface SyncListRequest {
  /**
   * 排放源id
   */
  id?: number;
  /**
   * 排放源名称
   */
  sourceName?: string;
  /**
   * 核算年份
   */
  year?: string;
}

/**
 * 同步列表返回参数
 */
export interface SyncListResponse {
  /**
   * 主键id
   */
  id?: number;
  /**
   * 排放源名称
   */
  sourceName?: string;
  /**
   * 周期
   */
  dataPeriod?: string;
  dataPeriod_name?: string;
  /**
   * 所属组织
   */
  orgName?: string;
  /**
   * 核算年份
   */
  year?: string;
  [property: string]: any;
}
