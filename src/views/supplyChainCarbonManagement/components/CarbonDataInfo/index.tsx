/**
 * @description: 核算数据的详情（供应商核算数据和供应商数据审核的详情）
 */
import { Tabs } from 'antd';
import { useEffect, useState } from 'react';

import { getSupplychainApplyId } from '@/sdks_v2/new/supplychainV2ApiDocs';

import { DATA_APPROVAL_TABS, DATA_APPROVAL_TABS_ITEMS } from './constant';
import { AuditLog, AuditNode } from '../../CarbonDataApproval/type';
import { ALL_CYCLE } from '../../utils/constant';
import { TypeApplyInfoResp } from '../../utils/type';
import ApproveInfo from '../ApproveInfo';
import CarbonDataOverview from '../CarbonDataOverview';
import CarbonDataRequire from '../CarbonDataRequire';
import CarbonFootPrintInfo from '../CarbonFootPrintInfo';

const { DATA_OVERVIEW, DATA_REQUIRE, DATA_FILL, APPROVAL_RECORD } =
  DATA_APPROVAL_TABS;

function CarbonDataInfo({
  /** 申请id */
  id,
  /** 表单数据禁用 */
  disabled,
  /** 审核记录数据 */
  approvalRecord,
  /** 审批流程数据 */
  approvalProcess,
}: {
  /** 表单是否可以编辑 */
  disabled?: boolean;
  /** 数据id */
  id?: string;
  /** 审核记录列表 */
  approvalRecord?: AuditLog[];
  /** 审批流程列表 */
  approvalProcess?: AuditNode[];
}) {
  /** 当前切换的顶部Tab栏 */
  const [currentTab, setCurrentTab] = useState<string>(DATA_OVERVIEW);

  /** 供应商碳数据概览和数据要求的详情 */
  const [cathRecord, setCathRecord] = useState<TypeApplyInfoResp>();

  /** 获取数据请求类型 1: 核算结果 2: 核算过程 */
  const [applyType, setApplyType] = useState<number>();

  /** 是否是全生命周期 */
  const isAllCycle = Number(cathRecord?.systemBoundaryType) === ALL_CYCLE;

  /** 获取碳数据概览和数据要求的详情 */
  useEffect(() => {
    if (id) {
      getSupplychainApplyId({
        id: Number(id),
      }).then(({ data }) => {
        if (data.code === 200) {
          const result = data?.data;
          const { productUnit } = result || {};
          /** 核算单位相关处理 */
          const productUnitArr = productUnit ? productUnit?.split(',') : [];
          setCathRecord({
            ...result,
            productUnit: productUnitArr,
          });
          setApplyType(Number(data?.data?.applyType));
        }
      });
    }
  }, [id]);

  return (
    <div>
      <Tabs
        defaultActiveKey={DATA_OVERVIEW}
        items={DATA_APPROVAL_TABS_ITEMS}
        onChange={value => {
          setCurrentTab(value);
        }}
      />
      {/* 数据概览 */}
      {currentTab === DATA_OVERVIEW && (
        <CarbonDataOverview cathRecord={cathRecord} />
      )}

      {/* 数据要求 */}
      {currentTab === DATA_REQUIRE && (
        <CarbonDataRequire cathRecord={cathRecord} />
      )}

      {/* 填报数据 */}
      {currentTab === DATA_FILL && (
        <CarbonFootPrintInfo
          id={id}
          disabled={disabled}
          applyType={applyType}
          isAllCycle={isAllCycle}
        />
      )}

      {/* 审批记录 */}
      {currentTab === APPROVAL_RECORD && (
        <ApproveInfo
          approvalRecord={approvalRecord}
          approvalProcess={approvalProcess}
        />
      )}
    </div>
  );
}
export default CarbonDataInfo;
