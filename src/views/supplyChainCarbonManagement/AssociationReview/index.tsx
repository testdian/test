/**
 * @description: 供应链碳管理-商户关联审核
 */
import I18N from '@src/lang/I18N';

import { Page } from '@/components/Page';
import { CustomTableRender } from '@/components/x-render/TableRender';
import { useTableRef as useTable } from '@/components/x-render/TableRender/hook/useTableRef';
import { CustomSearchProps } from '@/components/x-render/TableRender/types';

import { columns } from './columns';
import style from './index.module.less';
import { searchSchema } from './schemas';
import { getSupplierLinkList } from './service';
import { SupplierLinkRequest, SupplierLinkResp } from './type';
import { useSupplyChainEnums } from '../hooks/useEnums';

function AssociationReview() {
  const { refresh, tableRef } = useTable();

  /** 商户类型枚举 */
  const supplyTypeOptions = useSupplyChainEnums('SupplierType');

  /** 状态枚举 */
  const linkStatusOptions = useSupplyChainEnums('SupplierLinkStatus');

  /** 列表 */
  const searchApi: CustomSearchProps<
    SupplierLinkResp,
    SupplierLinkRequest
  > = args =>
    getSupplierLinkList(args).then(({ data }) => {
      return data?.data;
    });

  return (
    <Page
      wrapperClass={style.supplyManagementWrapper}
      title={I18N.supplyChainCarbonManagement.merchantAssociationReview}
    >
      <CustomTableRender<SupplierLinkResp, SupplierLinkRequest>
        tableRef={tableRef}
        searchProps={{
          schema: searchSchema(supplyTypeOptions, linkStatusOptions),
          api: searchApi,
        }}
        tableProps={{
          columns: columns({ refresh }),
          scroll: { x: 1400 },
        }}
        autoAddIndexColumn
        autoFixNoText
        autoSaveSearchInfo
      />
    </Page>
  );
}
export default AssociationReview;
