/*
 * @@description:
 * @Author: liuxinxin xinxin@carbonstop.net
 * @Date: 2023-06-15 17:54:04
 * @LastEditors: liuxinxin xinxin@carbonstop.net
 * @LastEditTime: 2023-06-15 17:54:20
 */

/** 文件上传后缀匹配的icon */
export const getSuffix = (suffix: string) => {
  if (['png', 'PNG', 'jpg', 'JPG', 'JPEG', 'jpeg'].includes(suffix)) {
    return 'icon-icon-tupian';
  }
  if (['pdf', 'PDF'].includes(suffix)) {
    return 'icon-a-icon-PDF';
  }
  if (['doc', 'DOC', 'docx', 'DOCX'].includes(suffix)) {
    return 'icon-icon-Word';
  }
  if (['xlsx', 'XLSX', 'XLS', 'xls'].includes(suffix)) {
    return 'icon-icon-Excel';
  }
  if (['rar', 'RAR'].includes(suffix)) {
    return 'icon-icon-rar';
  }
  if (['zip', 'ZIP'].includes(suffix)) {
    return 'icon-icon-ZIP';
  }
  return 'icon-a-icon-PDF';
};
