export interface ConfigurationRequest {
  /**
   * 关联参数名称
   */
  likeAssociatedParamName?: string;
  /**
   * 主要参数名称
   */
  likeMainParamName?: string;
  /**
   * 页码
   */
  pageNum: number;
  /**
   * 每页条数
   */
  pageSize: number;
  /**
   * year
   */
  year?: string;
  [property: string]: any;
}

/**
 * ParamConfig，ParamConfig
 */
export interface ConfigurationListType {
  /**
   * 副参数ID列表。,分割
   */
  associatedParamCodes?: string;
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
   * id
   */
  id?: number;
  /**
   * 主参数ID列表。,分割
   */
  mainParamCodes?: string;
  orgName?: string;
  /**
   * 参数配置类型。0 固定值；1 映射关系 (固定值 : 0； 映射关系 : 1)
   */
  paramConfigType?: number;
  /**
   * 备注
   */
  remark?: string;
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
   * 年
   */
  year?: number;
  [property: string]: any;
}

export interface ConfigurationResp {
  associatedParamCodeList?: string[];
  /**
   * 副参数ID列表。,分割
   */
  associatedParamCodes?: string;
  /**
   * 副参数ID列表
   */
  associatedParamList?: CodeValue[];
  /**
   * 排放源id
   */
  emissionSourceId: number;
  /**
   * 映射数据表头
   */
  headerList?: CodeValue[];
  /**
   * id
   */
  id?: number;
  mainParamCodeList?: string[];
  /**
   * 主参数ID列表。,分割
   */
  mainParamCodes?: string;
  /**
   * 主参数ID列表
   */
  mainParamList?: CodeValue[];
  /**
   * 参数配置类型。0 固定值；1 映射关系 (固定值 : 0； 映射关系 : 1)
   */
  paramConfigType: number;
  /**
   * 年
   */
  year: number;
  [property: string]: any;
}

/**
 * CodeValue，返回数据
 */
export interface CodeValue {
  code?: string;
  value?: string;
  [property: string]: any;
}

/**
 * EmissionSourceParam，EmissionSourceParam
 */
export interface EmissionSourceParam {
  /**
   * 正确区间
   */
  correctRange?: string;
  correctRangeClass?: NumberRange;
  /**
   * 创建者
   */
  createBy?: number;
  /**
   * 创建时间
   */
  createTime?: Date;
  /**
   * 是否有默认值。0 无；1 有 (否 : 0 : false； 是 : 1 : true)
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
   * 运输终点参数code
   */
  destinationParamCode?: string;
  /**
   * 选项枚举值/地址枚举值
   */
  dictEnum?: string;
  /**
   * 枚举名称
   */
  dictName?: string;
  /**
   * 是否展示。0 否；1 是 (否 : 0 : false； 是 : 1 : true)
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
   * 错误区间
   */
  errorRange?: string;
  /**
   * id
   */
  id?: number;
  /**
   * 多语言
   */
  languageSourceList?: LanguageSource[];
  /**
   * 文本长度/小数位数
   */
  len?: number;
  orgName?: string;
  /**
   * 运输起点参数code
   */
  originParamCode?: string;
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
   * 参数名称
   */
  paramNameFull?: string;
  /**
   * 参数名称反显
   */
  paramNameText?: string;
  /**
   * 参数适用范围。1 全局参数；2 自定义参数；3 距离参数 (全局参数 : 1； 自定义参数 : 2； 距离参数 : 3)
   */
  paramScope?: number;
  /**
   * 参数类型。1 文本；2 数值；3 选项；4 时间；5 地址 (文本 : 1； 数值 : 2； 选项 : 3； 时间 : 4)
   */
  paramType?: number;
  /**
   * 备注
   */
  remark?: string;
  /**
   * 是否必须。0 否；1 是 (否 : 0 : false； 是 : 1 : true)
   */
  requiredFlag?: number;
  /**
   * 顺序
   */
  sort?: number;
  /**
   * 文本类型。1 纯文本；2 富文本 (纯文本 : 1； 富文本 : 2)
   */
  textType?: number;
  /**
   * 时间格式类型。1 YYYY/MM/DD hh:mm:ss；2 YYYY/MM/DD；3 YYYY/MM；4 YYYY (yyyy/MM/dd HH:mm:ss : 年月日时分秒
   * : 1； yyyy/MM/dd : 年月日 : 2； yyyy/MM : 年月 : 3； yyyy : 年 : 4)
   */
  timeType?: number;
  /**
   * 运输方式参数code
   */
  transModeParamCode?: string;
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
   * 单位类型。1 普通单位；2 复合单位；3 无单位 (普通单位 : 1； 复合单位 : 2； 无单位 : 3)
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
  warningRangeClass?: NumberRange;
  [property: string]: any;
}

/**
 * NumberRange，NumberRange
 */
export interface NumberRange {
  /**
   * 最大值
   */
  maxNum?: string;
  /**
   * 最大值符号 (= : 1； > : 2； >= : 3； < : 4； <= : 5)
   */
  maxSymbol?: number;
  /**
   * 最小值
   */
  minNum?: string;
  /**
   * 最小值符号 (= : 1； > : 2； >= : 3； < : 4； <= : 5)
   */
  minSymbol?: number;
  [property: string]: any;
}

/**
 * LanguageSource，LanguageSource
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
   * 语言类型。1 zh；2 en (zh : 1； en : 2)
   */
  langType?: number;
  orgName?: string;
  /**
   * 数据id
   */
  sourceId?: number;
  /**
   * 数据类型 (sourceName : 排放源名称 : 1； facility : 排放设施 : 2； source : 排放因子来源 : 5； name : 排放因子名称 :
   * 6； sourceLanguageName : 源语言名称 : 7； description : 适用场景 : 8； institution : 发布机构 : 9； policy
   * : 政策 : 11； sceneName : 减排场景名称 : 12； sceneDesc : 减排场景描述 : 13； totalDesc : 总减排场景描述 : 14；
   * unitDesc : 单位减排量描述 : 15； deptName : 碳盘查负责部门 : 16； regAddress : 注册详细地址 : 17；
   * produceAddress : 生产经营详细地址 : 18； intro : 企业简介 : 19； planeImgDesc : 组织平面示意图描述 : 20；
   * gasGroupDesc : 温室气体管理小组架构描述 : 21； borderDesc : 组织边界描述 : 22； borderChange : 组织边界变动说明 : 23；
   * activityDesc : 活动描述/被排除的说明 : 24； collectDesc : 数据收集说明 : 25； calculateDesc : 计算方法描述 : 26；
   * dataQuality : 数据质量管理规定 : 27； serviceName : 产品或服务名称 : 28； serviceDesc : 产品或服务描述 : 29；
   * reportName : 报告名称 : 31； quantizationChangeDesc : 量化方法变换说明 : 32； biomassDesc : 生物质相关排放 :
   * 33； elseDesc : 其他说明情况 : 34； absolution : 排放源免除说明 : 35； storageDesc : 数据存储说明 : 36；
   * fillDesc : 填报描述 : 37； fillTips : 填报提示 : 38； paramName : 参数名称 : 39)
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
 * Row，Row
 */
export interface ConfigDataRow {
  /**
   * 数据列表
   */
  cellList?: ConfigDataRowCell[];
  /**
   * 核算排放源关系id
   */
  computationSourceId?: number;
  /**
   * 数据计算值
   */
  dataValue?: number;
  /**
   * 模板id
   */
  emissionSourceTemplateId?: number;
  /**
   * 因子id
   */
  factorId?: number;
  /**
   * 因子列表
   */
  factorList?: ConfigDataRowFactor[];
  /**
   * 因子名称
   */
  factorName?: string;
  /**
   * 因子值
   */
  factorValue?: string;
  /**
   * id
   */
  id?: number;
  /**
   * 是否重复数据。0 否；1 是
   */
  repeatFlag?: boolean;
  /**
   * 因子单位
   */
  unit?: string;
  [property: string]: any;
}

/**
 * RowCell，RowCell
 */
export interface ConfigDataRowCell {
  /**
   * code
   */
  code?: string;
  /**
   * 值
   */
  value?: string;
  /**
   * 值反显
   */
  valueDesc?: string;
  /**
   * 是否警告
   */
  warningFlag?: boolean;
  [property: string]: any;
}

/**
 * RowFactor，RowFactor
 */
export interface ConfigDataRowFactor {
  /**
   * 因子id
   */
  factorId?: number;
  /**
   * 因子名称
   */
  factorName?: string;
  /**
   * 因子值
   */
  factorValue?: string;
  /**
   * 因子单位
   */
  unit?: string;
  [property: string]: any;
}

/**
 * ParamConfigDataReq，ParamConfigDataReq
 */
export interface RowConfigDataRequest {
  /**
   * id
   */
  id?: number;
  /**
   * 参数配置表id
   */
  paramConfigId: number;
  /**
   * 值json
   */
  valueJson: CodeValue[];
  [property: string]: any;
}
