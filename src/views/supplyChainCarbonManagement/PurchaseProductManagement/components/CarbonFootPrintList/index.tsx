/**
 * 供应链碳管理-采购产品管理-详情-产品环境足迹列表
 */
import { useNavigate, useParams } from 'react-router-dom';

import { CustomTableRender } from '@/components/x-render/TableRender';
import { useTableRef } from '@/components/x-render/TableRender/hook/useTableRef';
import { CustomSearchProps } from '@/components/x-render/TableRender/types';
import { PageTypeInfo } from '@/router/utils/enums';

import { columns } from './columns';
import { getProductFootprintApplyList } from '../../service';
import {
  ProductFootprintApplyRequest,
  ProductFootprintApplyResp,
} from '../../type';

function CarbonFootPrintList() {
  const navigate = useNavigate();
  const { tableRef } = useTableRef();
  const { pageTypeInfo, id } = useParams<{
    pageTypeInfo: PageTypeInfo;
    id: string;
  }>();

  /** 获取采购产品管理下的产品碳足迹列表 */
  const searchApi: CustomSearchProps<
    ProductFootprintApplyResp,
    ProductFootprintApplyRequest
  > = args =>
    getProductFootprintApplyList({ ...args, productId: Number(id) }).then(
      ({ data }) => {
        return data?.data;
      },
    );

  return (
    <CustomTableRender<ProductFootprintApplyResp, ProductFootprintApplyRequest>
      tableRef={tableRef}
      searchProps={{
        hidden: true,
        schema: { type: 'void', properties: {} },
        api: searchApi,
      }}
      tableProps={{
        columns: columns({ navigate, pageTypeInfo, productId: Number(id) }),
        scroll: { x: 1400 },
      }}
      autoFixNoText
    />
  );
}
export default CarbonFootPrintList;
