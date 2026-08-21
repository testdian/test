/** 是否需要审批 */
export const CONFIG_TYPE = {
  /** 参数取固定值 */
  FIXED_VALUE: 0,
  /** 参数映射关系（参数ID） */
  MAPPING_RELATION: 1,
} as const;

const { FIXED_VALUE, MAPPING_RELATION } = CONFIG_TYPE;

/** 配置类型的枚举 */
export const CONFIG_TYPE_OPTIONS = [
  {
    label: '参数取固定值',
    value: FIXED_VALUE,
  },
  {
    label: '参数映射关系（参数ID）',
    value: MAPPING_RELATION,
  },
];

/** 临时数据标识 */
export const TMP_FLAG = 'TMP_';
