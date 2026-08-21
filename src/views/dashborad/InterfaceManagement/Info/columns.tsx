import I18N from '@/lang/I18N';

import { OaPageItem } from '../type';

/** 能源系统-电 */
export const energyColumns = [
  {
    title: '名称',
    dataIndex: 'energyName',
    key: 'energyName',
    ellipsis: true,
  },
  {
    title: '时间',
    dataIndex: 'queryData',
    key: 'queryData',
    width: 300,
    ellipsis: true,
  },
  {
    title: '用电量（kWh）',
    dataIndex: 'electricity',
    key: 'electricity',
    ellipsis: true,
  },
  {
    title: '导入标记',
    dataIndex: 'rowImportFlag',
    key: 'rowImportFlag',
    ellipsis: true,
    render: (_raw: unknown, record: OaPageItem) => {
      const v = Number(record.rowImportFlag);
      if (!Number.isNaN(v)) {
        if (v === 0) return '正常';
        if (v === 1) return '异常';
        return '-';
      }
      return '-';
    },
  },
];

/** 能源系统-光伏 */
export const energyPhotovoltaicColumns = [
  {
    title: '时间',
    dataIndex: 'energyName',
    key: 'energyName',
    width: 300,
    ellipsis: true,
  },
  {
    title: '用电量（kWh）',
    dataIndex: 'electricity',
    key: 'electricity',
    ellipsis: true,
  },
  {
    title: '导入标记',
    dataIndex: 'rowImportFlag',
    key: 'rowImportFlag',
    ellipsis: true,
    render: (_raw: unknown, record: OaPageItem) => {
      const v = Number(record.rowImportFlag);
      if (!Number.isNaN(v)) {
        if (v === 0) return '正常';
        if (v === 1) return '异常';
        return '-';
      }
      return '-';
    },
  },
];

/** KTMS */
export const ktmsColumns = [
  {
    title: '业务线',
    dataIndex: 'bizLine',
    key: 'bizLine',
    ellipsis: true,
  },
  {
    title: '报关单号',
    dataIndex: 'reportNo',
    key: 'reportNo',
    ellipsis: true,
  },
  {
    title: '合同号',
    dataIndex: 'contractNo',
    key: 'contractNo',
    ellipsis: true,
  },
  {
    title: '报关日期',
    dataIndex: 'reportDate',
    key: 'reportDate',
    ellipsis: true,
  },
  {
    title: '出货厂别',
    dataIndex: 'factory',
    key: 'factory',
    ellipsis: true,
  },
  {
    title: '出口口岸',
    dataIndex: 'exportPort',
    key: 'exportPort',
    ellipsis: true,
  },
  {
    title: '下游运输方式',
    dataIndex: 'transportMode',
    key: 'transportMode',
    ellipsis: true,
  },
  {
    title: '运抵国',
    dataIndex: 'destCountry',
    key: 'destCountry',
    ellipsis: true,
  },
  {
    title: '货物箱数（箱）',
    dataIndex: 'boxCount',
    key: 'boxCount',
    ellipsis: true,
  },
  {
    title: '运输货品总重量（kg）',
    dataIndex: 'totalWeight',
    key: 'totalWeight',
    ellipsis: true,
  },
  {
    title: '导入标记',
    dataIndex: 'rowImportFlag_name',
    key: 'rowImportFlag_name',
    ellipsis: true,
  },
  // {
  //   title: '异常原因',
  //   dataIndex: 'rowImportMsg',
  //   key: 'rowImportMsg',
  //   ellipsis: true,
  // },
];

/** OA */
export const oaColumns = [
  {
    title: '单据号',
    dataIndex: 'billNo',
    key: 'billNo',
    ellipsis: true,
  },
  {
    title: '数据发生日期',
    dataIndex: 'genDate',
    key: 'genDate',
    ellipsis: true,
  },
  {
    title: '部门',
    dataIndex: 'department',
    key: 'department',
    ellipsis: true,
  },
  {
    title: '费用名称',
    dataIndex: 'transportMode',
    key: 'transportMode',
    ellipsis: true,
  },
  {
    title: '出发地',
    dataIndex: 'departure',
    key: 'departure',
    ellipsis: true,
  },
  {
    title: '目的地',
    dataIndex: 'destination',
    key: 'destination',
    ellipsis: true,
  },
  {
    title: '金额（元）',
    dataIndex: 'amount',
    key: 'amount',
    ellipsis: true,
  },
  {
    title: '里程（km）',
    dataIndex: 'mileage',
    key: 'mileage',
    ellipsis: true,
  },
  {
    title: '房间数',
    dataIndex: 'roomCount',
    key: 'roomCount',
    ellipsis: true,
  },
  {
    title: '晚数',
    dataIndex: 'nights',
    key: 'nights',
    ellipsis: true,
  },
  {
    title: '住宿地类型',
    dataIndex: 'country',
    key: 'country',
    ellipsis: true,
  },
  {
    title: '导入标记',
    dataIndex: 'rowImportFlag',
    key: 'rowImportFlag',
    ellipsis: true,
    render: (_raw: unknown, record: OaPageItem) => {
      const v = Number(record.rowImportFlag);
      if (!Number.isNaN(v)) {
        if (v === 0) return '正常';
        if (v === 1) return '异常';
        return '-';
      }
      return '-';
    },
  },
  // {
  //   title: '异常原因',
  //   dataIndex: 'rowImportMsg',
  //   key: 'rowImportMsg',
  //   ellipsis: true,
  // },
];

/** CARE系统 */
export const careColumns = [
  {
    title: I18N.dashborad.uniqueId,
    dataIndex: 'contrKey',
    key: 'contrKey',
    ellipsis: true,
  },
  {
    title: I18N.dashborad.brandCode,
    dataIndex: 'brandCode',
    key: 'brandCode',
    ellipsis: true,
  },
  {
    title: I18N.dashborad.brandName,
    dataIndex: 'brandName',
    key: 'brandName',
    ellipsis: true,
  },
  {
    title: I18N.eca.modeOfTransport,
    dataIndex: 'trafMode',
    key: 'trafMode',
    ellipsis: true,
  },
  {
    title: I18N.dashborad.unitNetWeightG,
    dataIndex: 'unitNetWt',
    key: 'unitNetWt',
    ellipsis: true,
  },
  {
    title: I18N.dashborad.numberOfInvoices,
    dataIndex: 'qty',
    key: 'qty',
    ellipsis: true,
  },
  {
    title: I18N.dashborad.actualPlaceOfShipment,
    dataIndex: 'placeShipment',
    key: 'placeShipment',
    ellipsis: true,
  },
  {
    title: I18N.dashborad.arrivalDate,
    dataIndex: 'arrivalPortDate',
    key: 'arrivalPortDate',
    ellipsis: true,
  },
  {
    title: I18N.dashborad.axItemNumber,
    dataIndex: 'copGNo',
    key: 'copGNo',
    ellipsis: true,
  },
  {
    title: I18N.carbonAccount.productName,
    dataIndex: 'gName',
    key: 'gName',
    ellipsis: true,
  },
  {
    title: I18N.dashborad.customsCategoryRepresentative,
    dataIndex: 'itemGroup',
    key: 'itemGroup',
    ellipsis: true,
  },
  {
    title: I18N.dashborad.customsCategory,
    dataIndex: 'customsType',
    key: 'customsType',
    ellipsis: true,
  },
  {
    title: I18N.dashborad.dataUpdateDate,
    dataIndex: 'insertTime',
    key: 'insertTime',
    ellipsis: true,
  },
  {
    title: I18N.dashborad.abnormalMarking,
    dataIndex: 'rowWarning_name',
    key: 'rowWarning_name',
    ellipsis: true,
  },
  {
    title: I18N.dashborad.importTags,
    dataIndex: 'rowImportFlag_name',
    key: 'rowImportFlag_name',
    ellipsis: true,
  },
  {
    title: I18N.dashborad.abnormalCause,
    dataIndex: 'rowImportMsg',
    key: 'rowImportMsg',
    ellipsis: true,
  },
];
/**
 *  WMS发货
 */
export const wmsColumns = [
  {
    title: I18N.dashborad.brandName,
    dataIndex: 'brand',
    key: 'brand',
    ellipsis: true,
  },
  {
    title: I18N.dashborad.brandCode,
    dataIndex: 'brandCode',
    key: 'brandCode',
    ellipsis: true,
  },
  {
    title: I18N.dashborad.categoryCategories,
    dataIndex: 'class01',
    key: 'class01',
    ellipsis: true,
  },
  {
    title: I18N.dashborad.categoryInformation,
    dataIndex: 'itemCategory1',
    key: 'itemCategory1',
    ellipsis: true,
  },
  {
    title: I18N.dashborad.numberOfProductsSold,
    dataIndex: 'sumShippedqty',
    key: 'sumShippedqty',
    ellipsis: true,
  },
  {
    title: I18N.dashborad.productUnitNet,
    dataIndex: 'unitWeight',
    key: 'unitWeight',
    ellipsis: true,
  },
  {
    title: I18N.dashborad.shipmentDate,
    dataIndex: 'date',
    key: 'date',
    ellipsis: true,
  },
  {
    title: I18N.dashborad.axItemNumber,
    dataIndex: 'skuCode',
    key: 'skuCode',
    ellipsis: true,
  },
  {
    title: I18N.dashborad.dataUpdateDate,
    dataIndex: 'interfaceDate',
    key: 'interfaceDate',
    ellipsis: true,
  },
  {
    title: I18N.dashborad.abnormalMarking,
    dataIndex: 'rowWarning_name',
    key: 'rowWarning_name',
    ellipsis: true,
  },
  {
    title: I18N.dashborad.importTags,
    dataIndex: 'rowImportFlag_name',
    key: 'rowImportFlag_name',
    ellipsis: true,
  },
  {
    title: I18N.dashborad.abnormalCause,
    dataIndex: 'rowImportMsg',
    key: 'rowImportMsg',
    ellipsis: true,
  },
];
/**
 * WMS退货
 */
export const wmsReturnColumns = [
  {
    title: I18N.dashborad.ecReturnS,
    dataIndex: 'returnWaybillCode',
    key: 'returnWaybillCode',
    ellipsis: true,
  },
  {
    title: I18N.dashborad.ecReturnS2,
    dataIndex: 'brand',
    key: 'brand',
    ellipsis: true,
  },
  {
    title: I18N.dashborad.ecReturnS3,
    dataIndex: 'brandCode',
    key: 'brandCode',
    ellipsis: true,
  },
  {
    title: I18N.dashborad.returnDate,
    dataIndex: 'confirmDate',
    key: 'confirmDate',
    ellipsis: true,
  },
  {
    title: I18N.dashborad.dataUpdateDate,
    dataIndex: 'interfaceDate',
    key: 'interfaceDate',
    ellipsis: true,
  },
  {
    title: I18N.dashborad.abnormalMarking,
    dataIndex: 'rowWarning_name',
    key: 'rowWarning_name',
    ellipsis: true,
  },
  {
    title: I18N.dashborad.importTags,
    dataIndex: 'rowImportFlag_name',
    key: 'rowImportFlag_name',
    ellipsis: true,
  },
  {
    title: I18N.dashborad.abnormalCause,
    dataIndex: 'rowImportMsg',
    key: 'rowImportMsg',
    ellipsis: true,
  },
];
/**
 * LVMH碳账户
 */
export const carbonAccountColumns = [
  {
    title: I18N.dashborad.ticketNumber,
    dataIndex: 'ticketNo',
    key: 'ticketNo',
    ellipsis: true,
  },
  {
    title: I18N.dashborad.brandName,
    dataIndex: 'brand',
    key: 'brand',
    ellipsis: true,
  },
  {
    title: I18N.dashborad.cabinClassSeat,
    dataIndex: 'trainSeat',
    key: 'trainSeat',
    ellipsis: true,
  },
  {
    title: I18N.dashborad.modeOfTransportation,
    dataIndex: 'transType',
    key: 'transType',
    ellipsis: true,
  },
  {
    title: I18N.dashborad.costDate,
    dataIndex: 'checkDate',
    key: 'checkDate',
    ellipsis: true,
  },
  {
    title: I18N.dashborad.departure,
    dataIndex: 'arrivalStation',
    key: 'arrivalStation',
    ellipsis: true,
  },
  {
    title: I18N.dashborad.arrivingAtTheCity,
    dataIndex: 'departureStation',
    key: 'departureStation',
    ellipsis: true,
  },
  {
    title: I18N.dashborad.expenseType,
    dataIndex: 'transCode',
    key: 'transCode',
    ellipsis: true,
  },
  {
    title: I18N.dashborad.documentSubclass,
    dataIndex: 'formSubTypeBizCode',
    key: 'formSubTypeBizCode',
    ellipsis: true,
  },
  {
    title: I18N.dashborad.totalPaymentAmount,
    dataIndex: 'changeValue',
    key: 'changeValue',
    ellipsis: true,
  },
  {
    title: I18N.dashborad.consumerCurrency,
    dataIndex: 'currency',
    key: 'currency',
    ellipsis: true,
  },
  {
    title: I18N.dashborad.enterpriseHeadUp,
    dataIndex: 'legalEntityName',
    key: 'legalEntityName',
    ellipsis: true,
  },
  {
    title: I18N.dashborad.abnormalMarking,
    dataIndex: 'rowWarning_name',
    key: 'rowWarning_name',
    ellipsis: true,
  },
  {
    title: I18N.dashborad.importTags,
    dataIndex: 'rowImportFlag_name',
    key: 'rowImportFlag_name',
    ellipsis: true,
  },
  {
    title: I18N.dashborad.abnormalCause,
    dataIndex: 'rowImportMsg',
    key: 'rowImportMsg',
    ellipsis: true,
  },
];
