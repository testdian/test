/**
 * @description 供应商 - 资质证书
 */
import { Button, Form, Modal, Select, Space, Table, Tag, message } from 'antd';
import dayjs from 'dayjs';
import { useMemo, useState } from 'react';

import { ModifyNote } from '@/components/ModifyNote';
import { Page } from '@/components/Page';
import { TableActions } from '@/components/Table/TableActions';
import { CertificateVersionModal } from '@/views/supplyChainCarbon/components/certificates/CertificateVersionModal';
import { CertificateViewModal } from '@/views/supplyChainCarbon/components/certificates/CertificateViewModal';
import { attachmentSummary } from '@/views/supplyChainCarbon/data/cert-attachments';
import type { CarbonCertificate } from '@/views/supplyChainCarbon/data/demo-data';
import { getExpiryInfo } from '@/views/supplyChainCarbon/data/expiry-notifications';
import { useDemoStore } from '@/views/supplyChainCarbon/hooks/useDemoStore';
import { useUserRole } from '@/views/supplyChainCarbon/hooks/useUserRole';
import styles from '@/views/supplyChainCarbon/styles.module.less';
import { formatDate, usePagination } from '@/views/supplyChainCarbon/utils';

import {
  attachmentsFromFileList,
  applyCertificateVersionUpdate,
  certificateDisplayName,
  certToFormValues,
  createCertificateRecord,
  matchCertCategoryFilter,
  persistCertificateAttachmentFiles,
  resolveCertCategory,
  SUPPLIER_CERT_FORM_NOTE,
  type CertificateFormValues,
  type CertificatePayload,
} from './certificate-form';
import { CertificateFormFields } from './CertificateFormFields';

type ModalMode = 'create' | 'edit';

const SUPPLIER_CERT_TABLE_SCROLL_X = 1410;

const FILTER_CATEGORIES = [
  { label: '全部类别', value: 'all' },
  { label: '组织碳', value: '组织碳' },
  { label: '产品碳', value: '产品碳' },
  { label: '其他', value: '其他' },
];

function buildCertPayload(
  values: CertificateFormValues,
  supplierId: number,
  certCategory: string,
): CertificatePayload {
  const today = new Date().toISOString().slice(0, 10);
  const certNo = values.cert_no?.trim() || '';
  const attachments = attachmentsFromFileList(values.attachments);

  return {
    supplier_id: supplierId,
    cert_name: values.cert_name?.trim() || '',
    cert_category: certCategory,
    cert_type: `${certCategory}证书`,
    cert_no: certNo,
    issuer: values.issuer?.trim() || '',
    issued_at: values.issued_at!.format('YYYY-MM-DD'),
    expired_at: values.expired_at!.format('YYYY-MM-DD'),
    boundary: '-',
    file_name: attachments[0]?.name || `${certNo || 'certificate'}.pdf`,
    attachments,
    updated_at: today,
  };
}

export default function SupplierCertificatesPage() {
  const { supplierId } = useUserRole();
  const { data, update, ready } = useDemoStore();
  const [category, setCategory] = useState('all');
  const [expiry, setExpiry] = useState('all');
  const [applied, setApplied] = useState({ category: 'all', expiry: 'all' });
  const [modalMode, setModalMode] = useState<ModalMode | null>(null);
  const [activeCert, setActiveCert] = useState<CarbonCertificate | null>(null);
  const [viewCert, setViewCert] = useState<CarbonCertificate | null>(null);
  const [versionCert, setVersionCert] = useState<CarbonCertificate | null>(
    null,
  );
  const [submitting, setSubmitting] = useState(false);
  const [form] = Form.useForm<CertificateFormValues>();

  const list = useMemo(() => {
    return data.certificates.filter(cert => {
      if (cert.supplier_id !== supplierId) return false;
      if (!matchCertCategoryFilter(cert.cert_category, applied.category)) {
        return false;
      }
      const info = getExpiryInfo(cert.expired_at);
      if (applied.expiry === 'soon' && info.level !== 'soon') return false;
      if (applied.expiry === 'expired' && info.level !== 'expired')
        return false;
      return true;
    });
  }, [data.certificates, supplierId, applied]);

  const {
    paginatedItems,
    currentPage,
    pageSize,
    total,
    setCurrentPage,
    onPageSizeChange,
    resetPage,
  } = usePagination(list);

  const closeModal = () => {
    setModalMode(null);
    setActiveCert(null);
    form.resetFields();
  };

  const openCreateModal = () => {
    form.resetFields();
    form.setFieldsValue({
      category_kind: '组织碳',
      issued_at: dayjs(),
      expired_at: dayjs().add(1, 'year'),
      attachments: [],
    });
    setActiveCert(null);
    setModalMode('create');
  };

  const openEditModal = (cert: CarbonCertificate) => {
    setActiveCert(cert);
    form.setFieldsValue({
      ...certToFormValues(cert),
      version: `v${cert.version + 1}`,
    });
    setModalMode('edit');
  };

  const openViewModal = (cert: CarbonCertificate) => {
    setViewCert(cert);
  };

  const deleteCertificate = (cert: CarbonCertificate) => {
    Modal.confirm({
      title: '确认删除该证书？',
      content: `删除“${certificateDisplayName(
        cert,
      )}”后，管理员端将同步删除且无法恢复。`,
      okText: '删除',
      okButtonProps: { danger: true },
      cancelText: '取消',
      onOk: () => {
        update(d => ({
          ...d,
          certificates: d.certificates.filter(
            item =>
              !(item.id === cert.id && item.supplier_id === supplierId),
          ),
        }));
        message.success('证书已删除，管理员端已同步更新');
      },
    });
  };

  const handleSave = async () => {
    const values = await form.validateFields();
    const certCategory = resolveCertCategory(
      values.category_kind,
      values.custom_category,
    );
    if (!certCategory) {
      message.error('请输入证书类别');
      return;
    }

    setSubmitting(true);
    try {
      await persistCertificateAttachmentFiles(values.attachments);
      const today = new Date().toISOString().slice(0, 10);
      const payload = buildCertPayload(values, supplierId, certCategory);

      if (modalMode === 'edit' && activeCert) {
        update(d => ({
          ...d,
          certificates: d.certificates.map(item =>
            item.id === activeCert.id
              ? applyCertificateVersionUpdate(item, payload, today)
              : item,
          ),
        }));
        message.success(`证书已更新，当前版本 v${activeCert.version + 1}`);
      } else {
        update(d => {
          const newId = d.nextId.cert ?? d.certificates.length + 1;
          const cert = createCertificateRecord(newId, payload, today);
          return {
            ...d,
            certificates: [...d.certificates, cert],
            nextId: { ...d.nextId, cert: newId + 1 },
          };
        });
        message.success('证书已上传');
      }
      closeModal();
    } finally {
      setSubmitting(false);
    }
  };

  const modalTitle = modalMode === 'create' ? '上传证书' : '更新证书';

  if (!ready) return null;

  return (
    <Page
      title='资质证书'
      actionBtnChildArr={[
        {
          button: '新增',
          click: openCreateModal,
          buttonType: 'primary',
        },
      ]}
    >
      <div className={styles.filterBar}>
        <Select
          value={category}
          onChange={setCategory}
          style={{ width: 160 }}
          options={FILTER_CATEGORIES}
        />
        <Select
          value={expiry}
          onChange={setExpiry}
          style={{ width: 140 }}
          options={[
            { label: '全部有效期', value: 'all' },
            { label: '即将到期', value: 'soon' },
            { label: '已过期', value: 'expired' },
          ]}
        />
        <Space>
          <Button
            type='primary'
            onClick={() => {
              setApplied({ category, expiry });
              resetPage();
            }}
          >
            查询
          </Button>
          <Button
            onClick={() => {
              setCategory('all');
              setExpiry('all');
              setApplied({ category: 'all', expiry: 'all' });
              resetPage();
            }}
          >
            重置
          </Button>
        </Space>
      </div>

      <Table
        rowKey='id'
        className={styles.certificateTable}
        dataSource={paginatedItems}
        scroll={{ x: SUPPLIER_CERT_TABLE_SCROLL_X }}
        tableLayout='fixed'
        pagination={{
          current: currentPage,
          pageSize,
          total,
          showSizeChanger: true,
          onChange: setCurrentPage,
          onShowSizeChange: (_, size) => onPageSizeChange(size),
        }}
        columns={[
          {
            title: '证书名称',
            dataIndex: 'cert_name',
            width: 200,
            ellipsis: true,
            render: (_, record) => certificateDisplayName(record),
          },
          { title: '证书类别', dataIndex: 'cert_category', width: 120 },
          {
            title: '证书编号',
            dataIndex: 'cert_no',
            width: 220,
            ellipsis: true,
          },
          {
            title: '签发机构',
            dataIndex: 'issuer',
            width: 200,
            ellipsis: true,
          },
          {
            title: '有效期至',
            dataIndex: 'expired_at',
            width: 120,
            render: v => formatDate(v),
          },
          {
            title: '有效期状态',
            width: 110,
            render: (_, record) => {
              const info = getExpiryInfo(record.expired_at);
              return <Tag color={info.color}>{info.label}</Tag>;
            },
          },
          {
            title: '附件',
            width: 220,
            ellipsis: true,
            render: (_, record) => attachmentSummary(record.attachments),
          },
          {
            title: '版本',
            dataIndex: 'version',
            width: 80,
            render: value => `v${value}`,
          },
          {
            title: '操作',
            fixed: 'right',
            width: 180,
            render: (_, record) => (
              <TableActions
                menus={[
                  {
                    key: 'view',
                    label: '查看',
                    onClick: () => openViewModal(record),
                  },
                  {
                    key: 'edit',
                    label: '更新',
                    onClick: () => openEditModal(record),
                  },
                  {
                    key: 'version',
                    label: '版本',
                    onClick: () => setVersionCert(record),
                  },
                  {
                    key: 'delete',
                    label: '删除',
                    onClick: () => deleteCertificate(record),
                  },
                ]}
              />
            ),
          },
        ]}
      />

      <Modal
        title={
          <span style={{ display: 'inline-flex', alignItems: 'center' }}>
            {modalTitle}
            <ModifyNote content={SUPPLIER_CERT_FORM_NOTE} />
          </span>
        }
        open={modalMode != null}
        onCancel={closeModal}
        onOk={handleSave}
        okText='保存'
        confirmLoading={submitting}
        width={560}
        destroyOnClose
      >
        <Form form={form} layout='vertical'>
          <CertificateFormFields
            form={form}
            readOnly={false}
            showVersion={modalMode === 'edit'}
          />
        </Form>
      </Modal>

      <CertificateViewModal
        open={!!viewCert}
        cert={viewCert}
        onClose={() => setViewCert(null)}
      />

      <CertificateVersionModal
        open={!!versionCert}
        cert={versionCert}
        onClose={() => setVersionCert(null)}
      />
    </Page>
  );
}
