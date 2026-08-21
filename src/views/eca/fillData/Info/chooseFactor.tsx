/*
 * @description:选择排放因子
 */

import { useNavigate, useParams } from 'react-router-dom';

import { EcaRouteMaps } from '@/router/utils/ecaEmums';
import {
  PageTypeInfo,
  PAGE_TYPE_VAR,
  virtualLinkTransform,
} from '@/router/utils/enums';
import { Factor } from '@/sdks/systemV2ApiDocs';
import { updateUrl } from '@/utils';

import ChooseFactorComponent from '../../component/chooseFactor';
import { ParamsProp } from '../../component/chooseFactor/type';

const Factors = () => {
  const { pageTypeInfo, id, sourcePageInfo, SourcefactorId } = useParams<{
    pageTypeInfo: PageTypeInfo;
    id: string;
    sourcePageInfo: PageTypeInfo;
    SourcefactorId: string;
  }>();
  const navigate = useNavigate();

  return (
    <ChooseFactorComponent
      onDetailClick={(row: Factor) => {
        navigate(
          virtualLinkTransform(
            EcaRouteMaps.fillDataInfoScreenSelectEmissionSourceDetail,
            [
              PAGE_TYPE_VAR,
              ':id',
              ':sourcePageInfo',
              ':SourcefactorId',
              ':factorPageInfo',
              ':factorId',
            ],
            [
              pageTypeInfo,
              id,
              sourcePageInfo,
              SourcefactorId,
              PageTypeInfo.show,
              row?.id,
            ],
          ),
        );
      }}
      onConfirmClick={async (data: ParamsProp) => {
        navigate(
          virtualLinkTransform(
            EcaRouteMaps.fillDataInfoScreen,
            [PAGE_TYPE_VAR, ':id', ':sourcePageInfo', ':SourcefactorId'],
            [pageTypeInfo, id, sourcePageInfo, SourcefactorId],
          ),
        );
        updateUrl({
          ...data,
        });
      }}
      onCancelClick={async (data: ParamsProp) => {
        navigate(
          virtualLinkTransform(
            EcaRouteMaps.fillDataInfoScreen,
            [PAGE_TYPE_VAR, ':id', ':sourcePageInfo', ':SourcefactorId'],
            [pageTypeInfo, id, sourcePageInfo, SourcefactorId],
          ),
        );
        updateUrl({
          ...data,
        });
      }}
    />
  );
};

export default Factors;
