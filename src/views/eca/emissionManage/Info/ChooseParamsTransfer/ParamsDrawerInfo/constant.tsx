/*
 * @@description:
 */
import I18N from '@src/lang/I18N';

import DatepickerIcon from './Images/datepicker.svg';
import NumberIcon from './Images/number.svg';
import RadioIcon from './Images/radio.svg';
import Text100Icon from './Images/text100.svg';
import Text5000Icon from './Images/text5000.svg';

/** 多语言字段对照表 */
export const SOURCE_TYPE_MAPPING = {
  /** 参数名称 */
  paramName: 39,
};

/** 是否必填 */
export const REQUIRE_TYPE = {
  /** 是 */
  YES: 2,
  /** 否 */
  NO: 1,
} as const;

export const REQUIRE_TYPE_LABEL = {
  [REQUIRE_TYPE.YES]: I18N.eca.yes,
  [REQUIRE_TYPE.NO]: I18N.eca.no,
} as const;

/** 是否必填枚举  */
export const REQUIRE_OPTIONS = [
  { label: REQUIRE_TYPE_LABEL[REQUIRE_TYPE.YES], value: REQUIRE_TYPE.YES },
  { label: REQUIRE_TYPE_LABEL[REQUIRE_TYPE.NO], value: REQUIRE_TYPE.NO },
];

/** 单位类型 */
export const UNIT_TYPE = {
  /** 单体单位 */
  MONOMER_UNIT: 1,
  /** 复合单位 */
  COMPOUND_UNIT: 2,
  /** 无单位 */
  NO_UNIT: 3,
} as const;

/** 单位类型枚举 */
export const UNIT_TYPE_OPTION = [
  {
    label: I18N.eca.commonUnit,
    value: UNIT_TYPE.MONOMER_UNIT,
  },
  {
    label: I18N.eca.compoundUnit,
    value: UNIT_TYPE.COMPOUND_UNIT,
  },
  {
    label: I18N.eca.noUnit,
    value: UNIT_TYPE.NO_UNIT,
  },
];

/** 属性格式的类型 */
export const PARAM_INPUT_TYPE = {
  /** 文本 */
  TEXT: 1,
  /** 数值 */
  NUMBER: 2,
  /** 选项 */
  SELECT: 3,
  /** 时间 */
  TIME: 4,
  /** 地址 */
  ADDRESS: 5,
} as const;

const { TEXT, NUMBER, SELECT, TIME, ADDRESS } = PARAM_INPUT_TYPE;

export const INPUT_TYPE_OPTIONS = [
  {
    label: I18N.eca.text,
    value: TEXT,
  },
  {
    label: I18N.carbonFootPrintLCA.numericalValue,
    value: NUMBER,
  },
  {
    label: I18N.carbonAccount.option,
    value: SELECT,
  },
  {
    label: I18N.eca.time,
    value: TIME,
  },
  {
    label: I18N.eca.address,
    value: ADDRESS,
  },
];

/** 文本类型 */
export const TextType = {
  /** 单行文本 */
  SINGLE_LINE_TEXT: 1,
  /** 多行文本 */
  MULTIPLE_LINE_TEXT: 2,
};

/** 时间类型 */
export const TIME_TYPE = {
  /** 年/月/日-时/分/秒 */
  TIME_YEAR_SECOND: 1,
  /** 年/月/日 */
  TIME_YEAR_DATE: 2,
  /** 年/月 */
  TIME_YEAR_MONTH: 3,
  /** 年  */
  TIME_YEAR: 4,
};

/** 例如数值、选项、地址单个选项默认值 */
export const INIT_SINGLE_TYPE = 1;

const { TIME_YEAR_SECOND, TIME_YEAR_DATE, TIME_YEAR_MONTH, TIME_YEAR } =
  TIME_TYPE;

/** 属性格式的展示形式枚举 name：指后端的传给name字段 */
export const onDataSettingOptionsFn = (key: number) => {
  const dataSettingOptionsMap = new Map([
    [
      TEXT,
      [
        {
          label: I18N.eca.text,
          value: TextType.SINGLE_LINE_TEXT,
          icon: Text100Icon,
          name: 'textType',
        },
        {
          label: I18N.eca.multiline,
          value: TextType.MULTIPLE_LINE_TEXT,
          icon: Text5000Icon,
          name: 'textType',
        },
      ],
    ],
    [
      NUMBER,
      [
        {
          label: I18N.carbonFootPrintLCA.numericalValue,
          value: INIT_SINGLE_TYPE,
          icon: NumberIcon,
        },
      ],
    ],
    [
      SELECT,
      [
        {
          label: I18N.carbonAccount.singleChoice,
          value: INIT_SINGLE_TYPE,
          icon: RadioIcon,
        },
      ],
    ],
    [
      TIME,
      [
        {
          label: I18N.eca.yearMonthDayHour,
          value: TIME_YEAR_SECOND,
          icon: DatepickerIcon,
        },
        {
          label: I18N.eca.date2,
          value: TIME_YEAR_DATE,
          icon: DatepickerIcon,
        },
        {
          label: I18N.eca.date,
          value: TIME_YEAR_MONTH,
          icon: DatepickerIcon,
        },
        {
          label: I18N.Factors.year,
          value: TIME_YEAR,
          icon: DatepickerIcon,
        },
      ],
    ],
    [
      ADDRESS,
      [
        {
          label: I18N.eca.address,
          value: INIT_SINGLE_TYPE,
          icon: RadioIcon,
        },
      ],
    ],
  ]);
  return dataSettingOptionsMap.get(key as 1 | 2 | 3 | 4);
};

/** 参数管理/全局参数、自定义参数枚举值 */
export const PARAMETER_TYPE = {
  /** 全局参数 */
  GLOBAL_PARAMETER: 1,
  /** 自定义参数 */
  CUSTOM_PARAMETER: 2,
  /** 距离参数 */
  DISTANCE_PARAMETER: 3,
};

/** 参数管理/全局参数、自定义参数 */
export const PARAMETER_TYPE_OPTIONS = [
  {
    label: I18N.eca.globalParameters,
    value: PARAMETER_TYPE.GLOBAL_PARAMETER,
  },
  {
    label: I18N.eca.customParameters,
    value: PARAMETER_TYPE.CUSTOM_PARAMETER,
  },
  {
    label: I18N.eca.distanceParameter,
    value: PARAMETER_TYPE.DISTANCE_PARAMETER,
  },
];

/** 有无默认值 */
export const DEFAULT_VALUE = {
  YES: 1,
  NO: 0,
} as const;
/** 有无默认值枚举 */
export const DEFAULT_VALUE_OPTIONS = [
  {
    label: I18N.eca.have,
    value: DEFAULT_VALUE.YES,
  },
  {
    label: I18N.carbonFootPrintLCA.nothing,
    value: DEFAULT_VALUE.NO,
  },
];
