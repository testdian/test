/**
 * @description CBAM前体数据审批
 */
import I18N from '@src/lang/I18N';
import { includes } from 'lodash-es';
import { useNavigate } from 'react-router-dom';

import { Page } from '@/components/Page';
import { CustomTableRender } from '@/components/x-render/TableRender';
import { useTableRef } from '@/components/x-render/TableRender/hook/useTableRef';
import { CustomSearchProps } from '@/components/x-render/TableRender/types';

import { columns } from './columns';
import { searchSchema } from './schemas';
import { getPrecursorDataApprovalList } from './service';
import {
  PrecursorDataApprovalListProps,
  PrecursorDataApprovalListRequest,
} from './type';
import {
  defaultProps,
  PRECURSOR_DATA_STATUS,
} from '../PrecursorData/constants';
import { useSupplyChainEnums } from '../hook';

const { PENDING_APPROVAL, APPROVAL_PASSED, APPROVAL_FAILED } =
  PRECURSOR_DATA_STATUS;

const PrecursorDataApproval = () => {
  const navigate = useNavigate();

  const { tableRef } = useTableRef();

  /** 填报审批状态枚举 待审批/审批通过/审批不通过 */
  const applyStatusOptions = useSupplyChainEnums('ApplyStatus')?.filter(item =>
    includes([PENDING_APPROVAL, APPROVAL_PASSED, APPROVAL_FAILED], item.code),
  );

  const searchApi: CustomSearchProps<
    PrecursorDataApprovalListProps,
    PrecursorDataApprovalListRequest
  > = args =>
    getPrecursorDataApprovalList({
      ...defaultProps,
      ...args,
      type: 1,
    }).then(({ data }) => {
      // type 0的时候是全量的,1的时候是审批的
      return data?.data;
    });
  return (
    <Page title={I18N.cbam.beforeCbam2}>
      <CustomTableRender<
        PrecursorDataApprovalListProps,
        PrecursorDataApprovalListRequest
      >
        tableRef={tableRef}
        searchProps={{
          schema: searchSchema({ applyStatusOptions }),
          api: searchApi,
        }}
        tableProps={{
          columns: columns({ navigate }),
        }}
        autoSaveSearchInfo
        autoAddIndexColumn
        autoFixNoText
      />
    </Page>
  );
};

export default PrecursorDataApproval;
