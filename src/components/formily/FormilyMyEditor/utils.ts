/** 富文本转义 */
export const htmlToContent = (str: string) => {
  return str
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/&/g, '&amp;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&#39;');
};
export const decodeHTML = (html: any) => {
  const txt = document.createElement('textarea');
  txt.innerHTML = html;
  return txt.value;
};
