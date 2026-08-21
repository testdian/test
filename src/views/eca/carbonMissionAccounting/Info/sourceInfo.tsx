/*
 * @description: 碳排放核算-查看-排放源列表-排放源详情
 */

import { useParams } from 'react-router-dom';

import { PageTypeInfo } from '@/router/utils/enums';
import EmissionSourceComponent from '@/views/components/EmissionSource/indexcopy';

import { useSetEmissionDetailWithActivityData } from '../../hooks';

const EmissionSourceInfo = () => {
  const { factorPageInfo, sourcefactorId, computationDataId } = useParams<{
    pageTypeInfo: PageTypeInfo;
    id: string;
    factorPageInfo: PageTypeInfo;
    sourcefactorId: string;
    computationDataId: string;
  }>();

  // 是否为详情页面
  const isDetail = factorPageInfo === PageTypeInfo.show;

  // 排放源id
  const emissionSourceId = Number(sourcefactorId);

  // 核算模型id
  const computationId = Number(computationDataId);

  // 排放源详情数据
  const emissionSourceDetailData = useSetEmissionDetailWithActivityData(
    computationId,
    emissionSourceId,
  );
  return (
    <EmissionSourceComponent
      readPretty={isDetail}
      emissionSourceId={emissionSourceId}
      activityDataVisible
      emissionSourceDetailData={{
        ...emissionSourceDetailData,
      }}
      onCancelFn={() => {
        history.back();
      }}
    />
  );
};
export default EmissionSourceInfo;
