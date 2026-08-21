import type { FormField } from './demo-data';
import { fieldTypeLabel } from './demo-data';

function escapeHtml(value: string) {
  return value
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;');
}

function sanitizeFileName(name: string) {
  return name.replace(/[\\/:*?"<>|]/g, '_').trim() || '供应商';
}

export function downloadSupplierQuestionnaireExcel({
  taskName,
  supplierName,
  organization,
  deadline,
  submittedAt,
  fields,
  answers,
}: {
  taskName: string;
  supplierName: string;
  organization: string | null;
  deadline: string | null;
  submittedAt: string | null;
  fields: FormField[];
  answers: Record<string, string | number>;
}) {
  const metaRows = [
    ['任务名称', taskName],
    ['供应商', supplierName],
    ['所属组织', organization || '-'],
    ['截止日期', deadline || '-'],
    ['提交时间', submittedAt || '-'],
  ]
    .map(
      ([label, value]) =>
        `<tr><td>${escapeHtml(label)}</td><td>${escapeHtml(value)}</td></tr>`,
    )
    .join('');

  const fieldRows = fields
    .map(field => {
      const raw = answers[field.code];
      const value = raw === undefined || raw === '' ? '-' : String(raw);
      return `<tr>
        <td>${escapeHtml(field.name)}</td>
        <td>${escapeHtml(field.code)}</td>
        <td>${escapeHtml(fieldTypeLabel(field.type))}</td>
        <td>${escapeHtml(field.unit || '-')}</td>
        <td>${field.required ? '是' : '否'}</td>
        <td>${escapeHtml(value)}</td>
      </tr>`;
    })
    .join('');

  const html = `
    <html xmlns:o="urn:schemas-microsoft-com:office:office" xmlns:x="urn:schemas-microsoft-com:office:excel">
      <head><meta charset="utf-8" /></head>
      <body>
        <table border="1" cellspacing="0" cellpadding="4">
          ${metaRows}
        </table>
        <br />
        <table border="1" cellspacing="0" cellpadding="4">
          <tr>
            <th>字段名称</th>
            <th>字段ID</th>
            <th>类型</th>
            <th>单位</th>
            <th>必填</th>
            <th>填报内容</th>
          </tr>
          ${fieldRows}
        </table>
      </body>
    </html>
  `;

  const blob = new Blob([`\ufeff${html}`], {
    type: 'application/vnd.ms-excel;charset=utf-8',
  });
  const a = document.createElement('a');
  a.href = URL.createObjectURL(blob);
  a.download = `${sanitizeFileName(supplierName)}_${sanitizeFileName(
    taskName,
  )}_问卷回复.xls`;
  a.click();
  URL.revokeObjectURL(a.href);
}

export async function downloadAllSupplierQuestionnaireExcels(
  items: Array<Parameters<typeof downloadSupplierQuestionnaireExcel>[0]>,
) {
  await items.reduce<Promise<void>>((chain, item, index) => {
    return chain.then(async () => {
      downloadSupplierQuestionnaireExcel(item);
      if (index < items.length - 1) {
        await new Promise<void>(resolve => {
          setTimeout(resolve, 300);
        });
      }
    });
  }, Promise.resolve());
}
