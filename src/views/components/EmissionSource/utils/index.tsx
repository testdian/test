/** 根据表单路径 赋予表单title/label值 */
import I18N from '@src/lang/I18N';

export const emissionDataFieldState = new Map([
  [
    'unitConver',
    {
      factor: I18N.components.unitConversionRatio4,
      supplier: I18N.components.unitConversionRatio3,
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
    'year',
    {
      factor: I18N.Factors.yearOfPublication,
      supplier: I18N.components.accountingYear,
    },
  ],
]);
