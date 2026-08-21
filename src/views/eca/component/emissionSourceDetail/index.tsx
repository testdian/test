/*
 * @description: 排放源详情（无活动数据）核算模型-排放源管理、碳排放核算-排放源管理
 */

import { useParams } from 'react-router-dom';

import { PageTypeInfo } from '@/router/utils/enums';
import EmissionSourceComponent from '@/views/components/EmissionSource/indexcopy';

import { useSetEmissionSourceInfo } from '../../hooks';

const EmissionSourceInfo = () => {
  const { factorPageInfo, SourcefactorId } = useParams<{
    pageTypeInfo: PageTypeInfo;
    id: string;
    factorPageInfo: PageTypeInfo;
    SourcefactorId: string;
  }>();

  // 是否为详情页面
  const isDetail = factorPageInfo === PageTypeInfo.show;
  // 排放源ID
  const emissionSourceId = Number(SourcefactorId);
  // 排放源信息
  const emissionSourceDetailData = useSetEmissionSourceInfo(emissionSourceId);

  return (
    <EmissionSourceComponent
      readPretty={isDetail}
      emissionSourceId={emissionSourceId}
      noRequiredField='activityRecordWay,activityDept,activityCategory'
      emissionSourceDetailData={emissionSourceDetailData}
      onCancelFn={() => {
        history.back();
      }}
    />
  );
};
export default EmissionSourceInfo;
