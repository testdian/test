import { Key } from 'react';

import { CHOOSE_FACTOR } from '@/views/components/EmissionSource/utils/constant';

/** 选择因子或者供应商数据的数据类型 */
export interface ParamsProp {
  /** 表单数据 */
  [CHOOSE_FACTOR.FORM_VALUES]: string | null;
  /** 因子id */
  [CHOOSE_FACTOR.FACTOR_ID]?: Key | number;
}
