/*
 * @@description:
 * @Author: liuxinxin xinxin@carbonstop.net
 * @Date: 2023-06-18 15:55:03
 * @LastEditors: liuxinxin xinxin@carbonstop.net
 * @LastEditTime: 2023-06-20 17:14:41
 */
import I18N from '@src/lang/I18N';
import { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';

import { FormActions } from '@/components/FormActions';
import { PageTypeInfo } from '@/router/utils/enums';
import {
  FootprintResult,
  getComputationSupplierDataFootprintApplyInfoId,
} from '@/sdks_v2/new/computationV2ApiDocs';
import { ApplyInfoResp } from '@/sdks_v2/new/supplychainV2ApiDocs';
import CarbonFootPrintResult from '@/views/supplyChainCarbonManagement/components/CarbonFootPrintResult';
import { CarbonDataPropsType } from '@/views/supplyChainCarbonManagement/utils/type';

function SupplierDataIDetail() {
  const { applyInfoId } = useParams<{
    pageTypeInfo: PageTypeInfo;
    id: string;
    applyInfoId: string;
  }>();

  const [footprintResult, setFootprintResult] = useState<FootprintResult>();

  useEffect(() => {
    getComputationSupplierDataFootprintApplyInfoId({
      applyInfoId: Number(applyInfoId),
    }).then(({ data }) => {
      if (data.code === 200) {
        setFootprintResult(data.data);
      }
    });
  }, []);
  return (
    <div>
      <CarbonFootPrintResult
        currentModalType='supplierSelect'
        disabled
        cathRecord={{
          periodType:
            footprintResult?.periodType as ApplyInfoResp['periodType'],
        }}
        footprintResult={
          footprintResult as CarbonDataPropsType['footprintResult']
        }
      />

      <FormActions
        place='center'
        buttons={[
          {
            title: I18N.Factors.return,
            onClick: async () => {
              history.back();
            },
          },
        ]}
      />
    </div>
  );
}
export default SupplierDataIDetail;
