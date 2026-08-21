/**
 * @description: 供应链碳管理-采购产品管理-供应商管理-申请产品碳足迹
 */
import { useParams } from 'react-router-dom';

import ApplyProduct from '@/views/supplyChainCarbonManagement/components/ApplyProduct';
import { UseGetUnitLabel } from '@/views/supplyChainCarbonManagement/hooks/useGetUnitLabel';

import { useProductSupplierDetail } from '../../hooks/useProductSupplierDetail';
import { usePurchaseProductDetail } from '../../hooks/usePurchaseProductDetail';

function Apply() {
  const { id, supplierId } = useParams<{
    id: string;
    supplierId: string;
  }>();

  /** 采购产品管理下的供应商的详情 */
  const productSupplierInfo = useProductSupplierDetail({
    productId: id,
    supplierId,
  });

  /** 采购产品详情 */
  const purchaseProductInfo = usePurchaseProductDetail(id);
  const {
    productName,
    productUnit,
    materialNo,
    sourceSystem_name,
    productModel,
  } = purchaseProductInfo || {};

  /** 获取核算单位翻译值 */
  const unitValue = UseGetUnitLabel(productUnit)?.unitValue;

  return (
    <ApplyProduct
      supplierId={Number(supplierId)}
      productId={Number(id)}
      cathRecord={{
        supplierName: productSupplierInfo?.supplierName,
        productName,
        productUnit: unitValue || [],
        materialNo,
        supplierMaterialNo: productSupplierInfo?.materialNo,
        sourceSystem_name,
        productModel,
      }}
    />
  );
}
export default Apply;
