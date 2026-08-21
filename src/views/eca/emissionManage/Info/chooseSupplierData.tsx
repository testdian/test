/*
 * @description: 选择供应商数据
 */
import { useNavigate, useParams } from 'react-router-dom';

import { EcaRouteMaps } from '@/router/utils/ecaEmums';
import {
  PageTypeInfo,
  PAGE_TYPE_VAR,
  virtualLinkTransform,
} from '@/router/utils/enums';
import { ProductDto } from '@/sdks_v2/new/computationV2ApiDocs';
import { updateUrl } from '@/utils';

import { ParamsProp } from '../../component/chooseFactor/type';
import ChooseSupplierComponent from '../../component/chooseSupplier';

function ChooseSupplierData() {
  const navigate = useNavigate();
  const { pageTypeInfo, id } = useParams<{
    pageTypeInfo: PageTypeInfo;
    id: string;
  }>();

  /** 页面跳转 */
  const navigatePageTo = (data: ParamsProp) => {
    navigate(
      virtualLinkTransform(
        EcaRouteMaps.emissionManagInfo,
        [PAGE_TYPE_VAR, ':id'],
        [pageTypeInfo, id],
      ),
    );
    updateUrl({
      ...data,
    });
  };

  return (
    <ChooseSupplierComponent
      onDetail={(row: ProductDto) => {
        navigate(
          virtualLinkTransform(
            EcaRouteMaps.emissionManagInfoChooseSupplierDataInfo,
            [PAGE_TYPE_VAR, ':id', ':applyInfoId'],
            [pageTypeInfo, id, row?.applyInfoId],
          ),
        );
      }}
      onComfirmClick={(data: ParamsProp) => {
        navigatePageTo(data);
      }}
      onCancelClick={(data: ParamsProp) => {
        navigatePageTo(data);
      }}
    />
  );
}
export default ChooseSupplierData;
