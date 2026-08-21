/*
 * @@description:
 * @Author: qifeng qifeng@carbonstop.net
 * @Date: 2023-02-22 10:47:55
 * @LastEditors: qifeng qifeng@carbonstop.net
 * @LastEditTime: 2023-02-22 10:55:00
 */
/** 文件状态。0 生成中 1 已生成 -1 生成失败,可用值:-1,0,1 */
import I18N from '@src/lang/I18N';

export const FileStatus = {
  0: I18N.dashborad.generating,
  1: I18N.dashborad.generated,
  '-1': I18N.dashborad.generationFailed,
};
export const FileStatusTagColor = {
  0: 'blue',
  1: 'green',
  '-1': 'red',
};
