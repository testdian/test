import I18N from '@/lang/I18N';

/** 供应商商户详情tab */
export const SUPPLIER_TABS = {
  /** 商户信息 */
  SUPPLIER_INFO: '1',
  /** 审核记录 */
  APPROVAL_RECORD: '2',
};

/** 供应商商户详情tab items */
export const SUPPLIER_TABS_ITEMS = [
  {
    label: I18N.supplyChainCarbonManagement.merchantInformation,
    key: SUPPLIER_TABS.SUPPLIER_INFO,
  },
  {
    label: I18N.components.auditRecords,
    key: SUPPLIER_TABS.APPROVAL_RECORD,
  },
];
