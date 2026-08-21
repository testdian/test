/**
 * Computation
 */
export interface AccountYearComputation {
  /**
   * 创建者
   */
  createBy?: number;
  /**
   * 创建时间
   */
  createTime?: Date;
  /**
   * 数据收集周期。1 按年 2 按季度 3 按月(1:按年; 2:按季度; 3:按月)
   */
  dataPeriod?: number;
  /**
   * 标记删除。0 未删除 1 已删除
   */
  deleted?: boolean;
  /**
   * gwp版本(0:IPCC第六次评估报告（IPCC WGI Sixth Assessment Report.IPCC.2021）; 1:IPCC第五次评估报告（IPCC WGI
   * Fifth Assessment Report.IPCC.2013）; 2:IPCC第四次评估报告（IPCC WGI Fourth Assessment
   * Report.IPCC.2007）)
   */
  gwpVersion?: number;
  /**
   * id
   */
  id?: number;
  /**
   * 模型id
   */
  modelId?: number;
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
   * 核算年度
   */
  year?: number;
  [property: string]: any;
}

export interface AccountingModelDataDatum {
  id: number;
  createBy: number;
  updateBy: number;
  createTime: Date;
  updateTime: Date;
  updateByName: string;
  snapshot: boolean;
  modelName: string;
  quantitativeMethod: number;
  quantitativeMethod_name: string;
  intro: string;
  deleted: boolean;
  year?: number;
  orgVersion?: string;
  emissionUnit?: number;
  emissionPoint?: number;
  orgCodeList?: any;
  [key: string]: any;
}

export interface ComputationSourceRequest {
  /**
   * 组织编码
   */
  orgCode?: string;
  /**
   * 排放源id
   */
  emissionSourceId?: number;
  /**
   * 核算id
   */
  computationId: number;
  /**
   * 邮件状态。0 未发送；1 发送失败；2 发送成功
   */
  emailStatus?: number;
  /**
   * 填报状态。0 -；1 未填报；2 填报中；3 填报完成
   */
  fillStatus?: number;
  fillStatus_name?: string;
  /**
   * 排放源名称
   */
  likeSourceName?: string;
  /**
   * 页码
   */
  pageNum: number;
  /**
   * 每页条数
   */
  pageSize: number;
  /**
   * 审核状态。0 -；1 待匹配因子；2 未审核；3 审批通过；4 审批不通过
   */
  reviewStatus?: number;
  [property: string]: any;
}

/**
 * ComputationSourceGroupResp，ComputationSourceGroupResp
 */
export interface ComputationSourceGroupResp {
  /**
   * 碳排放量
   */
  carbonEmissionStr?: string;
  /**
   * 核算id
   */
  computationId?: number;
  /**
   * 排放源列表
   */
  computationSourceList?: ComputationSourceResp[];
  /**
   * 创建者
   */
  createBy?: number;
  /**
   * 创建时间
   */
  createTime?: Date;
  /**
   * 数据收集周期。1 按年；2 按季度；3 按月 (1 : 按年 : 1； 4 : 按季度 : 2； 12 : 按月 : 3)
   */
  dataPeriod?: number;
  /**
   * 标记删除。0 未删除 1 已删除
   */
  deleted?: boolean;
  /**
   * 邮件状态。1 未发送；2 已发送 (未发送 : 1； 已发送 : 2)
   */
  emailStatus?: number;
  /**
   * 排放源id
   */
  emissionSourceId?: number;
  /**
   * 排放量单位。2 tCO₂e；1 kgCO₂e (1000000 : tCO₂e : 2； 1000 : kgCO₂e : 1； 1 : gCO₂e : 3)
   */
  emissionUnit?: number;
  /**
   * 排放设施
   */
  facility?: string;
  /**
   * 因子匹配状态。0 已匹配；1 未匹配 (已匹配 : 0； 未匹配 : 1)
   */
  factorMatchStatus?: number;
  /**
   * 填报截止时间
   */
  fillDeadline?: Date;
  /**
   * GHG分类。1 范围一；2 范围二；3 范围三 (直接排放 : [1] : scope one : 范围一 : 1； 间接排放 : [2] : scope two : 范围二 :
   * 2； 间接排放 : [3, 4, 5, 6] : scope three : 范围三 : 3)
   */
  ghgCategory?: number;
  /**
   * GHG类别 (#EE822F : [1] : 固定燃烧 : #FCE4D3 : 1 : 固定设备内部的燃料燃烧，如锅炉、 熔炉、燃烧器、涡轮、加热器、焚烧炉、引擎和燃烧塔等 :
   * 1； #EE822F : [2] : 移动燃烧 : #FCE4D3 : 1 : 运输工具的燃料燃烧，如汽车、卡车、 巴士、火车、飞机、汽船、轮船、驳船、船舶等 : 2；
   * #EE822F : [3] : 工艺过程 : #FCE4D3 : 1 :
   * 物理或化学工艺产生的排放，如水泥生产过程中煅烧环节产生的二氧化碳，石化工艺中催化裂化产生的二氧化碳，以及炼铝产生的全氟碳化物等 : 3； #EE822F : [4] :
   * 无组织排放 : #FCE4D3 : 1 : 设备的接缝、密封件、包装和垫圈等发生的有意和无意的泄漏，以及煤堆、 废水处理、维修区、冷却塔、各类气体处理设施等产生的无组织排放 :
   * 4； #EE822F : [5] : 碳封存 : #FCE4D3 : 1 :
   * 植物在光合作用过程中清除大气中的碳（以二氧化碳的形式），并将其储存在植物组织内。直到这些碳再次进入大气之前将停留在大量的“碳库”中，这些碳库包括：森林、农田和其他陆地环境中的地上生物质（如植被）；地下生物质（如根系）；储存在使用中或填埋场的生物基质产品（如木制品）
   * : 5； #FA9158 : [6] : 电力 : #FBA779 : 2 : 企业拥有或控制的设备或运营消耗的外购或取得电力所产生的排放 : 6； #FA9158 : [7]
   * : 蒸汽 : #FBA779 : 2 : 企业拥有或控制的设备或运营消耗的外购或取得蒸汽所产生的排放 : 7； #FA9158 : [8] : 压缩空气 : #FBA779 :
   * 2 : 企业拥有或控制的设备或运营消耗的外购或取得压缩空气所产生的排放 : 8； #FA9158 : [9] : 冷 : #FBA779 : 2 :
   * 企业拥有或控制的设备或运营消耗的外购或取得供冷所产生的排放 : 9； #FA9158 : [10] : 热 : #FBA779 : 2 :
   * 企业拥有或控制的设备或运营消耗的外购或取得供热所产生的排放 : 10； F2BA02 : [18, 20] : 外购商品和服务 : FFF3CA : 3 :
   * 企业在报告年份购买或收购的商品和服务的提取、生产和运输（不包含在第2类别~第8类别的部分） : 11； C198E0 : [17] : 资本商品 : DCD7FF : 3 :
   * 报告企业在报告年份购买或收购的资本商品的提取、生产和运输 : 12； 30C0B4 : [26] : 燃料和能源相关活动 : D2F4F2 : 3 :
   * 报告企业在报告年份购买或收购的燃料与能源的开采、生产和运输（未包括在范围一和范围二中的部分）：
   * （1）外购燃料的上游排放（报告企业所消耗的燃料的提取、生产、运输）
   * （2）外购电力的上游排放（生产报告企业所需的电力、蒸汽、供热和供冷所消耗燃料的提取、生产和运输）
   * （3）传输和配送（T&D）损耗 [T&D系统中的消耗（即损失）的电力、蒸汽、供暖和供冷的生产 ]——由最终用户报告
   * （4）出售给最终用户的外购电力的生产（报告企业购买的，并出售给最终用户的电力、蒸汽、供热和供冷的生产）——仅由公共事业公司或能源零售商报告 : 13； D3A77B : [13]
   * : 上游运输和配送 : FFDBB3 : 3 : （1）报告企业在报告年份购买的产品在企业的一级供应商及其自身运营之间的运输和配送（使用非报告企业拥有或控制的车辆和设施）
   * （2）报告企业在报告年份购买的运输和配送服务，包括进货物流和出货物流（如出售产品的），和公司自有设施之间的运输和配送（使用非报告企业拥有或控制的车辆和设施） : 14；
   * 75BD42 : [16] : 运营中产生的废弃物 : E3F2D9 : 3 : 报告企业的运营在报告年份产生的废弃物的处理/处置（使用非报告企业拥有或控制的设施） : 15；
   * 00B0F0 : [11, 15] : 商务旅行 : D9E1F4 : 3 : 雇员在报告年份与商务活动相关的交通（使用非报告企业拥有或控制的车辆） : 16； 00B0F0 :
   * [12] : 雇员通勤 : D9E1F4 : 3 : 雇员在报告年份自住所到工作地点之间的交通（使用非报告企业拥有或控制的车辆） : 17； 30C0B4 : [19] :
   * 上游租赁资产 : D2F4F2 : 3 : 不包含在范围一和范围二中的，报告企业（承租方）在报告年份租赁资产的运营——由承租方报告 : 18； D3A77B : [14] :
   * 售出产品的运输和配送 : FFDBB3 : 3 :
   * 报告企业在报告年份售出的产品在报告企业的运营和最终用户之间的运输和配送（在非报告企业付费的情况下），包括零售和存储（使用费报告企业拥有或控制的车辆和设施） : 19；
   * 30C0B4 : [22] : 售出产品的加工 : D2F4F2 : 3 : 下游企业（如制造商）在报告年份售出的中间产品的加工 : 20； 30C0B4 : [21] :
   * 售出产品的使用 : D2F4F2 : 3 : 报告企业在报告年份售出的产品和服务的最终使用 : 21； 30C0B4 : [23] : 处理寿命终止的售出产品 : D2F4F2
   * : 3 : 报告企业（在报告年份）售出产品在其寿命终止时的废物处理/处置 : 22； 30C0B4 : [25] : 下游租赁资产 : D2F4F2 : 3 :
   * 不包含在范围一和范围二中的，报告企业（出租方）所有的，且出租给其他实体的资产在报告年份的运营——由出租方报告 : 23； 30C0B4 : [26] : 特许经营权 :
   * D2F4F2 : 3 : 不包含在范围一和范围二中的，特许经营权在报告年份的运营-----由特许权授予方报告 : 24； 30C0B4 : [24] : 投资 : D2F4F2
   * : 3 : 不包含在范围一和范围二中的，投资在报告年份的运营（包括股权和债券投资及项目融资） : 25)
   */
  ghgClassify?: number;
  /**
   * id
   */
  id?: number;
  /**
   * 模型id。非核算模型为0
   */
  modelId?: number;
  /**
   * 组织code
   */
  orgCode?: string;
  orgName?: string;
  /**
   * 填报角色（多选）。,分割
   */
  roleIds?: string;
  /**
   * 排放源code
   */
  sourceCode?: string;
  /**
   * 排放源名称
   */
  sourceName?: string;
  /**
   * 统计类型 (普通 : 0； CARE3.1 : 11； CARE3.4 : 12； 3.6碳账户飞机 : 21； 3.6碳账户火车 : 22； 3.6碳账户出租车 : 23；
   * 3.6碳账户大巴 : 24； WMS3.12 : 31； WMS3.4 : 6； 3.4运输特殊模板三段式 : 5； 3.1服务金额 : 40； 3.1包装金额 : 41；
   * 3.1物料金额 : 42)
   */
  statisticType?: number;
  /**
   * 模板文件json
   */
  templateFileJson?: IdValue[];
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

/**
 * ComputationSourceResp，ComputationSourceResp
 */
export interface ComputationSourceResp {
  /**
   * 审核意见
   */
  auditComment?: string;
  /**
   * 审核时间
   */
  auditTime?: Date;
  /**
   * 碳排放量
   */
  carbonEmissionStr?: string;
  /**
   * 核算id
   */
  computationId?: number;
  /**
   * 排放源组id
   */
  computationSourceGroupId?: number;
  /**
   * 创建者
   */
  createBy?: number;
  /**
   * 创建时间
   */
  createTime?: Date;
  /**
   * 数据收集周期序号。从1开始
   */
  dataPeriodIdx?: number;
  /**
   * 标记删除。0 未删除 1 已删除
   */
  deleted?: boolean;
  /**
   * 邮件状态。1 未发送；2 已发送 (未发送 : 1； 已发送 : 2)
   */
  emailStatus?: number;
  /**
   * 排放源id
   */
  emissionSourceId?: number;
  /**
   * 排放量单位。2 tCO₂e；1 kgCO₂e (1000000 : tCO₂e : 2； 1000 : kgCO₂e : 1； 1 : gCO₂e : 3)
   */
  emissionUnit?: number;
  /**
   * 排放设施
   */
  facility?: string;
  /**
   * 因子匹配状态。0 已匹配；1 未匹配 (已匹配 : 0； 未匹配 : 1)
   */
  factorMatchStatus?: number;
  /**
   * 填报截止时间
   */
  fillDeadline?: Date;
  /**
   * 填报状态。0 -；1 未填报；2 填报中；3 填报完成 (- : 0； 未填报 : 1； 填报中 : 2； 填报完成 : 3)
   */
  fillStatus?: number;
  /**
   * GHG分类。1 范围一；2 范围二；3 范围三 (直接排放 : [1] : scope one : 范围一 : 1； 间接排放 : [2] : scope two : 范围二 :
   * 2； 间接排放 : [3, 4, 5, 6] : scope three : 范围三 : 3)
   */
  ghgCategory?: number;
  /**
   * GHG类别 (#EE822F : [1] : 固定燃烧 : #FCE4D3 : 1 : 固定设备内部的燃料燃烧，如锅炉、 熔炉、燃烧器、涡轮、加热器、焚烧炉、引擎和燃烧塔等 :
   * 1； #EE822F : [2] : 移动燃烧 : #FCE4D3 : 1 : 运输工具的燃料燃烧，如汽车、卡车、 巴士、火车、飞机、汽船、轮船、驳船、船舶等 : 2；
   * #EE822F : [3] : 工艺过程 : #FCE4D3 : 1 :
   * 物理或化学工艺产生的排放，如水泥生产过程中煅烧环节产生的二氧化碳，石化工艺中催化裂化产生的二氧化碳，以及炼铝产生的全氟碳化物等 : 3； #EE822F : [4] :
   * 无组织排放 : #FCE4D3 : 1 : 设备的接缝、密封件、包装和垫圈等发生的有意和无意的泄漏，以及煤堆、 废水处理、维修区、冷却塔、各类气体处理设施等产生的无组织排放 :
   * 4； #EE822F : [5] : 碳封存 : #FCE4D3 : 1 :
   * 植物在光合作用过程中清除大气中的碳（以二氧化碳的形式），并将其储存在植物组织内。直到这些碳再次进入大气之前将停留在大量的“碳库”中，这些碳库包括：森林、农田和其他陆地环境中的地上生物质（如植被）；地下生物质（如根系）；储存在使用中或填埋场的生物基质产品（如木制品）
   * : 5； #FA9158 : [6] : 电力 : #FBA779 : 2 : 企业拥有或控制的设备或运营消耗的外购或取得电力所产生的排放 : 6； #FA9158 : [7]
   * : 蒸汽 : #FBA779 : 2 : 企业拥有或控制的设备或运营消耗的外购或取得蒸汽所产生的排放 : 7； #FA9158 : [8] : 压缩空气 : #FBA779 :
   * 2 : 企业拥有或控制的设备或运营消耗的外购或取得压缩空气所产生的排放 : 8； #FA9158 : [9] : 冷 : #FBA779 : 2 :
   * 企业拥有或控制的设备或运营消耗的外购或取得供冷所产生的排放 : 9； #FA9158 : [10] : 热 : #FBA779 : 2 :
   * 企业拥有或控制的设备或运营消耗的外购或取得供热所产生的排放 : 10； F2BA02 : [18, 20] : 外购商品和服务 : FFF3CA : 3 :
   * 企业在报告年份购买或收购的商品和服务的提取、生产和运输（不包含在第2类别~第8类别的部分） : 11； C198E0 : [17] : 资本商品 : DCD7FF : 3 :
   * 报告企业在报告年份购买或收购的资本商品的提取、生产和运输 : 12； 30C0B4 : [26] : 燃料和能源相关活动 : D2F4F2 : 3 :
   * 报告企业在报告年份购买或收购的燃料与能源的开采、生产和运输（未包括在范围一和范围二中的部分）：
   * （1）外购燃料的上游排放（报告企业所消耗的燃料的提取、生产、运输）
   * （2）外购电力的上游排放（生产报告企业所需的电力、蒸汽、供热和供冷所消耗燃料的提取、生产和运输）
   * （3）传输和配送（T&D）损耗 [T&D系统中的消耗（即损失）的电力、蒸汽、供暖和供冷的生产 ]——由最终用户报告
   * （4）出售给最终用户的外购电力的生产（报告企业购买的，并出售给最终用户的电力、蒸汽、供热和供冷的生产）——仅由公共事业公司或能源零售商报告 : 13； D3A77B : [13]
   * : 上游运输和配送 : FFDBB3 : 3 : （1）报告企业在报告年份购买的产品在企业的一级供应商及其自身运营之间的运输和配送（使用非报告企业拥有或控制的车辆和设施）
   * （2）报告企业在报告年份购买的运输和配送服务，包括进货物流和出货物流（如出售产品的），和公司自有设施之间的运输和配送（使用非报告企业拥有或控制的车辆和设施） : 14；
   * 75BD42 : [16] : 运营中产生的废弃物 : E3F2D9 : 3 : 报告企业的运营在报告年份产生的废弃物的处理/处置（使用非报告企业拥有或控制的设施） : 15；
   * 00B0F0 : [11, 15] : 商务旅行 : D9E1F4 : 3 : 雇员在报告年份与商务活动相关的交通（使用非报告企业拥有或控制的车辆） : 16； 00B0F0 :
   * [12] : 雇员通勤 : D9E1F4 : 3 : 雇员在报告年份自住所到工作地点之间的交通（使用非报告企业拥有或控制的车辆） : 17； 30C0B4 : [19] :
   * 上游租赁资产 : D2F4F2 : 3 : 不包含在范围一和范围二中的，报告企业（承租方）在报告年份租赁资产的运营——由承租方报告 : 18； D3A77B : [14] :
   * 售出产品的运输和配送 : FFDBB3 : 3 :
   * 报告企业在报告年份售出的产品在报告企业的运营和最终用户之间的运输和配送（在非报告企业付费的情况下），包括零售和存储（使用费报告企业拥有或控制的车辆和设施） : 19；
   * 30C0B4 : [22] : 售出产品的加工 : D2F4F2 : 3 : 下游企业（如制造商）在报告年份售出的中间产品的加工 : 20； 30C0B4 : [21] :
   * 售出产品的使用 : D2F4F2 : 3 : 报告企业在报告年份售出的产品和服务的最终使用 : 21； 30C0B4 : [23] : 处理寿命终止的售出产品 : D2F4F2
   * : 3 : 报告企业（在报告年份）售出产品在其寿命终止时的废物处理/处置 : 22； 30C0B4 : [25] : 下游租赁资产 : D2F4F2 : 3 :
   * 不包含在范围一和范围二中的，报告企业（出租方）所有的，且出租给其他实体的资产在报告年份的运营——由出租方报告 : 23； 30C0B4 : [26] : 特许经营权 :
   * D2F4F2 : 3 : 不包含在范围一和范围二中的，特许经营权在报告年份的运营-----由特许权授予方报告 : 24； 30C0B4 : [24] : 投资 : D2F4F2
   * : 3 : 不包含在范围一和范围二中的，投资在报告年份的运营（包括股权和债券投资及项目融资） : 25)
   */
  ghgClassify?: number;
  /**
   * id
   */
  id?: number;
  /**
   * 模型id。非核算模型为0
   */
  modelId?: number;
  /**
   * 组织code
   */
  orgCode?: string;
  orgName?: string;
  /**
   * 剩余天数
   */
  remainingDay?: number;
  /**
   * 审核状态。0 -；2 未审核；3 审批通过；4 审批不通过 (- : 0； 未审核 : 2； 审核通过 : 3； 审核驳回 : 4)
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
   * 统计类型 (普通 : 0； CARE3.1 : 11； CARE3.4 : 12； 3.6碳账户飞机 : 21； 3.6碳账户火车 : 22； 3.6碳账户出租车 : 23；
   * 3.6碳账户大巴 : 24； WMS3.12 : 31； WMS3.4 : 6； 3.4运输特殊模板三段式 : 5； 3.1服务金额 : 40； 3.1包装金额 : 41；
   * 3.1物料金额 : 42)
   */
  statisticType?: number;
  /**
   * 提交审核时间
   */
  submitTime?: Date;
  /**
   * 模板文件json
   */
  templateFileJson?: IdValue[];
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
   * 用户是否处于当前审核节点 && 当前节点待审核
   */
  userBtnFlag?: boolean;
  /**
   * 年
   */
  year?: number;
  [property: string]: any;
}

/**
 * IdValue，模板文件json
 */
export interface IdValue {
  id?: number;
  value?: string;
  [property: string]: any;
}
/**
 * ComputationSourceReq
 */
export interface ComputationSourceReqRequest {
  /**
   * 核算id
   */
  computationId?: number;
  /**
   * 排放源code列表
   */
  emissionSourceCodeList?: string[];
  /**
   * 组织code
   */
  orgCode: string;
}

export interface ComputationSourceReqResponse {
  computationSourceId: number;
  emissionSourceId: number;
  emissionSourceTemplateId: number;
  mainParamList: MainParamList[];
}
export interface MainParamList {
  id: number;
  emissionSourceFactorId: number;
  emissionSourceId: number;
  emissionSourceTemplateId: number;
  mainParamCode: string;
  associatedParamCodes: string;
  mainParamName: string;
  associatedParamName: string;
  factorList: FactorList[];
}
export interface FactorList {
  id: number;
  factorValueId: number;
  factorId: number;
  factorName: string;
  factorValue: string;
  unit: string;
  remark: string;
  paramValueList: ParamValueList[];
}
export interface ParamValueList {
  id: number;
  value: string;
  valueName: string;
  paramName: string;
  paramCode: string;
  paramType: number;
  paramType_name: string;
  textType: number;
  len: number;
  dictEnum: string;
  defaultFlag: number;
  defaultFlag_name: string;
  defaultValue: string;
}
