import I18N from '@/lang/I18N';

/** 数据填报详情tab */
export const FILL_TABS = {
  /** 数据请求 */
  DATA_REQUEST: '1',
  /** 数据填报 */
  DATA_FILL: '2',
};

/** 数据填报详情tab items */
export const FILL_TABS_ITEMS = [
  {
    label: I18N.supplyChainCarbonManagement.dataRequest,
    key: FILL_TABS.DATA_REQUEST,
  },
  {
    label: I18N.supplyChainCarbonManagement.dataReporting,
    key: FILL_TABS.DATA_FILL,
  },
];
