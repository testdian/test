import I18N from '@src/lang/I18N';
import { InputNumber, message, Select } from 'antd';
import React, {
  useCallback,
  useEffect,
  useMemo,
  useRef,
  useState,
} from 'react';

import { useDrawer } from '@/hooks/useDrawer';
import usePageType from '@/hooks/usePageType';
import { checkAuth } from '@/layout/utills';
import { CarbonReductionPerms } from '@/router/utils/carbonReductionEnum';
import { PageTypeInfo } from '@/router/utils/enums';
import { Toast } from '@/utils';

// 阶段指标信息区暂下线：恢复下方 StageMetricsInfo 区块时取消注释
// import { StageMetricsInfo } from './StageMetricsInfo';
import TargetInfoDrawer from './TargetInfoDrawer';
import style from './index.module.less';
import {
  getComputationReductionPlanBaseEmissionApi,
  getComputationReductionPlanTargetLineChartApi,
  getComputationReductionPlanTargetStageDetailListApi,
  getComputationReductionPlanTargetStageListApi,
  postComputationReductionPlanTargetStageDetailEditApi,
  postComputationReductionPlanTargetStageEditApi,
  // postComputationReductionPlanTargetStageDeleteApi, // 仅 StageMetricsInfo 删除用，随该区块暂下线
} from './service';
import {
  BaseEmissionData,
  ReductionTargetLineChartResp,
  ReductionTargetStage,
  ReductionTargetStageDetail,
  ReductionTargetStageDetailEditReq,
  ReductionTargetStageEditReq,
  StageTargetValueListResp,
} from './type';
import {
  buildReductionTargetLineChartPlotData,
  CHART_BLUE,
  CHART_GREEN,
  FlexibleLineChart,
  normalizeReductionTargetLineChartPayload,
} from '../DataOverview/chart';
import ScopeThreeModal from '../ScopeThreeModal';
import { getComputationEnumsGhgClassifyApi } from '../ScopeThreeModal/service';

type GoalScope = '12' | '3';

type StageSlotDraft = {
  targetYear: number | null;
  reductionRatio: number | null;
};

type DetailCellDraft = {
  reductionRatio: number | null;
  carbonEmission: number | null;
};

function detailDraftsFromList(
  list: ReductionTargetStageDetail[],
): Record<number, DetailCellDraft> {
  const next: Record<number, DetailCellDraft> = {};
  list.forEach(r => {
    if (r.id != null) {
      next[r.id] = {
        reductionRatio: r.reductionRatio ?? null,
        carbonEmission: r.carbonEmission ?? null,
      };
    }
  });
  return next;
}

function numDetailEq(
  a: number | null | undefined,
  b: number | null | undefined,
): boolean {
  if (a == null && b == null) {
    return true;
  }
  if (a == null || b == null) {
    return false;
  }
  return Math.abs(a - b) < 1e-9;
}

const YEAR_CAP = 2099;

function buildStageTargetYearOptions(
  slotIndex: 0 | 1,
  baseYear: number,
  stageDraftSlots: [StageSlotDraft | null, StageSlotDraft | null],
  sortedStages: ReductionTargetStage[],
): { label: string; value: number }[] {
  let from: number;
  if (slotIndex === 0) {
    from = baseYear + 1;
  } else {
    const y1 = stageDraftSlots[0]?.targetYear ?? sortedStages[0]?.targetYear;
    if (y1 == null) {
      return [];
    }
    from = Math.max(baseYear, y1) + 1;
  }
  if (from > YEAR_CAP) {
    return [];
  }
  const out: { label: string; value: number }[] = [];
  for (let y = from; y <= YEAR_CAP; y += 1) {
    out.push({ label: String(y), value: y });
  }
  return out;
}

/** Target Tab 所需的外部 props（基准年和组织范围由父组件统一管理） */
interface TargetProps {
  /** 已保存的基准年，由父组件传入；编辑下拉改年不会更新此值，保存后刷新 */
  baseYear: number;
  /** 组织范围 orgCode，由父组件传入，变化时重新请求数据 */
  orgCode: string | undefined;
  /** 父组件保存基准年后递增，触发全量刷新 */
  refreshKey?: number;
}

const Target: React.FC<TargetProps> = ({
  baseYear,
  orgCode,
  refreshKey = 0,
}) => {
  const [goalScope, setGoalScope] = useState<GoalScope>('12');

  const [lineChartData, setLineChartData] =
    useState<ReductionTargetLineChartResp>({ stage1List: [], stage2List: [] });
  const [baseEmissionData, setBaseEmissionData] = useState<BaseEmissionData>();
  const [stageData, setStageData] = useState<ReductionTargetStage[]>([]);
  const [stageDetailList, setStageDetailList] = useState<
    ReductionTargetStageDetail[]
  >([]);
  const [detailRowDrafts, setDetailRowDrafts] = useState<
    Record<number, DetailCellDraft>
  >({});
  const detailDraftsRef = useRef<Record<number, DetailCellDraft>>({});
  const [goalSectionEditing, setGoalSectionEditing] = useState(false);
  const [stageDraftSlots, setStageDraftSlots] = useState<
    [StageSlotDraft | null, StageSlotDraft | null]
  >([null, null]);

  const drawer = useDrawer();
  const { visible, showDrawer, onClose } = drawer;
  const pageTypeState = usePageType(PageTypeInfo.edit);
  const { pageType, setModelAction } = pageTypeState;
  const [stageRecord, setStageRecord] = useState<
    StageTargetValueListResp | undefined
  >();

  const [categoryData, setCategoryData] = useState<
    { name: string; code: number }[]
  >([]);

  const sortedStages = useMemo((): ReductionTargetStage[] => {
    const list: ReductionTargetStage[] = stageData.slice();
    list.sort((a, b) => (a.targetYear || 0) - (b.targetYear || 0));
    return list;
  }, [stageData]);

  const sortedStageDetails = useMemo((): ReductionTargetStageDetail[] => {
    return [...stageDetailList].sort((a, b) => {
      const dy = (a.year ?? 0) - (b.year ?? 0);
      if (dy !== 0) {
        return dy;
      }
      return (a.stageNo ?? 0) - (b.stageNo ?? 0);
    });
  }, [stageDetailList]);

  const firstDetailYear = sortedStageDetails[0]?.year;

  const chartPlotData = useMemo(
    () => buildReductionTargetLineChartPlotData(lineChartData),
    [lineChartData],
  );

  useEffect(() => {
    detailDraftsRef.current = detailRowDrafts;
  }, [detailRowDrafts]);

  const scopeData = [
    {
      title: I18N.eca.scopeOne,
      value: baseEmissionData?.scope1Value || 0,
    },
    {
      title: I18N.eca.scope2,
      value: baseEmissionData?.scope2Value || 0,
    },
    {
      title: I18N.eca.fanWeisan,
      value: baseEmissionData?.scope3Value || 0,
      category: baseEmissionData?.scope3ClassifyValueList?.length,
    },
  ];

  const getStageData = useCallback(async () => {
    if (!orgCode) {
      setStageData([]);
      return;
    }
    const scopeType: 1 | 3 = goalScope === '12' ? 1 : 3;
    const { data } = await getComputationReductionPlanTargetStageListApi({
      orgCode,
      scopeType,
    });
    setStageData((data?.data ?? []) as ReductionTargetStage[]);
  }, [orgCode, goalScope]);

  const getStageDetailList = useCallback(async () => {
    if (!orgCode) {
      setStageDetailList([]);
      setDetailRowDrafts({});
      return;
    }
    const scopeType: 1 | 3 = goalScope === '12' ? 1 : 3;
    const { data } = await getComputationReductionPlanTargetStageDetailListApi({
      orgCode,
      scopeType,
    });
    const list = (data?.data ?? []) as ReductionTargetStageDetail[];
    setStageDetailList(list);
    setDetailRowDrafts(detailDraftsFromList(list));
  }, [orgCode, goalScope]);

  const getCategory = async () => {
    const { data } = await getComputationEnumsGhgClassifyApi({
      ghgCategory: 3,
    });
    setCategoryData(data?.data);
  };

  const getLineForecastData = useCallback(async () => {
    if (!orgCode) {
      setLineChartData({ stage1List: [], stage2List: [] });
      return;
    }
    const scopeType: 1 | 3 = goalScope === '12' ? 1 : 3;
    const { data } = await getComputationReductionPlanTargetLineChartApi({
      orgCode,
      scopeType,
    });
    setLineChartData(normalizeReductionTargetLineChartPayload(data?.data));
  }, [orgCode, goalScope]);

  const getBaseEmissionData = async () => {
    if (!orgCode) {
      return;
    }
    const { data } = await getComputationReductionPlanBaseEmissionApi({
      orgCode,
      standardYear: baseYear,
    });
    setBaseEmissionData(data?.data);
  };

  useEffect(() => {
    getCategory();
  }, []);

  useEffect(() => {
    getStageData();
  }, [getStageData]);

  useEffect(() => {
    getStageDetailList().catch(() => {});
  }, [getStageDetailList]);

  useEffect(() => {
    getLineForecastData().catch(() => {});
  }, [getLineForecastData]);

  useEffect(() => {
    getBaseEmissionData();
  }, [orgCode]);

  useEffect(() => {
    if (!refreshKey) return;
    getStageData();
    getStageDetailList().catch(() => {});
    getLineForecastData().catch(() => {});
    getBaseEmissionData();
  }, [refreshKey]);

  const openAddStage = () => {
    if (sortedStages.length >= 2) {
      message.info(I18N.eca.goalMaxStagesMessage);
      return;
    }
    setModelAction(PageTypeInfo.add);
    setStageRecord(undefined);
    showDrawer();
  };

  // 阶段指标信息区编辑/删除：随下方 StageMetricsInfo 列表暂下线，恢复 UI 时一并取消注释
  /*
  const openEditStage = (item: StageTargetValueListResp) => {
    setModelAction(PageTypeInfo.edit);
    setStageRecord(item);
    showDrawer();
  };

  const handleDeleteStage = async (item: StageTargetValueListResp) => {
    await postComputationReductionPlanTargetStageDeleteApi({
      id: item.id as number,
    });
    Toast('success', I18N.Factors.deleteSuccessful);
    await getStageData();
    await getLineForecastData();
  };
  */

  const handleGoalScopeChange = useCallback((next: GoalScope) => {
    setGoalScope(prev => {
      if (prev === next) {
        return prev;
      }
      setGoalSectionEditing(false);
      setStageDraftSlots([null, null]);
      return next;
    });
  }, []);

  const handleEnterSectionEdit = () => {
    const a: ReductionTargetStage | undefined = sortedStages[0];
    const b: ReductionTargetStage | undefined = sortedStages[1];
    setStageDraftSlots([
      a?.id != null
        ? {
            targetYear: a.targetYear ?? null,
            reductionRatio: a.reductionRatio != null ? a.reductionRatio : null,
          }
        : null,
      b?.id != null
        ? {
            targetYear: b.targetYear ?? null,
            reductionRatio: b.reductionRatio != null ? b.reductionRatio : null,
          }
        : null,
    ]);
    setDetailRowDrafts(detailDraftsFromList(stageDetailList));
    setGoalSectionEditing(true);
  };

  const handleCancelSectionEdit = () => {
    setStageDraftSlots([null, null]);
    setDetailRowDrafts(detailDraftsFromList(stageDetailList));
    setGoalSectionEditing(false);
  };

  const handleSaveSectionEdit = async () => {
    const bodies: ReductionTargetStageEditReq[] = [];

    const pushIfValid = (slot: 0 | 1): boolean => {
      const stage: ReductionTargetStage | undefined = sortedStages[slot];
      const draft = stageDraftSlots[slot];
      if (!stage?.id || !draft) {
        return true;
      }
      if (draft.targetYear == null) {
        message.warning(I18N.eca.pleaseSelectTheTarget);
        return false;
      }
      if (slot === 0 && draft.targetYear <= baseYear) {
        message.warning(I18N.eca.pleaseSelectTheTarget);
        return false;
      }
      if (slot === 1) {
        const y1 =
          stageDraftSlots[0]?.targetYear ?? sortedStages[0]?.targetYear;
        if (y1 == null || draft.targetYear <= y1) {
          message.warning(I18N.eca.pleaseSelectTheTarget);
          return false;
        }
      }
      const body: ReductionTargetStageEditReq = {
        id: stage.id,
        targetYear: draft.targetYear,
      };
      // 范围三：阶段卡片仅保存目标年，减排比例在下方明细表维护
      if (goalScope === '12' && slot === 0) {
        if (draft.reductionRatio == null) {
          message.warning(I18N.eca.pleaseEnterTheRange3);
          return false;
        }
        body.reductionRatio = draft.reductionRatio;
      }
      // 范围1+2 阶段2：仅保存目标年，不传减排比例（接口约定）
      bodies.push(body);
      return true;
    };

    if (!pushIfValid(0) || !pushIfValid(1)) {
      return;
    }

    if (!bodies.length) {
      message.info(I18N.utils.noData);
      return;
    }

    try {
      await bodies.reduce<Promise<void>>(
        (chain, body) =>
          chain.then(() =>
            postComputationReductionPlanTargetStageEditApi(body).then(
              () => undefined,
            ),
          ),
        Promise.resolve(),
      );
      await getStageData();
      await getLineForecastData();
      await getStageDetailList();
      setStageDraftSlots([null, null]);
      setGoalSectionEditing(false);
      Toast('success', I18N.Factors.saveSuccessful);
    } catch {
      // 全局拦截器已提示
    }
  };

  const updateDetailDraft = (
    row: ReductionTargetStageDetail,
    patch: Partial<DetailCellDraft>,
  ) => {
    if (row.id == null) {
      return;
    }
    const rowId = row.id;
    setDetailRowDrafts(prev => {
      const base: DetailCellDraft = prev[rowId] ?? {
        reductionRatio: row.reductionRatio ?? null,
        carbonEmission: row.carbonEmission ?? null,
      };
      return { ...prev, [rowId]: { ...base, ...patch } };
    });
  };

  const saveDetailRowIfChanged = useCallback(
    async (row: ReductionTargetStageDetail) => {
      if (!goalSectionEditing || row.id == null) {
        return;
      }
      const serverRow = stageDetailList.find(r => r.id === row.id) ?? row;
      const draft = detailDraftsRef.current[row.id];
      if (!draft) {
        return;
      }
      const sorted = [...stageDetailList].sort(
        (a, b) => (a.year ?? 0) - (b.year ?? 0),
      );
      const firstY = sorted[0]?.year;

      const canRatio =
        goalScope === '3' || (goalScope === '12' && serverRow.stageNo === 2);
      const canCarbon =
        goalScope === '3' &&
        serverRow.year != null &&
        firstY != null &&
        serverRow.year === firstY;

      const body: ReductionTargetStageDetailEditReq = { id: row.id };
      if (
        canRatio &&
        !numDetailEq(draft.reductionRatio, serverRow.reductionRatio)
      ) {
        body.reductionRatio = draft.reductionRatio ?? undefined;
      }
      if (
        canCarbon &&
        !numDetailEq(draft.carbonEmission, serverRow.carbonEmission)
      ) {
        body.carbonEmission = draft.carbonEmission ?? undefined;
      }
      if (
        body.reductionRatio === undefined &&
        body.carbonEmission === undefined
      ) {
        return;
      }
      try {
        await postComputationReductionPlanTargetStageDetailEditApi(body);
        await getStageDetailList();
        await getLineForecastData();
      } catch {
        // 拦截器已提示
      }
    },
    [
      goalSectionEditing,
      goalScope,
      stageDetailList,
      getStageDetailList,
      getLineForecastData,
    ],
  );

  const updateStageDraft = (slot: 0 | 1, patch: Partial<StageSlotDraft>) => {
    setStageDraftSlots(prev => {
      const next: [StageSlotDraft | null, StageSlotDraft | null] = [
        prev[0] ? { ...prev[0] } : null,
        prev[1] ? { ...prev[1] } : null,
      ];
      const cur = next[slot];
      if (!cur) {
        return prev;
      }
      next[slot] = { ...cur, ...patch };
      if (slot === 0 && patch.targetYear != null && next[1]) {
        const y2 = next[1].targetYear;
        if (y2 != null && y2 <= patch.targetYear) {
          next[1] = { ...next[1], targetYear: null };
        }
      }
      return next;
    });
  };

  const renderStageCard = (slotIndex: 0 | 1) => {
    const item: ReductionTargetStage | undefined = sortedStages[slotIndex];
    const isStage1 = slotIndex === 0;
    const badgeClass = isStage1 ? style.stageBadge1 : style.stageBadge2;
    const draft = goalSectionEditing ? stageDraftSlots[slotIndex] : null;
    const canEditSlot = Boolean(
      goalSectionEditing && item?.id != null && draft != null,
    );

    const formatRatio = (v: number | null | undefined) =>
      v != null && !Number.isNaN(v) ? `${v}%` : '—';

    const ratioLabel =
      goalScope === '12'
        ? I18N.eca.goalScope12RatioLabel
        : I18N.eca.rangeReductionRatio;

    const hideRatioForScope12Stage2 = goalScope === '12' && slotIndex === 1;
    const hideRatioRow = hideRatioForScope12Stage2 || goalScope === '3';

    const ratioEditable = canEditSlot && draft && !hideRatioForScope12Stage2;

    const yearOptionsRaw = buildStageTargetYearOptions(
      slotIndex,
      baseYear,
      stageDraftSlots,
      sortedStages,
    );
    let yearOptions = yearOptionsRaw;
    if (
      draft?.targetYear != null &&
      !yearOptionsRaw.some(o => o.value === draft.targetYear)
    ) {
      yearOptions = [
        ...yearOptionsRaw,
        { label: String(draft.targetYear), value: draft.targetYear },
      ].sort((a, b) => a.value - b.value);
    }

    let ratioSection: React.ReactNode = null;
    if (!hideRatioRow) {
      if (ratioEditable && draft) {
        ratioSection = (
          <div className={style.stageRow}>
            <span className={style.stageFieldLbl}>{ratioLabel}</span>
            <div className={style.stageFieldInputWrap}>
              <InputNumber
                className={style.stageRatioNum}
                min={0}
                max={100}
                precision={2}
                controls={false}
                placeholder={I18N.base.pleaseEnter}
                value={draft.reductionRatio}
                onChange={v =>
                  updateStageDraft(slotIndex, {
                    reductionRatio: typeof v === 'number' ? v : null,
                  })
                }
              />
              <span className={style.stagePctSuffix}>%</span>
            </div>
          </div>
        );
      } else {
        ratioSection = (
          <div className={style.stageRow}>
            <span className={style.stageFieldLbl}>{ratioLabel}</span>
            <span className={style.stageFieldVal}>
              {formatRatio(item?.reductionRatio)}
            </span>
          </div>
        );
      }
    }

    let stageHintText = I18N.eca.goalManualRatioHint;
    if (goalScope === '3') {
      stageHintText = I18N.eca.goalScope3CardHint;
    } else if (isStage1) {
      stageHintText = I18N.eca.goalUniformLinearHint;
    }

    return (
      <div
        className={style.stageCard}
        key={slotIndex === 0 ? 'slot-1' : 'slot-2'}
      >
        <div className={`${style.stageBadge} ${badgeClass}`}>
          {I18N.eca.stage}
          {slotIndex + 1}
        </div>
        <div className={style.stageRow}>
          <span className={style.stageFieldLbl}>{I18N.eca.targetYear2}</span>
          {canEditSlot && draft ? (
            <Select
              allowClear
              showSearch
              className={style.stageYearSelect}
              placeholder={I18N.eca.pleaseSelectFiscalYear}
              options={yearOptions}
              optionFilterProp='label'
              value={draft.targetYear ?? undefined}
              onChange={v =>
                updateStageDraft(slotIndex, {
                  targetYear: typeof v === 'number' ? v : null,
                })
              }
            />
          ) : (
            <span className={style.stageFieldVal}>
              {item?.targetYear != null ? `${item.targetYear}` : '—'}
            </span>
          )}
        </div>
        {ratioSection}
        <div className={style.stageHint}>{stageHintText}</div>
      </div>
    );
  };

  const formatDetailNum = (v: number | null | undefined) =>
    v != null && !Number.isNaN(v) ? String(v) : '—';

  return (
    <div>
      <div className={style.scope}>
        {scopeData.map(item => {
          return (
            <div className={style.scopeItem} key={item.title}>
              <div className={style.scopeTitle}>{item.title}（tCO₂e）</div>
              <div className={style.scopeTitleRight}>
                <div className={style.scopeValue}>{item.value}</div>
                {item?.category ? (
                  <div className={style.scopeCategory}>
                    <ScopeThreeModal
                      categoryData={categoryData}
                      scopeValue={
                        (baseEmissionData?.scope3ClassifyValueList as string[]) ||
                        []
                      }
                    />
                  </div>
                ) : null}
              </div>
            </div>
          );
        })}
      </div>

      <div
        className={`${style.goalSection} ${
          goalSectionEditing ? style.goalSectionEditing : ''
        }`}
      >
        <div className={style.sectionHead}>
          <div className={style.sectionHeadLeft}>
            <span className={style.sectionTitle}>{I18N.eca.atTarget}</span>
            <div className={style.scopeBtnGroup}>
              <button
                type='button'
                disabled={goalSectionEditing}
                className={`${style.scopeBtn} ${
                  goalScope === '12' ? style.scopeBtnActive : ''
                }`}
                onClick={() => handleGoalScopeChange('12')}
              >
                {I18N.eca.scopeOneScope}
              </button>
              <button
                type='button'
                disabled={goalSectionEditing}
                className={`${style.scopeBtn} ${
                  goalScope === '3' ? style.scopeBtnActive : ''
                }`}
                onClick={() => handleGoalScopeChange('3')}
              >
                {I18N.eca.fanWeisan}
              </button>
            </div>
          </div>
          <div className={style.sectionHeadRight}>
            {!goalSectionEditing ? (
              <>
                {checkAuth(
                  CarbonReductionPerms.targetEdit,
                  <button
                    type='button'
                    className={`${style.btn} ${style.btnPrimary} ${style.btnSm}`}
                    onClick={handleEnterSectionEdit}
                  >
                    {I18N.Factors.edit}
                  </button>,
                )}
                {sortedStages.length < 2
                  ? checkAuth(
                      CarbonReductionPerms.targetAdd,
                      <button
                        type='button'
                        className={`${style.btn} ${style.btnPrimary} ${style.btnSm}`}
                        onClick={openAddStage}
                      >
                        {I18N.Factors.newAddition}
                      </button>,
                    )
                  : null}
              </>
            ) : (
              <>
                <button
                  type='button'
                  className={`${style.btn} ${style.btnDefault} ${style.btnSm}`}
                  onClick={handleCancelSectionEdit}
                >
                  {I18N.Factors.cancel}
                </button>
                <button
                  type='button'
                  className={`${style.btn} ${style.btnPrimary} ${style.btnSm}`}
                  onClick={handleSaveSectionEdit}
                >
                  {I18N.Factors.preserve}
                </button>
              </>
            )}
          </div>
        </div>

        <div className={style.stageCards}>
          {renderStageCard(0)}
          {renderStageCard(1)}
        </div>

        {/* 阶段指标信息区（StageMetricsInfo 列表）：产品要求暂时下线，需要恢复时取消本段注释即可 */}
        {/*
        <div className={style.stageMetricsBlock}>
          {sortedStages.map((item, index) => (
            <StageMetricsInfo
              key={item.id ?? `stage-${index}`}
              categoryData={categoryData}
              item={{ ...item, index: index + 1 }}
              onEdit={openEditStage}
              onDelete={handleDeleteStage}
            />
          ))}
        </div>
        */}

        <div className={style.tblWrap}>
          <table className={style.goalTable}>
            <colgroup>
              <col className={style.colYear} />
              <col className={style.colRatio} />
              <col className={style.colEmission} />
            </colgroup>
            <thead>
              <tr>
                <th className={style.thYear}>{I18N.Factors.year}</th>
                <th className={style.thCenter}>
                  {I18N.eca.goalStageDetailRatioCol}
                </th>
                <th className={style.thCenter}>
                  {goalScope === '3'
                    ? I18N.eca.goalStageDetailEmissionColScope3
                    : I18N.eca.goalStageDetailEmissionCol}
                </th>
              </tr>
            </thead>
            <tbody>
              {sortedStageDetails.length === 0 ? (
                <tr>
                  <td colSpan={3} className={style.tdEmpty}>
                    {I18N.utils.noData}
                  </td>
                </tr>
              ) : (
                sortedStageDetails.map(row => {
                  const rid = row.id;
                  const draft =
                    rid != null && detailRowDrafts[rid]
                      ? detailRowDrafts[rid]
                      : {
                          reductionRatio: row.reductionRatio ?? null,
                          carbonEmission: row.carbonEmission ?? null,
                        };
                  const isBaseYearRow =
                    row.year != null && row.year === baseYear;
                  const canEditRatioCell =
                    goalSectionEditing &&
                    rid != null &&
                    ((goalScope === '3' && !isBaseYearRow) ||
                      (goalScope === '12' && row.stageNo === 2));
                  const canEditCarbonCell =
                    goalSectionEditing && goalScope === '3' && rid != null;

                  let rowCls = '';
                  if (row.stageNo === 1) {
                    rowCls = style.stage1Row;
                  } else if (row.stageNo === 2) {
                    rowCls = style.stage2Row;
                  } else if (goalScope === '12') {
                    const y1 = sortedStages[0]?.targetYear;
                    const y2 = sortedStages[1]?.targetYear;
                    if (row.year != null && y1 != null && row.year <= y1) {
                      rowCls = style.stage1Row;
                    } else if (
                      row.year != null &&
                      y2 != null &&
                      row.year >= y2
                    ) {
                      rowCls = style.stage2Row;
                    }
                  } else if (row.year === firstDetailYear) {
                    rowCls = style.stage1Row;
                  } else {
                    rowCls = style.stage2Row;
                  }

                  let ratioCell: React.ReactNode;
                  if (canEditRatioCell) {
                    ratioCell = (
                      <div className={style.detailCellEdit}>
                        <InputNumber
                          className={style.goalDetailRatioNum}
                          min={0}
                          max={100}
                          precision={2}
                          controls={false}
                          placeholder={I18N.base.pleaseEnter}
                          value={draft.reductionRatio}
                          onChange={v =>
                            updateDetailDraft(row, {
                              reductionRatio: typeof v === 'number' ? v : null,
                            })
                          }
                          onBlur={() => {
                            saveDetailRowIfChanged(row).catch(() => {});
                          }}
                        />
                        <span className={style.goalDetailPct}>%</span>
                      </div>
                    );
                  } else if (isBaseYearRow) {
                    ratioCell = <span className={style.autoVal}>—</span>;
                  } else {
                    ratioCell = (
                      <span className={style.autoVal}>
                        {formatDetailNum(row.reductionRatio)}
                        {row.reductionRatio != null ? '%' : ''}
                      </span>
                    );
                  }

                  return (
                    <tr
                      key={rid ?? `y-${row.year}-s-${row.stageNo ?? ''}`}
                      className={rowCls || undefined}
                    >
                      <td>
                        <span className={style.yrTag}>
                          {row.year != null ? String(row.year) : '—'}
                          {row.year != null && row.year === baseYear
                            ? I18N.eca.baseYearTableSuffix
                            : ''}
                        </span>
                      </td>
                      <td className={style.tdCenter}>{ratioCell}</td>
                      <td className={style.tdCenter}>
                        {canEditCarbonCell ? (
                          <InputNumber
                            className={style.goalDetailEmissionNum}
                            min={0}
                            controls={false}
                            placeholder={I18N.base.pleaseEnter}
                            value={draft.carbonEmission}
                            onChange={v =>
                              updateDetailDraft(row, {
                                carbonEmission:
                                  typeof v === 'number' ? v : null,
                              })
                            }
                            onBlur={() => {
                              saveDetailRowIfChanged(row).catch(() => {});
                            }}
                          />
                        ) : (
                          <span className={style.autoVal}>
                            {formatDetailNum(row.carbonEmission)}
                          </span>
                        )}
                      </td>
                    </tr>
                  );
                })
              )}
            </tbody>
          </table>
        </div>
      </div>

      <TargetInfoDrawer
        categoryData={categoryData}
        stageRecord={stageRecord as StageTargetValueListResp}
        actionType={pageType}
        visible={visible}
        onClose={() => {
          onClose();
          setStageRecord(undefined);
        }}
        onSuccessSave={async () => {
          onClose();
          setStageRecord(undefined);
          await getStageData();
          await getLineForecastData();
          await getStageDetailList();
        }}
      />

      <div className={style.goalChartWrap}>
        <FlexibleLineChart
          data={chartPlotData}
          xKey='year'
          series={[
            {
              key: 'stage1Target',
              name: I18N.eca.goalChartStageOne,
              color: CHART_BLUE,
            },
            {
              key: 'stage2Target',
              name: I18N.eca.goalChartStageTwo,
              color: CHART_GREEN,
            },
          ]}
          yName={
            goalScope === '3'
              ? I18N.eca.unitTCoPerTenThousand
              : I18N.eca.unitTCo
          }
          xName={I18N.Factors.year}
          height={260}
          extraOptions={{
            legend: {
              show: true,
              top: 0,
              left: 'center',
              itemWidth: 16,
              itemHeight: 8,
            },
            grid: { top: 52, right: 56, bottom: 36, left: 34 },
            tooltip: {
              trigger: 'axis',
              axisPointer: { type: 'shadow' },
            },
          }}
        />
      </div>
    </div>
  );
};

export default Target;
