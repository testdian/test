/**
 * @description 排放目标表格（可嵌入进度追踪看板等页面）
 */
import { Button, InputNumber, message } from 'antd';
import type { ColumnsType } from 'antd/es/table';
import { useCallback, useMemo, useState } from 'react';

import { HorizontalDragTable } from '@/components/HorizontalDragTable';
import { FormLabelWithNote, ModifyNote } from '@/components/ModifyNote';
import { SelectWithNote } from '@/components/ModifyNote/SelectWithNote';
import { useOrgTreeData } from '@/hooks/useOrgTreeData';
import { getYear } from '@/utils';

import styles from './index.module.less';
import { EmissionTargetTableRow, OrgTargetValues } from './type';
import {
  buildOrgCellMeta,
  buildMonthlyTargets,
  calcAnnualTarget,
  flattenOrgList,
  getOrgValues,
  resolvePrevYearActual,
} from './utils';

const PREV_YEAR_NOTE = '上一年度实际排放量（tCO₂e）可编辑';

const MONTHLY_TARGET_NOTE =
  '前面增加月度目标排放量：1月目标排放量（tCO2e）……12月目标排放量（tCO2e），用年度/12，可编辑';

const EDIT_SAVE_NOTE = '列表右上角增加按钮：编辑、保存两种状态切换。';

const YEAR_NOTE = '顶部展示年份切换器';

const MONTH_LABELS = Array.from({ length: 12 }, (_, index) => `${index + 1}月`);

const COLUMN_WIDTH = {
  orgName: 140,
  prevYearActual: 240,
  reductionRatio: 120,
  annualTarget: 190,
  monthlyTarget: 168,
  actualEmission: 150,
  achievementRatio: 200,
} as const;

const TABLE_SCROLL_X =
  COLUMN_WIDTH.orgName +
  COLUMN_WIDTH.prevYearActual +
  COLUMN_WIDTH.reductionRatio +
  COLUMN_WIDTH.annualTarget +
  COLUMN_WIDTH.monthlyTarget * 12 +
  COLUMN_WIDTH.actualEmission +
  COLUMN_WIDTH.achievementRatio;

function columnTitle(label: string) {
  return label;
}

type EmissionTargetTableProps = {
  /** 只读展示，隐藏编辑/保存 */
  readOnly?: boolean;
  /** 嵌入其他页面时使用，去掉独立页背景与最小高度 */
  embedded?: boolean;
  /** 嵌入时由外部 filterBar 控制年份，隐藏内部年份选择 */
  hideYearToolbar?: boolean;
  /** 外部受控年份（配合 hideYearToolbar） */
  year?: number;
  /** 年份变更回调（配合 hideYearToolbar） */
  onYearChange?: (year: number) => void;
  /** 供应商名称关键词，嵌入进度看板时过滤基地列表 */
  supplierKeyword?: string;
};

export function EmissionTargetTable({
  readOnly = false,
  embedded = false,
  hideYearToolbar = false,
  year: controlledYear,
  onYearChange,
  supplierKeyword = '',
}: EmissionTargetTableProps) {
  const currentYear = new Date().getFullYear();
  const [internalYear, setInternalYear] = useState(currentYear);
  const year = controlledYear ?? internalYear;
  const setYear = onYearChange ?? setInternalYear;
  const [orgTreeData] = useOrgTreeData({ filterVirtualOrg: true });
  const [targetStore, setTargetStore] = useState<
    Record<number, Record<string, OrgTargetValues>>
  >({});
  const [isEditing, setIsEditing] = useState(false);

  const editing = !readOnly && isEditing;
  const orgList = useMemo(() => flattenOrgList(orgTreeData), [orgTreeData]);
  const yearTargetMap = targetStore[year] || {};

  const updateOrgValue = useCallback(
    (orgCode: string, field: keyof OrgTargetValues, value?: number) => {
      setTargetStore(prev => {
        const current = getOrgValues(prev[year] || {}, orgCode);
        const next: OrgTargetValues = { ...current, [field]: value };

        if (field === 'prevYearActual' || field === 'reductionRatio') {
          next.monthlyTargets = undefined;
        }

        return {
          ...prev,
          [year]: {
            ...prev[year],
            [orgCode]: next,
          },
        };
      });
    },
    [year],
  );

  const updateMonthlyTarget = useCallback(
    (orgCode: string, monthIndex: number, value?: number) => {
      setTargetStore(prev => {
        const current = getOrgValues(prev[year] || {}, orgCode);
        const prevYear = resolvePrevYearActual(current, orgCode, year);
        const annualTarget = calcAnnualTarget(
          prevYear.value,
          current.reductionRatio,
        );
        const defaults = buildMonthlyTargets(annualTarget);
        const baseMonthly =
          current.monthlyTargets ??
          buildOrgCellMeta(current, orgCode, year).monthlyTargets ??
          defaults;
        const nextMonthly = [...baseMonthly];
        nextMonthly[monthIndex] =
          value === undefined || value === null ? defaults[monthIndex] : value;

        return {
          ...prev,
          [year]: {
            ...prev[year],
            [orgCode]: {
              ...current,
              monthlyTargets: nextMonthly,
            },
          },
        };
      });
    },
    [year],
  );

  const handleSave = () => {
    message.success('保存成功');
    setIsEditing(false);
  };

  const renderReadonlyValue = (
    value?: number,
    options?: { suffix?: string },
  ) => {
    if (value === undefined || value === null) {
      return <span className={styles.readonlyCell}>-</span>;
    }
    return (
      <span className={styles.readonlyCell}>
        {value}
        {options?.suffix ?? ''}
      </span>
    );
  };

  const tableData = useMemo<EmissionTargetTableRow[]>(() => {
    const keyword = supplierKeyword.trim().toLowerCase();
    return orgList
      .filter(
        org =>
          !keyword || org.name.toLowerCase().includes(keyword),
      )
      .map(org => {
      const meta = buildOrgCellMeta(
        getOrgValues(yearTargetMap, org.code),
        org.code,
        year,
      );

      return {
        key: org.code,
        orgName: org.name,
        prevYearActual: meta.prevYearActual,
        reductionRatio: meta.reductionRatio,
        annualTarget: meta.annualTarget,
        actualEmission: meta.actualEmission,
        monthlyTargets: meta.monthlyTargets,
        achievementRatio: meta.achievementRatio,
      };
    });
  }, [orgList, year, yearTargetMap, supplierKeyword]);

  const columns = useMemo<ColumnsType<EmissionTargetTableRow>>(() => {
    const monthlyColumns: ColumnsType<EmissionTargetTableRow> =
      MONTH_LABELS.map((monthLabel, monthIndex) => ({
        title:
          monthIndex === 0 ? (
            <span style={{ whiteSpace: 'nowrap' }}>
              <FormLabelWithNote
                label={`${monthLabel}目标排放量（tCO₂e）`}
                note={MONTHLY_TARGET_NOTE}
              />
            </span>
          ) : (
            columnTitle(`${monthLabel}目标排放量（tCO₂e）`)
          ),
        dataIndex: 'monthlyTargets',
        align: 'center' as const,
        width: COLUMN_WIDTH.monthlyTarget,
        render: (
          monthlyTargets: (number | undefined)[] | undefined,
          record,
        ) => {
          const value = monthlyTargets?.[monthIndex];
          if (!editing) {
            return renderReadonlyValue(value);
          }
          return (
            <InputNumber
              size='small'
              value={value}
              min={0}
              precision={2}
              placeholder='请输入'
              className={styles.compactInput}
              disabled={record.annualTarget === undefined}
              onChange={val =>
                updateMonthlyTarget(record.key, monthIndex, val ?? undefined)
              }
            />
          );
        },
      }));

    return [
      {
        title: columnTitle('基地名称'),
        dataIndex: 'orgName',
        width: COLUMN_WIDTH.orgName,
        fixed: 'left',
      },
      {
        title: (
          <span style={{ whiteSpace: 'nowrap' }}>
            <FormLabelWithNote
              label='上一年度实际排放量（tCO₂e）'
              note={PREV_YEAR_NOTE}
            />
          </span>
        ),
        dataIndex: 'prevYearActual',
        align: 'center' as const,
        width: COLUMN_WIDTH.prevYearActual,
        render: (value: number | undefined, record) => {
          if (!editing) {
            return renderReadonlyValue(value);
          }
          return (
            <InputNumber
              size='small'
              value={value}
              min={0}
              precision={2}
              placeholder='请输入'
              className={styles.compactInput}
              onChange={val =>
                updateOrgValue(record.key, 'prevYearActual', val ?? undefined)
              }
            />
          );
        },
      },
      {
        title: columnTitle('减排比例（%）'),
        dataIndex: 'reductionRatio',
        align: 'center' as const,
        width: COLUMN_WIDTH.reductionRatio,
        render: (value: number | undefined, record) => {
          if (!editing) {
            return renderReadonlyValue(value);
          }
          return (
            <InputNumber
              size='small'
              value={value}
              min={0}
              max={100}
              precision={1}
              placeholder='请输入'
              className={styles.compactInput}
              onChange={val =>
                updateOrgValue(record.key, 'reductionRatio', val ?? undefined)
              }
            />
          );
        },
      },
      {
        title: columnTitle('年度目标排放量（tCO₂e）'),
        dataIndex: 'annualTarget',
        align: 'center' as const,
        width: COLUMN_WIDTH.annualTarget,
        render: (value?: number) => renderReadonlyValue(value),
      },
      ...monthlyColumns,
      {
        title: columnTitle('实际排放量（tCO₂e）'),
        dataIndex: 'actualEmission',
        align: 'center' as const,
        width: COLUMN_WIDTH.actualEmission,
        render: (value?: number) => renderReadonlyValue(value),
      },
      {
        title: (
          <span style={{ whiteSpace: 'nowrap' }}>
            <FormLabelWithNote
              label='目标达成比例（%）'
              note='目标达成比例（%）=实际排放量/年度目标排放量'
            />
          </span>
        ),
        dataIndex: 'achievementRatio',
        align: 'center' as const,
        width: COLUMN_WIDTH.achievementRatio,
        render: (value?: number) =>
          renderReadonlyValue(value, {
            suffix: value !== undefined ? '%' : '',
          }),
      },
    ];
  }, [editing, updateMonthlyTarget, updateOrgValue]);

  return (
    <div className={embedded ? styles.embedded : styles.wrapper}>
      {(!hideYearToolbar || !readOnly) && (
        <div className={styles.toolbar}>
          {!hideYearToolbar && (
            <div className={styles.toolbarLeft}>
              <SelectWithNote
                note={YEAR_NOTE}
                value={year}
                className={styles.yearSelect}
                options={getYear(currentYear - 4, currentYear + 1).map(item => ({
                  label: `${item}年`,
                  value: item,
                }))}
                onChange={value => setYear(value as number)}
              />
            </div>
          )}
          {!readOnly && (
            <div
              className={
                hideYearToolbar ? styles.toolbarRightOnly : styles.toolbarRight
              }
            >
              {isEditing ? (
                <Button type='primary' onClick={handleSave}>
                  保存
                </Button>
              ) : (
                <Button type='primary' onClick={() => setIsEditing(true)}>
                  编辑
                </Button>
              )}
              <ModifyNote content={EDIT_SAVE_NOTE} />
            </div>
          )}
        </div>
      )}

      <HorizontalDragTable
        className={styles.table}
        bordered
        size='small'
        rowKey='key'
        pagination={false}
        scrollX={TABLE_SCROLL_X}
        columns={columns}
        dataSource={tableData}
        loading={!orgList.length}
      />
    </div>
  );
}
