import I18N from '@src/lang/I18N';
import React, { FC } from 'react';

import CustomDrawer from '@/components/CustomDrawer';
import { PageTypeInfo } from '@/router/utils/enums';
import ReductionSceneInfo from '@/views/eca/reductionScene/Info';

const ReductionDetailInfoDrawer: FC<{
  id: string;
  visible: boolean;
  onClose: () => void;
}> = ({ visible, id, onClose }) => {
  return (
    <CustomDrawer
      width='50%'
      title={I18N.router.detailsOfEmissionReductionScenarios}
      visible={visible}
      onClose={onClose}
      isDetail
    >
      <ReductionSceneInfo
        externalId={id}
        hideFooter
        externalPageTypeInfo={PageTypeInfo.show}
      />
    </CustomDrawer>
  );
};

export default ReductionDetailInfoDrawer;
