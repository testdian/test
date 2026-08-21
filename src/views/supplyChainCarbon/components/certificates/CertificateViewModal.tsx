/**
 * @description 证书查看弹窗（管理端 / 供应商端共用）
 */
import { Form, Modal } from 'antd';
import { useEffect } from 'react';

import { ModifyNote } from '@/components/ModifyNote';
import type { CarbonCertificate } from '@/views/supplyChainCarbon/data/demo-data';
import { CertificateFormFields } from '@/views/supplyChainCarbon/supplier/certificates/CertificateFormFields';
import {
  certToFormValues,
  SUPPLIER_CERT_FORM_NOTE,
  type CertificateFormValues,
} from '@/views/supplyChainCarbon/supplier/certificates/certificate-form';

import styles from './certificates.module.less';

type CertificateViewModalProps = {
  open: boolean;
  cert: CarbonCertificate | null;
  onClose: () => void;
  /** 管理端展示供应商名称 */
  supplierLabel?: string;
};

export function CertificateViewModal({
  open,
  cert,
  onClose,
  supplierLabel,
}: CertificateViewModalProps) {
  const [form] = Form.useForm<CertificateFormValues>();

  useEffect(() => {
    if (open && cert) {
      form.setFieldsValue(certToFormValues(cert));
      return;
    }
    form.resetFields();
  }, [cert, form, open]);

  return (
    <Modal
      title={
        <span style={{ display: 'inline-flex', alignItems: 'center' }}>
          证书详情
          <ModifyNote content={SUPPLIER_CERT_FORM_NOTE} />
        </span>
      }
      open={open}
      onCancel={onClose}
      onOk={onClose}
      okText='返回'
      cancelButtonProps={{ style: { display: 'none' } }}
      width={560}
      destroyOnClose
    >
      {supplierLabel ? (
        <div className={styles.viewSupplierRow}>
          <span className={styles.viewSupplierLabel}>供应商</span>
          <span>{supplierLabel}</span>
        </div>
      ) : null}
      <Form form={form} layout='vertical' disabled>
        <CertificateFormFields form={form} readOnly />
      </Form>
    </Modal>
  );
}
