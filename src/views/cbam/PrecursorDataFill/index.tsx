/**
 * @description CBAM前体数据填报
 */
import I18N from '@src/lang/I18N';
import { useNavigate } from 'react-router-dom';

import { Page } from '@/components/Page';
import { CustomTableRender } from '@/components/x-render/TableRender';
import { useTableRef as useTable } from '@/components/x-render/TableRender/hook/useTableRef';
import { CustomSearchProps } from '@/components/x-render/TableRender/types';

import { columns } from './columns';
import { searchSchema } from './schemas';
import { getPrecursorDataFillList } from './service';
import {
  PrecursorDataFillListResq,
  PrecursorDataFillListRequest,
} from './type';
import { defaultProps } from '../PrecursorData/constants';
import { useSupplyChainEnums } from '../hook';

const PrecursorDataFill = () => {
  const { refresh, tableRef } = useTable();
  const navigate = useNavigate();

  /** 填报审批状态枚举 */
  const applyStatusOptions = useSupplyChainEnums('ApplyStatus');

  const searchApi: CustomSearchProps<
    PrecursorDataFillListResq,
    PrecursorDataFillListRequest
  > = args =>
    getPrecursorDataFillList({
      ...defaultProps,
      ...args,
    }).then(({ data }) => {
      return data?.data;
    });
  return (
    <Page title={I18N.cbam.beforeCbam3}>
      <CustomTableRender<
        PrecursorDataFillListResq,
        PrecursorDataFillListRequest
      >
        tableRef={tableRef}
        searchProps={{
          schema: searchSchema({ applyStatusOptions }),
          api: searchApi,
        }}
        tableProps={{
          columns: columns({ refresh, navigate }),
          scroll: { x: 1800 },
        }}
        autoSaveSearchInfo
        autoAddIndexColumn
        autoFixNoText
      />
    </Page>
  );
};

export default PrecursorDataFill;
