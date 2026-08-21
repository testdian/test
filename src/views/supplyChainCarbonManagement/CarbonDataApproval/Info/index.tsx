/**
 * @description: 供应链碳管理-碳数据审核-详情
 */
import I18N from '@src/lang/I18N';
import { compact } from 'lodash-es';
import { useEffect, useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';

import { FormActions } from '@/components/FormActions';
import { checkAuth } from '@/layout/utills';
import { PageTypeInfo } from '@/router/utils/enums';
import { SccmRouteMaps } from '@/router/utils/sccmEnums';
import {
  AuditDto,
  getSupplychainApplyId,
  postSupplychainAuditAudit,
} from '@/sdks_v2/new/supplychainV2ApiDocs';
import { Toast } from '@/utils';

import { APPLY_STATUS } from '../../CarbonDataFill/constant';
import style from '../../SupplierManagement/Info/index.module.less';
import { ApproveModal } from '../../components/ApproveModal';
import CarbonDataInfo from '../../components/CarbonDataInfo';
import { AuditListType } from '../../utils/type';
import { getAuditProcessList, getAuditRecordList } from '../service';
import { AuditLog, AuditNode } from '../type';

const { TO_BE_REVIEWED } = APPLY_STATUS;

function CarbonDataApproval() {
  const navigate = useNavigate();

  const { pageTypeInfo, id, dataId, dataType } = useParams<{
    pageTypeInfo: PageTypeInfo;
    id: string;
    dataId: string;
    dataType: string;
  }>();

  /** 申请id */
  const applyInfoId = Number(dataId);

  /** 审核id */
  const auditDataId = Number(id);

  /** 是否为详情页面 */
  const isDetail = pageTypeInfo === PageTypeInfo.show;

  /** 是否为审核页面 */
  const isApprove = dataType === 'approve';

  /** 是否是待审批 */
  const [isToBeReviewed, setIsToBeReviewed] = useState(false);

  /** 控制审核弹窗的显隐 */
  const [open, setOpen] = useState(false);

  /** 审核记录列表 */
  const [approvalRecord, setApprovalRecord] = useState<AuditLog[]>();

  /** 审核列表列表 */
  const [approvalProcess, setApprovalProcess] = useState<AuditNode[]>();

  /** 审批记录 */
  useEffect(() => {
    if (applyInfoId) {
      getAuditRecordList({
        applyInfoId,
      }).then(({ data }) => {
        setApprovalRecord(data.data);
      });
    }
  }, [auditDataId, applyInfoId]);

  /** 审批流程 */
  useEffect(() => {
    if (applyInfoId) {
      getAuditProcessList({
        applyInfoId,
      }).then(({ data }) => {
        setApprovalProcess(data.data);
      });
    }
  }, [auditDataId, applyInfoId]);

  /** 获取碳数据概览和数据要求的详情 */
  useEffect(() => {
    if (dataId) {
      getSupplychainApplyId({
        id: Number(dataId),
      }).then(({ data }) => {
        const cathRecord = data?.data;
        setIsToBeReviewed(Number(cathRecord?.applyStatus) === TO_BE_REVIEWED);
      });
    }
  }, [dataId]);

  return (
    <div className={style.supplyManagementInfoWrapper}>
      <CarbonDataInfo
        id={dataId}
        disabled={isDetail || isApprove}
        approvalRecord={approvalRecord}
        approvalProcess={approvalProcess}
      />
      <FormActions
        place='center'
        buttons={compact([
          !isDetail &&
            isToBeReviewed &&
            checkAuth('/supplyChain/carbonDataApproval/approve', {
              title: I18N.router.approval,
              type: 'primary',
              onClick: async () => {
                setOpen(true);
              },
            }),
          {
            title: I18N.Factors.return,
            onClick: async () => {
              navigate(SccmRouteMaps.sccmApproval);
            },
          },
        ])}
      />
      <ApproveModal
        open={open}
        handleCancel={() => {
          setOpen(false);
        }}
        handleOk={(value: AuditListType) => {
          postSupplychainAuditAudit({
            req: {
              ...value,
              auditDataId: Number(id),
            } as AuditDto,
          }).then(({ data }) => {
            if (data.code === 200) {
              setOpen(false);
              Toast(
                'success',
                I18N.supplyChainCarbonManagement.approvalSuccessful,
              );
              navigate(SccmRouteMaps.sccmApproval);
            }
          });
        }}
      />
    </div>
  );
}
export default CarbonDataApproval;
