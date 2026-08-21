/*
 * @@description:
 */
/**
 * @description 采购产品管理-供应商管理-选择
 */
import I18N from '@src/lang/I18N';
import { compact } from 'lodash-es';
import { useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';

import { FormActions } from '@/components/FormActions';
import { Page } from '@/components/Page';
import { CustomTableRender } from '@/components/x-render/TableRender';
import { useTableRef } from '@/components/x-render/TableRender/hook/useTableRef';
import { CustomSearchProps } from '@/components/x-render/TableRender/types';
import { virtualLinkTransform } from '@/router/utils/enums';
import { SccmRouteMaps } from '@/router/utils/sccmEnums';
import { postSupplychainProductSupplierBind } from '@/sdks_v2/new/supplychainV2ApiDocs';
import style from '@/views/supplyChainCarbonManagement/SupplierManagement/Info/index.module.less';
import {
  SUPPLIER_STATUS,
  SUPPLIER_TYPE,
} from '@/views/supplyChainCarbonManagement/SupplierManagement/constant';
import { getSupplierList } from '@/views/supplyChainCarbonManagement/SupplierManagement/service';
import {
  SupplierListRequest,
  SupplierResp,
} from '@/views/supplyChainCarbonManagement/SupplierManagement/type';

import { columns } from './columns';
import { searchSchema } from './schemas';

function SelectSupplierManagement() {
  const navigate = useNavigate();
  const { tableRef } = useTableRef();

  const { id } = useParams<{
    id: string;
    orgId: string;
  }>();

  /** 选中的数据Key */
  const [selectedRowKeys, setSelectedRowKeys] = useState<number[]>([]);

  /** 供应商管理列表（只能选择该组织以及启用的供应商） */
  const searchApi: CustomSearchProps<
    SupplierResp,
    SupplierListRequest
  > = args =>
    getSupplierList({
      ...args,
      // orgId: Number(orgId),
      supplierStatus: SUPPLIER_STATUS.ENABLE,
      supplierType: SUPPLIER_TYPE.SUPPLIER,
    }).then(({ data }) => {
      return data?.data;
    });

  /** 选中表格 */
  const onSelectChange = (newSelectedRowKeys: React.Key[]) => {
    setSelectedRowKeys(newSelectedRowKeys as unknown as number[]);
  };

  /** 选择项配置 */
  const rowSelection = {
    selectedRowKeys,
    onChange: onSelectChange,
  };
  return (
    <div className={style.supplyManagementInfoWrapper}>
      <Page title={I18N.router.selectSupplier}>
        <CustomTableRender<SupplierResp, SupplierListRequest>
          tableRef={tableRef}
          searchProps={{
            schema: searchSchema(),
            api: searchApi,
            searchOnMount: false,
          }}
          tableProps={{
            columns: columns(),
            rowSelection: {
              type: 'checkbox',
              ...rowSelection,
            },
          }}
          autoFixNoText
        />
      </Page>
      <FormActions
        place='center'
        buttons={compact([
          {
            title: I18N.carbonFootPrintLCA.confirm,
            type: 'primary',
            disabled: selectedRowKeys.length === 0,
            onClick: async () => {
              postSupplychainProductSupplierBind({
                req: {
                  supplierIdList: selectedRowKeys,
                  productId: Number(id),
                },
              }).then(() => {
                navigate(
                  virtualLinkTransform(
                    SccmRouteMaps.sccmProdctSupplierManagement,
                    [':id'],
                    [id],
                  ),
                );
              });
            },
          },
          {
            title: I18N.Factors.cancel,
            onClick: async () => {
              navigate(
                virtualLinkTransform(
                  SccmRouteMaps.sccmProdctSupplierManagement,
                  [':id'],
                  [id],
                ),
              );
            },
          },
        ])}
      />
    </div>
  );
}
export default SelectSupplierManagement;
