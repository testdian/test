/**
 * @description: 供应链碳管理-碳数据填报
 */
import I18N from '@src/lang/I18N';
import { useNavigate } from 'react-router-dom';

import { Page } from '@/components/Page';
import { CustomTableRender } from '@/components/x-render/TableRender';
import { useTableRef as useTable } from '@/components/x-render/TableRender/hook/useTableRef';
import { CustomSearchProps } from '@/components/x-render/TableRender/types';

import { columns } from './columns';
import { searchSchema } from './schemas';
import { getSupplierFillList } from './service';
import { SupplierFillListRequest, SupplierFillResp } from './type';
import style from '../SupplierManagement/index.module.less';
import { useSupplyChainEnums } from '../hooks/useEnums';

function CarbonDataFill() {
  const navigate = useNavigate();
  const { refresh, tableRef } = useTable();

  /** 填报审批状态枚举 */
  const applyStatusOptions = useSupplyChainEnums('ApplyStatus');

  /** 碳数据填报列表 */
  const searchApi: CustomSearchProps<
    SupplierFillResp,
    SupplierFillListRequest
  > = args =>
    getSupplierFillList(args).then(({ data }) => {
      return data?.data;
    });

  return (
    <Page
      wrapperClass={style.supplyManagementWrapper}
      title={I18N.supplyChainCarbonManagement.supplierData3}
    >
      <CustomTableRender<SupplierFillResp, SupplierFillListRequest>
        tableRef={tableRef}
        searchProps={{
          schema: searchSchema({
            applyStatusOptions,
          }),
          api: searchApi,
        }}
        tableProps={{
          columns: columns({ refresh, navigate }),
          scroll: { x: 1600 },
        }}
        autoAddIndexColumn
        autoFixNoText
        autoSaveSearchInfo
      />
    </Page>
  );
}
export default CarbonDataFill;
