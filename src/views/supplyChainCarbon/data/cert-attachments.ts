import { getCertAttachmentFile } from './cert-attachment-store';
import type { CertificateAttachment, CarbonCertificate } from './demo-data';

export const CERT_ATTACHMENT_MAX_FILES = 5;
export const CERT_ATTACHMENT_MAX_SIZE_MB = 20;

export function createAttachmentId() {
  return `att-${Date.now()}-${Math.random().toString(36).slice(2, 10)}`;
}

export function formatAttachmentSize(bytes: number) {
  if (bytes < 1024) return `${bytes} B`;
  if (bytes < 1024 * 1024) return `${(bytes / 1024).toFixed(1)} KB`;
  return `${(bytes / (1024 * 1024)).toFixed(2)} MB`;
}

export function attachmentSummary(
  attachments: CertificateAttachment[] | undefined,
) {
  if (!attachments?.length) return '-';
  if (attachments.length === 1) return attachments[0].name;
  return `${attachments[0].name} 等 ${attachments.length} 个文件`;
}

export async function filesToAttachments(
  files: File[],
): Promise<CertificateAttachment[]> {
  const { putCertAttachmentFile } = await import('./cert-attachment-store');

  return Promise.all(
    files.map(async file => {
      const id = createAttachmentId();
      await putCertAttachmentFile(id, file);
      return {
        id,
        name: file.name,
        size: file.size,
        mime_type: file.type || 'application/octet-stream',
      };
    }),
  );
}

export async function downloadStoredAttachment(
  attachment: CertificateAttachment,
  context?: { title?: string; category?: string; reference?: string },
) {
  const stored = await getCertAttachmentFile(attachment.id);
  const blob =
    stored ||
    new Blob(
      [
        `演示附件：${attachment.name}\n`,
        context?.title ? `资料名称：${context.title}\n` : '',
        context?.category ? `类别：${context.category}\n` : '',
        context?.reference ? `编号：${context.reference}\n` : '',
        `说明：当前为演示数据占位文件，实际上传后会下载真实附件。\n`,
      ],
      { type: attachment.mime_type || 'text/plain' },
    );

  const url = URL.createObjectURL(blob);
  const a = document.createElement('a');
  a.href = url;
  a.download = attachment.name;
  a.click();
  URL.revokeObjectURL(url);
}

export async function downloadCertificateAttachment(
  attachment: CertificateAttachment,
  cert?: Pick<CarbonCertificate, 'cert_no' | 'cert_category' | 'supplier_id'>,
) {
  await downloadStoredAttachment(attachment, {
    reference: cert?.cert_no,
    category: cert?.cert_category,
  });
}
