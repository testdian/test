/**
 * @description 采购产品管理-列表
 */
import { PlusOutlined } from '@ant-design/icons';
import I18N from '@src/lang/I18N';
import { Button } from 'antd';
import { useNavigate } from 'react-router-dom';

import { Page } from '@/components/Page';
import { CustomTableRender } from '@/components/x-render/TableRender';
import { useTableRef as useTable } from '@/components/x-render/TableRender/hook/useTableRef';
import { CustomSearchProps } from '@/components/x-render/TableRender/types';
import { checkAuth } from '@/layout/utills';
import {
  PAGE_TYPE_VAR,
  PageTypeInfo,
  virtualLinkTransform,
} from '@/router/utils/enums';
import { SccmRouteMaps } from '@/router/utils/sccmEnums';
// import { useOrgs } from '@/views/dashborad/organizations/OrgManage/hooks';

import { columns } from './columns';
import style from './index.module.less';
import { searchSchema } from './schemas';
import { getProductionList } from './service';
import { ProductionRequest, ProductionResp } from './type';

function PurchaseProductManagement() {
  const navigate = useNavigate();
  const { refresh, tableRef } = useTable();

  /** 所属组织枚举 */
  // const orgList = useOrgs();

  const searchApi: CustomSearchProps<
    ProductionResp,
    ProductionRequest
  > = args =>
    getProductionList(args).then(({ data }) => {
      return data?.data;
    });

  return (
    <Page
      wrapperClass={style.wrapper}
      title={I18N.router.procurementProductManagement}
      rightRender={[
        checkAuth(
          '/supplyChain/supplierManagement/add',
          <Button
            type='primary'
            onClick={() => {
              navigate(
                virtualLinkTransform(
                  SccmRouteMaps.sccmProdctInfo,
                  [PAGE_TYPE_VAR, ':id'],
                  [PageTypeInfo.add, 'null'],
                ),
              );
            }}
          >
            <PlusOutlined /> {I18N.Factors.newAddition}
          </Button>,
        ),
        checkAuth(
          '/supplyChain/supplierManagement/import',
          <Button
            type='default'
            onClick={() => {
              navigate(SccmRouteMaps.sccmProdctImport);
            }}
          >
            {I18N.carbonFootPrint.import}
          </Button>,
        ),
      ]}
    >
      <CustomTableRender<ProductionResp, ProductionRequest>
        tableRef={tableRef}
        searchProps={{
          searchOnMount: false,
          schema: searchSchema(),
          api: searchApi,
        }}
        tableProps={{
          columns: columns({ navigate, refresh }),
          scroll: { x: 1400 },
        }}
        autoAddIndexColumn
        autoFixNoText
        autoSaveSearchInfo
      />
    </Page>
  );
}
export default PurchaseProductManagement;
