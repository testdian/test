import {
  CERT_ATTACHMENT_MAX_FILES,
  CERT_ATTACHMENT_MAX_SIZE_MB,
  downloadStoredAttachment,
} from './cert-attachments';
import type { CertificateAttachment, Training } from './demo-data';

export const TRAINING_ATTACHMENT_MAX_FILES = CERT_ATTACHMENT_MAX_FILES;
export const TRAINING_ATTACHMENT_MAX_SIZE_MB = CERT_ATTACHMENT_MAX_SIZE_MB;

export async function downloadTrainingMaterials(training: Training) {
  if (training.attachments?.length) {
    await training.attachments.reduce<Promise<void>>(
      (chain, attachment) =>
        chain.then(() =>
          downloadStoredAttachment(attachment, {
            title: training.title,
            category: training.type,
          }),
        ),
      Promise.resolve(),
    );
    return;
  }

  const html = `<!DOCTYPE html><html lang="zh-CN"><head><meta charset="UTF-8"><title>${training.title}</title><style>body{font-family:sans-serif;max-width:800px;margin:40px auto;padding:0 20px;line-height:1.8}h1{color:#16332F}</style></head><body><h1>${training.title}</h1><p>${training.type} · ${training.created_at}</p>${training.content}</body></html>`;
  const blob = new Blob([html], { type: 'text/html;charset=utf-8' });
  const a = document.createElement('a');
  a.href = URL.createObjectURL(blob);
  a.download = training.attachment_name || `${training.title}.html`;
  a.click();
  URL.revokeObjectURL(a.href);
}

export function mergeTrainingAttachments(
  existing: CertificateAttachment[],
  added: CertificateAttachment[],
): CertificateAttachment[] {
  const merged = [...existing, ...added];
  return merged.slice(0, TRAINING_ATTACHMENT_MAX_FILES);
}
