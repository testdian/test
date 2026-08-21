/**
 * 审批配置
 */
export interface AuditDetailDto {
  /**
   * 审批需要。1 需要审批；2 不需要审批
   */
  auditRequired?: number;
  /**
   * 审批内容（枚举）(1:企业碳核算排放数据审核; 3:供应链碳数据审核; 4:行业碳核算数据审核)
   */
  auditType?: number;
  /**
   * 公司id
   */
  companyId?: number;
  /**
   * 节点列表
   */
  nodeList?: AuditNodeDto[];
  /**
   * 组织id
   */
  orgId?: number;
}

/**
 * 审批节点
 */
export interface AuditNodeDto {
  /**
   * 审批组织id
   */
  auditOrgId?: number;
  /**
   * 配置类型。1 按人员；2 按角色
   */
  configType?: number;
  id?: number;
  /**
   * 节点层级。从1开始
   */
  nodeLevel?: number;
  /**
   * 节点名称
   */
  nodeName?: string;
  /**
   * 角色id或用户ids
   */
  targetIds?: number[];
  /**
   * 角色名或用户名
   */
  targetNames?: string;
}

/**
 * 审批流程
 */

export interface AuditNode {
  /**
   * 数据审批id
   */
  auditDataId?: number;
  /**
   * 审批组织id
   */
  auditOrgId?: number;
  /**
   * 审核状态。0 待审核；1 审核通过；2 审核不通过；3 已撤回；4 已作废(0:待审核; 1:审核通过; 2:审核不通过; 3:已撤回; 4:已作废),
   */

  auditStatus?: number;
  /**
   * 审批内容（枚举）(1:企业碳核算排放数据审核; 3:供应链碳数据审核; 4:行业碳核算数据审核)
   */
  auditType?: number;
  /**
   * 公司id
   */
  companyId?: number;
  /**
   * 配置类型。1 按人员；2 按角色
   */
  configType?: number;
  /**
   * 创建者
   */
  createBy?: number;
  /**
   * 创建时间
   */
  createTime?: Date;
  /**
   * 审批关联的数据
   */
  dataId?: string;
  /**
   * 标记删除。0 未删除 1 已删除
   */
  deleted?: boolean;
  id?: number;
  /**
   * 节点层级。从1开始
   */
  nodeLevel?: number;
  /**
   * 节点名称
   */
  nodeName?: string;
  /**
   * 组织id
   */
  orgId?: number;
  /**
   * 是否已审批节点或当前节点
   */
  passed?: boolean;
  /**
   * 审批配置id
   */
  sysAuditId?: number;
  /**
   * 角色id或用户ids。,分隔
   */
  targetIds?: number[];
  /**
   * 角色名或用户名
   */
  targetNames?: string;
  /**
   * 更新者
   */
  updateBy?: number;
  /**
   * 更新时间
   */
  updateTime?: Date;
}

/**
 * 审批记录
 */
export interface AuditLog {
  /**
   * 审批人id
   */
  auditBy?: number;
  /**
   * 审批人手机号
   */
  auditByMobile?: string;
  /**
   * 审批人名称
   */
  auditByName?: string;
  /**
   * 审批意见
   */
  auditComment?: string;
  /**
   * 数据审批id
   */
  auditDataId?: number;
  /**
   * 审核状态。0 待审核；1 审核通过；2 审核不通过；3 已撤回；4 已作废
   */
  auditStatus?: 0 | 1 | 2 | 3 | 4;
  /**
   * 审批时间
   */
  auditTime?: Date;
  /**
   * 审批内容（枚举）(1:企业碳核算排放数据审核; 3:供应链碳数据审核; 4:行业碳核算数据审核)
   */
  auditType?: 1 | 3 | 4;
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
   * 审批关联的数据
   */
  dataId?: string;

  /**
   * id
   */
  id?: number;
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
}

export interface DataFillPageRequest {
  /**
   * GHG分类及类别
   */
  ghg?: string;
  /**
   * 排放源名称
   */
  likeSourceName?: string;
  /**
   * 页码
   */
  pageNum?: number;
  /**
   * 每页条数
   */
  pageSize?: number;
  /**
   * 是否查询pending数据。0 否；1 是
   */
  pendingFlag?: number;
  /**
   * 核算年份
   */
  year?: number;
  /** 模板id	 */
  emissionSourceTemplateId?: number;
  /** 核算id */
  computationId?: number;
  /** 核算排放源关系id */
  computationSourceId?: number;

  [property: string]: any;
}

/**
 * ComputationSourceResp
 */
export interface ComputationSourceResp {
  orgCode?: string;
  /**
   * 碳排放量(tCO2)
   */
  carbonEmission?: number;
  /**
   * 邮件发送类型。0 群发；1 分别发送 (群发 : 0； 分别发送 : 1),可用值:0,1
   */
  mailSendType?: number;
  /**
   * 核算id
   */
  computationId?: number;
  createBy?: number;
  createTime?: Date;
  /**
   * 邮件状态。0 -；1 未发送；2 发送成功；-1 发送失败(0:-; 1:未发送; 2:发送成功; -1:发送失败)
   */
  emailStatus?: number;
  /**
   * 排放源id
   */
  emissionSourceId?: number;
  /**
   * 排放设施
   */
  facility?: string;
  /**
   * 填报截止时间
   */
  fillDeadline?: Date;
  /**
   * 填报状态。0 -；1 未填报；2 填报中；3 填报完成(0:-; 1:未填报; 2:填报中; 3:填报完成)
   */
  fillStatus?: number;
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
   * id/核算排放源关系id
   */
  id?: number;
  /**
   * 模型id。非核算模型为0
   */
  modelId?: number;
  /**
   * 剩余天数
   */
  remainingDay?: number;
  /**
   * 审核状态。0 -；1 待匹配因子；2 未审核；3 审批通过；4 审批不通过(0:-; 1:待匹配因子; 2:未审核; 3:审批通过; 4:审核驳回)
   */
  reviewStatus?: number;
  /**
   * 填报角色（多选）。,分割
   */
  roleIds?: string;
  /**
   * 填报角色
   */
  roleNames?: string;
  /**
   * 排放源ID
   */
  sourceCode?: string;
  /**
   * 排放源名称
   */
  sourceName?: string;
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
  updateTime?: string;
  [property: string]: any;
}

/**
 * ComputationTemplateResp
 */
export interface ComputationTemplateResp {
  /**
   * 附件url
   */
  attachmentUrl?: string;
  /**
   * 核算id
   */
  computationId?: number;
  /**
   * 核算排放源关系id
   */
  computationSourceId?: number;
  /**
   * 排放源id
   */
  emissionSourceId?: number;
  /**
   * 模板id
   */
  emissionSourceTemplateId?: number;
  /**
   * 展示的参数列表
   */
  paramList?: EmissionSourceParam[];
  /**
   * 排放源ID
   */
  sourceCode?: string;
  [property: string]: any;
}

/**
 * EmissionSourceParam
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
   * 运输终点参数code
   */
  destinationParamCode?: string;
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
   * 错误区间
   */
  errorRange?: string;
  /**
   * id
   */
  id?: number;
  /**
   * 文本长度/小数位数
   */
  len?: number;
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
   * 参数适用范围。1 全局参数；2 自定义参数；3 距离参数(1:全局参数; 2:自定义参数; 3:距离参数)
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
   * 时间格式类型。1 YYYY/MM/DD hh:mm:ss；2 YYYY/MM/DD；3 YYYY/MM；4 YYYY(1:yyyy/MM/dd HH:mm:ss;
   * 2:yyyy/MM/dd; 3:yyyy/MM; 4:yyyy)
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
  warningRangeClass?: NumberRange;
  [property: string]: any;
}

/**
 * NumberRange
 */
export interface NumberRange {
  /**
   * 最大值
   */
  maxNum?: string;
  /**
   * 最大值符号(1:=; 2:>; 3:>=; 4:<; 5:<=)
   */
  maxSymbol?: number;
  /**
   * 最小值
   */
  minNum?: string;
  /**
   * 最小值符号(1:=; 2:>; 3:>=; 4:<; 5:<=)
   */
  minSymbol?: number;
  [property: string]: any;
}

/**
 * Row
 */
export interface FillDataRow {
  /**
   * 数据列表
   */
  cellList?: RowCell[];
  /**
   * 核算排放源关系id
   */
  computationSourceId?: number;
  /**
   * 模板id
   */
  emissionSourceTemplateId?: number;
  /**
   * id
   */
  id?: number;
  [property: string]: any;
}

/**
 * RowCell
 */
export interface RowCell {
  code: string;
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
