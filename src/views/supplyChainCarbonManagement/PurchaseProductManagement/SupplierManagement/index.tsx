/*
 * @@description: 供应链碳管理-采购产品管理-供应商管理
 */
import I18N from '@src/lang/I18N';
import { useNavigate, useParams } from 'react-router-dom';

import { checkAuth } from '@/layout/utills';
import { virtualLinkTransform } from '@/router/utils/enums';
import { SccmRouteMaps } from '@/router/utils/sccmEnums';

import ManagementPage from '../../components/ManagementPage';
import { UseGetUnitLabel } from '../../hooks/useGetUnitLabel';
import SupplierList from '../components/SupplierList';
import { usePurchaseProductDetail } from '../hooks/usePurchaseProductDetail';

function SupplierManagement() {
  const navigate = useNavigate();
  const { id } = useParams<{
    id: string;
  }>();

  /** 采购产品详情 */
  const purchaseProductInfo = usePurchaseProductDetail(id);
  const { productName, productUnit } = purchaseProductInfo || {};

  /** 获取核算单位翻译值 */
  const unitLabel = UseGetUnitLabel(productUnit)?.unitLabel;

  return (
    <ManagementPage
      basicInfo={[
        {
          label: I18N.Factors.productName,
          value: productName,
        },
        // {
        //   label: I18N.carbonData.affiliatedOrganization,
        //   value: orgName,
        // },
        {
          label: I18N.carbonFootPrint.accountingUnit,
          value: unitLabel,
        },
      ]}
      onBtnClick={async () => {
        navigate(
          virtualLinkTransform(
            SccmRouteMaps.sccmProdctSupplierManagementSelect,
            [':id', ':orgId'],
            [id, 0],
          ),
        );
      }}
      actionBtnChild={checkAuth(
        '/supplyChain/productManagement/supplier/select',
        <div>{I18N.supplyChainCarbonManagement.choice}</div>,
      )}
    >
      <SupplierList hasAction />
    </ManagementPage>
  );
}
export default SupplierManagement;
