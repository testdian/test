import { Form } from '@formily/core';
import I18N from '@src/lang/I18N';
// import I18N from '@src/lang/I18N';
// import I18N from '@src/lang/I18N';
import { compact } from 'lodash-es';

import {
  changeEnum2Options,
  changeEnum2OptionsLabel,
  Dicts,
} from '@/views/dashborad/Dicts/hooks';

import { HasSubCategoryGas } from './schemas';
import { FactorUnitMTransformMap } from '../type';

/** 气体对应的字典枚举 */
export const gasEnumsMap = {
  'CO₂': 'factorUnitZ',
  'CH₄': 'methaneUnitZ',
  'N₂O': 'nitrousUnitZ',
  HFCs: 'hydrofluorocarbonUnitZ',
  PFCs: 'perfluorocarbonUnitZ',
  'SF₆': 'sulfurUnitZ',
  'NF₃': 'nitrogenUnitZ',
  'CO₂e': 'cequivalentUnitZ',
};
export const gasNamesMap = {
  'CO₂': I18N.Factors.carbonDioxide,
  'CH₄': I18N.Factors.methane,
  'N₂O': I18N.Factors.nitrousOxide,
  HFCs: I18N.Factors.hydrofluorocarbons,
  PFCs: I18N.Factors.perfluorocarbon,
  'SF₆': I18N.Factors.sulfurHexafluoride,
  'NF₃': I18N.Factors.nitrogenTrifluoride,
  'CO₂e': I18N.Factors.carbonDioxideWhen,
};

const gasList = Object.keys(gasNamesMap).map(
  gas => `${gasNamesMap[gas as keyof typeof gasNamesMap]}（${gas}）`,
);
const gasTypeList = Object.keys(gasNamesMap);
export const gasObjFn = () => {
  const gasObj: { [key: string]: any } = {};
  gasList.forEach((g, i) => {
    gasObj[g] = gasTypeList[i];
  });

  return gasObj;
};
export const gasTableData = gasList.map((g, i) => ({
  gasType: g,
  gas: Object.keys(HasSubCategoryGas).some(gas => g.includes(gas))
    ? undefined
    : g,
  showAdd: 1,
  gasCurtType: gasTypeList[i],
}));
/** 设置因子单位选项 */
/** 设置因子单位选项 */
export const setGasSelectOptions = (
  form: Form,
  enums: Record<string, Dicts[]>,
) => {
  // const gas = Object.keys(gasEnumsMap);
  const gas = form.getValuesIn('gasList');
  const length = gas?.length;
  const getGasTypePath = (n: number) => `gasList.${n}.gasType`;
  const getFactorUnitZPath = (n: number) => `gasList.${n}.factorUnitZ`;
  for (let i = 0; i < length; i++) {
    const field = form.getFieldState(getGasTypePath(i));
    if (!field) {
      return;
    }
    const { value } = field;
    if (!value) {
      return;
    }
    const currentGasList = form
      .getValuesIn('*')
      .gasList.map((item: { gas: string }) => item.gas);
    const gasName = gas[i];
    /** 氢氟碳化物（HFCs）全氟化碳（PFCs 选项 */
    if (value?.includes('HFCs')) {
      form.setFieldState(`gasList.${i}.gas`, {
        dataSource: changeEnum2OptionsLabel(enums.HFCsEnum, currentGasList),
      });
    }
    if (value?.includes('PFCs')) {
      form.setFieldState(`gasList.${i}.gas`, {
        dataSource: changeEnum2OptionsLabel(enums.PFCseNUM, currentGasList),
      });
    }
    if (value?.includes(gasName.gasCurtType)) {
      form.setFieldState(getFactorUnitZPath(i), {
        dataSource: changeEnum2Options(
          enums[gasEnumsMap[gasName.gasCurtType as keyof typeof gasEnumsMap]],
        ),
      });
    }
  }
};
export const factorDetailsetGasSelectOptions = (
  newGasList: any,
  form: Form,
  enums: Record<string, Dicts[]>,
) => {
  // const gas = Object.keys(gasEnumsMap);
  const gas = newGasList;
  const { length } = newGasList;
  const getFactorUnitZPath = (n: number) => `gasList.${n}.factorUnitZ`;
  for (let i = 0; i < length; i++) {
    const value = newGasList[i].gasType;

    const currentGasList = form
      .getValuesIn('*')
      .gasList.map((item: { gas: string }) => item.gas);
    const gasName = gas[i];
    /** 氢氟碳化物（HFCs）全氟化碳（PFCs 选项 */
    if (value?.includes('HFCs')) {
      form.setFieldState(`gasList.${i}.gas`, {
        dataSource: changeEnum2OptionsLabel(enums.HFCsEnum, currentGasList),
      });
    }
    if (value?.includes('PFCs')) {
      form.setFieldState(`gasList.${i}.gas`, {
        dataSource: changeEnum2OptionsLabel(enums.PFCseNUM, currentGasList),
      });
    }

    if (value?.includes(gasName.gasCurtType)) {
      form.setFieldState(getFactorUnitZPath(i), {
        dataSource: changeEnum2Options(
          enums[gasEnumsMap[gasName.gasCurtType as keyof typeof gasEnumsMap]],
        ),
      });
    }
  }
};
/** 分母单位转换成联级数据结构 */
export const changeFactorM2cascaderOptions = (factorUnitM: Dicts[]) => {
  const factorMap: FactorUnitMTransformMap = {};
  factorUnitM.forEach(val => {
    if (val.sourceType && factorMap[val.sourceType]) {
      // @ts-ignore
      factorMap[val.sourceType].children = factorMap[
        val.sourceType
      ].children?.concat?.([
        { label: val.dictLabel, value: val.dictValue, children: [] },
      ]);
    } else if (val.sourceType) {
      factorMap[val.sourceType] = {
        label: val.sourceName || val.sourceType,
        value: val.sourceType,
        children: [
          {
            label: val.dictLabel,
            value: val.dictValue,
          },
        ],
      };
    }
  });
  return compact(Object.values(factorMap)).flat();
};
