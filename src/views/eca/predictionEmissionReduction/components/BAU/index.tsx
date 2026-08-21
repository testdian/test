/**
 * BAU（Business As Usual）Tab
 * 排放量/增长率在编辑态失焦时提交 `reductionBau/edit`，由服务端计算 BAU；列表刷新后展示接口 `bau`。
 * 「保存」仅结束编辑态；「取消」退出编辑并重新拉列表。
 *
 * 接口：`GET /computation/reductionBau/list`，`POST /computation/reductionBau/edit`
 * baseYear、orgCode 由父组件传入；scopeType：范围1+2 → 1，范围3 → 3。
 */
import I18N from '@src/lang/I18N';
import { Button, InputNumber, Select, Table } from 'antd';
import React, { useEffect, useRef, useState } from 'react';

import { checkAuth } from '@/layout/utills';
import { CarbonReductionPerms } from '@/router/utils/carbonReductionEnum';

import style from './index.module.less';
import { getBauListApi, postBauEditApi } from './service';
import { BauYearRow, ReductionBau } from './type';

type EditRowMap = Record<number, { emission?: number; growth?: number }>;

function mapApiToRows(list: ReductionBau[]): BauYearRow[] {
  return list
    .filter(
      (r): r is ReductionBau & { id: number; year: number } =>
        typeof r.id === 'number' && typeof r.year === 'number',
    )
    .map(r => ({
      id: r.id,
      year: r.year,
      emission: r.carbonEmission,
      growth: r.outputGrowthRate,
      bauFromApi: r.bau,
    }))
    .sort((a, b) => a.year - b.year);
}

/** BAU Tab 所需的外部 props（基准年和组织范围由父组件统一管理） */
interface BauProps {
  /** 已保存的基准年，由父组件传入；编辑下拉改年不会更新此值，保存后由 refreshKey 刷新 */
  baseYear: number;
  /** 组织范围 orgCode，由父组件传入，变化时重新请求数据 */
  orgCode?: string;
  /** 父组件保存基准年后递增，触发全量刷新 */
  refreshKey?: number;
}

const Bau: React.FC<BauProps> = ({ baseYear, orgCode, refreshKey = 0 }) => {
  const [scope, setScope] = useState<string>('12');
  const [editing, setEditing] = useState(false);

  const scopeOptions = [
    { label: I18N.eca.scopeOneScope, value: '12' },
    { label: I18N.eca.fanWeisan, value: '3' },
  ];

  /** 表格行数据 */
  const [rows, setRows] = useState<BauYearRow[]>([]);

  /** 编辑中的行数据（与 rows 合并为提交值；失焦后与服务端对齐） */
  const [editRows, setEditRows] = useState<EditRowMap>({});

  const [loading, setLoading] = useState(false);

  const rowsRef = useRef(rows);
  rowsRef.current = rows;
  const editRowsRef = useRef(editRows);
  editRowsRef.current = editRows;
  const editingRef = useRef(editing);
  editingRef.current = editing;

  /** 加载 BAU 数据；失焦刷新时可 silent，避免整表 loading 闪烁 */
  const fetchBauData = async (options?: {
    silent?: boolean;
    resyncEditRows?: boolean;
  }) => {
    if (!orgCode?.trim()) {
      setRows([]);
      return;
    }
    if (!options?.silent) setLoading(true);
    try {
      const scopeType = scope === '12' ? 1 : 3;
      const { data } = await getBauListApi({
        orgCode: orgCode.trim(),
        scopeType,
      });
      const rawList = data?.data as ReductionBau[] | undefined;
      const list = Array.isArray(rawList) ? rawList : [];
      if (!list.length) {
        setRows([]);
        return;
      }
      const nextRows = mapApiToRows(list);
      setRows(nextRows);
      if (options?.resyncEditRows && editingRef.current) {
        const snap: EditRowMap = {};
        nextRows.forEach(r => {
          snap[r.year] = { emission: r.emission, growth: r.growth };
        });
        setEditRows(snap);
      }
    } finally {
      if (!options?.silent) setLoading(false);
    }
  };

  /** 当范围（scope）/ 组织范围（orgCode）变化时重新请求；基准年保存后由 refreshKey 触发 */
  useEffect(() => {
    fetchBauData();
  }, [scope, orgCode]);

  useEffect(() => {
    if (!refreshKey) return;
    fetchBauData();
  }, [refreshKey]);

  /** 进入编辑态：快照当前数据到 editRows */
  const enterEdit = () => {
    const snapshot: EditRowMap = {};
    rows.forEach(r => {
      snapshot[r.year] = { emission: r.emission, growth: r.growth };
    });
    setEditRows(snapshot);
    setEditing(true);
  };

  /** 取消编辑：退出编辑态并重新拉列表 */
  const cancelEdit = () => {
    setEditing(false);
    setEditRows({});
    fetchBauData().catch(() => {});
  };

  /** 保存：仅结束编辑态（数据已在输入框失焦时提交） */
  const handleSave = () => {
    setEditing(false);
    setEditRows({});
  };

  const formatBau = (val: number) =>
    val.toLocaleString('zh-CN', { maximumFractionDigits: 3 });

  /** BAU 仅展示接口字段（编辑后由失焦 → edit → 再 list 刷新） */
  const formatBauCell = (bauFromApi?: number) =>
    bauFromApi != null && !isNaN(bauFromApi) ? formatBau(bauFromApi) : '—';

  /** 非基准年：失焦时若有变更则调编辑接口并静默刷新列表 */
  const persistRowOnBlur = async (year: number) => {
    if (!editingRef.current || year === baseYear) return;
    const row = rowsRef.current.find(r => r.year === year);
    if (!row) return;
    const curE = editRowsRef.current[year]?.emission ?? row.emission;
    const curG = editRowsRef.current[year]?.growth ?? row.growth;
    const norm = (v: number | undefined) =>
      v == null || Number.isNaN(v) ? undefined : v;
    const sameE = norm(curE) === norm(row.emission);
    const sameG = norm(curG) === norm(row.growth);
    if (sameE && sameG) return;
    try {
      await postBauEditApi({
        id: row.id,
        carbonEmission: curE,
        outputGrowthRate: curG,
      });
      await fetchBauData({ silent: true, resyncEditRows: true });
    } catch {
      // 错误提示由 request 拦截器处理
    }
  };

  /** 空值占位符 */
  const emptyDash = <span style={{ color: '#ccc' }}>—</span>;

  /** 排放量列标题（范围1+2 和 范围3 显示不同文案） */
  const emissionColTitle =
    scope === '12' ? '范围1+2排放量（tCO₂e）' : '范围3强度值（tCO₂e/万件）';

  /** view 态列 */
  const viewColumns = [
    {
      title: '年份',
      dataIndex: 'year',
      width: 140,
      render: (year: number) =>
        year === baseYear ? (
          <span className={style.baseTag}>{year}年（基准年）</span>
        ) : (
          <span className={style.yearTag}>{year}年</span>
        ),
    },
    {
      title: emissionColTitle,
      dataIndex: 'emission',
      align: 'center' as const,
      render: (val: number, row: BauYearRow) => {
        if (row.year === baseYear) return val?.toLocaleString() ?? '—';
        if (val != null) return val.toLocaleString();
        return emptyDash;
      },
    },
    {
      title: '产值增长率（倍数）',
      dataIndex: 'growth',
      align: 'center' as const,
      render: (val: number, row: BauYearRow) => {
        if (row.year === baseYear) return emptyDash;
        if (val != null) return val;
        return emptyDash;
      },
    },
    {
      title: 'BAU（自动计算）',
      dataIndex: 'bau',
      align: 'center' as const,
      render: (_: unknown, row: BauYearRow) => {
        if (row.year === baseYear) return emptyDash;
        return (
          <span className={style.autoVal}>{formatBauCell(row.bauFromApi)}</span>
        );
      },
    },
  ];

  /** edit 态列 */
  const editColumns = [
    {
      title: '年份',
      dataIndex: 'year',
      width: 150,
      render: (year: number) =>
        year === baseYear ? (
          <span className={style.baseTag}>{year}年（基准年）</span>
        ) : (
          <span className={style.yearTag}>{year}年</span>
        ),
    },
    {
      title: emissionColTitle,
      dataIndex: 'emission',
      align: 'center' as const,
      render: (val: number, row: BauYearRow) => {
        if (row.year === baseYear) return val?.toLocaleString() ?? '—';
        return (
          <InputNumber
            size='small'
            value={editRows[row.year]?.emission}
            placeholder='请输入'
            style={{ width: 120 }}
            onChange={v =>
              setEditRows(prev => ({
                ...prev,
                [row.year]: { ...prev[row.year], emission: v ?? undefined },
              }))
            }
            onBlur={() => {
              persistRowOnBlur(row.year).catch(() => {});
            }}
          />
        );
      },
    },
    {
      title: '产值增长率（倍数，如 1.05 代表增长5%）',
      dataIndex: 'growth',
      align: 'center' as const,
      render: (_: unknown, row: BauYearRow) => {
        if (row.year === baseYear) return emptyDash;
        return (
          <InputNumber
            size='small'
            value={editRows[row.year]?.growth}
            placeholder='如 1.05'
            step={0.01}
            min={0}
            style={{ width: 120 }}
            onChange={v =>
              setEditRows(prev => ({
                ...prev,
                [row.year]: { ...prev[row.year], growth: v ?? undefined },
              }))
            }
            onBlur={() => {
              persistRowOnBlur(row.year).catch(() => {});
            }}
          />
        );
      },
    },
    {
      title: 'BAU（自动计算）',
      align: 'center' as const,
      render: (_: unknown, row: BauYearRow) => {
        if (row.year === baseYear) return emptyDash;
        return (
          <span className={style.autoVal}>{formatBauCell(row.bauFromApi)}</span>
        );
      },
    },
  ];

  return (
    <div>
      {/* 头部：范围切换 + 操作按钮（基准年由父组件全局控制，此处仅展示提示） */}
      <div className={style.bauHeader}>
        <Select
          value={scope}
          options={scopeOptions}
          onChange={v => {
            setScope(v);
            setEditing(false);
            setEditRows({});
          }}
          style={{ width: 120 }}
          disabled={editing}
        />
        <span className={style.bauScopeHint}>
          以基准年（{baseYear}年）数值为基础，自动计算各年 BAU
        </span>
        <div className={style.bauActions}>
          {!editing &&
            checkAuth(
              CarbonReductionPerms.bauEdit,
              <Button type='primary' size='small' onClick={enterEdit}>
                编辑
              </Button>,
            )}
          {editing && (
            <>
              <Button size='small' onClick={cancelEdit}>
                取消
              </Button>
              <Button type='primary' size='small' onClick={handleSave}>
                保存
              </Button>
            </>
          )}
        </div>
      </div>

      {/* 编辑提示 */}
      {editing && (
        <div className={style.bauNote}>
          * 有实际数据的年份自动填入，可编辑修改；产值增长率填写倍数（如 1.05
          代表增长5%）。修改后失焦将自动保存并由系统重算 BAU。
        </div>
      )}

      {/* 数据表格 */}
      <div className={style.bauWrap}>
        <Table
          loading={loading}
          columns={editing ? editColumns : viewColumns}
          dataSource={rows}
          rowKey={r => `${r.id}-${r.year}`}
          pagination={false}
          size='small'
          scroll={{ y: 480 }}
          bordered
        />
      </div>
    </div>
  );
};

export default Bau;
