import I18N from '@src/lang/I18N';
import type { ColumnsType } from 'antd/es/table';

import { COLOR, ColorTag } from '@/components/ColorTag';
import {
  AuditLog,
  AuditNode,
} from '@/views/supplyChainCarbonManagement/CarbonDataApproval/type';

/** 审批流程 */
export const processColumns = (): ColumnsType<AuditNode> => [
  {
    title: I18N.supplyChainCarbonManagement.approvalStage,
    dataIndex: 'nodeName',
  },
  {
    title: I18N.dashborad.approvalConfiguration,
    dataIndex: 'targetNames',
  },
  {
    title: I18N.supplyChainCarbonManagement.approvalStatus,
    dataIndex: 'auditStatus',
    render: (value, record) => {
      const status = {
        0: COLOR.orange,
        1: COLOR.green,
        2: COLOR.red,
        3: COLOR.yellow,
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
];

/** 审批记录 */
export const recordColumns = (): ColumnsType<AuditLog> => [
  {
    title: I18N.supplyChainCarbonManagement.approvalResults,
    dataIndex: 'auditStatus',
    render: (value, record) => {
      const status = {
        0: COLOR.orange,
        1: COLOR.green,
        2: COLOR.red,
        3: COLOR.yellow,
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
    title: I18N.components.approvedBy,
    dataIndex: 'auditByName',
  },
  {
    title: I18N.eca.approvalTime,
    dataIndex: 'auditTime',
  },
  {
    title: I18N.supplyChainCarbonManagement.approvalRemarks,
    dataIndex: 'auditComment',
  },
];
