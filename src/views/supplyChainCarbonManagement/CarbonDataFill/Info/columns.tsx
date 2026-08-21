import I18N from '@src/lang/I18N';
import type { ColumnsType } from 'antd/es/table';

import { COLOR, ColorTag } from '@/components/ColorTag';
import { AuditLog } from '@/sdks_v2/new/supplychainV2ApiDocs';

export const columns = (): ColumnsType<AuditLog> => [
  {
    title: I18N.supplyChainCarbonManagement.feedbackResults,
    dataIndex: 'auditStatus',
    render: (value, record) => {
      const status = {
        0: COLOR.orange,
        1: COLOR.green,
        2: COLOR.red,
        3: COLOR.grey,
      } as {
        [key: number]: keyof typeof COLOR;
      };
      return (
        <ColorTag
          color={status[Number(value)]}
          text={record?.auditStatus_name}
        />
      );
    },
  },
  {
    title: I18N.supplyChainCarbonManagement.feedbackPerson,
    dataIndex: 'auditByName',
  },
  {
    title: I18N.supplyChainCarbonManagement.contactInformation,
    dataIndex: 'auditByMobile',
  },
  {
    title: I18N.supplyChainCarbonManagement.feedback,
    dataIndex: 'auditComment',
  },
  {
    title: I18N.supplyChainCarbonManagement.feedbackTime,
    dataIndex: 'auditTime',
  },
];
