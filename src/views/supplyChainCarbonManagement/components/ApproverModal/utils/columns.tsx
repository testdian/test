/*
 * @@description:
 * @Author: liuxinxin xinxin@carbonstop.net
 * @Date: 2023-02-28 16:59:23
 * @LastEditors: liuxinxin xinxin@carbonstop.net
 * @LastEditTime: 2023-06-09 16:11:55
 */

import I18N from '@src/lang/I18N';
import { TableRenderProps } from 'table-render/dist/src/types';

import { ImportLog } from '@/sdks_v2/new/systemV2ApiDocs';

export const columns = (): TableRenderProps<ImportLog>['columns'] => [
  {
    title: I18N.dashborad.name,
    dataIndex: 'realName',
  },
  {
    title: I18N.carbonData.affiliatedOrganization,
    dataIndex: 'orgName',
  },
];
