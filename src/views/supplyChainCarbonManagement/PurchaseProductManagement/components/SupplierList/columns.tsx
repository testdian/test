/*
 * @@description:
 */
import I18N, { LocaleType } from '@src/lang/I18N';
import { compact } from 'lodash-es';
import { NavigateFunction } from 'react-router-dom';
import { TableContext, TableRenderProps } from 'table-render/dist/src/types';

import { TableActions } from '@/components/Table/TableActions';
import { checkAuth } from '@/layout/utills';
import { PageTypeInfo, virtualLinkTransform } from '@/router/utils/enums';
import { SccmRouteMaps } from '@/router/utils/sccmEnums';
import {
  Supplier,
  postSupplychainProductSupplierDelete,
} from '@/sdks_v2/new/supplychainV2ApiDocs';
import { modal } from '@/store/module/notification';
import { Toast, modalText, modelFooterBtnStyle } from '@/utils';

export const columns = ({
  refresh,
  navigate,
  hasAction,
  id,
  locale,
}: {
  refresh: TableContext['refresh'];
  navigate: NavigateFunction;
  hasAction?: boolean;
  id?: string;
  locale: LocaleType;
}): TableRenderProps<Supplier>['columns'] => {
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
      title: I18N.supplyChainCarbonManagement.contacts,
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
      title: I18N.supplyChainCarbonManagement.singlePriceElement,
      dataIndex: 'unitPrice',
    },
    {
      title: I18N.supplyChainCarbonManagement.recentlyAppliedForProduction2,
      dataIndex: 'lastApplyTime',
      width: 220,
    },
    hasAction && {
      title: I18N.Factors.operation,
      dataIndex: 'action',
      width: locale === LocaleType.enUS ? 420 : 250,
      render: (_, row) => {
        return (
          <TableActions
            menus={compact([
              checkAuth('/supplyChain/productManagement/supplier/apply', {
                label: I18N.router.applyForProductCarbon,
                key: I18N.router.applyForProductCarbon,
                onClick: async () => {
                  navigate(
                    virtualLinkTransform(
                      SccmRouteMaps.sccmProdctSupplierManagementApply,
                      [':id', ':supplierId'],
                      [id, row?.id],
                    ),
                  );
                },
              }),
              checkAuth('/supplyChain/productManagement/supplier/edit', {
                label: I18N.Factors.edit,
                key: I18N.Factors.edit,
                onClick: async () => {
                  navigate(
                    virtualLinkTransform(
                      SccmRouteMaps.sccmProdctSupplierManagementInfo,
                      [':id', ':supplierPageTypeInfo', ':supplierId'],
                      [id, PageTypeInfo.edit, row?.id],
                    ),
                  );
                },
              }),
              checkAuth('/supplyChain/productManagement/supplier/delete', {
                label: I18N.Factors.delete,
                key: I18N.Factors.delete,
                onClick: async () => {
                  modal.confirm({
                    title: I18N.Factors.prompt,
                    icon: '',
                    content: (
                      <span>
                        {
                          I18N.supplyChainCarbonManagement
                            .confirmDeletionOfProcurement
                        }
                        <span className={modalText}>{row?.supplierName}?</span>
                      </span>
                    ),
                    ...modelFooterBtnStyle,
                    okText: I18N.base.confirm,
                    cancelText: I18N.Factors.cancel,
                    onOk: () => {
                      if (!id) return {};
                      return postSupplychainProductSupplierDelete({
                        req: {
                          productId: Number(id),
                          supplierId: row.id,
                        },
                      }).then(({ data }) => {
                        if (data.code === 200) {
                          Toast('success', I18N.Factors.deleteSuccessful);
                          refresh?.({ stay: true, tab: 1 });
                        }
                      });
                    },
                  });
                },
              }),
            ])}
          />
        );
      },
    },
  ]);
};
