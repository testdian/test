/**
 * @description 碳资质认证
 */
import { DownloadOutlined } from '@ant-design/icons';
import { Select, Table, Tag, message } from 'antd';
import { useMemo, useState } from 'react';

import { Page } from '@/components/Page';
import { ModifyNote } from '@/components/ModifyNote';
import { TableActions } from '@/components/Table/TableActions';
import { CertificateVersionModal } from '@/views/supplyChainCarbon/components/certificates/CertificateVersionModal';
import { CertificateViewModal } from '@/views/supplyChainCarbon/components/certificates/CertificateViewModal';
import { PageActionLabel } from '@/views/supplyChainCarbon/components/PageActionLabel';
import { attachmentSummary } from '@/views/supplyChainCarbon/data/cert-attachments';
import {
  supplierName,
  type CarbonCertificate,
} from '@/views/supplyChainCarbon/data/demo-data';
import { getExpiryInfo } from '@/views/supplyChainCarbon/data/expiry-notifications';
import { useDemoStore } from '@/views/supplyChainCarbon/hooks/useDemoStore';
import styles from '@/views/supplyChainCarbon/styles.module.less';
import { formatDate, usePagination } from '@/views/supplyChainCarbon/utils';

const CERTIFICATES_PAGE_NOTE =
  '碳资质认证模块，是供应商在供应商端上传的证书，管理员可查看，同时证书有有效期，当证书过期时需要邮件提醒供应商更新证书。';

function escapeCsv(value: string) {
  if (/[",\n]/.test(value)) return `"${value.replace(/"/g, '""')}"`;
  return value;
}

const CERT_TABLE_SCROLL_X = 1330;

export default function CertificatesPage() {
  const { data, ready } = useDemoStore();
  const [category, setCategory] = useState('all');
  const [expiry, setExpiry] = useState('all');
  const [viewCert, setViewCert] = useState<CarbonCertificate | null>(null);
  const [versionCert, setVersionCert] = useState<CarbonCertificate | null>(
    null,
  );

  const list = useMemo(() => {
    return data.certificates.filter(c => {
      if (category !== 'all' && c.cert_category !== category) return false;
      const exp = getExpiryInfo(c.expired_at).label;
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

  const exportFiltered = () => {
    if (list.length === 0) {
      message.error('当前筛选条件下暂无数据可导出');
      return;
    }
    const rows = list.map(c =>
      [
        supplierName(data, c.supplier_id),
        c.cert_category,
        c.cert_no,
        c.issuer,
        c.expired_at,
        getExpiryInfo(c.expired_at).label,
        attachmentSummary(c.attachments),
        `v${c.version}`,
      ]
        .map(escapeCsv)
        .join(','),
    );
    const csv = [
      '供应商,证书类别,证书编号,签发机构,有效期至,有效期状态,附件,版本',
      ...rows,
    ].join('\n');
    const blob = new Blob([`\ufeff${csv}`], { type: 'text/csv;charset=utf-8' });
    const a = document.createElement('a');
    a.href = URL.createObjectURL(blob);
    a.download = `证书台账_${new Date().toISOString().slice(0, 10)}.csv`;
    a.click();
    URL.revokeObjectURL(a.href);
    message.success(`已导出 ${list.length} 条记录`);
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
            <PageActionLabel icon={<DownloadOutlined />}>导出</PageActionLabel>
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
            { label: '组织碳核查', value: '组织碳核查' },
            { label: '产品碳足迹', value: '产品碳足迹' },
            { label: 'ISO认证', value: 'ISO认证' },
            { label: '客户指定', value: '客户指定' },
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
            title: '供应商',
            dataIndex: 'supplier_id',
            width: 160,
            ellipsis: true,
            render: (_, record) => supplierName(data, record.supplier_id),
          },
          {
            title: '证书类别',
            dataIndex: 'cert_category',
            width: 120,
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
              return <Tag className={info.className}>{info.label}</Tag>;
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
