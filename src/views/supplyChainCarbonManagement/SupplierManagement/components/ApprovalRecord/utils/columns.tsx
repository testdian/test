/**
 * @default 审核记录
 */
import I18N from '@src/lang/I18N';
import type { ColumnsType } from 'antd/es/table';

import { COLOR, ColorTag } from '@/components/ColorTag';
import { SupplierAuditLogDto } from '@/sdks_v2/new/supplychainV2ApiDocs';

export const columns = (): ColumnsType<SupplierAuditLogDto> => [
  {
    title: I18N.eca.findingsOfAudit,
    dataIndex: 'approvalStatus',
    render: (value, record) => {
      const status = {
        0: COLOR.orange,
        1: COLOR.green,
        2: COLOR.red,
      } as {
        [key: number]: keyof typeof COLOR;
      };
      return (
        <ColorTag
          color={status[Number(value)]}
          text={record?.approvalStatus_name}
        />
      );
    },
  },
  {
    title: I18N.components.reviewer,
    dataIndex: 'auditByName',
  },
  {
    title: I18N.supplyChainCarbonManagement.contactInformation,
    dataIndex: 'auditByMobile',
  },
  {
    title: I18N.supplyChainCarbonManagement.reviewComments,
    dataIndex: 'auditComment',
  },
  {
    title: I18N.components.reviewTime,
    dataIndex: 'auditTime',
  },
];
