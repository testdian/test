import I18N from '@src/lang/I18N';

export const TAB_TYPE = {
  /** 排放数据 */
  EMISSION_DATA: '1',
  /** 审核详情 */
  APPROVAL_INFO: '2',
};

export const TAB_OPTIONS = [
  {
    label: I18N.eca.emissionData,
    key: TAB_TYPE.EMISSION_DATA,
  },
  {
    label: I18N.eca.reviewDetails,
    key: TAB_TYPE.APPROVAL_INFO,
  },
];
