import I18N from '@src/lang/I18N';
import { TableRenderProps } from 'table-render/dist/src/types';

import { SupplierResp } from '@/views/supplyChainCarbonManagement/SupplierManagement/type';

export const columns = (): TableRenderProps<SupplierResp>['columns'] => [
  {
    title: I18N.carbonFootPrintLCA.number,
    dataIndex: 'allIndex',
    fixed: 'left',
    width: '68px',
  },
  {
    title: I18N.carbonFootPrint.supplierName,
    dataIndex: 'supplierName',
  },
  // {
  //   title: I18N.carbonData.affiliatedOrganization,
  //   dataIndex: 'orgName',
  // },
  {
    title: I18N.supplyChainCarbonManagement.contactName,
    dataIndex: 'contactName',
  },
  {
    title: I18N.supplyChainCarbonManagement.cellPhone,
    dataIndex: 'contactMobile',
  },
  {
    title: I18N.supplyChainCarbonManagement.contactEmail,
    dataIndex: 'contactEmail',
  },
  {
    title: I18N.supplyChainCarbonManagement.merchantCode,
    dataIndex: 'supplierCode',
  },
  {
    title: I18N.dashborad.remarks,
    dataIndex: 'remark',
  },
];
