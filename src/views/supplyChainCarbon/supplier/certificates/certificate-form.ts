import type { UploadFile } from 'antd/es/upload/interface';
import dayjs, { type Dayjs } from 'dayjs';

import { putCertAttachmentFile } from '@/views/supplyChainCarbon/data/cert-attachment-store';
import type {
  CarbonCertificate,
  CertificateAttachment,
  CertificateVersion,
} from '@/views/supplyChainCarbon/data/demo-data';

export const SUPPLIER_CERT_FORM_NOTE =
  '新增、编辑、查看证书弹窗：更新证书时自动生成下一版本号，不可手工修改；证书名称：文本框，必填，不超过100个字符；证书类别枚举值：组织碳、产品碳、其他，选择其他下方可录入证书类别，文本框，必填，不超过100个字符；证书编号：文本框，非必填，不超过100个字符；签发机构：文本框，非必填，不超过100个字符；签发日期：日期框，必填；有效期至：日期框，必填，必须严格晚于签发日期，同一天不可保存；附件：必传，气泡提示：附件支持doc、docx、xls、xlsx、pdf、jpg、jpeg、png格式，最多上传3个附件，每个附件不超过10M。';

export const SUPPLIER_CERT_VERSION_NOTE =
  '供应商更新证书时自动保留历史版本；可查看各版本的证书名称、证书编号、签发机构、有效期与附件，历史版本附件支持点击下载。';

export type CertificatePayload = {
  supplier_id: number;
  cert_name: string;
  cert_category: string;
  cert_type: string;
  cert_no: string;
  issuer: string;
  issued_at: string;
  expired_at: string;
  boundary: string;
  file_name: string;
  attachments: CertificateAttachment[];
  updated_at: string;
};

export function certificateDisplayName(
  cert: Pick<
    CarbonCertificate,
    'cert_name' | 'cert_type' | 'file_name' | 'cert_category'
  >,
) {
  return (
    cert.cert_name?.trim() ||
    cert.cert_type?.trim() ||
    cert.file_name?.replace(/\.[^.]+$/, '').trim() ||
    `${cert.cert_category}证书`
  );
}

export function buildCertificateVersionSnapshot(
  cert: Pick<
    CarbonCertificate,
    | 'version'
    | 'cert_name'
    | 'cert_type'
    | 'cert_category'
    | 'file_name'
    | 'cert_no'
    | 'expired_at'
    | 'issuer'
    | 'attachments'
    | 'updated_at'
    | 'created_at'
  >,
  uploadedAt: string,
): CertificateVersion {
  return {
    version: cert.version,
    cert_name: certificateDisplayName(cert),
    file_name: cert.file_name,
    uploaded_at: uploadedAt,
    cert_no: cert.cert_no,
    expired_at: cert.expired_at,
    issuer: cert.issuer,
    attachments: cert.attachments ? [...cert.attachments] : [],
  };
}

export function buildVersionSnapshotFromPayload(
  version: number,
  payload: CertificatePayload,
  uploadedAt: string,
): CertificateVersion {
  return {
    version,
    cert_name: payload.cert_name,
    file_name: payload.file_name,
    uploaded_at: uploadedAt,
    cert_no: payload.cert_no,
    expired_at: payload.expired_at,
    issuer: payload.issuer,
    attachments: payload.attachments ? [...payload.attachments] : [],
  };
}

export function mergeCertificateVersions(
  versions: CertificateVersion[],
  snapshot: CertificateVersion,
) {
  return [
    ...versions.filter(item => item.version !== snapshot.version),
    snapshot,
  ].sort((a, b) => a.version - b.version);
}

export function applyCertificateVersionUpdate(
  cert: CarbonCertificate,
  payload: CertificatePayload,
  today: string,
): CarbonCertificate {
  const previousSnapshot = buildCertificateVersionSnapshot(
    cert,
    cert.updated_at || cert.created_at,
  );
  const nextVersion = cert.version + 1;
  const nextSnapshot = buildVersionSnapshotFromPayload(
    nextVersion,
    payload,
    today,
  );

  return {
    ...cert,
    ...payload,
    version: nextVersion,
    versions: mergeCertificateVersions(
      mergeCertificateVersions(cert.versions || [], previousSnapshot),
      nextSnapshot,
    ),
    updated_at: today,
  };
}

export function createCertificateRecord(
  id: number,
  payload: CertificatePayload,
  today: string,
): CarbonCertificate {
  const initialSnapshot = buildVersionSnapshotFromPayload(1, payload, today);

  return {
    id,
    ...payload,
    version: 1,
    versions: [initialSnapshot],
    audit_status: 'pending',
    pipeline_status: 'upload',
    archived_at: today,
    created_at: today,
  };
}

export const CERT_CATEGORY_KIND_OPTIONS = [
  { label: '组织碳', value: '组织碳' as const },
  { label: '产品碳', value: '产品碳' as const },
  { label: '其他', value: '其他' as const },
];

export type CertCategoryKind = '组织碳' | '产品碳' | '其他';

export const CERT_ATTACHMENT_ACCEPT =
  '.doc,.docx,.xls,.xlsx,.pdf,.jpg,.jpeg,.png';
export const CERT_ATTACHMENT_MAX_FILES = 3;
export const CERT_ATTACHMENT_MAX_SIZE_MB = 10;
export const CERT_ATTACHMENT_TIP =
  '附件支持doc、docx、xls、xlsx、pdf、jpg、jpeg、png格式，最多上传3个附件，每个附件不超过10M。';

export const MAX_CERT_TEXT_LENGTH = 100;

export function isCertificateDateRangeValid(
  issuedAt?: Dayjs,
  expiredAt?: Dayjs,
) {
  return !issuedAt || !expiredAt || issuedAt.isBefore(expiredAt, 'day');
}

export type CertificateFormValues = {
  version?: string;
  cert_name?: string;
  category_kind: CertCategoryKind;
  custom_category?: string;
  cert_no?: string;
  issuer?: string;
  issued_at?: Dayjs;
  expired_at?: Dayjs;
  attachments?: UploadFile[];
};

export async function persistCertificateAttachmentFiles(
  fileList: UploadFile[] | undefined,
) {
  await Promise.all(
    (fileList || []).map(async file => {
      if (!file.originFileObj) return;
      await putCertAttachmentFile(file.uid, file.originFileObj);
    }),
  );
}

const LEGACY_ORG_CATEGORIES = new Set(['组织碳', '组织碳核查']);
const LEGACY_PRODUCT_CATEGORIES = new Set(['产品碳', '产品碳足迹']);

export function getCertCategoryKind(certCategory: string): CertCategoryKind {
  if (LEGACY_ORG_CATEGORIES.has(certCategory)) return '组织碳';
  if (LEGACY_PRODUCT_CATEGORIES.has(certCategory)) return '产品碳';
  return '其他';
}

export function resolveCertCategory(
  categoryKind: CertCategoryKind,
  customCategory?: string,
) {
  if (categoryKind === '其他') {
    return customCategory?.trim() || '';
  }
  return categoryKind;
}

export function certToFormValues(
  cert: CarbonCertificate,
): CertificateFormValues {
  const categoryKind = getCertCategoryKind(cert.cert_category);
  let customCategory: string | undefined = cert.cert_category;

  if (categoryKind !== '其他') {
    customCategory = undefined;
  }

  return {
    cert_name: certificateDisplayName(cert),
    category_kind: categoryKind,
    custom_category: customCategory,
    cert_no: cert.cert_no === '-' ? undefined : cert.cert_no,
    issuer: cert.issuer === '-' ? undefined : cert.issuer,
    issued_at: cert.issued_at ? dayjs(cert.issued_at) : undefined,
    expired_at: cert.expired_at ? dayjs(cert.expired_at) : undefined,
    attachments: (cert.attachments || []).map(item => ({
      uid: item.id,
      name: item.name,
      size: item.size,
      type: item.mime_type,
      status: 'done' as const,
    })),
  };
}

export function attachmentsFromFileList(
  fileList: UploadFile[] | undefined,
): CertificateAttachment[] {
  return (fileList || [])
    .filter(file => file.status !== 'error')
    .map(file => ({
      id: file.uid,
      name: file.name,
      size: file.size || 0,
      mime_type: file.type || 'application/octet-stream',
    }));
}

export function matchCertCategoryFilter(certCategory: string, filter: string) {
  if (filter === 'all') return true;
  return getCertCategoryKind(certCategory) === filter;
}

export function validateAttachmentFile(file: File) {
  const ext = file.name.split('.').pop()?.toLowerCase() || '';
  const allowed = ['doc', 'docx', 'xls', 'xlsx', 'pdf', 'jpg', 'jpeg', 'png'];
  if (!allowed.includes(ext)) {
    return '附件格式不支持';
  }
  if (file.size > CERT_ATTACHMENT_MAX_SIZE_MB * 1024 * 1024) {
    return `单个附件不能超过${CERT_ATTACHMENT_MAX_SIZE_MB}M`;
  }
  return null;
}
