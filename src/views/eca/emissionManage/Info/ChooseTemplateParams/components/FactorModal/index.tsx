import { Modal } from 'antd';
import React from 'react';

import { Factor } from '@/sdks/systemV2ApiDocs';
import { FullPageDetail } from '@/views/Factors/FullPageDetail';

import ChooseParamsFactor, {
  ChooseParamsFactorSelectedFactor,
} from '../../../ChooseParamsFactor';

interface FactorModalProps {
  checkFactorId: string;
  visible: string;
  onCancel: () => void;
  onSubmit: (values: Factor, checkFactorId: string) => void;
  onDetailClick?: (row: Factor) => void;
  selectedFactor?: ChooseParamsFactorSelectedFactor;
}

const FactorModal: React.FC<FactorModalProps> = ({
  checkFactorId,
  visible,
  onCancel,
  onSubmit,
  onDetailClick,
  selectedFactor,
}) => {
  const handleOk = async (data: Factor) => {
    try {
      onSubmit(data, checkFactorId);
    } catch (error) {
      console.error('Validation Failed:', error);
    }
  };

  const handleCancel = () => {
    onCancel();
  };

  return (
    <div>
      <Modal
        width='80%'
        open={visible === 'checkFactorModalOpen'}
        footer={null}
        destroyOnHidden
      >
        <ChooseParamsFactor
          selectedFactor={selectedFactor}
          onDetailClick={row => {
            onDetailClick?.(row);
          }}
          onConfirmClick={data => {
            handleOk(data);
          }}
          onCancelClick={() => {
            handleCancel();
          }}
        />
      </Modal>
      {/* 查看因子详情Modal */}
      <FullPageDetail
        open={visible === 'checkFactorDetailModalOpen'}
        onClose={() => {
          onCancel();
        }}
        initFactorId={checkFactorId}
        defaultApi
      />
    </div>
  );
};

export default FactorModal;
