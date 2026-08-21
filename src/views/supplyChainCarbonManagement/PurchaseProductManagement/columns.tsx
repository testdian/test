import I18N from '@src/lang/I18N';
import { compact } from 'lodash-es';
import { NavigateFunction } from 'react-router-dom';
import { TableContext, TableRenderProps } from 'table-render/dist/src/types';

import { TableActions } from '@/components/Table/TableActions';
import { checkAuth } from '@/layout/utills';
import {
  PageTypeInfo,
  PAGE_TYPE_VAR,
  virtualLinkTransform,
} from '@/router/utils/enums';
import { SccmRouteMaps } from '@/router/utils/sccmEnums';
import { postSupplychainProductDelete } from '@/sdks_v2/new/supplychainV2ApiDocs';
import { modal } from '@/store/module/notification';
import { Toast, modalText } from '@/utils';
import { modelFooterBtnStyle } from '@/views/components/utils/index';

import style from './index.module.less';
import { ProductionResp } from './type';

export const columns = ({
  refresh,
  navigate,
}: {
  navigate: NavigateFunction;
  refresh: TableContext['refresh'];
}): TableRenderProps<ProductionResp>['columns'] => [
  {
    title: I18N.Factors.productName,
    dataIndex: 'productName',
    ellipsis: true,
    fixed: 'left',
  },
  // {
  //   title: I18N.carbonData.affiliatedOrganization,
  //   dataIndex: 'orgName',
  // },
  {
    title: I18N.router.supplier,
    dataIndex: 'supplier',
    render: (_, record) => {
      return (
        <span
          className={style.columnText}
          onClick={() => {
            navigate(
              virtualLinkTransform(
                SccmRouteMaps.sccmProdctSupplierManagement,
                [':id'],
                [record?.id],
              ),
            );
          }}
        >
          {I18N.router.supplierManagement}
        </span>
      );
    },
  },
  {
    title: I18N.carbonFootPrintLCA.specificationAndModel,
    dataIndex: 'productModel',
  },
  {
    title: I18N.carbonFootPrint.accountingUnit,
    dataIndex: 'productUnitName',
  },
  {
    title: I18N.Factors.updatedBy,
    dataIndex: 'updateByName',
    width: 100,
  },
  {
    title: I18N.Factors.updateTime,
    dataIndex: 'updateTime',
    width: 180,
  },
  {
    title: I18N.Factors.operation,
    dataIndex: 'action',
    width: 180,
    render: (_, row) => {
      const { id, productName } = row;
      return (
        <TableActions
          menus={compact([
            checkAuth('/supplyChain/productManagement/detail', {
              label: I18N.Factors.check,
              key: I18N.Factors.check,
              onClick: async () => {
                navigate(
                  virtualLinkTransform(
                    SccmRouteMaps.sccmProdctInfo,
                    [PAGE_TYPE_VAR, ':id'],
                    [PageTypeInfo.show, id],
                  ),
                );
              },
            }),
            checkAuth('/supplyChain/productManagement/edit', {
              label: I18N.Factors.edit,
              key: I18N.Factors.edit,
              onClick: async () => {
                navigate(
                  virtualLinkTransform(
                    SccmRouteMaps.sccmProdctInfo,
                    [PAGE_TYPE_VAR, ':id'],
                    [PageTypeInfo.edit, id],
                  ),
                );
              },
            }),
            checkAuth('/supplyChain/productManagement/delete', {
              label: I18N.Factors.delete,
              key: I18N.Factors.delete,
              onClick: async () => {
                modal.confirm({
                  title: I18N.Factors.prompt,
                  icon: '',
                  content: (
                    <span>
                      {I18N.supplyChainCarbonManagement.confirmDeletionOfThis2}
                      <span className={modalText}>{productName}?</span>
                    </span>
                  ),
                  ...modelFooterBtnStyle,
                  okText: I18N.base.confirm,
                  cancelText: I18N.Factors.cancel,
                  onOk: () => {
                    if (!id) return {};
                    return postSupplychainProductDelete({
                      req: {
                        id,
                      },
                    }).then(({ data }) => {
                      if (data.code === 200) {
                        Toast('success', I18N.Factors.deleteSuccessful);
                        refresh?.();
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
];
