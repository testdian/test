import I18N from '@/lang/I18N';

/** 数据/审核详情tab */
export const DATA_APPROVAL_TABS = {
  /** 数据概览 */
  DATA_OVERVIEW: '1',
  /** 数据要求 */
  DATA_REQUIRE: '2',
  /** 填报数据 */
  DATA_FILL: '3',
  /** 审批记录 */
  APPROVAL_RECORD: '4',
};

/** 数据/审核详情tab items */
export const DATA_APPROVAL_TABS_ITEMS = [
  {
    label: I18N.supplyChainCarbonManagement.dataOverview,
    key: DATA_APPROVAL_TABS.DATA_OVERVIEW,
  },
  {
    label: I18N.supplyChainCarbonManagement.dataRequirements,
    key: DATA_APPROVAL_TABS.DATA_REQUIRE,
  },
  {
    label: I18N.router.fillingInData,
    key: DATA_APPROVAL_TABS.DATA_FILL,
  },
  {
    label: I18N.supplyChainCarbonManagement.approvalRecords,
    key: DATA_APPROVAL_TABS.APPROVAL_RECORD,
  },
];
