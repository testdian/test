/**
 * @description 排放因子列表弹窗
 */

import { Modal, Table, Typography } from 'antd';
import { FC } from 'react';

import I18N from '@/lang/I18N';

import styles from './index.module.less';

export interface FactorItem {
  factorId: string;
  factorName: string;
  factorValue: string;
  unit: string;
}

const FactorListModal: FC<{
  open: boolean;
  onClose: () => void;
  list?: FactorItem[];
  onCheckFactor: (factorId: string) => void;
}> = ({ open, onClose, list = [], onCheckFactor }) => {
  const columns = [
    {
      title: I18N.Factors.emissionFactors,
      dataIndex: 'factorId',
      render: (text: string, record: FactorItem) => {
        const factorInfoShow =
          record.factorName || record.factorValue || record.unit
            ? `${record.factorName} ${record.factorValue} ${record.unit}`
            : '-';

        return (
          <Typography.Text
            onClick={() => {
              onCheckFactor(record?.factorId);
            }}
            style={{ width: 360, color: '#103861', cursor: 'pointer' }}
            ellipsis={{
              tooltip: factorInfoShow,
            }}
          >
            {factorInfoShow}
          </Typography.Text>
        );
      },
    },
  ];

  return (
    <Modal
      open={open}
      onCancel={onClose}
      width={500}
      footer={null}
      destroyOnHidden
      className={styles.factorListModal}
    >
      <Table
        size='small'
        columns={columns}
        dataSource={list}
        rowKey='factorId'
        pagination={false}
        scroll={{ y: '50vh' }}
      />
    </Modal>
  );
};

export default FactorListModal;
