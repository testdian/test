/*
 * @description: 排放源填报详情-排放源列表-排放源详情
 */

import { useNavigate, useParams } from 'react-router-dom';

import { EcaRouteMaps } from '@/router/utils/ecaEmums';
import {
  PAGE_TYPE_VAR,
  PageTypeInfo,
  TypeMapRoute,
  virtualLinkTransform,
} from '@/router/utils/enums';
import { postComputationDataSourceEdit } from '@/sdks_v2/new/computationV2ApiDocs';
import { updateUrl } from '@/utils';
import EmissionSourceComponent from '@/views/components/EmissionSource/indexcopy';
import { FACTOR_SELECT_WAY } from '@/views/components/EmissionSource/utils/constant';

import { useSetEmissionDetailWithActivityData } from '../../hooks';

const EmissionSourceInfo = () => {
  const navigate = useNavigate();
  const {
    pageTypeInfo,
    id,
    sourcePageInfo,
    SourcefactorId,
    dataId,
    approvalId,
  } = useParams<{
    pageTypeInfo: PageTypeInfo;
    id: string;
    sourcePageInfo: PageTypeInfo;
    SourcefactorId: string;
    dataId: string;
    approvalId: string;
  }>();

  // 是否为详情页面
  const isDetail = sourcePageInfo === PageTypeInfo.show;

  // 排放源id
  const emissionSourceId = Number(SourcefactorId);

  // 排放数据id
  const computationId = dataId ? Number(dataId) : Number(id);
  console.log(id, approvalId, SourcefactorId);
  // 排放源详情数据
  const emissionSourceDetailData = useSetEmissionDetailWithActivityData(
    Number(approvalId || computationId),
    emissionSourceId,
  );

  /** 选择按钮的跳转 */
  const navigateSelectPageTo = (path: TypeMapRoute) => {
    navigate(
      virtualLinkTransform(
        path,
        [PAGE_TYPE_VAR, ':id', ':sourcePageInfo', ':SourcefactorId'],
        [pageTypeInfo, id, sourcePageInfo, SourcefactorId],
      ),
    );
  };

  // 确定/返回跳转
  const navigatePageTo = () => {
    if (dataId) {
      history.back();
      return;
    }
    if (computationId) {
      history.back();
      return;
    }
    navigate(
      virtualLinkTransform(
        EcaRouteMaps.fillDataInfo,
        [PAGE_TYPE_VAR, ':id'],
        [pageTypeInfo, id],
      ),
    );
  };
  return (
    <EmissionSourceComponent
      readPretty={isDetail || !!dataId}
      emissionSourceId={emissionSourceId}
      activityDataVisible
      emissionSourceDetailData={{
        ...emissionSourceDetailData,
      }}
      disabledFieldPath='sourceName,facility,ghg,iso,activityUnit,factorWay,unitConver,factorType,gasList,supplierData,factorSource,year'
      onSelectFn={({ urlParamsData, factorType }) => {
        /** 选择因子 */
        if (factorType === FACTOR_SELECT_WAY.FACTOR) {
          navigateSelectPageTo(
            EcaRouteMaps.fillDataInfoScreenSelectEmissionSource,
          );
          updateUrl({
            ...urlParamsData,
          });
        }
        /** 选择供应商数据 */
        if (factorType === FACTOR_SELECT_WAY.SUPPLIER) {
          navigateSelectPageTo(EcaRouteMaps.fillDataInfoScreenSelectSupplier);
          updateUrl({
            ...urlParamsData,
            likeProductName: urlParamsData.likeName,
          });
        }
      }}
      onConfirmFn={async data => {
        if (isDetail) return;
        await postComputationDataSourceEdit({
          req: {
            ...data,
            computationDataId: computationId,
            emissionSourceId,
          },
        });
        navigatePageTo();
      }}
      onCancelFn={() => {
        navigatePageTo();
      }}
    />
  );
};
export default EmissionSourceInfo;
