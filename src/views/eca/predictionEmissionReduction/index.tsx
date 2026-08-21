/**
 * 预测与减排
 * 三个 Tab：目标 / BAU / 减排措施
 *
 * 基准年和组织范围是三个 Tab 共用的筛选条件，统一提升到 Tab 上方管理。
 * 组织切换时各 Tab 重新请求；基准年仅在保存成功后通过 refreshKey 刷新数据。
 */
import I18N from '@src/lang/I18N';
import { Select, Tabs, message } from 'antd';
import React, { useCallback, useEffect, useRef, useState } from 'react';

import { checkAuth } from '@/layout/utills';
import { CarbonReductionPerms } from '@/router/utils/carbonReductionEnum';
import { getYear } from '@/utils';

import Bau from './components/BAU';
import Measures from './components/Measures';
import Target from './components/Target';
import style from './index.module.less';
import {
  getReductionPlanOrgListApi,
  postReductionPlanStandardYearEditApi,
} from './service';
import type { OrgWithStandardYearResp } from './type';

const PRED_TYPE = {
  /** 目标 */
  TARGET: '1',
  /** BAU */
  BAU: '2',
  /** 减排措施 */
  MEASURES: '3',
};

const { TARGET, BAU, MEASURES } = PRED_TYPE;

const items = [
  { label: '目标', key: TARGET },
  { label: 'BAU', key: BAU },
  { label: '减排措施', key: MEASURES },
];

/** 基准年下拉选项 */
const yearOptions = getYear().map(y => ({ label: `${y}`, value: y }));

function orgListToSelectOptions(list: OrgWithStandardYearResp[]) {
  return list.reduce<{ label: string; value: string }[]>((acc, item) => {
    const value = item.orgCode?.trim();
    if (!value) return acc;
    acc.push({ label: item.orgName ?? value, value });
    return acc;
  }, []);
}

const PredictionEmissionReduction: React.FC = () => {
  const [activeKey, setActiveKey] = useState(TARGET);

  /**
   * 基准年下拉展示值（编辑态可改，改选不触发子 Tab 请求）
   * 默认 2024；切换组织时（非编辑态）用 orgList 返回的 standardYear 同步
   */
  const [baseYear, setBaseYear] = useState<number>(2024);

  /** 已生效的基准年，传给各 Tab 用于接口与展示，仅在保存成功或切换组织时更新 */
  const [committedBaseYear, setCommittedBaseYear] = useState<number>(2024);

  /**
   * 组织范围 orgCode（全局共用）
   * 三个 Tab 内部数据均依赖此值进行接口请求
   */
  const [orgCode, setOrgCode] = useState<string>();

  const [orgOptions, setOrgOptions] = useState<
    { label: string; value: string }[]
  >([]);
  const [orgRawList, setOrgRawList] = useState<OrgWithStandardYearResp[]>([]);
  const [orgListLoading, setOrgListLoading] = useState(false);

  /** 阅读态不可改基准年；编辑态可改，保存/取消退出编辑 */
  const [isEditingBaseYear, setIsEditingBaseYear] = useState(false);
  const [baseYearSnapshot, setBaseYearSnapshot] = useState<number | null>(null);
  const [savingStandardYear, setSavingStandardYear] = useState(false);

  /** 基准年保存成功后递增，通知各 Tab 重新拉取数据（切换 Tab 不递增） */
  const [pageRefreshKey, setPageRefreshKey] = useState(0);

  const prevOrgCodeRef = useRef<string | undefined>(undefined);

  const loadOrgList = useCallback(async () => {
    const { data: res } = await getReductionPlanOrgListApi();
    const list = res.data ?? [];
    setOrgRawList(list);
    setOrgOptions(orgListToSelectOptions(list));
    return list;
  }, []);

  useEffect(() => {
    let cancelled = false;
    (async () => {
      setOrgListLoading(true);
      try {
        await loadOrgList();
      } finally {
        if (!cancelled) setOrgListLoading(false);
      }
    })();
    return () => {
      cancelled = true;
    };
  }, [loadOrgList]);

  /** 组织列表加载完成后，默认选中第一项 */
  useEffect(() => {
    if (orgOptions.length && !orgCode) {
      setOrgCode(orgOptions[0].value);
    }
  }, [orgOptions, orgCode]);

  /** 切换组织（非编辑态）时，用接口返回的该组织基准年刷新展示 */
  useEffect(() => {
    if (!orgCode || !orgRawList.length || isEditingBaseYear) return;
    if (prevOrgCodeRef.current === orgCode) return;
    prevOrgCodeRef.current = orgCode;
    const row = orgRawList.find(o => o.orgCode?.trim() === orgCode);
    if (row?.standardYear != null) {
      setBaseYear(row.standardYear);
      setCommittedBaseYear(row.standardYear);
    }
  }, [orgCode, orgRawList, isEditingBaseYear]);

  const handleOrgChange = (code: string) => {
    prevOrgCodeRef.current = code;
    setOrgCode(code);
    const row = orgRawList.find(o => o.orgCode?.trim() === code);
    if (row?.standardYear != null) {
      setBaseYear(row.standardYear);
      setCommittedBaseYear(row.standardYear);
    }
    // 基准年编辑针对当前组织，切换组织后退出编辑并展示新组织的基准年
    setBaseYearSnapshot(null);
    setIsEditingBaseYear(false);
  };

  const handleStartEditBaseYear = () => {
    setBaseYearSnapshot(baseYear);
    setIsEditingBaseYear(true);
  };

  const handleCancelEditBaseYear = () => {
    if (baseYearSnapshot != null) {
      setBaseYear(baseYearSnapshot);
    }
    setBaseYearSnapshot(null);
    setIsEditingBaseYear(false);
  };

  const handleSaveStandardYear = async () => {
    if (!orgCode) {
      message.warning(I18N.utils.pleaseSelect);
      return;
    }
    setSavingStandardYear(true);
    try {
      await postReductionPlanStandardYearEditApi({
        orgCode,
        standardYear: baseYear,
      });
      message.success(I18N.Factors.saveSuccessful);
      setBaseYearSnapshot(null);
      setIsEditingBaseYear(false);

      const list = await loadOrgList();
      const row = list.find(o => o.orgCode?.trim() === orgCode);
      if (row?.standardYear != null) {
        setBaseYear(row.standardYear);
        setCommittedBaseYear(row.standardYear);
      }
      setPageRefreshKey(k => k + 1);
    } catch {
      // 失败提示由 request 拦截器统一处理
    } finally {
      setSavingStandardYear(false);
    }
  };

  return (
    <div>
      <h3>碳减排管理</h3>
      {/* ── 全局筛选区：基准年 + 组织范围，位于 Tab 上方，三个 Tab 共用 ── */}
      <div className={style.globalFilter}>
        <span className={style.filterLabel}>{I18N.eca.baseYear2}</span>
        <Select
          value={baseYear}
          onChange={setBaseYear}
          options={yearOptions}
          variant='borderless'
          style={{ minWidth: 100 }}
          disabled={!isEditingBaseYear}
        />
        <span className={style.filterActions}>
          {!isEditingBaseYear ? (
            checkAuth(
              CarbonReductionPerms.baseYearEdit,
              <button
                type='button'
                className={`${style.btn} ${style.btnPrimary} ${style.btnSm}`}
                onClick={handleStartEditBaseYear}
              >
                {I18N.eca.reductionPlanEditStandardYear}
              </button>,
            )
          ) : (
            <>
              <button
                type='button'
                className={`${style.btn} ${style.btnDefault} ${style.btnSm}`}
                disabled={savingStandardYear}
                onClick={handleCancelEditBaseYear}
              >
                {I18N.eca.reductionPlanCancelStandardYearEdit}
              </button>
              <button
                type='button'
                className={`${style.btn} ${style.btnPrimary} ${style.btnSm}`}
                disabled={savingStandardYear}
                onClick={handleSaveStandardYear}
              >
                {I18N.utils.save}
              </button>
            </>
          )}
        </span>
        <Select
          className={style.orgSelect}
          style={{ minWidth: 120 }}
          value={orgCode}
          onChange={handleOrgChange}
          options={orgOptions}
          loading={orgListLoading}
          placeholder={I18N.eca.organizationalScope}
          showSearch
          optionFilterProp='label'
        />
      </div>

      <div className={style.tabWrapper}>
        <Tabs
          activeKey={activeKey}
          items={items}
          className={style.tabs}
          onChange={key => setActiveKey(key)}
        />
      </div>

      {/* 仅挂载当前 Tab：初始只请求当前页数据，切换 Tab 时卸载再挂载并重新请求 */}
      {activeKey === TARGET && (
        <Target
          baseYear={committedBaseYear}
          orgCode={orgCode}
          refreshKey={pageRefreshKey}
        />
      )}
      {activeKey === BAU && (
        <Bau
          baseYear={committedBaseYear}
          orgCode={orgCode}
          refreshKey={pageRefreshKey}
        />
      )}
      {activeKey === MEASURES && (
        <Measures orgCode={orgCode} refreshKey={pageRefreshKey} />
      )}
    </div>
  );
};

export default PredictionEmissionReduction;
