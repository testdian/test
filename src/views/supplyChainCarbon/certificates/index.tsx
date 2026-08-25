/**
 * @description 碳资质认证
 */
import { DownloadOutlined } from '@ant-design/icons';
import { Select, Table, Tag, message } from 'antd';
import JSZip from 'jszip';
import { useMemo, useState } from 'react';

import { Page } from '@/components/Page';
import { ModifyNote } from '@/components/ModifyNote';
import { TableActions } from '@/components/Table/TableActions';
import { CertificateVersionModal } from '@/views/supplyChainCarbon/components/certificates/CertificateVersionModal';
import { CertificateViewModal } from '@/views/supplyChainCarbon/components/certificates/CertificateViewModal';
import { PageActionLabel } from '@/views/supplyChainCarbon/components/PageActionLabel';
import {
  attachmentSummary,
  getCertificateAttachmentBlob,
} from '@/views/supplyChainCarbon/data/cert-attachments';
import {
  supplierName,
  type CarbonCertificate,
} from '@/views/supplyChainCarbon/data/demo-data';
import { getExpiryInfo } from '@/views/supplyChainCarbon/data/expiry-notifications';
import { useDemoStore } from '@/views/supplyChainCarbon/hooks/useDemoStore';
import {
  CERT_CATEGORY_KIND_OPTIONS,
  certificateDisplayName,
  getCertCategoryKind,
  matchCertCategoryFilter,
} from '@/views/supplyChainCarbon/supplier/certificates/certificate-form';
import styles from '@/views/supplyChainCarbon/styles.module.less';
import { formatDate, usePagination } from '@/views/supplyChainCarbon/utils';

const CERTIFICATES_PAGE_NOTE =
  '碳资质认证模块，是供应商在供应商端上传的证书，管理员可查看，同时证书有有效期，当证书过期时需要邮件提醒供应商更新证书。';

const CERT_TABLE_SCROLL_X = 1530;

function safeZipSegment(value: string) {
  return value.replace(/[\\/:*?"<>|]/g, '_').trim() || '未命名供应商';
}

function uniqueAttachmentName(name: string, usedNames: Set<string>) {
  if (!usedNames.has(name)) {
    usedNames.add(name);
    return name;
  }

  const dotIndex = name.lastIndexOf('.');
  const baseName = dotIndex > 0 ? name.slice(0, dotIndex) : name;
  const extension = dotIndex > 0 ? name.slice(dotIndex) : '';
  let index = 2;
  let candidate = `${baseName}（${index}）${extension}`;
  while (usedNames.has(candidate)) {
    index += 1;
    candidate = `${baseName}（${index}）${extension}`;
  }
  usedNames.add(candidate);
  return candidate;
}

function latestCertificateVersion(cert: CarbonCertificate) {
  const latestVersion = [...(cert.versions || [])].sort(
    (a, b) => b.version - a.version,
  )[0];
  return {
    version: latestVersion?.version ?? cert.version,
    attachments: latestVersion?.attachments?.length
      ? latestVersion.attachments
      : cert.attachments || [],
  };
}

function localDateString(date = new Date()) {
  const year = date.getFullYear();
  const month = String(date.getMonth() + 1).padStart(2, '0');
  const day = String(date.getDate()).padStart(2, '0');
  return `${year}-${month}-${day}`;
}

export default function CertificatesPage() {
  const { data, ready } = useDemoStore();
  const [category, setCategory] = useState('all');
  const [expiry, setExpiry] = useState('all');
  const [viewCert, setViewCert] = useState<CarbonCertificate | null>(null);
  const [versionCert, setVersionCert] = useState<CarbonCertificate | null>(
    null,
  );
  const [exporting, setExporting] = useState(false);

  const list = useMemo(() => {
    return data.certificates.filter(c => {
      if (!matchCertCategoryFilter(c.cert_category, category)) return false;
      const exp = getExpiryInfo(c.expired_at).label;
      if (expiry === 'valid' && exp !== '有效') return false;
      if (expiry === 'soon' && exp !== '即将到期') return false;
      if (expiry === 'expired' && exp !== '已过期') return false;
      return true;
    });
  }, [data.certificates, category, expiry]);

  const {
    paginatedItems,
    currentPage,
    pageSize,
    total,
    setCurrentPage,
    onPageSizeChange,
  } = usePagination(list);

  const exportFiltered = async () => {
    if (exporting) return;
    if (list.length === 0) {
      message.error('当前筛选条件下暂无数据可导出');
      return;
    }

    setExporting(true);
    const messageKey = 'certificate-zip-export';
    message.loading({ content: '正在生成证书 ZIP 包…', key: messageKey });
    try {
      const zip = new JSZip();
      const usedNamesBySupplier = new Map<string, Set<string>>();
      let attachmentCount = 0;

      await Promise.all(
        list.map(async cert => {
          const folderName = safeZipSegment(
            supplierName(data, cert.supplier_id),
          );
          const folder = zip.folder(folderName);
          if (!folder) return;
          const usedNames =
            usedNamesBySupplier.get(folderName) || new Set<string>();
          usedNamesBySupplier.set(folderName, usedNames);

          const latest = latestCertificateVersion(cert);
          attachmentCount += latest.attachments.length;
          await Promise.all(
            latest.attachments.map(async attachment => {
              const fileName = uniqueAttachmentName(attachment.name, usedNames);
              const blob = await getCertificateAttachmentBlob(attachment, cert);
              folder.file(fileName, blob);
            }),
          );
        }),
      );

      if (attachmentCount === 0) {
        message.error({
          content: '当前筛选结果中没有可导出的证书附件',
          key: messageKey,
        });
        return;
      }

      const blob = await zip.generateAsync({ type: 'blob' });
      const url = URL.createObjectURL(blob);
      const anchor = document.createElement('a');
      anchor.href = url;
      anchor.download = `资质认证证书${localDateString()}.zip`;
      anchor.click();
      URL.revokeObjectURL(url);
      message.success({
        content: `已生成 ${usedNamesBySupplier.size} 个供应商、${attachmentCount} 个附件，请至下载管理查看`,
        key: messageKey,
      });
    } catch {
      message.error({
        content: '证书 ZIP 包生成失败，请稍后重试',
        key: messageKey,
      });
    } finally {
      setExporting(false);
    }
  };

  return (
    <Page
      title={
        <span style={{ display: 'inline-flex', alignItems: 'center' }}>
          碳资质认证
          <ModifyNote content={CERTIFICATES_PAGE_NOTE} />
        </span>
      }
      actionBtnChildArr={[
        {
          button: (
            <PageActionLabel icon={<DownloadOutlined />}>
              {exporting ? '生成中…' : '导出'}
            </PageActionLabel>
          ),
          click: exportFiltered,
          buttonType: 'default',
        },
      ]}
    >
      <div className={styles.filterBar}>
        <Select
          value={category}
          onChange={v => {
            setCategory(v);
            setCurrentPage(1);
          }}
          style={{ width: 176 }}
          options={[
            { label: '全部类别', value: 'all' },
            ...CERT_CATEGORY_KIND_OPTIONS,
          ]}
        />
        <Select
          value={expiry}
          onChange={v => {
            setExpiry(v);
            setCurrentPage(1);
          }}
          style={{ width: 176 }}
          options={[
            { label: '全部到期状态', value: 'all' },
            { label: '有效', value: 'valid' },
            { label: '即将到期', value: 'soon' },
            { label: '已过期', value: 'expired' },
          ]}
        />
      </div>

      <Table
        loading={!ready}
        rowKey='id'
        className={styles.certificateTable}
        dataSource={paginatedItems}
        scroll={{ x: CERT_TABLE_SCROLL_X }}
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
            title: '供应商名称',
            dataIndex: 'supplier_id',
            width: 160,
            ellipsis: true,
            render: (_, record) => supplierName(data, record.supplier_id),
          },
          {
            title: '证书名称',
            dataIndex: 'cert_name',
            width: 200,
            ellipsis: true,
            render: (_, record) => certificateDisplayName(record),
          },
          {
            title: '证书类别',
            dataIndex: 'cert_category',
            width: 120,
            render: value => getCertCategoryKind(value),
          },
          {
            title: '证书编号',
            dataIndex: 'cert_no',
            width: 180,
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
            render: value => formatDate(value),
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
            width: 140,
            render: (_, record) => (
              <TableActions
                menus={[
                  {
                    key: 'view',
                    label: '查看',
                    onClick: () => setViewCert(record),
                  },
                  {
                    key: 'version',
                    label: '版本',
                    onClick: () => setVersionCert(record),
                  },
                ]}
              />
            ),
          },
        ]}
      />

      <CertificateViewModal
        open={!!viewCert}
        cert={viewCert}
        onClose={() => setViewCert(null)}
        supplierLabel={
          viewCert ? supplierName(data, viewCert.supplier_id) : undefined
        }
      />

      <CertificateVersionModal
        open={!!versionCert}
        cert={versionCert}
        onClose={() => setVersionCert(null)}
      />
    </Page>
  );
}
