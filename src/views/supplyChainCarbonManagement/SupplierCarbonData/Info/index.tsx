/**
 * @description: 供应链碳管理-供应商碳数据-详情
 */
import I18N from '@src/lang/I18N';
import { compact } from 'lodash-es';
import { useEffect, useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';

import { FormActions } from '@/components/FormActions';
import { PageTypeInfo } from '@/router/utils/enums';
import { SccmRouteMaps } from '@/router/utils/sccmEnums';

import {
  getAuditProcessList,
  getAuditRecordList,
} from '../../CarbonDataApproval/service';
import { AuditLog, AuditNode } from '../../CarbonDataApproval/type';
import style from '../../SupplierManagement/Info/index.module.less';
import CarbonDataInfo from '../../components/CarbonDataInfo';

function SupplierCarbonDataInfo() {
  const navigate = useNavigate();

  const { id } = useParams<{
    pageTypeInfo: PageTypeInfo;
    id: string;
  }>();

  /** 审核记录列表 */
  const [approvalRecord, setApprovalRecord] = useState<AuditLog[]>();

  /** 审核列表列表 */
  const [approvalProcess, setApprovalProcess] = useState<AuditNode[]>();

  /** 审批流程列表 */
  useEffect(() => {
    if (id) {
      /** 流程列表 */
      getAuditProcessList({ applyInfoId: Number(id) }).then(({ data }) => {
        if (data.code === 200) {
          setApprovalProcess(data.data);
        }
      });
      /** 记录列表 */
      getAuditRecordList({ applyInfoId: Number(id) }).then(({ data }) => {
        if (data.code === 200) {
          setApprovalRecord(data.data);
        }
      });
    }
  }, [id]);

  return (
    <div className={style.supplyManagementInfoWrapper}>
      <CarbonDataInfo
        id={id}
        disabled
        approvalRecord={approvalRecord}
        approvalProcess={approvalProcess}
      />
      <FormActions
        place='center'
        buttons={compact([
          {
            title: I18N.Factors.return,
            onClick: async () => {
              navigate(SccmRouteMaps.sccmCarbonData);
            },
          },
        ])}
      />
    </div>
  );
}
export default SupplierCarbonDataInfo;
