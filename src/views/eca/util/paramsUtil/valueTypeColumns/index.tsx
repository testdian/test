/**
 * @description: 处理模版参数配置项的渲染逻辑
 */
import { ProFieldValueTypeWithFieldProps } from '@ant-design/pro-components';
import I18N from '@src/lang/I18N';
import { isNumber } from 'lodash-es';

import { getSystemDictenumListAllByDictTypeBatch } from '@/sdks/systemV2ApiDocs';
import { Dicts } from '@/utils';

import { EmissionSourceParam } from '../../../emissionManage/type';
import { COMMON_PARAM_TYPE } from '../../constant';
import {
  CorrectRangeClassMaxSymbolEnum,
  CorrectRangeClassMinSymbolEnum,
} from '../correctParams';
import { TIME_TYPE } from '../paramsSchema/constant';

const { TEXT, NUMBER, SELECT, TIME, ADDRESS } = COMMON_PARAM_TYPE;

const { TIME_YEAR_SECOND, TIME_YEAR_DATE, TIME_YEAR_MONTH, TIME_YEAR } =
  TIME_TYPE;

export const renderFormComponent = (paramType: number) => {
  switch (paramType) {
    case SELECT:
      return 'select';
    case TEXT:
      return 'text';
    case NUMBER:
      return 'digit';
    case TIME:
      return 'dateTime';
    default:
      return 'text';
  }
};

/** 处理不同参数类型的renderFiledProps */
export const renderFieldProps = (item: EmissionSourceParam) => {
  switch (item.paramType) {
    case SELECT:
      return {
        showSearch: true,
        allowClear: true,
        placeholder: I18N.Factors.pleaseSelect,
        style: {
          width: '174px',
        },
      } as ProFieldValueTypeWithFieldProps['select'];
    case TEXT:
      return {
        placeholder: I18N.base.pleaseEnter,
        style: {
          width: '100%',
        },
      } as ProFieldValueTypeWithFieldProps['text'];
    case NUMBER: {
      return {
        placeholder: I18N.base.pleaseEnter,
        style: {
          width: '100%',
        },
      } as ProFieldValueTypeWithFieldProps['digit'];
    }
    case TIME: {
      const { timeType } = item;
      if (timeType === TIME_YEAR_SECOND) {
        return {
          format: 'YYYY-MM-DD HH:mm:ss',
          placeholder: I18N.eca.pleaseSelectATime,
          showNow: false,
          style: {
            width: '174px',
          },
        } as ProFieldValueTypeWithFieldProps['dateTime'];
      }
      if (timeType === TIME_YEAR_DATE) {
        return {
          format: 'YYYY-MM-DD',
          placeholder: I18N.eca.pleaseSelectATime,
          showNow: false,
          showTime: false,
          picker: 'date',
          style: {
            width: '174px',
          },
        } as ProFieldValueTypeWithFieldProps['dateTime'];
      }
      if (timeType === TIME_YEAR_MONTH) {
        return {
          format: 'YYYY-MM',
          placeholder: I18N.eca.pleaseSelectATime,
          showNow: false,
          showTime: false,
          picker: 'month',
          style: {
            width: '174px',
          },
        } as ProFieldValueTypeWithFieldProps['dateTime'];
      }
      if (timeType === TIME_YEAR) {
        return {
          format: 'YYYY',
          placeholder: I18N.eca.pleaseSelectATime,
          showNow: false,
          showTime: false,
          picker: 'year',
          style: {
            width: '174px',
          },
        } as ProFieldValueTypeWithFieldProps['dateTime'];
      }
      return {
        format: 'YYYY',
        placeholder: I18N.eca.pleaseSelectATime,
        showNow: false,
        showTime: false,
        picker: 'year',
        style: {
          width: '174px',
        },
      };
    }
    default:
      return {};
  }
};

/**
 * 生成表单校验规则
 *  item - 参数配置项
 *  item.requiredFlag - 是否必填 (1:必填, 其他:非必填)
 *  item.len - 数值小数位或文本最大长度
 *  item.paramType - 参数类型
 */
const { MORE_THAN, MORE_THAN_OR_EQUAL } = CorrectRangeClassMinSymbolEnum;
const { MORE_THAN: MAX_MORE_THAN, MORE_THAN_OR_EQUAL: MAX_MORE_THAN_OR_EQUAL } =
  CorrectRangeClassMaxSymbolEnum;
export const generateFormRules = (item: EmissionSourceParam) => {
  const rules = [];

  // 必填项校验
  if (item?.requiredFlag === 1) {
    rules.push({
      required: true,
      message: I18N.template(I18N.eca.itemp, { val1: item.paramName }),
    });
  }

  // 数值类型小数位校验或文本长度校验
  if (isNumber(item.len)) {
    // 数值类型校验
    if (item?.paramType === NUMBER) {
      rules.push({
        validator: (_: any, value: string | undefined) => {
          // 非必填项且值为空时不校验
          if (!item.requiredFlag && (value === undefined || value === '')) {
            return Promise.resolve();
          }

          // 验证数值格式和小数位
          const valueStr = String(value);
          const decimalPart = valueStr.split('.')[1];

          if (decimalPart && decimalPart.length > Number(item.len)) {
            return Promise.reject(
              new Error(
                I18N.template(I18N.eca.maximumDecimalPlaces, {
                  val1: item.len,
                }),
              ),
            );
          }

          return Promise.resolve();
        },
      });

      // 数值范围校验
      if (item?.correctRangeClass) {
        rules.push({
          validator: (_: any, value: string | number) => {
            if (!value && value !== 0) return Promise.resolve();

            // 正常值范围校验
            const { minNum, minSymbol, maxNum, maxSymbol } =
              item.correctRangeClass;

            // 最小值取正常值和警告值的最小值
            let checkMin = minNum;
            let checkMinSymbol = minSymbol;

            // 最大值取正常值和警告值的最大值
            let checkMax = maxNum;
            let checkMaxSymbol = maxSymbol;

            if (item?.warningRangeClass) {
              // 警告值范围校验
              const {
                minNum: warningMinNum,
                minSymbol: warningMinSymbol,
                maxNum: warningMaxNum,
                maxSymbol: warningMaxSymbol,
              } = item?.warningRangeClass || {};

              // 如果警告值warningMinSymbol,warningMinNum存在，并且warningMinNum小于正常值minNum，则取警告值minNum
              if (
                warningMinSymbol &&
                warningMinNum !== undefined &&
                warningMinNum < minNum
              ) {
                checkMin = warningMinNum;
                checkMinSymbol = warningMinSymbol;
              }

              // 如果警告值warningMaxSymbol,warningMaxNum存在，并且warningMaxNum大于正常值maxNum，则取警告值maxNum
              if (
                warningMaxSymbol &&
                warningMaxNum !== undefined &&
                warningMaxNum > maxNum
              ) {
                checkMax = warningMaxNum;
                checkMaxSymbol = warningMaxSymbol;
              }
            }

            const numValue = parseFloat(String(value));

            // 最小值校验
            if (checkMinSymbol && checkMin !== undefined) {
              const min = parseFloat(checkMin);

              if (checkMinSymbol === MORE_THAN && numValue <= min) {
                // >
                return Promise.reject(
                  new Error(
                    I18N.template(I18N.eca.theValueMustBeM2, {
                      val1: item?.correctRange,
                    }),
                  ),
                );
              }

              if (checkMinSymbol === MORE_THAN_OR_EQUAL && numValue < min) {
                // >=
                return Promise.reject(
                  new Error(
                    I18N.template(I18N.eca.theValueMustBeM2, {
                      val1: item?.correctRange,
                    }),
                  ),
                );
              }
            }

            // 最大值校验
            if (checkMaxSymbol && checkMax !== undefined) {
              const max = parseFloat(checkMax);

              if (checkMaxSymbol === MAX_MORE_THAN && numValue >= max) {
                // <
                return Promise.reject(
                  new Error(
                    I18N.template(I18N.eca.theValueMustBeM, {
                      val1: item?.correctRange,
                    }),
                  ),
                );
              }

              if (checkMaxSymbol === MAX_MORE_THAN_OR_EQUAL && numValue > max) {
                // <=
                return Promise.reject(
                  new Error(
                    I18N.template(I18N.eca.theValueMustBeM, {
                      val1: item?.correctRange,
                    }),
                  ),
                );
              }
            }

            return Promise.resolve();
          },
        });
      }
    }
    // 文本类型长度校验
    else if (item?.paramType === TEXT) {
      rules.push({
        max: item.len,
        message: I18N.template(I18N.eca.maximumInputI, { val1: item.len }),
      });
    }
  }
  return rules;
};

/** 获取参数类型是下拉框的数据 */
export const fetchParamsSelectOptions = async (dictTypes: string) => {
  const { data } = await getSystemDictenumListAllByDictTypeBatch({
    dictTypes,
  });
  return data?.data as { [key: string]: Dicts[] };
};

/**
 * 提取参数列表中的字典类型并获取对应数据
 * @param {Array} paramList - 参数列表
 * @param {(param: EmissionSourceParam) => string} dictEnumSelector - 从参数中提取字典类型的函数
 * @returns {Promise<Object>} 字典数据映射对象
 */
export async function extractAndFetchDictData(
  paramList: EmissionSourceParam[],
  dictEnumSelector: (param: EmissionSourceParam) => string = param =>
    param?.dictEnum || '',
) {
  // 提取所有需要的字典类型（去重）
  const dictEnumsSet = new Set<string>();

  paramList.forEach(item => {
    // 只处理下拉框类型(SELECT/ADDRESS)的参数
    if (
      (item?.paramType === SELECT || item?.paramType === ADDRESS) &&
      item?.dictEnum
    ) {
      const dictEnum = dictEnumSelector(item);
      if (dictEnum) {
        dictEnumsSet.add(dictEnum);
      }
    }
  });

  // 转换为逗号分隔的字符串
  const dictEnums = Array.from(dictEnumsSet).join(',');

  // 请求字典数据
  const options = dictEnums ? await fetchParamsSelectOptions(dictEnums) : {};

  return options;
}
