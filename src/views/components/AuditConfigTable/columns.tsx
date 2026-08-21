import type { ProColumns } from '@ant-design/pro-components';
import I18N from '@src/lang/I18N';

import { AuditNodeDto } from './type';

export const columns = (): ProColumns<AuditNodeDto>[] => [
  {
    title: I18N.components.approvalProcess,
    dataIndex: 'nodeName',
  },
  {
    title: I18N.components.approvedBy,
    dataIndex: 'targetNames',
  },
];
