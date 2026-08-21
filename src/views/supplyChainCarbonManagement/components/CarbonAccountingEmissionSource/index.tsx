/*
 * @description: 企业碳核算-排放源详情 （供应商碳数据、碳数据审核、供应商管理-详情-企业碳核算）
 */
import { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';

import { PageTypeInfo } from '@/router/utils/enums';
import { EmissionSource } from '@/sdks_v2/new/computationV2ApiDocs';
import { getSupplychainProcessComputationSourceId } from '@/sdks_v2/new/supplychainV2ApiDocs';
import EmissionSourceComponent from '@/views/components/EmissionSource/indexcopy';

function EmissionSourceInfo() {
  const { factorId } = useParams<{
    pageTypeInfo: PageTypeInfo;
    id: string;
    factorPageInfo: PageTypeInfo;
    factorId: string;
  }>();

  // 排放源id
  const emissionSourceId = Number(factorId);

  /** 排放源详情 */
  const [emissionSourceData, setEmissionSourceData] =
    useState<EmissionSource>();

  /** 排放源详情接口 */
  useEffect(() => {
    if (factorId) {
      getSupplychainProcessComputationSourceId({
        id: Number(factorId),
      }).then(({ data }) => {
        if (data.code === 200) {
          setEmissionSourceData(data.data as EmissionSource);
        }
      });
    }
  }, [factorId]);

  return (
    <EmissionSourceComponent
      readPretty
      emissionSourceId={emissionSourceId}
      activityDataVisible
      emissionSourceDetailData={{
        ...emissionSourceData,
      }}
      onCancelFn={() => {
        history.back();
      }}
    />
  );
}
export default EmissionSourceInfo;
