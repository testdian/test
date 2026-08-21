export interface ParameterRequest {
  /**
   * 参数名称
   */
  likeParamName?: string;
  /**
   * 页码
   */
  pageNum: number;
  /**
   * 每页条数
   */
  pageSize: number;
  /**
   * 参数ID
   */
  paramCode?: string;
  /**
   * 参数适用范围。1 全局参数；2 自定义参数
   */
  paramScope?: number;
  /**
   * 查询非全量
   */
  notGlobal?: number;
  [property: string]: any;
}

/**
 * Param
 */
export interface Param {
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
  /**
   * 参数适用范围。1 全局参数；2 自定义参数(1:全局参数; 2:自定义参数)
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
  paramScope_name?: string;
  correctRangeClass: CorrectRangeClassProps;
  warningRangeClass: CorrectRangeClassProps;
  [property: string]: any;
}

export interface CorrectRangeClassProps {
  maxNum: number;
  maxSymbol: number;
  minNum: number;
  minSymbol: number;
}
