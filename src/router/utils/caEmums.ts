/*
 * @@description: 员工碳账户
 * @Author: lichunxiao 1359758885@aa.com
 * @Date: 2023-06-14 09:54:05
 * @LastEditors: lichunxiao 1359758885@aa.com
 * @LastEditTime: 2023-06-30 16:05:36
 */
export enum CaRouteMaps {
  /** 员工碳账户 */
  'ca' = '/carbonAccount',
  /** 用户列表**/
  'userList' = '/carbonAccount/userList',
  'userListInfo' = '/carbonAccount/userList/:pageTypeInfo/:id',
  'userListImport' = '/carbonAccount/userList/import',

  /** 碳账户明细**/
  'CADetail' = '/carbonAccount/CADetail',

  /** 活动数据记录**/
  'activityDataRecord' = '/carbonAccount/activityDataRecord',
  'activityDataRecordShow' = '/carbonAccount/activityDataRecord/show/:id',

  /** 兑换记录**/
  'exchangeRecords' = '/carbonAccount/exchangeRecords',

  /** 排行榜**/
  'ranking' = '/carbonAccount/ranking',
  'rankList' = '/carbonAccount/ranking/list/:title/:type',

  /** 低碳场景**/
  'lowCarbonScenario' = '/carbonAccount/lowCarbonScenario',
  'lowCarbonScenarioInfo' = '/carbonAccount/lowCarbonScenario/:pageTypeInfo/:id',

  /** 低碳题库**/
  'lowCarbonQuestionBank' = '/carbonAccount/lowCarbonQuestionBank',
  'lowCarbonQuestionBankInfo' = '/carbonAccount/lowCarbonQuestionBank/:pageTypeInfo/:id',
  'lowCarbonQuestionBankImport' = '/carbonAccount/lowCarbonQuestionBank/import',

  /** 积分商品**/
  'pointProducts' = '/carbonAccount/pointProducts',
  'pointProductsInfo' = '/carbonAccount/pointProducts/:pageTypeInfo/:id',

  /** 商品库存**/
  'merchandiseInventory' = '/carbonAccount/merchandiseInventory',
  'inventoryRecords' = '/carbonAccount/merchandiseInventory/inventoryRecords/:id/:title/:num',

  /** 碳账户设置**/
  'settings' = '/carbonAccount/settings',
}
