import { DownloadOutlined } from '@ant-design/icons';
import I18N from '@src/lang/I18N';
import {
  Button,
  Col,
  Empty,
  Pagination,
  Row,
  Select,
  Space,
  Spin,
  Table,
  message,
} from 'antd';
import type { ColumnsType } from 'antd/es/table';
import React, { useCallback, useEffect, useMemo, useState } from 'react';

import { ModifyNote } from '@/components/ModifyNote';
import { useDrawer } from '@/hooks/useDrawer';
import usePageType from '@/hooks/usePageType';
import { checkAuth } from '@/layout/utills';
import { CarbonReductionPerms } from '@/router/utils/carbonReductionEnum';
import { PageTypeInfo } from '@/router/utils/enums';
import { modal } from '@/store/module/notification';
import {
  commonRequestDownloadFile,
  extractFileNameFromUrl,
} from '@/utils/downBlobFile';
import { CommonColumnsActionType } from '@/views/eca/util/actionType';

import ButtonHeader from '../ButtonHeader';
import MeasuresImportModal from './ImportModal';
import MeasureInfoDrawer from './MeasureInfoDrawer';
import MeasuresCombinationChart from './MeasuresCombinationChart';
import { QueryFilterForm } from './SearchFrom';
import style from './index.module.less';
import {
  getReductionMeasureCurveChartApi,
  getReductionMeasureCurveChartMeasuresApi,
  getReductionMeasureExportApi,
  getReductionMeasureOverviewApi,
  getReductionMeasurePageApi,
  postReductionMeasureDeleteApi,
} from './service';
import type {
  ReductionMeasureDetail,
  MeasuresPageListParams,
  ReductionMeasure,
  ReductionMeasureCurveChartMeasureResp,
  ReductionMeasureCurveChartResp,
  ReductionMeasureOverviewResp,
} from './type';
import {
  computeDetailMetrics,
  feasibilityOptions,
  measureTypeOptions,
  scopeTypeOptions,
} from './utils';

/** 概览区范围切换（与 BAU 一致用字符串 value，避免 Select 不显示选中项） */
const overviewScopeOptions = scopeTypeOptions.map(item => ({
  label: item.label,
  value: String(item.value),
}));

const { add, edit, show } = PageTypeInfo;
const { SHOW, EDIT, DELETE } = CommonColumnsActionType;

/** curveChartMeasures 无数据时，用 curveChart 的 measuresByYear 构造右侧面板行 */
function panelRowsFromMeasuresByYear(
  chartData: ReductionMeasureCurveChartResp | null,
  year: number,
  scopeType: number,
): ReductionMeasureCurveChartMeasureResp[] {
  const block = chartData?.measuresByYear?.find(r => r.year === year);
  if (!block?.measures?.length) return [];
  return block.measures.map(m => ({
    measureId: m.id,
    measureName: m.measureName,
    annualReduction: scopeType === 3 ? undefined : m.value,
    reductionIntensity: scopeType === 3 ? m.value : undefined,
  }));
}

interface MeasuresProps {
  orgCode?: string;
  /** 父组件保存基准年后递增，触发全量刷新 */
  refreshKey?: number;
  /** 独立菜单页隐藏图表及预测提示 */
  hideChart?: boolean;
  /** 图表区修改说明 */
  chartNote?: string;
  /** 范围选项修改说明 */
  scopeOptionsNote?: string;
}

type MeasureTableRecord = ReductionMeasure & {
  detail?: ReductionMeasureDetail;
  detailIndex: number;
  detailCount: number;
  rowKey: string;
};

function fmtNum(
  n: number | string | undefined | null,
  options?: { useGrouping?: boolean },
) {
  if (n === '' || n == null) return '—';
  const num = typeof n === 'number' ? n : Number(n);
  if (Number.isNaN(num)) return '—';
  return num.toLocaleString(undefined, {
    maximumFractionDigits: 4,
    useGrouping: options?.useGrouping ?? true,
  });
}

const Measures: React.FC<MeasuresProps> = ({
  orgCode,
  refreshKey = 0,
  hideChart = false,
  chartNote,
  scopeOptionsNote,
}) => {
  const { visible, showDrawer, onClose } = useDrawer();
  const { pageType, setModelAction } = usePageType(add);

  const [scopeType, setScopeType] = useState('1');
  const scopeTypeNum = Number(scopeType) as 1 | 2 | 3;
  const [overview, setOverview] = useState<ReductionMeasureOverviewResp | null>(
    null,
  );
  const [chartData, setChartData] =
    useState<ReductionMeasureCurveChartResp | null>(null);
  const [chartLoading, setChartLoading] = useState(false);
  const [panelYear, setPanelYear] = useState<number | null>(null);
  const [panelData, setPanelData] = useState<
    ReductionMeasureCurveChartMeasureResp[]
  >([]);

  const [measuresList, setMeasuresList] = useState<ReductionMeasure[]>([]);
  const [total, setTotal] = useState(0);
  const [pageNum, setPageNum] = useState(1);
  const [pageSize, setPageSize] = useState(10);

  const [measuresId, setMeasuresId] = useState<number>();
  const [searchParams, setSearchParams] = useState<MeasuresPageListParams>({
    scopeType: 1,
  });
  const [loading, setLoading] = useState(false);
  const [importModalVisible, setImportModalVisible] = useState(false);

  const isScope3 = scopeType === '3';
  const listScopeType =
    searchParams?.scopeType != null
      ? Number(searchParams.scopeType)
      : scopeTypeNum;
  const listIsScope3 = listScopeType === 3;

  const fetchOverview = useCallback(async () => {
    if (!orgCode) return;
    try {
      const { data: res } = await getReductionMeasureOverviewApi({
        orgCode,
        scopeType: scopeTypeNum,
      });
      setOverview(res?.data ?? null);
    } catch {
      setOverview(null);
    }
  }, [orgCode, scopeTypeNum]);

  const fetchChart = useCallback(
    async (filter?: { isAll: boolean; measureIdList?: number[] }) => {
      if (!orgCode) return;
      setChartLoading(true);
      try {
        const isAll = filter?.isAll ?? true;
        const { data: res } = await getReductionMeasureCurveChartApi({
          orgCode,
          scopeType: scopeTypeNum,
          isAll,
          measureIdList: isAll ? undefined : filter?.measureIdList ?? [],
        });
        setChartData(res?.data ?? null);
      } catch {
        setChartData(null);
      } finally {
        setChartLoading(false);
      }
    },
    [orgCode, scopeTypeNum],
  );

  const fetchList = useCallback(async () => {
    if (!orgCode) return;
    setLoading(true);
    try {
      const { data: res } = await getReductionMeasurePageApi({
        pageNum,
        pageSize,
        orgCode,
        measureType: searchParams?.measureType,
        likeMeasureName: searchParams?.likeMeasureName,
        feasibilityType: searchParams?.feasibilityType,
        scopeType:
          searchParams?.scopeType != null
            ? Number(searchParams.scopeType)
            : scopeTypeNum,
      });
      const page = res?.data;
      setMeasuresList(page?.list ?? []);
      setTotal(page?.total ?? 0);
    } finally {
      setLoading(false);
    }
  }, [orgCode, pageNum, pageSize, scopeTypeNum, searchParams]);

  useEffect(() => {
    fetchOverview();
    if (!hideChart) {
      fetchChart({ isAll: true });
      setPanelYear(null);
      setPanelData([]);
    }
  }, [fetchOverview, fetchChart, hideChart]);

  useEffect(() => {
    fetchList();
  }, [fetchList]);

  useEffect(() => {
    if (!refreshKey) return;
    fetchOverview();
    if (!hideChart) {
      fetchChart({ isAll: true });
      setPanelYear(null);
      setPanelData([]);
    }
    fetchList();
  }, [refreshKey, fetchOverview, fetchChart, fetchList, hideChart]);

  const onYearClick = useCallback(
    async (year: number) => {
      if (!orgCode) return;
      try {
        const { data: res } = await getReductionMeasureCurveChartMeasuresApi({
          orgCode,
          scopeType: scopeTypeNum,
          year,
        });
        let rows = res?.data ?? [];
        if (!rows.length) {
          rows = panelRowsFromMeasuresByYear(chartData, year, scopeTypeNum);
        }
        setPanelYear(year);
        setPanelData(rows);
        await fetchChart({ isAll: true });
      } catch {
        setPanelYear(year);
        setPanelData(
          panelRowsFromMeasuresByYear(chartData, year, scopeTypeNum),
        );
        await fetchChart({ isAll: true });
      }
    },
    [orgCode, scopeTypeNum, chartData, fetchChart],
  );

  const onMeasureFilterChange = useCallback(
    (checkedIds: number[], allIds: number[]) => {
      const isAll = allIds.length > 0 && checkedIds.length === allIds.length;
      fetchChart({
        isAll,
        measureIdList: isAll ? undefined : checkedIds,
      });
    },
    [fetchChart],
  );

  const refreshAfterMutation = useCallback(() => {
    fetchList();
    fetchOverview();
    if (!hideChart) {
      fetchChart({ isAll: true });
      setPanelYear(null);
      setPanelData([]);
    }
  }, [fetchList, fetchOverview, fetchChart, hideChart]);

  const handleExport = async () => {
    if (!orgCode) {
      message.warning(I18N.eca.pleaseSelectAnOrganization);
      return;
    }
    try {
      const { data: res } = await getReductionMeasureExportApi({
        orgCode,
        measureType: searchParams?.measureType,
        likeMeasureName: searchParams?.likeMeasureName,
        feasibilityType: searchParams?.feasibilityType,
        scopeType:
          searchParams?.scopeType != null
            ? Number(searchParams.scopeType)
            : scopeTypeNum,
      });
      const fileData = res?.data;
      const url = fileData?.url || fileData?.internalUrl;
      if (!url) {
        message.warning(I18N.utils.noData);
        return;
      }
      const fileName =
        fileData?.fileName || extractFileNameFromUrl(url) || undefined;
      commonRequestDownloadFile(url, fileName, false);
    } catch {
      // 错误由拦截器处理
    }
  };

  const handleActionClick = useCallback(
    async (actionType: CommonColumnsActionType, record: { id?: number }) => {
      const { id } = record;
      if (id == null) return;
      switch (actionType) {
        case SHOW:
          setMeasuresId(id);
          setModelAction(show);
          showDrawer();
          break;
        case EDIT:
          setMeasuresId(id);
          setModelAction(edit);
          showDrawer();
          break;
        case DELETE:
          modal.confirm({
            title: I18N.Factors.prompt,
            content: I18N.dashborad.pleaseConfirmIfItIs2,
            onOk: async () => {
              await postReductionMeasureDeleteApi({ id });
              refreshAfterMutation();
            },
          });
          break;
        default:
      }
    },
    [refreshAfterMutation, setModelAction, showDrawer],
  );

  const measureTypeLabel = useCallback((v?: number) => {
    const hit = measureTypeOptions.find(o => o.value === v);
    return hit?.label ?? (v != null ? String(v) : '—');
  }, []);

  const feasibilityLabel = useCallback((v?: number) => {
    const hit = feasibilityOptions.find(o => o.value === v);
    return hit?.label ?? (v != null ? String(v) : '—');
  }, []);

  const tableData = useMemo<MeasureTableRecord[]>(
    () =>
      measuresList.flatMap(measure => {
        const details = measure.detailList?.length
          ? measure.detailList
          : [undefined];
        const detailCount = details.length;

        return details.map((detail, detailIndex) => ({
          ...measure,
          detail,
          detailIndex,
          detailCount,
          rowKey: [
            measure.id ?? measure.measureName ?? measure.orgCode ?? 'measure',
            detail?.id ?? detail?.year ?? detailIndex,
          ].join('-'),
        }));
      }),
    [measuresList],
  );

  const renderFirstDetailCell = useCallback(
    (children: React.ReactNode, record: MeasureTableRecord) =>
      record.detailIndex === 0 ? children : null,
    [],
  );

  const renderPlainText = useCallback(
    (value?: React.ReactNode) => value ?? '—',
    [],
  );

  const renderNumberText = useCallback(
    (value?: number | string | null) => (
      <span className={style.numberText}>{fmtNum(value)}</span>
    ),
    [],
  );

  const renderRoiText = useCallback((value?: number | string | null) => {
    const text = fmtNum(value);
    return (
      <span className={style.numberText}>
        {text === '—' ? text : `${text}%`}
      </span>
    );
  }, []);

  const detailMetricColumns: ColumnsType<MeasureTableRecord> = useMemo(() => {
    const renderComputed = (
      record: MeasureTableRecord,
      pick: (m: ReturnType<typeof computeDetailMetrics>) => number | undefined,
    ) => {
      const metrics = computeDetailMetrics(record.detail, listIsScope3);
      return renderNumberText(pick(metrics));
    };

    const scope12Columns: ColumnsType<MeasureTableRecord> = [
      {
        title: '年减排量（吨）',
        key: 'annualReduction',
        width: 130,
        align: 'right',
        render: (_, record) => renderNumberText(record.detail?.annualReduction),
      },
      {
        title: '碳价（元/吨）',
        key: 'carbonPrice',
        width: 130,
        align: 'right',
        render: (_, record) => renderNumberText(record.detail?.carbonPrice),
      },
      {
        title: '节约开支（元）',
        key: 'costSavings',
        width: 130,
        align: 'right',
        render: (_, record) => renderNumberText(record.detail?.costSavings),
      },
      {
        title: '潜在收益（元）',
        key: 'potentialRevenue',
        width: 130,
        align: 'right',
        render: (_, record) => renderComputed(record, m => m.potentialRevenue),
      },
      {
        title: '总成本（元）',
        key: 'totalCost',
        width: 120,
        align: 'right',
        render: (_, record) => renderNumberText(record.detail?.totalCost),
      },
      {
        title: '潜在净收益（元）',
        key: 'potentialNetRevenue',
        width: 150,
        align: 'right',
        render: (_, record) =>
          renderComputed(record, m => m.potentialNetRevenue),
      },
      {
        title: '当年ROI（%）',
        key: 'annualRoi',
        width: 130,
        align: 'right',
        render: (_, record) =>
          renderRoiText(
            computeDetailMetrics(record.detail, listIsScope3).annualRoi,
          ),
      },
    ];

    const scope3ExtraColumns: ColumnsType<MeasureTableRecord> = [
      {
        title: '产量（万件）',
        key: 'production',
        width: 120,
        align: 'right',
        render: (_, record) => renderNumberText(record.detail?.production),
      },
      {
        title: '年减排强度（吨/万件）',
        key: 'reductionIntensity',
        width: 180,
        align: 'right',
        render: (_, record) =>
          renderComputed(record, m => m.reductionIntensity),
      },
    ];

    return [
      {
        title: I18N.eca.affectedYear,
        key: 'year',
        width: 100,
        align: 'center',
        render: (_, record) =>
          record.detail?.year == null ? (
            '—'
          ) : (
            <span className={style.yearTag}>{record.detail.year}年</span>
          ),
      },
      ...(listIsScope3
        ? [scope12Columns[0], ...scope3ExtraColumns, ...scope12Columns.slice(1)]
        : scope12Columns),
      {
        title: '备注',
        key: 'remark',
        width: 160,
        ellipsis: true,
        render: (_, record) => renderPlainText(record.detail?.remark),
      },
    ];
  }, [listIsScope3, renderNumberText, renderPlainText, renderRoiText]);

  const columns: ColumnsType<MeasureTableRecord> = useMemo(
    () => [
      {
        title: I18N.eca.measureName,
        dataIndex: 'measureName',
        key: 'measureName',
        width: 140,
        ellipsis: true,
        render: (v: string, record) =>
          renderFirstDetailCell(renderPlainText(v), record),
      },
      {
        title: I18N.eca.typeOfMeasures,
        dataIndex: 'measureType',
        key: 'measureType',
        width: 120,
        render: (v: number, record) =>
          renderFirstDetailCell(
            <span className={style.typeTag}>{measureTypeLabel(v)}</span>,
            record,
          ),
      },
      {
        title: I18N.Factors.ghgClassifyCol2,
        dataIndex: 'ghgCategory',
        key: 'ghgCategory',
        width: 150,
        render: (_, record) =>
          renderFirstDetailCell(
            <span className={style.scopeTag}>
              {`${record.ghgCategory_name}-${record.ghgClassify_name}`}
            </span>,
            record,
          ),
      },
      {
        title: I18N.eca.feasibility,
        dataIndex: 'feasibilityType',
        key: 'feasibilityType',
        width: 88,
        render: (v: number, record) =>
          renderFirstDetailCell(
            <span className={style.feasibilityTag}>{feasibilityLabel(v)}</span>,
            record,
          ),
      },
      ...detailMetricColumns,
      {
        title: I18N.Factors.operation,
        key: 'action',
        width: 200,
        fixed: 'right',
        render: (_, record) =>
          renderFirstDetailCell(
            <Space>
              {checkAuth(
                CarbonReductionPerms.measuresShow,
                <Button
                  type='link'
                  size='small'
                  onClick={() => handleActionClick(SHOW, record)}
                >
                  {I18N.Factors.check}
                </Button>,
              )}
              {checkAuth(
                CarbonReductionPerms.measuresEdit,
                <Button
                  type='link'
                  size='small'
                  onClick={() => handleActionClick(EDIT, record)}
                >
                  {I18N.Factors.edit}
                </Button>,
              )}
              {checkAuth(
                CarbonReductionPerms.measuresDelete,
                <Button
                  type='link'
                  size='small'
                  danger
                  onClick={() => handleActionClick(DELETE, record)}
                >
                  {I18N.Factors.delete}
                </Button>,
              )}
            </Space>,
            record,
          ),
      },
    ],
    [
      detailMetricColumns,
      feasibilityLabel,
      handleActionClick,
      measureTypeLabel,
      renderFirstDetailCell,
      renderPlainText,
    ],
  );

  /** 概览四宫格：字段与 GET /reductionMeasure/overview 一致 */
  const overviewBlocks = isScope3
    ? [
        {
          title: I18N.eca.emissionReductionMeasures2,
          value:
            overview?.measureCount != null
              ? String(overview.measureCount)
              : '—',
          suffix: '',
        },
        {
          title: '预计减排强度',
          value: fmtNum(overview?.expectedReductionIntensity, {
            useGrouping: false,
          }),
          suffix: '吨/万件',
        },
        {
          title: I18N.eca.estimatedCost,
          value: fmtNum(overview?.expectedCost, { useGrouping: false }),
          suffix: '元',
        },
        {
          title: '预计年收益',
          value: fmtNum(overview?.expectedRevenue, { useGrouping: false }),
          suffix: '元',
        },
      ]
    : [
        {
          title: I18N.eca.emissionReductionMeasures2,
          value:
            overview?.measureCount != null
              ? String(overview.measureCount)
              : '—',
          suffix: '',
        },
        {
          title: I18N.eca.expectedEmissionReduction,
          value: fmtNum(overview?.expectedReduction, { useGrouping: false }),
          suffix: '吨',
        },
        {
          title: I18N.eca.estimatedCost,
          value: fmtNum(overview?.expectedCost, { useGrouping: false }),
          suffix: '元',
        },
        {
          title: '预计年收益',
          value: fmtNum(overview?.expectedRevenue, { useGrouping: false }),
          suffix: '元',
        },
      ];

  const suffixMutedStyle: React.CSSProperties = {
    fontSize: 13,
    fontWeight: 400,
    color: 'rgba(0,0,0,.45)',
  };

  return (
    <div className={style.measuresContainer}>
      <div className={style.measuresYear}>
        <span>{I18N.eca.overviewOfEmissionReductionMeasures}</span>
        <Select
          className={style.measuresYearSel}
          value={scopeType}
          allowClear={false}
          onChange={v => {
            setScopeType(String(v));
            setPageNum(1);
          }}
          options={overviewScopeOptions}
        />
        {scopeOptionsNote ? <ModifyNote content={scopeOptionsNote} /> : null}
      </div>
      <div className={style.measuresInfo}>
        <Row gutter={[24, 24]}>
          {overviewBlocks.map(item => (
            <Col span={6} key={item.title}>
              <div className={style.measuresTitle}>{item.title}</div>
              <div className={style.measuresValue}>
                {item.value}
                {item.suffix ? (
                  <>
                    {' '}
                    <span style={suffixMutedStyle}>{item.suffix}</span>
                  </>
                ) : null}
              </div>
            </Col>
          ))}
        </Row>
      </div>
      {!hideChart ? (
        <>
          <div className={style.measuresChart}>
            {chartNote ? (
              <div className={style.measuresChartNote}>
                <ModifyNote content={chartNote} />
              </div>
            ) : null}
            <Spin spinning={chartLoading}>
              <MeasuresCombinationChart
                chartData={chartData}
                panelData={panelData}
                panelYear={panelYear}
                onYearClick={onYearClick}
                onMeasureFilterChange={onMeasureFilterChange}
                scopeType={scopeTypeNum}
                height={340}
              />
            </Spin>
          </div>
          <div className={style.measuresTip}>
            {I18N.eca.thePredictedResultsAreOnly}
          </div>
        </>
      ) : null}

      <ButtonHeader
        title={I18N.eca.emissionReductionMeasures}
        buttonText={`+ ${I18N.Factors.newAddition}`}
        buttonShow
        buttonAuth={CarbonReductionPerms.measuresAdd}
        onButtonClick={() => {
          setMeasuresId(undefined);
          setModelAction(add);
          showDrawer();
        }}
        extra={
          <Space>
            {checkAuth(
              CarbonReductionPerms.measuresExport,
              <Button icon={<DownloadOutlined />} onClick={handleExport}>
                {I18N.eca.export}
              </Button>,
            )}
            {checkAuth(
              CarbonReductionPerms.measuresImport,
              <Button
                onClick={() => {
                  setImportModalVisible(true);
                }}
              >
                {I18N.carbonFootPrint.import}
              </Button>,
            )}
          </Space>
        }
      />

      <div className={style.searchWrapper}>
        <QueryFilterForm
          onFinish={async values => {
            setPageNum(1);
            setSearchParams(values as MeasuresPageListParams);
          }}
          onReset={() => {
            setPageNum(1);
            setSearchParams({ scopeType: 1 });
          }}
        />
      </div>
      <Spin spinning={loading}>
        {measuresList.length > 0 ? (
          <>
            <Table<MeasureTableRecord>
              rowKey='rowKey'
              columns={columns}
              dataSource={tableData}
              pagination={false}
              scroll={{ x: listIsScope3 ? 2100 : 1900 }}
            />
            <div className={style.paginationWrapper}>
              <Pagination
                current={pageNum}
                pageSize={pageSize}
                total={total}
                showSizeChanger
                showTotal={t => `共 ${t} 条`}
                onChange={(p, ps) => {
                  setPageNum(p);
                  setPageSize(ps);
                }}
              />
            </div>
          </>
        ) : (
          <Empty
            image={Empty.PRESENTED_IMAGE_SIMPLE}
            description={I18N.utils.noData}
          />
        )}
      </Spin>

      <MeasureInfoDrawer
        measureId={measuresId}
        orgCode={orgCode}
        actionType={pageType}
        visible={visible}
        onClose={() => {
          onClose();
          setModelAction(add);
        }}
        onSuccessSave={() => {
          onClose();
          setModelAction(add);
          refreshAfterMutation();
        }}
      />

      <MeasuresImportModal
        visible={importModalVisible}
        orgCode={orgCode}
        onImportSuccess={refreshAfterMutation}
        onOk={() => {
          setImportModalVisible(false);
          refreshAfterMutation();
        }}
        onCancel={() => {
          setImportModalVisible(false);
          refreshAfterMutation();
        }}
      />
    </div>
  );
};

export default Measures;
