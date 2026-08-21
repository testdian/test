/*
 * @@description: 排放源审核详情页面
 */
import I18N from '@src/lang/I18N';
import { Tabs } from 'antd';
import { compact } from 'lodash-es';
import { useEffect, useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';

import { FormActions } from '@/components/FormActions';
import { EcaRouteMaps } from '@/router/utils/ecaEmums';
import { PageTypeInfo } from '@/router/utils/enums';
import ApproveInfo from '@/views/components/ApproveInfo';

import { TAB_OPTIONS, TAB_TYPE, AUDIT_STATUS_TYPE } from './constant';
import style from './index.module.less';
import EmissionData from '../../component/EmissionData/newIndex';
import {
  getAuditProcessList,
  getAuditRecordList,
} from '../../fillData/service';
import { AuditNode, AuditLog } from '../../fillData/type';
import { AuditModal } from '../PendReviewModal';
import {
  getAuditProcessListForCancel,
  getAuditRecordListForCancel,
} from '../service';

const { APPROVAL_CONTENT, APPROVAL_INFO } = TAB_TYPE;
const ApprovalManageInfo = () => {
  const navigator = useNavigate();

  const { pageTypeInfo, id, dataId, auditStatus } = useParams<{
    pageTypeInfo: PageTypeInfo;
    id: string;
    dataId: string;
    auditStatus: string;
  }>();

  /** 是否是已作废状态 */
  const isCancel = Number(auditStatus) === AUDIT_STATUS_TYPE.CANCEL;

  /** 审核Id */
  const approveId = Number(id || '');

  /** 审核数据 */
  const computationDataId = Number(dataId);

  const isDetail = pageTypeInfo === PageTypeInfo.show;

  /** 审核弹窗显隐 */
  const [open, setOpen] = useState(false);

  //  当前Tab
  const [currentTab, setCurrentTab] = useState<string>(APPROVAL_CONTENT);

  // 审批流程
  const [processTableData, setProcessTableData] = useState<AuditNode[]>();

  // 审批记录
  const [recordTableData, setRecordTableData] = useState<AuditLog[]>();
  const [dataStatus, setDataStatus] = useState<number>(0);

  useEffect(() => {
    if (computationDataId && !isCancel) {
      /** 流程 */
      getAuditProcessList({
        computationDataId,
      }).then(({ data }) => {
        setProcessTableData(data?.data);
      });
      /** 记录 */
      getAuditRecordList({
        computationDataId,
      }).then(({ data }) => {
        setRecordTableData(data?.data);
      });
      return;
    }
    if (approveId && isCancel) {
      /** 已作废状态-流程 */
      getAuditProcessListForCancel({
        auditDataId: approveId,
      }).then(({ data }) => {
        setProcessTableData(data?.data);
      });
      /** 已作废状态-记录 */
      getAuditRecordListForCancel({
        auditDataId: approveId,
      }).then(({ data }) => {
        setRecordTableData(data?.data);
      });
    }
  }, [computationDataId, approveId, isCancel]);

  return (
    <div className={style.wrapper}>
      <Tabs
        activeKey={currentTab}
        className='customTabs'
        items={TAB_OPTIONS}
        onChange={value => {
          setCurrentTab(value);
        }}
      />
      {currentTab === APPROVAL_CONTENT && (
        <EmissionData id={computationDataId} setDataStatus={setDataStatus} />
      )}
      {currentTab === APPROVAL_INFO && (
        <ApproveInfo<AuditNode, AuditLog>
          processDataSource={processTableData}
          recordDataSource={recordTableData}
        />
      )}
      <FormActions
        place='center'
        buttons={compact([
          !isDetail &&
            [4, 5].indexOf(dataStatus) >= 0 && {
              title: I18N.eca.auditing,
              type: 'primary',
              onClick: async () => {
                setOpen(true);
              },
            },
          {
            title: I18N.Factors.return,
            onClick: async () => {
              navigator(EcaRouteMaps.approvalManage);
            },
          },
        ])}
      />
      <AuditModal
        open={open}
        handleCancel={() => {
          setOpen(false);
        }}
        handleOk={() => {
          setOpen(false);
          navigator(EcaRouteMaps.approvalManage);
        }}
        id={approveId}
      />
    </div>
  );
};

export default ApprovalManageInfo;
