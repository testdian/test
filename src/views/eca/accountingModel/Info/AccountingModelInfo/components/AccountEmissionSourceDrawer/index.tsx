import I18N from '@src/lang/I18N';
import React from 'react';

import CustomDrawer from '@/components/CustomDrawer';
import EmissionSourceInfo from '@/views/eca/emissionManage/Info';

import styles from './index.module.less';

interface AccountEmissionSourceDrawerProps {
  visible: boolean;
  onClose: () => void;
  onSaveSuccess: () => void;
  propsEmissionSourceId: number;
}

const AccountEmissionSourceDrawer: React.FC<
  AccountEmissionSourceDrawerProps
> = ({ visible, onClose, propsEmissionSourceId, onSaveSuccess }) => {
  return (
    <CustomDrawer
      title={I18N.cbam.editEmissionSources}
      onClose={onClose}
      visible={visible}
      width='80%'
    >
      <EmissionSourceInfo
        propsEmissionSourceId={propsEmissionSourceId}
        customCancel
        customCancelFn={() => {
          onClose();
        }}
        footerClassName={styles.editDrawerFooter}
        customTemplateFooterSave
        customTemplateFooterSaveFn={() => {
          onSaveSuccess();
        }}
      />
    </CustomDrawer>
  );
};

export default AccountEmissionSourceDrawer;
