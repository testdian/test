import { ProColumns } from '@ant-design/pro-components';
import { compact } from 'lodash-es';

import { TableActions } from '@/components/Table/TableActions';
import I18N from '@/lang/I18N';
import { checkAuth } from '@/layout/utills';
import { ActionTypeEnum } from '@/utils/actionType';

import { PERIOD_TYPE_MAP } from './const';
import { IndicatorInfoTableItemDatum } from './type';

const { YEAR, QUARTER, MONTH } = PERIOD_TYPE_MAP;

/** 动态渲染指标表头 */
export const generatePeriodColumns = ({
  periodType,
  year,
  indexStatisticalName,
  handelTableAction,
}: {
  /** 周期类型  */
  periodType: number;
  /** 年份 */
  year: string;
  /** 统计维度名称 */
  indexStatisticalName: string;
  /** 表格操作 */
  handelTableAction: (
    type: ActionTypeEnum,
    record: IndicatorInfoTableItemDatum,
  ) => void;
}) => {
  // 公共列配置
  const baseColumns: ProColumns<any, 'text'>[] = [
    {
      title: I18N.eca.organizationName1,
      dataIndex: 'orgName',
      fixed: 'left',
    },
  ];

  // 根据周期类型生成不同列
  if (periodType === YEAR) {
    // 年类型
    baseColumns.push({
      title: I18N.template(I18N.eca.strin, { val1: String(year) }),
      dataIndex: 'value1',
    });
  } else if (periodType === QUARTER) {
    // 季度
    baseColumns.push(
      ...[1, 2, 3, 4].map(quarter => ({
        title: I18N.template(I18N.eca.theFourthQuarter, { val1: quarter }),
        dataIndex: `value${quarter}`,
        ellipsis: true,
        width: 100,
      })),
    );
  } else if (periodType === MONTH) {
    // 月
    baseColumns.push(
      ...Array.from({ length: 12 }, (_, i) => ({
        title: I18N.template(I18N.eca.monthI, { val1: i + 1 }),
        dataIndex: `value${i + 1}`,
        width: 100,
        ellipsis: true,
      })),
    );
  }

  // 添加固定列
  baseColumns.push(
    {
      title: indexStatisticalName,
      dataIndex: 'dataValue',
      width: 140,
      ellipsis: true,
    },
    {
      title: I18N.Factors.updatedBy,
      dataIndex: 'updateByName',
      width: 140,
      ellipsis: true,
    },
    {
      title: I18N.Factors.updateTime,
      dataIndex: 'updateTime',
      width: 200,
      ellipsis: true,
    },
    {
      title: I18N.Factors.operation,
      dataIndex: 'action',
      fixed: 'right',
      renderText: (_, record) => {
        return (
          <TableActions
            menus={compact([
              checkAuth('/pom/data/edit', {
                label: I18N.Factors.edit,
                key: I18N.Factors.edit,
                onClick: async () => {
                  if (!record.id) return;
                  handelTableAction(ActionTypeEnum.EDIT, record);
                  // setTableModalType(edit);
                  // setTableItemInfo(record);
                  // setTableModalVisible(true);
                },
              }),
              checkAuth('/pom/data/delete', {
                label: I18N.Factors.delete,
                key: I18N.Factors.delete,
                onClick: async () => {
                  if (!record.id) return;
                  handelTableAction(ActionTypeEnum.DELETE, record);
                },
              }),
              checkAuth('/pom/data/show', {
                label: I18N.Factors.check,
                key: I18N.Factors.check,
                onClick: async () => {
                  if (!record.id) return;
                  handelTableAction(ActionTypeEnum.SHOW, record);
                  // setTableModalType(show);
                  // setTableItemInfo(record);
                  // setTableModalVisible(true);
                },
              }),
            ])}
          />
        );
      },
    },
  );

  return baseColumns;
};
