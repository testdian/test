/*
 * @@description:
 * @Author: liuxinxin xinxin@carbonstop.net
 * @Date: 2023-03-21 18:32:04
 * @LastEditors: liuxinxin xinxin@carbonstop.net
 * @LastEditTime: 2023-06-15 21:25:49
 */

/** 排放因子 */
export interface EmissionSourceData {
  /** 类型为运输-计算方式 */
  materialsTypeFormula: number;
  /** 类型为运输-按里程-产品重量-产品重量数值 */
  weight2: string;
  /** 类型为运输-按里程-产品重量-产品重量单位值 */
  maMeasure2: string[];
  /** 类型为运输-按载重-载重比例数值 */
  weight3: string;
  /** 排放数据-因子对象 */
  factorInfoObj?: FactorInfoProps;
}

/** 排放数据-因子对象 */
export interface FactorInfoProps {
  /** 排放因子名称 */
  factorName: string;
  /** 排放因子数值 */
  factorValue: string;
  /** 单位-分子单位 */
  factorUnitZ: string;
  /** 单位-分母单位 */
  factorUnitM: string[];
  /** 单位换算比例 */
  percentMeasure: string;
  /** 排放因子来源 */
  factorSource: string;
  /** 发布年份 */
  factorYear: string;
  /** 排放因子id */
  factorId?: string | number;
}

/** 返回的单位处理的数据  */
export interface UnitValueBackProps {
  /** 分类名称 */
  dictLabel?: string | undefined;
  /** 分类标识 */
  dictValue?: string | undefined;
  /** 所属分类标识 */
  sourceType?: string | undefined;
  /** 字典排序 */
  dictSort?: number | undefined;
  /** 单位id */
  id?: null | undefined;
  /** 所属分类名称 */
  sourceName?: string | null | undefined;
  /** 字典标识 */
  dictType?: string | undefined;
  /** 传递的单位值 */
  value: string;
}

/** 非运输类型的数据值  */
export interface UnitItemProps {
  /** 数值 */
  weight?: string;
  /** 单位 */
  maMeasure?: string[] | string;
  /** 单位code码 */
  measureCode?: string;
  /** 因子单位 */
  factorUnit?: string;
  /** 因子单位code码 */
  unitCode?: string;
}
