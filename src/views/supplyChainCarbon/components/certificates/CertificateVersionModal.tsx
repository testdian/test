/**
 * @description 证书版本历史弹窗（管理端 / 供应商端共用）
 */
import { Modal, Table } from 'antd';

import { ModifyNote } from '@/components/ModifyNote';
import { attachmentSummary } from '@/views/supplyChainCarbon/data/cert-attachments';
import type { CarbonCertificate } from '@/views/supplyChainCarbon/data/demo-data';
import { SUPPLIER_CERT_VERSION_NOTE } from '@/views/supplyChainCarbon/supplier/certificates/certificate-form';
import { formatDate } from '@/views/supplyChainCarbon/utils';

type CertificateVersionModalProps = {
  open: boolean;
  cert: CarbonCertificate | null;
  onClose: () => void;
};

export function CertificateVersionModal({
  open,
  cert,
  onClose,
}: CertificateVersionModalProps) {
  return (
    <Modal
      title={
        <span style={{ display: 'inline-flex', alignItems: 'center' }}>
          证书版本
          <ModifyNote content={SUPPLIER_CERT_VERSION_NOTE} />
        </span>
      }
      open={open}
      footer={null}
      onCancel={onClose}
      width={720}
      destroyOnClose
    >
      {cert ? (
        <Table
          rowKey='version'
          pagination={false}
          dataSource={cert.versions}
          columns={[
            { title: '版本', dataIndex: 'version', render: v => `v${v}` },
            { title: '证书编号', dataIndex: 'cert_no' },
            { title: '签发机构', dataIndex: 'issuer', ellipsis: true },
            {
              title: '有效期至',
              dataIndex: 'expired_at',
              render: value => formatDate(value),
            },
            {
              title: '上传时间',
              dataIndex: 'uploaded_at',
              render: value => formatDate(value),
            },
            {
              title: '附件',
              render: (_, record) => attachmentSummary(record.attachments),
            },
          ]}
        />
      ) : null}
    </Modal>
  );
}
