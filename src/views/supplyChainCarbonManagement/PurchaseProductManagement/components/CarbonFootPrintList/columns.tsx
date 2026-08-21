import I18N from '@src/lang/I18N';
import { compact } from 'lodash-es';
import { NavigateFunction } from 'react-router-dom';
import { TableRenderProps } from 'table-render/dist/src/types';

import { TableActions } from '@/components/Table/TableActions';
import { checkAuth } from '@/layout/utills';
import {
  PAGE_TYPE_VAR,
  PageTypeInfo,
  virtualLinkTransform,
} from '@/router/utils/enums';
import { SccmRouteMaps } from '@/router/utils/sccmEnums';

import { ProductFootprintApplyResp } from '../../type';

export const columns = ({
  navigate,
  pageTypeInfo,
  productId,
}: {
  navigate: NavigateFunction;
  pageTypeInfo?: PageTypeInfo;
  productId?: number;
}): TableRenderProps<ProductFootprintApplyResp>['columns'] => {
  return compact([
    {
      title: I18N.carbonFootPrintLCA.number,
      dataIndex: 'allIndex',
      fixed: 'left',
      width: '68px',
    },
    {
      title: I18N.carbonFootPrint.supplierName,
      dataIndex: 'supplierName',
      fixed: 'left',
    },
    {
      title: I18N.Factors.productName,
      dataIndex: 'productName',
    },
    {
      title: I18N.carbonFootPrint.accountingUnit,
      dataIndex: 'productUnitName',
    },
    {
      title: I18N.Factors.systemBoundary,
      dataIndex: 'systemBoundaryType_name',
    },
    {
      title: I18N.supplyChainCarbonManagement.dataRequestClass,
      dataIndex: 'applyType_name',
    },
    {
      title: I18N.carbonFootPrintLCA.productionCycle,
      dataIndex: 'startTime',
      width: 200,
      render: (startTime, row) => {
        const { endTime } = row;
        if (startTime && endTime) {
          return `${startTime}~${endTime}`;
        }
        return '-';
      },
    },
    {
      title: I18N.carbonAccount.completionTime,
      dataIndex: 'auditTime',
      width: 220,
    },
    {
      title: I18N.Factors.operation,
      dataIndex: 'action',
      fixed: 'right',
      width: 100,
      render: (_, row) => {
        return (
          <TableActions
            menus={compact([
              checkAuth('/supplyChain/productManagement/supplier/edit', {
                label: I18N.Factors.check,
                key: I18N.Factors.check,
                onClick: async () => {
                  navigate(
                    virtualLinkTransform(
                      SccmRouteMaps.sccmProdctInfoCarbonFootPrintInfo,
                      [
                        PAGE_TYPE_VAR,
                        ':id',
                        ':carbonFootPrintPageTypeInfo',
                        ':carbonFootPrintId',
                      ],
                      [pageTypeInfo, productId, PageTypeInfo.show, row?.id],
                    ),
                  );
                },
              }),
            ])}
          />
        );
      },
    },
  ]);
};
