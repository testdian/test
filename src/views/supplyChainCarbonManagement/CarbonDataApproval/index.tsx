/**
 * @description: 供应链碳管理-碳数据审核
 */
import I18N from '@src/lang/I18N';
import { includes } from 'lodash-es';
import { useNavigate } from 'react-router-dom';

import { Page } from '@/components/Page';
import { CustomTableRender } from '@/components/x-render/TableRender';
import { useTableRef } from '@/components/x-render/TableRender/hook/useTableRef';
import { CustomSearchProps } from '@/components/x-render/TableRender/types';
import { handleAssessmentProposalOptions } from '@/utils';
import { useAllEnumsBatch } from '@/views/dashborad/Dicts/hooks';
// import { useOrgs } from '@/views/dashborad/organizations/OrgManage/hooks';

import { columns } from './columns';
import { searchSchema } from './schemas';
import { getSupplierApprovalList } from './service';
import { SupplierApprovalListRequest, SupplierApprovalResp } from './type';
import { APPLY_STATUS } from '../CarbonDataFill/constant';
import style from '../SupplierManagement/index.module.less';
import { useSupplyChainEnums } from '../hooks/useEnums';

const { TO_BE_REVIEWED, APPROVED, REVIEW_FAILED } = APPLY_STATUS;

function CarbonDataApproval() {
  const navigate = useNavigate();
  const { tableRef } = useTableRef();

  const enumOptions = useAllEnumsBatch('AssessmentProposal');

  /** lca评价方法 */
  const assessmentMethodOptions = handleAssessmentProposalOptions(
    enumOptions?.AssessmentProposal || [],
  );

  /** 所属组织枚举 */
  // const orgList = useOrgs();

  /** 数据请求类型枚举 */
  const applyTypeOptions = useSupplyChainEnums('ApplyType');

  /** 填报审批状态枚举 待审批/审批通过/审批不通过 */
  const applyStatusOptions = useSupplyChainEnums('ApplyStatus')?.filter(item =>
    includes([TO_BE_REVIEWED, APPROVED, REVIEW_FAILED], item.code),
  );

  /** 数据审核枚举 */
  const applusAuditStatusOptions = useSupplyChainEnums('ApplusAuditStatus');

  const searchApi: CustomSearchProps<
    SupplierApprovalResp,
    SupplierApprovalListRequest
  > = args =>
    getSupplierApprovalList(args).then(({ data }) => {
      return data?.data;
    });

  return (
    <Page
      wrapperClass={style.supplyManagementWrapper}
      title={I18N.supplyChainCarbonManagement.supplierData2}
    >
      <CustomTableRender<SupplierApprovalResp, SupplierApprovalListRequest>
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
          columns: columns({ navigate }),
          scroll: { x: 2000 },
        }}
        autoAddIndexColumn
        autoFixNoText
        autoSaveSearchInfo
      />
    </Page>
  );
}
export default CarbonDataApproval;
