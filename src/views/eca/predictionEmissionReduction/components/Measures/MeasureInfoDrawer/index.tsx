import {
  Cascader,
  DatePicker as FormilyDatePicker,
  Form,
  FormGrid,
  FormItem,
  FormLayout,
  Input,
  NumberPicker,
  Radio,
  Select,
} from '@formily/antd-v5';
import { createForm, onFieldValueChange } from '@formily/core';
import { createSchemaField } from '@formily/react';
import {
  Card,
  DatePicker,
  Form as AntdForm,
  Input as AntdInput,
  InputNumber,
  Table,
  Typography,
} from 'antd';
import type { ColumnsType } from 'antd/es/table';
import dayjs from 'dayjs';
import React, {
  useCallback,
  useEffect,
  useMemo,
  useRef,
  useState,
} from 'react';

import CustomDrawer from '@/components/CustomDrawer';
import I18N from '@/lang/I18N';
import { PageTypeInfo } from '@/router/utils/enums';
import { Toast } from '@/utils';
import { ComputationEnums } from '@/views/eca/hooks';

import {
  getReductionMeasureDetailApi,
  postReductionMeasureAddApi,
  postReductionMeasureEditApi,
} from '../service';
import type {
  ReductionMeasureAddReq,
  ReductionMeasureDetail,
  ReductionMeasureEditReq,
} from '../type';
import {
  computeDetailMetrics,
  findGhgClassifyPath,
  getGhgClassifyFirstLevel,
  isScope3ByGhgClassifyFirst,
  measureTypeOptions,
  toMeasureGhgCategory,
} from '../utils';
import { measureBaseSchema } from './schema';

const SchemaField = createSchemaField({
  components: {
    FormItem,
    FormGrid,
    FormLayout,
    Input,
    DatePicker: FormilyDatePicker,
    Radio,
    Select,
    Cascader,
    NumberPicker,
  },
});

interface MeasureInfoDrawerProps {
  actionType: PageTypeInfo;
  visible: boolean;
  onClose: () => void;
  onSuccessSave?: () => void;
  measureId?: number;
  /** 新增/编辑必填 */
  orgCode?: string;
}

interface DetailRow {
  year: number;
  annualReduction?: number;
  production?: number;
  carbonPrice?: number;
  costSavings?: number;
  totalCost?: number;
  remark?: string;
}

const { add, edit, show } = PageTypeInfo;

function buildYearRows(
  startYear: number,
  endYear: number,
  existing: DetailRow[],
): DetailRow[] {
  const existingMap = new Map(existing.map(r => [r.year, r]));
  const rows: DetailRow[] = [];
  for (let y = startYear; y <= endYear; y += 1) {
    rows.push(existingMap.get(y) ?? { year: y });
  }
  return rows;
}

const fmtNum = (n: number) =>
  Number.isFinite(n) ? (Math.round(n * 10000) / 10000).toLocaleString() : '—';

const MeasureInfoDrawer: React.FC<MeasureInfoDrawerProps> = ({
  actionType,
  visible,
  onClose,
  onSuccessSave,
  measureId,
  orgCode,
}) => {
  const isDetail = actionType === show;

  const [loading, setLoading] = useState(false);
  const [detailRows, setDetailRows] = useState<DetailRow[]>([]);
  /** 计划起止年（React state，直接驱动逐年表行数） */
  const [planStart, setPlanStart] = useState<dayjs.Dayjs | null>(null);
  const [planEnd, setPlanEnd] = useState<dayjs.Dayjs | null>(null);
  /** 年份输入校验错误 */
  const [yearError, setYearError] = useState<string | undefined>();
  /** 影响类别 Cascader 第一级值，用于切换逐年表列 */
  const [classifyFirstLevel, setClassifyFirstLevel] = useState<
    number | undefined
  >();
  /** 详情接口返回的叶子 ghgClassify，用于枚举树异步加载后回填 Cascader */
  const detailGhgClassifyLeafRef = useRef<number | undefined>(undefined);

  // eslint-disable-next-line react-hooks/exhaustive-deps
  const form = useMemo(() => createForm({ readPretty: isDetail }), [isDetail]);

  /** 直接按起止年拼接行数组，保留已有年份的数据 */
  const applyYearRange = useCallback(
    (start: dayjs.Dayjs | null, end: dayjs.Dayjs | null) => {
      if (!start || !end) {
        setDetailRows([]);
        setYearError(undefined);
        return;
      }
      const sy = start.year();
      const ey = end.year();
      if (sy > ey) {
        setYearError('开始年份不能晚于结束年份');
        return;
      }
      setYearError(undefined);
      setDetailRows(prev => buildYearRows(sy, ey, prev));
    },
    [],
  );

  const ghgCategoryEnumTree = ComputationEnums('GHGCategory');

  const syncScopeFromClassify = useCallback(
    (raw: unknown) => {
      const first = getGhgClassifyFirstLevel(
        raw as number[] | number | undefined,
        ghgCategoryEnumTree,
      );
      setClassifyFirstLevel(first);
      if (!isScope3ByGhgClassifyFirst(first)) {
        setDetailRows(prev => prev.map(r => ({ ...r, production: undefined })));
      }
    },
    [ghgCategoryEnumTree],
  );

  const titleMap = {
    [add]: I18N.eca.newIncreaseOrDecreaseMeasures,
    [edit]: I18N.eca.editEmissionReductionMeasures,
    [show]: I18N.eca.viewEmissionReductionMeasures,
  };

  useEffect(() => {
    if (!visible) {
      return undefined;
    }
    form.addEffects('measure-ghg-classify', () => {
      onFieldValueChange('ghgClassify', field => {
        syncScopeFromClassify(field.value);
      });
    });
    return () => {
      form.removeEffects('measure-ghg-classify');
    };
  }, [visible, form, syncScopeFromClassify]);

  /** 枚举树加载后，将详情叶子节点展开为完整路径并同步范围 */
  useEffect(() => {
    if (!visible || !ghgCategoryEnumTree.length) return;
    const leaf = detailGhgClassifyLeafRef.current;
    if (leaf == null) return;
    const fullPath = findGhgClassifyPath(ghgCategoryEnumTree, leaf);
    if (fullPath?.length) {
      form.setValues({ ghgClassify: fullPath });
      syncScopeFromClassify(fullPath);
    }
  }, [visible, ghgCategoryEnumTree, form, syncScopeFromClassify]);

  useEffect(() => {
    if (!visible) return;
    form.setFieldState('measureType', {
      dataSource: measureTypeOptions,
    });
  }, [visible, form]);

  /* ---- row field update ---- */
  const updateRow = (
    year: number,
    field: keyof DetailRow,
    value: number | string | undefined,
  ) => {
    setDetailRows(prev =>
      prev.map(r => (r.year === year ? { ...r, [field]: value } : r)),
    );
  };

  const isScope3 = isScope3ByGhgClassifyFirst(classifyFirstLevel);

  /* ---- computed values per row ---- */
  const computedRow = (row: DetailRow) => {
    const {
      potentialRevenue,
      potentialNetRevenue: potentialNet,
      annualRoi: roi,
      reductionIntensity: intensity,
    } = computeDetailMetrics(row, isScope3);
    return { potentialRevenue, potentialNet, intensity, roi };
  };

  /* ---- editable number cell ---- */
  const numCell = (
    row: DetailRow,
    field: Exclude<keyof DetailRow, 'year' | 'remark'>,
    precision = 4,
  ) => {
    if (isDetail) {
      const val = row[field];
      return <span>{val != null ? String(val) : '—'}</span>;
    }
    return (
      <InputNumber
        size='small'
        style={{ width: '100%', minWidth: 80 }}
        min={0}
        precision={precision}
        value={row[field] as number | undefined}
        onChange={val => updateRow(row.year, field, val ?? undefined)}
      />
    );
  };

  /* ---- remark text cell ---- */
  const remarkCell = (row: DetailRow, isLastRow = false) => {
    if (isDetail) {
      return <span>{row.remark || '—'}</span>;
    }
    return (
      <div style={isLastRow ? { paddingBottom: 8 } : undefined}>
        <AntdInput.TextArea
          size='small'
          value={row.remark ?? ''}
          maxLength={200}
          showCount
          autoSize={{ minRows: 1, maxRows: 2 }}
          placeholder={I18N.utils.pleaseEnter}
          styles={{ textarea: { paddingBottom: 22 } }}
          onChange={e => updateRow(row.year, 'remark', e.target.value)}
        />
      </div>
    );
  };

  /* ---- table columns（与列表页字段顺序、计算规则一致） ---- */
  const columns: ColumnsType<DetailRow> = useMemo(() => {
    const yearCol: ColumnsType<DetailRow>[number] = {
      title: '影响年份',
      dataIndex: 'year',
      width: 90,
      fixed: 'left',
      render: (y: number) => <Typography.Text strong>{y}年</Typography.Text>,
    };

    const scope12MetricCols: ColumnsType<DetailRow> = [
      {
        title: '年减排量（吨）',
        dataIndex: 'annualReduction',
        width: 140,
        render: (_, row) => numCell(row, 'annualReduction', 4),
      },
      {
        title: '碳价（元/吨）',
        dataIndex: 'carbonPrice',
        width: 130,
        render: (_, row) => numCell(row, 'carbonPrice', 4),
      },
      {
        title: '节约开支（元）',
        dataIndex: 'costSavings',
        width: 140,
        render: (_, row) => numCell(row, 'costSavings', 2),
      },
      {
        title: '潜在收益（元）',
        dataIndex: 'potentialRevenue',
        width: 140,
        render: (_, row) => (
          <span>{fmtNum(computedRow(row).potentialRevenue)}</span>
        ),
      },
      {
        title: '总成本（元）',
        dataIndex: 'totalCost',
        width: 130,
        render: (_, row) => numCell(row, 'totalCost', 2),
      },
      {
        title: '潜在净收益（元）',
        dataIndex: 'potentialNet',
        width: 150,
        render: (_, row) => (
          <span>{fmtNum(computedRow(row).potentialNet)}</span>
        ),
      },
      {
        title: '当年ROI（%）',
        dataIndex: 'roi',
        width: 130,
        render: (_, row) => {
          const { roi } = computedRow(row);
          return <span>{roi != null ? `${fmtNum(roi)}%` : '—'}</span>;
        },
      },
    ];

    const remarkCol: ColumnsType<DetailRow>[number] = {
      title: '备注',
      dataIndex: 'remark',
      width: 180,
      render: (_, row, index) =>
        remarkCell(row, index === detailRows.length - 1),
    };

    if (!isScope3) {
      return [yearCol, ...scope12MetricCols, remarkCol];
    }

    return [
      yearCol,
      scope12MetricCols[0],
      {
        title: '产量（万件）',
        dataIndex: 'production',
        width: 130,
        render: (_, row) => numCell(row, 'production', 4),
      },
      {
        title: '年减排强度（吨/万件）',
        dataIndex: 'intensity',
        width: 160,
        render: (_, row) => {
          const { intensity } = computedRow(row);
          return <span>{intensity != null ? fmtNum(intensity) : '—'}</span>;
        },
      },
      ...scope12MetricCols.slice(1),
      remarkCol,
    ];
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [isScope3, isDetail, detailRows]);

  /* ---- load detail ---- */
  const loadMeasureDetail = async () => {
    if (actionType !== add && measureId) {
      setLoading(true);
      const { data } = await getReductionMeasureDetailApi(measureId).finally(
        () => setLoading(false),
      );
      const measureInfo = data?.data ?? {};

      detailGhgClassifyLeafRef.current =
        measureInfo.ghgClassify != null
          ? Number(measureInfo.ghgClassify)
          : undefined;

      const rows = (
        (measureInfo.detailList as ReductionMeasureDetail[]) ?? []
      ).map(d => ({
        year: d.year ?? 0,
        annualReduction: d.annualReduction,
        production: d.production,
        carbonPrice: d.carbonPrice,
        costSavings: d.costSavings,
        totalCost: d.totalCost,
        remark: d.remark,
      }));

      const startVal = measureInfo.startTime
        ? dayjs(String(measureInfo.startTime), 'YYYY')
        : null;
      const endVal = measureInfo.endTime
        ? dayjs(String(measureInfo.endTime), 'YYYY')
        : null;

      // 直接按起止年拼接行，保留接口返回的已有数据
      if (startVal && endVal && startVal.year() <= endVal.year()) {
        setDetailRows(buildYearRows(startVal.year(), endVal.year(), rows));
      } else {
        setDetailRows(rows);
      }
      setPlanStart(startVal);
      setPlanEnd(endVal);

      const classifyPath =
        detailGhgClassifyLeafRef.current != null
          ? findGhgClassifyPath(
              ghgCategoryEnumTree,
              detailGhgClassifyLeafRef.current,
            ) ?? [detailGhgClassifyLeafRef.current]
          : undefined;

      form.setValues({
        measureName: measureInfo.measureName,
        measureDesc: measureInfo.measureDesc,
        ghgClassify: classifyPath,
        measureType: measureInfo.measureType,
        feasibilityType: measureInfo.feasibilityType,
      });

      if (classifyPath?.length) {
        syncScopeFromClassify(classifyPath);
      } else if (measureInfo.ghgCategory != null) {
        setClassifyFirstLevel(Number(measureInfo.ghgCategory) === 3 ? 3 : 1);
      }
    }
  };

  const buildPayload = (
    values: Record<string, unknown>,
  ): ReductionMeasureAddReq | ReductionMeasureEditReq => {
    const rawGhgClassify = values.ghgClassify as
      | number[]
      | number
      | string
      | undefined;
    let ghgClassify: number | undefined;
    let classifyPath: number[] = [];
    if (Array.isArray(rawGhgClassify)) {
      classifyPath = rawGhgClassify.map(Number).filter(n => !Number.isNaN(n));
      if (classifyPath.length > 0) {
        ghgClassify = classifyPath[classifyPath.length - 1];
      }
    } else if (rawGhgClassify != null && rawGhgClassify !== '') {
      ghgClassify = Number(rawGhgClassify);
      classifyPath = [ghgClassify];
    }
    const firstLevel = getGhgClassifyFirstLevel(
      classifyPath,
      ghgCategoryEnumTree,
    );
    const ghgCategory = toMeasureGhgCategory(firstLevel);

    const detailList = detailRows.map(row => ({
      year: row.year,
      annualReduction:
        row.annualReduction != null ? Number(row.annualReduction) : undefined,
      production:
        ghgCategory === 3 && row.production != null
          ? Number(row.production)
          : undefined,
      carbonPrice:
        row.carbonPrice != null ? Number(row.carbonPrice) : undefined,
      costSavings:
        row.costSavings != null ? Number(row.costSavings) : undefined,
      totalCost: row.totalCost != null ? Number(row.totalCost) : undefined,
      remark:
        typeof row.remark === 'string' && row.remark.trim()
          ? row.remark.trim()
          : undefined,
    }));

    const base: ReductionMeasureAddReq = {
      orgCode: orgCode ?? '',
      measureName: String(values.measureName ?? '').trim(),
      measureDesc: values.measureDesc
        ? String(values.measureDesc).trim()
        : undefined,
      ghgCategory,
      ghgClassify,
      measureType:
        values.measureType != null && values.measureType !== ''
          ? Number(values.measureType)
          : undefined,
      startTime: planStart ? planStart.format('YYYY') : '',
      endTime: planEnd ? planEnd.format('YYYY') : '',
      feasibilityType:
        values.feasibilityType != null && values.feasibilityType !== ''
          ? Number(values.feasibilityType)
          : undefined,
      detailList,
    };

    if (actionType === edit && measureId) {
      return { ...base, id: measureId } as ReductionMeasureEditReq;
    }
    return base;
  };

  const handleSubmit = async (values: Record<string, unknown>) => {
    if (!orgCode?.trim()) {
      Toast('warning', I18N.eca.pleaseSelectAnOrganization);
      return;
    }
    if (!planStart) {
      Toast('warning', I18N.eca.pleaseSelectAPlan2);
      return;
    }
    if (!planEnd) {
      Toast('warning', I18N.eca.pleaseSelectAPlan);
      return;
    }
    if (planStart.year() > planEnd.year()) {
      Toast('warning', '开始年份不能晚于结束年份');
      return;
    }
    setLoading(true);
    try {
      const payload = buildPayload(values);
      if (actionType === add) {
        await postReductionMeasureAddApi(payload as ReductionMeasureAddReq);
      } else if (actionType === edit) {
        await postReductionMeasureEditApi(payload as ReductionMeasureEditReq);
      }
      Toast('success', I18N.Factors.saveSuccessful);
      onSuccessSave?.();
    } finally {
      setLoading(false);
    }
  };

  const resetForm = () => {
    form.reset();
    setDetailRows([]);
    setPlanStart(null);
    setPlanEnd(null);
    setYearError(undefined);
    setClassifyFirstLevel(undefined);
    detailGhgClassifyLeafRef.current = undefined;
  };

  useEffect(() => {
    if (!visible) {
      resetForm();
      return;
    }
    if (actionType === add) {
      resetForm();
      const startVal = dayjs().startOf('year');
      const endVal = dayjs().add(4, 'year').startOf('year');
      setPlanStart(startVal);
      setPlanEnd(endVal);
      setDetailRows(buildYearRows(startVal.year(), endVal.year(), []));
      form.setValues({ measureType: 1, feasibilityType: 1 });
    } else {
      loadMeasureDetail();
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [visible, actionType, measureId]);

  return (
    <CustomDrawer
      title={titleMap[actionType as keyof typeof titleMap]}
      width='70%'
      isDetail={isDetail}
      onClose={onClose}
      visible={visible}
      loading={loading}
      onSave={
        isDetail
          ? undefined
          : async () => {
              await form.validate();
              await handleSubmit(form.values as Record<string, unknown>);
            }
      }
    >
      <Form form={form} previewTextPlaceholder='-'>
        <section style={{ marginBottom: 16 }}>
          <h3 style={{ marginBottom: 12, fontSize: 16, fontWeight: 600 }}>
            {I18N.Factors.basicInformation}
          </h3>
          <SchemaField schema={measureBaseSchema(ghgCategoryEnumTree)} />
          {/* 与上方 FormGrid 同列宽：startTime / endTime 占前两列，feasibilityType 占第三列 */}
          <AntdForm
            layout='vertical'
            style={{
              display: 'grid',
              gridTemplateColumns: 'repeat(3, 1fr)',
              columnGap: 25,
              rowGap: 2,
              marginTop: 2,
            }}
          >
            <AntdForm.Item
              label={I18N.eca.atTheBeginningOfThePlan}
              required
              validateStatus={yearError ? 'error' : undefined}
              style={{ marginBottom: 0 }}
            >
              <DatePicker
                picker='year'
                format='YYYY'
                style={{ width: '100%' }}
                value={planStart}
                disabled={isDetail}
                onChange={val => {
                  setPlanStart(val);
                  applyYearRange(val, planEnd);
                }}
              />
            </AntdForm.Item>
            <AntdForm.Item
              label={I18N.eca.whenThePlanIsCompleted}
              required
              validateStatus={yearError ? 'error' : undefined}
              help={yearError}
              style={{ marginBottom: 0 }}
            >
              <DatePicker
                picker='year'
                format='YYYY'
                style={{ width: '100%' }}
                value={planEnd}
                disabled={isDetail}
                onChange={val => {
                  setPlanEnd(val);
                  applyYearRange(planStart, val);
                }}
              />
            </AntdForm.Item>
          </AntdForm>
        </section>

        <Card
          size='small'
          title={<span style={{ fontWeight: 600 }}>减排效果 · 逐年数据</span>}
          extra={
            !isDetail ? (
              <span style={{ fontSize: 12, color: 'rgba(0,0,0,.45)' }}>
                {isScope3
                  ? '手动填写年减排量、产量、碳价、节约开支、总成本；潜在收益、年减排强度、潜在净收益、当年 ROI 自动计算'
                  : '手动填写年减排量、碳价、节约开支、总成本；潜在收益、潜在净收益、当年 ROI 自动计算'}
              </span>
            ) : undefined
          }
          bordered
          style={{ marginBottom: 16 }}
          styles={{ body: { padding: '8px 0 0' } }}
        >
          <Table<DetailRow>
            dataSource={detailRows}
            columns={columns}
            rowKey='year'
            size='small'
            pagination={false}
            scroll={{ x: 'max-content' }}
            locale={{ emptyText: '请先选择开始年份和结束年份' }}
            style={{ borderRadius: 0 }}
          />
        </Card>
      </Form>
    </CustomDrawer>
  );
};

export default MeasureInfoDrawer;
