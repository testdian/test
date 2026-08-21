/**
 * UserReq
 */
export interface UserReq {
  /**
   * 页码
   * 示例值: '1'
   */
  pageNum?: number;
  /**
   * 每页条数
   * 示例值: '10'
   */
  pageSize?: number;
  /**
   * 用户类型。0 内部用户；1 外部用户
   */
  userType?: string;
  /**
   * 姓名工号
   */
  likeUsername?: string;
  /**
   * 直接上级姓名/工号
   */
  likeLeader?: string;
  /**
   * 部门全称
   */
  likeDeptpath?: string;
  /**
   * 所属单位
   */
  likeGscompany?: string;
  /**
   * 钉钉id
   */
  likeDingdingid?: string;
  /**
   * 供应商全称/编码
   */
  likeSupplierCode?: string;
  /**
   * 邮箱
   */
  likeEmail?: string;
  /**
   * 用户状态。0 启用；1 禁用
   * 收集类型: enum<string> 示例值: '0'
   */
  userStatus?: string;
  /**
   * 角色id
   */
  roleId?: string;
  [property: string]: any;
}

/**
 * UserResp，UserResp
 */
export interface UserResp {
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
  /**
   * 组织
   */
  orgNames?: string;
  /**
   * 姓名
   */
  realName?: string;
  /**
   * 角色
   */
  roleNames?: string;
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
  /**
   * 核算组织
   */
  orgs?: string;
  /**
   * 角色id
   */
  roles?: string;
  [property: string]: any;
}

export interface ExportUserReq {
  /**
   * 用户类型。0 内部用户；1 外部用户
   */
  userType: string;
  /**
   * 姓名工号
   */
  likeUsername?: string;
  /**
   * 直接上级姓名/工号
   */
  likeLeader?: string;
  /**
   * 部门全称
   */
  likeDeptpath?: string;
  /**
   * 所属单位
   */
  likeGscompany?: string;
  /**
   * 钉钉id
   */
  likeDingdingid?: string;
  /**
   * 供应商全称/编码
   */
  likeSupplierCode?: string;
  /**
   * 邮箱
   */
  likeEmail?: string;
  /**
   * 用户状态。0 启用；1 禁用
   * 收集类型: enum<string> 示例值: '0'
   */
  userStatus?: string;
  /**
   * 角色id
   */
  roleId?: string;
  [property: string]: any;
}
