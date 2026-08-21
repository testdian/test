export type FormValueType = {
  auditType: number;
  orgId: number;
  auditRequired: number;
  nodeList: AuditNodeDto[];
};

/**
 * 审批设置详情的类型
 */
export interface AuditReq {
  /**
   * 审批需要。1 需要审批；2 不需要审批
   */
  auditRequired?: number;
  /**
   * 审批内容（枚举）(1:企业碳核算排放数据审核; 3:供应链碳数据审核; 4:行业碳核算数据审核)
   */
  auditType?: number;
  /**
   * 节点列表
   */
  nodeList?: AuditNodeDto[];
  /**
   * 组织id
   */
  orgCode?: string;
  /**
   * 排放源组id列表
   */
  groupIdList?: number[];
  /**
   * 核算id列表
   */
  computationIdList?: number[];
}

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
   * 角色id
   */
  targetRoleId?: number;
}

export interface UserLeaderRequest {
  /**
   * 配置类型。1 按人员；2 按角色
   */
  configType: string;
  /**
   * ids
   */
  ids: string;
  [property: string]: any;
}

/**
 * User，User
 */
export interface UserLeaderResp {
  /**
   * 姓名
   */
  a0101?: string;
  /**
   * 预计转正日期
   */
  a0127?: string;
  /**
   * 入职日期
   */
  a0144?: string;
  /**
   * 考勤卡号
   */
  a0147?: string;
  /**
   * 人员ID
   */
  a0188?: string;
  /**
   * 工号
   */
  a0190?: string;
  /**
   * 人员类别
   */
  a0191?: string;
  /**
   * 合同主体
   */
  a01htcontent?: string;
  /**
   * 性别
   */
  a01Sex?: string;
  /**
   * 人员状态
   */
  a01status?: string;
  /**
   * 常驻工作地点
   */
  a01workaddr?: string;
  /**
   * 所属派遣公司
   */
  a01wxgs?: string;
  /**
   * 人员分类
   */
  a0201?: string;
  /**
   * 品牌列表（字典）。','分割
   */
  brands?: string;
  /**
   * 所属分类/组织代码值
   */
  categorycode?: string;
  /**
   * 主编码，主键
   */
  code?: string;
  /**
   * 数据唯一ID
   */
  codeid?: string;
  /**
   * 创建者
   */
  createBy?: number;
  /**
   * 创建时间
   */
  createTime?: Date;
  /**
   * 主数据状态 1生效 3冻结 4废止
   */
  dataflag?: string;
  /**
   * 主数据状态-描述
   */
  dataflagname?: string;
  /**
   * 是否默认密码
   */
  defaultPassword?: boolean;
  /**
   * 标记删除。0 未删除 1 已删除
   */
  deleted?: boolean;
  /**
   * 部门代码
   */
  deptCode?: string;
  /**
   * 部门ID
   */
  deptId?: string;
  /**
   * 部门全称
   */
  deptpath?: string;
  /**
   * 钉钉ID
   */
  dingdingid?: string;
  /**
   * 邮箱
   */
  email?: string;
  /**
   * 人脸路径
   */
  facePath?: string;
  /**
   * 所属单位
   */
  gscompany?: string;
  /**
   * 岗位名称
   */
  gwName?: string;
  /**
   * 计薪类型
   */
  gztype?: string;
  /**
   * id
   */
  id?: number;
  /**
   * 上次登录时间
   */
  lastLoginTime?: Date;
  /**
   * 直接上级姓名(查看)
   */
  leadera0101v?: string;
  /**
   * 直接上级工号(查看)
   */
  leadera0190v?: string;
  /**
   * 手机号
   */
  mobile?: string;
  orgName?: string;
  /**
   * 姓名
   */
  realName?: string;
  /**
   * 供应商编码
   */
  supplierCode?: string;
  /**
   * 供应商名称
   */
  supplierName?: string;
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
   * 用户名
   */
  username?: string;
  /**
   * 用户状态。0 启用 1 禁用 (启用 : 0； 禁用 : 1)
   */
  userStatus?: number;
  /**
   * 用户类型。0 内部用户；1 外部用户 (内部用户 : 0； 外部用户 : 1)
   */
  userType?: number;
  /**
   * 版本号
   */
  version?: number;
  [property: string]: any;
}
