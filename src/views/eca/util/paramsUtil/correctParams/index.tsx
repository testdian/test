/** 涉及到参数管理的数值区间逻辑 */
import I18N from '@src/lang/I18N';

import { ErrorRangeParams } from './type';
import { COMMON_PARAM_TYPE } from '../../constant';

const { NUMBER } = COMMON_PARAM_TYPE;

/** 正确区间范围的最小值  2:<; 3: ≤ */
export const CorrectRangeClassMinSymbolEnum = {
  MORE_THAN: 2,
  MORE_THAN_OR_EQUAL: 3,
};
/** 正确区间范围的-最小值选项 */
export const correctRangeOptions = [
  {
    label: '<',
    value: CorrectRangeClassMinSymbolEnum.MORE_THAN,
  },
  {
    label: '≤',
    value: CorrectRangeClassMinSymbolEnum.MORE_THAN_OR_EQUAL,
  },
];

/** 正确区间范围的最大值  4:<; 5:≤ */
export const CorrectRangeClassMaxSymbolEnum = {
  MORE_THAN: 4,
  MORE_THAN_OR_EQUAL: 5,
};

/** 正确区间范围的-最大值选项*/
export const correctRangeOptionsMax = [
  {
    label: '<',
    value: CorrectRangeClassMaxSymbolEnum.MORE_THAN,
  },
  {
    label: '≤',
    value: CorrectRangeClassMaxSymbolEnum.MORE_THAN_OR_EQUAL,
  },
];

/** 警告区间范围的最小值  最小值符号(1:=; 2:>; 3:>=; 4:<; 5:≤)*/
const WarningRangeClassMinSymbolEnum = {
  MORE_THAN: 2,
  MORE_THAN_OR_EQUAL: 3,
};
/** 警告区间范围的-最小值选项 */
export const warningRangeOptionsMin = [
  {
    label: '<',
    value: WarningRangeClassMinSymbolEnum.MORE_THAN,
  },
  {
    label: '≤',
    value: WarningRangeClassMinSymbolEnum.MORE_THAN_OR_EQUAL,
  },
];

/** 警告区间范围的最大值  最大值符号(1:=; 2:>; 3:>=; 4:<; 5:≤), */
const WarningRangeClassMaxSymbolEnum = {
  MORE_THAN: 4,
  MORE_THAN_OR_EQUAL: 5,
};
/** 警告区间范围的-最大值选项 */
export const warningRangeOptionsMax = [
  {
    label: '<',
    value: WarningRangeClassMaxSymbolEnum.MORE_THAN,
  },
  {
    label: '≤',
    value: WarningRangeClassMaxSymbolEnum.MORE_THAN_OR_EQUAL,
  },
];

/** 警告区间验证规则 */
export const warningRangeClassConfig = [
  {
    dependencies: [
      'warningRangeClassMinNum',
      'warningRangeClassMinSymbol',
      'warningRangeClassMaxNum',
      'warningRangeClassMaxSymbol',
    ],
    fulfill: {
      schema: {
        'x-validator': [
          {
            required: `{{!!$deps[0] || !!$deps[1] || !!$deps[2] || !!$deps[3]}}`,
            message: I18N.eca.thisItemIsRequired,
          },
        ],
      },
    },
  },
];

/** 正确区间验证规则 */
export const correctRangeClassConfig = [
  {
    dependencies: [
      'correctRangeClassMinNum',
      'correctRangeClassMinSymbol',
      'correctRangeClassMaxNum',
      'correctRangeClassMaxSymbol',
    ],
    fulfill: {
      schema: {
        'x-validator': [
          {
            required: `{{!!$deps[0] ||!!$deps[1] ||!!$deps[2] ||!!$deps[3]}}`,
            message: I18N.eca.thisItemIsRequired,
          },
        ],
      },
    },
  },
];

// 提取后的计算函数
export const calculateErrorRange = ({
  paramType,
  warningMin,
  warningMinSymbol,
  warningMax,
  warningMaxSymbol,
  correctMin,
  correctMinSymbol,
  correctMax,
  correctMaxSymbol,
}: ErrorRangeParams): string => {
  let errorRange = '';
  if (paramType !== NUMBER) return errorRange;
  if (warningMin !== undefined || warningMax !== undefined) {
    const minSymbolStr =
      warningMinSymbol === WarningRangeClassMinSymbolEnum.MORE_THAN ? '≤' : '<';
    const maxSymbolStr =
      warningMaxSymbol === WarningRangeClassMaxSymbolEnum.MORE_THAN
        ? '>='
        : '>';
    errorRange = `${minSymbolStr}${warningMin}, ${maxSymbolStr}${warningMax}`;
  } else if (correctMin !== undefined || correctMax !== undefined) {
    const minSymbolStr =
      correctMinSymbol === CorrectRangeClassMinSymbolEnum.MORE_THAN ? '≤' : '<';
    const maxSymbolStr =
      correctMaxSymbol === CorrectRangeClassMinSymbolEnum.MORE_THAN
        ? '>='
        : '>';
    errorRange = `${minSymbolStr}${correctMin}, ${maxSymbolStr}${correctMax}`;
  }
  return errorRange;
};
