import type { DemoData } from './demo-data';
import { supplierName } from './demo-data';
import { STATUS_BADGE } from './status-badges';

export const EXPIRY_SOON_DAYS = 90;

export type ExpiryLevel = 'expired' | 'soon';

export interface ExpiryInfo {
  label: '已过期' | '即将到期' | '有效';
  level: 'expired' | 'soon' | 'valid';
  days: number;
  className: string;
  color: 'error' | 'warning' | 'success';
}

export interface ExpiryNotification {
  id: string;
  type: 'certificate' | 'report';
  level: ExpiryLevel;
  title: string;
  message: string;
  supplier_id: number;
  supplier_name: string;
  expired_at: string;
  href: string;
}

function daysFromDate(date: string) {
  return Math.ceil((new Date(date).getTime() - Date.now()) / 86400000);
}

export function getExpiryInfo(date: string): ExpiryInfo {
  const days = daysFromDate(date);
  if (days < 0) {
    return {
      label: '已过期',
      level: 'expired',
      days,
      className: STATUS_BADGE.danger,
      color: 'error',
    };
  }
  if (days <= EXPIRY_SOON_DAYS) {
    return {
      label: '即将到期',
      level: 'soon',
      days,
      className: STATUS_BADGE.warning,
      color: 'warning',
    };
  }
  return {
    label: '有效',
    level: 'valid',
    days,
    className: STATUS_BADGE.success,
    color: 'success',
  };
}

export function reportValidUntil(submission: {
  valid_until?: string;
  submitted_at: string;
}) {
  if (submission.valid_until) return submission.valid_until;
  const base = new Date(submission.submitted_at);
  base.setFullYear(base.getFullYear() + 1);
  return base.toISOString().slice(0, 10);
}

export function getExpiryNotifications(
  data: DemoData,
  options: { scope: 'admin' | 'supplier'; supplierId?: number },
): ExpiryNotification[] {
  const notifications: ExpiryNotification[] = [];

  data.certificates.forEach(cert => {
    if (options.scope === 'supplier' && cert.supplier_id !== options.supplierId)
      return;
    const info = getExpiryInfo(cert.expired_at);
    if (info.level === 'valid') return;

    const name = supplierName(data, cert.supplier_id);
    notifications.push({
      id: `cert-${cert.id}`,
      type: 'certificate',
      level: info.level,
      title: `证书${info.label}：${cert.cert_no}`,
      message:
        options.scope === 'admin'
          ? `${name} 的 ${cert.cert_category} 证书将于 ${cert.expired_at} 到期`
          : `您的 ${cert.cert_category} 证书（${cert.cert_no}）将于 ${cert.expired_at} 到期`,
      supplier_id: cert.supplier_id,
      supplier_name: name,
      expired_at: cert.expired_at,
      href:
        options.scope === 'admin'
          ? '/enterprise/certificates'
          : '/supplier/certificates',
    });
  });

  data.formSubmissions.forEach(report => {
    if (
      options.scope === 'supplier' &&
      report.supplier_id !== options.supplierId
    )
      return;
    const validUntil = reportValidUntil(report);
    const info = getExpiryInfo(validUntil);
    if (info.level === 'valid') return;

    const name = supplierName(data, report.supplier_id);
    notifications.push({
      id: `report-${report.id}`,
      type: 'report',
      level: info.level,
      title: `碳评估报告${info.label}：${report.report_no}`,
      message:
        options.scope === 'admin'
          ? `${name} 的报告 ${report.report_no} 将于 ${validUntil} 失效`
          : `您的碳评估报告 ${report.report_no} 将于 ${validUntil} 失效`,
      supplier_id: report.supplier_id,
      supplier_name: name,
      expired_at: validUntil,
      href:
        options.scope === 'admin' ? '/enterprise/form-templates' : '/supplier',
    });
  });

  const levelOrder = { expired: 0, soon: 1 };
  return notifications.sort((a, b) => {
    if (levelOrder[a.level] !== levelOrder[b.level]) {
      return levelOrder[a.level] - levelOrder[b.level];
    }
    return new Date(a.expired_at).getTime() - new Date(b.expired_at).getTime();
  });
}
