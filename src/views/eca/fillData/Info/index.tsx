/*
 * @@description: 排放源填报详情页面
 */
import { Tabs } from 'antd';
import { compact } from 'lodash-es';
import { useEffect, useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';

import { FormActions } from '@/components/FormActions';
import I18N from '@/lang/I18N';
import { EcaRouteMaps } from '@/router/utils/ecaEmums';
import { PageTypeInfo } from '@/router/utils/enums';
import ApproveInfo from '@/views/components/ApproveInfo';

import { TAB_OPTIONS, TAB_TYPE } from './constant';
import style from './index.module.less';
// import EmissionSourceList from '../../carbonMissionAccounting/component/EmissionSourceList';
import EmissionData from '../../component/EmissionData/newIndex';
import { getAuditProcessList, getAuditRecordList } from '../service';
import { AuditNode, AuditLog } from '../type';

const { EMISSION_DATA, APPROVAL_INFO } = TAB_TYPE;
const FillData = () => {
  const { pageTypeInfo, approvalId, id } = useParams<{
    pageTypeInfo: PageTypeInfo;
    id: string;
    approvalId: string;
  }>();

  const computationDataId = Number(approvalId);

  const isDetail = pageTypeInfo === PageTypeInfo.show;

  //  当前Tab
  const [currentTab, setCurrentTab] = useState<string>(EMISSION_DATA);

  // 审批流程
  const [processTableData, setProcessTableData] = useState<AuditNode[]>();

  // 审批记录
  const [recordTableData, setRecordTableData] = useState<AuditLog[]>();

  useEffect(() => {
    if (Number(approvalId)) {
      /** 流程 */
      getAuditProcessList({
        computationDataId: Number(approvalId),
      }).then(({ data }) => {
        setProcessTableData(data?.data);
      });
      /** 记录 */
      getAuditRecordList({
        computationDataId: Number(approvalId),
      }).then(({ data }) => {
        setRecordTableData(data?.data);
      });
    }
  }, [approvalId]);
  const navigate = useNavigate();

  return (
    <div className={style.wrapper}>
      {isDetail && (
        <Tabs
          activeKey={currentTab}
          className='customTabs'
          items={TAB_OPTIONS}
          onChange={value => {
            setCurrentTab(value);
          }}
        />
      )}
      {currentTab === EMISSION_DATA && (
        <EmissionData id={computationDataId} computionId={Number(id)} />
      )}
      {currentTab === APPROVAL_INFO && (
        <ApproveInfo<AuditNode, AuditLog>
          processDataSource={processTableData}
          recordDataSource={recordTableData}
        />
      )}
      {currentTab === APPROVAL_INFO && (
        <FormActions
          place='center'
          buttons={compact([
            {
              title: I18N.Factors.cancel,
              onClick: async () => {
                await navigate(EcaRouteMaps.fillData);
              },
            },
          ])}
        />
      )}
    </div>
  );
};

export default FillData;
