/**
 * @description 证书版本历史弹窗（管理端 / 供应商端共用）
 */
import { Button, Modal, Space, Table, message } from 'antd';

import { ModifyNote } from '@/components/ModifyNote';
import { downloadCertificateAttachment } from '@/views/supplyChainCarbon/data/cert-attachments';
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
      width={820}
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
              width: 220,
              render: (_, record) =>
                record.attachments?.length ? (
                  <Space direction='vertical' size={0}>
                    {record.attachments.map(attachment => (
                      <Button
                        key={attachment.id}
                        type='link'
                        style={{ height: 'auto', padding: 0 }}
                        onClick={async () => {
                          try {
                            await downloadCertificateAttachment(
                              attachment,
                              cert,
                            );
                          } catch {
                            message.error('附件下载失败，请稍后重试');
                          }
                        }}
                      >
                        {attachment.name}
                      </Button>
                    ))}
                  </Space>
                ) : (
                  '-'
                ),
            },
          ]}
        />
      ) : null}
    </Modal>
  );
}
