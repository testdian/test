/*
 * @@description:
 * @Author: liuxinxin xinxin@carbonstop.net
 * @Date: 2023-03-14 16:10:36
 * @LastEditors: liuxinxin xinxin@carbonstop.net
 * @LastEditTime: 2023-06-16 19:27:55
 */

/**
 * @description 类型枚举值
 * stage：生命周期阶段 1:原材料获取 2:生产制造 3:分销与存储 4:产品使用 5:废弃使用
 */
import I18N from '@src/lang/I18N';

export const materialsTypeList = (stage: string) => {
  const list = [
    I18N.components.mainMaterials,
    I18N.components.accessories,
    I18N.carbonFootPrintLCA.packingMaterial,
    I18N.components.recycledMaterials,
    I18N.carbonFootPrintLCA.energyConsumption,
    I18N.carbonFootPrintLCA.waterConsumption,
    I18N.carbonFootPrintLCA.transport,
  ];
  switch (Number(stage)) {
    case 2:
      list.push(I18N.components.machining);
      break;
    case 4:
      list.push(I18N.components.apply);
      break;
    case 5:
      list.push(I18N.carbonFootPrintLCA.abandonedDisposal);
      break;
    default:
      list.push();
      break;
  }
  return list;
};

/** 根据表单路径 赋予表单title/label值 */
export const emissionDataFieldState = new Map([
  [
    'factorName',
    {
      factor: I18N.components.emissionFactorName,
      supplier: I18N.components.purchasingProducts,
    },
  ],
  [
    'factorValue',
    {
      factor: I18N.components.numberOfEmissionFactors,
      supplier: I18N.carbonFootPrint.unitProductScheduling2,
    },
  ],
  [
    'factorUnit',
    {
      factor: I18N.components.emissionFactorSheet,
      supplier: I18N.Factors.unit,
    },
  ],
  [
    'percentMeasure',
    {
      factor: I18N.components.unitConversionRatio2,
      supplier: I18N.components.unitConversionRatio,
    },
  ],
  [
    'factorSource',
    {
      factor: I18N.components.emissionFactors,
      supplier: I18N.carbonFootPrint.supplierName,
    },
  ],
  [
    'factorYear',
    {
      factor: I18N.Factors.yearOfPublication,
      supplier: I18N.components.accountingYear,
    },
  ],
]);
