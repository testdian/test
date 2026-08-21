import I18N from '@/lang/I18N';

/** 采购产品详情tab */
export const PRODUCT_TABS = {
  /** 采购产品信息 */
  PRODUCT_INFO: '1',
  /** 供应商列表 */
  SUPPLY_LIST: '2',
  /** 产品环境足迹 */
  LCA: '3',
};

/** 供应商商户详情tab items */
export const SUPPLIER_TABS_ITEMS = [
  {
    label: I18N.supplyChainCarbonManagement.purchaseProductLetter,
    key: PRODUCT_TABS.PRODUCT_INFO,
  },
  {
    label: I18N.supplyChainCarbonManagement.supplierList,
    key: PRODUCT_TABS.SUPPLY_LIST,
  },
  {
    label: I18N.router.theProductEnvironmentIsSufficient,
    key: PRODUCT_TABS.LCA,
  },
];

/** 来源系统 */
export const SOURCE_SYSTEM = {
  /** 手动填报 */
  MANUAL_REPORTING: 1,
};
