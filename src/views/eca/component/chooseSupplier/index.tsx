/*
 * @description: 选择供应商数据
 */
import { Key } from 'react';

import type { CustomSearchProps } from '@/components/x-render/TableRender/types';
import {
  ProductDto,
  getComputationSupplierDataPageProps as SearchApiProps,
  getComputationSupplierDataChooseApplyInfoId,
  getComputationSupplierDataPage,
} from '@/sdks_v2/new/computationV2ApiDocs';
import { getSearchParams } from '@/utils';
import { CHOOSE_FACTOR } from '@/views/components/EmissionSource/utils/constant';
import SelectTable from '@/views/components/SelectTable';

import { columns } from './utils/columns';
import { searchSchema } from './utils/schemas';
import { ParamsProp } from '../chooseFactor/type';

function ChooseSupplier({
  onDetail,
  onComfirmClick,
  onCancelClick,
}: {
  onDetail?: (data: ProductDto) => void;
  onComfirmClick?: (data: ParamsProp) => void;
  onCancelClick?: (data: ParamsProp) => void;
}) {
  /** 路由上携带的参数 */
  const search = { ...getSearchParams()[0] };
  const emissionData = JSON.parse(search[CHOOSE_FACTOR.FORM_VALUES] || '{}');
  const likeProductName = search.likeProductName || '';

  /** 获取供应商数据 */
  const searchApi: CustomSearchProps<ProductDto, SearchApiProps> = args => {
    return getComputationSupplierDataPage(args).then(({ data }) => {
      const result = data?.data || {};
      return {
        ...result,
        rows: result?.list || [],
        total: result.total || 0,
      };
    });
  };

  const onComfirm = (applyInfoId: Key) => {
    getComputationSupplierDataChooseApplyInfoId({
      applyInfoId: Number(applyInfoId),
    }).then(({ data }) => {
      emissionData.supplierData = {
        ...emissionData.supplierData,
        ...data.data,
      };
      onComfirmClick?.({
        [CHOOSE_FACTOR.FORM_VALUES]: JSON.stringify(emissionData),
        [CHOOSE_FACTOR.FACTOR_ID]: -1,
      });
    });
  };
  return (
    <SelectTable
      searchProps={{
        schema: searchSchema(),
      }}
      columns={columns({
        onDetail,
      })}
      searchApi={searchApi}
      likeName={likeProductName}
      onComfirm={onComfirm}
      onCancel={() => {
        onCancelClick?.({
          [CHOOSE_FACTOR.FORM_VALUES]:
            search[CHOOSE_FACTOR.FORM_VALUES] || '{}',
        });
      }}
    />
  );
}
export default ChooseSupplier;
