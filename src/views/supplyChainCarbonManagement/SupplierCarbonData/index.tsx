/**
 * @description 供应商核算数据
 */
import I18N from '@src/lang/I18N';
import { useNavigate } from 'react-router-dom';

import { Page } from '@/components/Page';
import { CustomTableRender } from '@/components/x-render/TableRender';
import { useTableRef as useTable } from '@/components/x-render/TableRender/hook/useTableRef';
import { CustomSearchProps } from '@/components/x-render/TableRender/types';
import { handleAssessmentProposalOptions } from '@/utils';
import { useAllEnumsBatch } from '@/views/dashborad/Dicts/hooks';
// import { useOrgs } from '@/views/dashborad/organizations/OrgManage/hooks';

import { columns } from './columns';
import { searchSchema } from './schemas';
import { getSupplierDataList } from './service';
import { SupplierDataListRequest, SupplierDataResp } from './type';
import style from '../SupplierManagement/index.module.less';
import { useSupplyChainEnums } from '../hooks/useEnums';

function SupplierCarbonData() {
  const navigate = useNavigate();
  const { refresh, tableRef } = useTable();

  const enumOptions = useAllEnumsBatch('AssessmentProposal');

  /** lca评价方法 */
  const assessmentMethodOptions = handleAssessmentProposalOptions(
    enumOptions?.AssessmentProposal || [],
  );

  /** 所属组织枚举 */
  // const orgList = useOrgs();

  /** 数据请求类型枚举 */
  const applyTypeOptions = useSupplyChainEnums('ApplyType');

  /** 填报审批状态枚举 */
  const applyStatusOptions = useSupplyChainEnums('ApplyStatus');

  /** 数据审核枚举 */
  const applusAuditStatusOptions = useSupplyChainEnums('ApplusAuditStatus');

  const searchApi: CustomSearchProps<
    SupplierDataResp,
    SupplierDataListRequest
  > = args =>
    getSupplierDataList(args).then(({ data }) => {
      return data?.data;
    });

  return (
    <Page
      wrapperClass={style.supplyManagementWrapper}
      title={I18N.supplyChainCarbonManagement.supplierAccounting}
    >
      <CustomTableRender<SupplierDataResp, SupplierDataListRequest>
        tableRef={tableRef}
        searchProps={{
          schema: searchSchema({
            // orgList,
            assessmentMethodOptions,
            applyTypeOptions,
            applyStatusOptions,
            applusAuditStatusOptions,
          }),
          api: searchApi,
        }}
        tableProps={{
          columns: columns({ refresh, navigate }),
          scroll: { x: 1800 },
        }}
        autoAddIndexColumn
        autoFixNoText
        autoSaveSearchInfo
      />
    </Page>
  );
}
export default SupplierCarbonData;
