import { ProColumns, ProTable } from '@ant-design/pro-components';
import I18N from '@src/lang/I18N';
import { compact } from 'lodash-es';
import { FC, useEffect, useMemo, useState } from 'react';

import LoadingButton from '@/components/LoadingButton';
import { checkAuth } from '@/layout/utills';
import { CarbonReductionPerms } from '@/router/utils/carbonReductionEnum';
import {
  commonRequestDownloadFile,
  extractFileNameFromUrl,
} from '@/utils/downBlobFile';

import { EmissionsCard } from './EmissionsCard';
import { FlexibleBarChart, FlexibleLineChart } from './chart';
import styles from './index.module.less';
import {
  getComputationReductionPlanOverviewInfoApi,
  getComputationReductionPlanTableDetailApi,
  getComputationReductionPlanTableDetailExportApi,
} from './service';
import { OverViewDataItem, ReductionOverviewEmissionRespData } from './type';

export interface CardData {
  label: string;
  value: number | string;
  children?: CardData[];
}

// 创建卡片数据的工厂函数
const createCardData = (
  label: string,
  value: number | string,
  children?: CardData[] | undefined,
): CardData => ({
  label,
  value,
  children,
});

export const EmissionsOverview: FC<{
  scopeType: string;
}> = ({ scopeType }) => {
  /** 设置数据概览数据 */
  const [overviewData, setOverviewData] =
    useState<ReductionOverviewEmissionRespData>();

  /** 表格数据 */
  const [tableData, setTableData] = useState<
    Record<string, OverViewDataItem>[]
  >([]);

  // 使用useMemo缓存计算结果
  const targetData = useMemo(
    () => [
      createCardData(
        I18N.eca.targetYear,
        `${overviewData?.targetYear || '-'}`,
        [
          createCardData(
            I18N.eca.targetYearRanking,
            Number(overviewData?.targetEmission),
          ),
        ],
      ),
    ],
    [overviewData],
  );

  const latestData = useMemo(
    () => [
      createCardData(
        I18N.eca.latestYear,
        `${overviewData?.latestYear || '-'}`,
        [
          createCardData(
            I18N.eca.latestYearActual,
            Number(overviewData?.latestEmission),
          ),
        ],
      ),
    ],
    [overviewData],
  );

  const predictData = useMemo(
    () => [
      createCardData(
        I18N.eca.predictForTheNextYear,
        `${overviewData?.predictYear || '-'}`,
        [
          createCardData(
            I18N.eca.sbtEmissions2,
            Number(overviewData?.predictSbtEmission),
          ),
          createCardData(
            I18N.eca.bauEmissions2,
            Number(overviewData?.predictBauEmission),
          ),
          createCardData(
            I18N.eca.bapEmissions2,
            Number(overviewData?.predictBapEmission),
          ),
        ],
      ),
    ],
    [overviewData],
  );

  /** 获取数据概览数据 */
  const getEmissionDataByGhg = async () => {
    if (!scopeType.length) return;
    const { data } = await getComputationReductionPlanOverviewInfoApi({
      scopeType,
    });
    setOverviewData(data?.data);
  };

  // 动态生成列配置
  const customLeftColumns = [
    {
      title: I18N.Factors.year,
      dataIndex: 'mainGroup',
      width: 150,
      fixed: 'left',
      colSpan: 3,
      render: (_: any, row: any) => {
        if (row.subGroupIndex === -1) {
          // 普通行合并三列
          return { children: row.mainGroup, props: { colSpan: 3, rowSpan: 1 } };
        }
        // 分组行
        if (row.mainGroup && row.subGroupIndex === 0) {
          return { children: row.mainGroup, props: { rowSpan: 4, colSpan: 1 } };
        }
        if (row.mainGroup) {
          return { children: '', props: { rowSpan: 0, colSpan: 0 } };
        }
        return { children: '', props: {} };
      },
    },
    {
      title: '',
      dataIndex: 'subGroup',
      width: 110,
      fixed: 'left',
      colSpan: 0,
      render: (_: any, row: any) => {
        if (row.subGroupIndex === -1) {
          // 普通行隐藏
          return { children: '', props: { colSpan: 0 } };
        }
        // SBT/BAU/BAP分组下的Total、范围1&2合并两列
        if (row.subGroupIndex === 0) {
          return {
            children: <div className={styles.totalCell}>{I18N.eca.total}</div>,
            props: { colSpan: 2, rowSpan: 1 },
          };
        }
        if (row.subGroupIndex === 1) {
          return {
            children: I18N.eca.scope1AndScope,
            props: { colSpan: 2, rowSpan: 1 },
          };
        }
        // 范围三及其子项
        if (row.subGroupIndex === 2) {
          return {
            children: I18N.eca.fanWeisan,
            props: { colSpan: 1, rowSpan: 2 },
          };
        }
        if (row.subGroupIndex === 3) {
          return { children: '', props: { colSpan: 0, rowSpan: 0 } };
        }
        return { children: '', props: {} };
      },
    },
    {
      title: '',
      dataIndex: 'subSubGroup',
      width: 90,
      fixed: 'left',
      colSpan: 0,
      render: (_: any, row: any) => {
        if (row.subGroupIndex === -1) {
          // 普通行隐藏
          return { children: '', props: { colSpan: 0 } };
        }
        // 范围三下的Total、范围3.4
        if (row.subGroupIndex === 2) {
          return {
            children: I18N.eca.total,
            props: { colSpan: 1, rowSpan: 1 },
          };
        }
        if (row.subGroupIndex === 3) {
          return {
            children: I18N.eca.fanWeisan2,
            props: { colSpan: 1, rowSpan: 1 },
          };
        }
        return { children: '', props: { colSpan: 0, rowSpan: 0 } };
      },
    },
  ];

  // 生成三列分组结构的数据
  const generateCustomDataSource = (
    data: Record<string, OverViewDataItem>[],
  ) => {
    // 其它非分组指标
    const indicatorMap = [
      { title: I18N.eca.latestYearActual3, dataIndex: 'actualEmission' },
      {
        title: I18N.eca.targetEmissionReduction,
        dataIndex: 'targetEmissionReduction',
      },
      { title: I18N.eca.targetEmissions, dataIndex: 'targetEmission' },
      { title: I18N.eca.actualAnnualNetSales, dataIndex: 'actualNetSales' },
      { title: I18N.eca.predictAnnualNetSales, dataIndex: 'predictedNetSales' },
      {
        title: I18N.eca.actualEmissionReduction,
        dataIndex: 'actualEmissionReduction',
      },
    ];
    const rows: any[] = [];
    // 先加非分组指标
    indicatorMap.forEach(({ title, dataIndex }, idx) => {
      const row: any = {
        key: `other-${idx}`,
        mainGroup: title,
        subGroup: '',
        subSubGroup: '',
        subGroupIndex: -1,
      };
      Object.keys(data).forEach(year => {
        const yearData = data[year as unknown as number] as OverViewDataItem;
        row[year] = (yearData as any)[dataIndex] ?? null;
      });
      rows.push(row);
    });
    // SBT/BAU/BAP分组
    const groupDefs = [
      {
        mainGroup: I18N.eca.sbtEmissions7,
        fields: [
          { subGroupIndex: 0, dataIndex: 'sbtTotal' },
          { subGroupIndex: 1, dataIndex: 'sbtScope12' },
          { subGroupIndex: 2, dataIndex: 'sbtScope3' },
          { subGroupIndex: 3, dataIndex: 'sbtScope34' },
        ],
      },
      {
        mainGroup: I18N.eca.bauEmissions7,
        fields: [
          { subGroupIndex: 0, dataIndex: 'bauTotal' },
          { subGroupIndex: 1, dataIndex: 'bauScope12' },
          { subGroupIndex: 2, dataIndex: 'bauScope3' },
          { subGroupIndex: 3, dataIndex: 'bauScope34' },
        ],
      },
      {
        mainGroup: I18N.eca.bapEmissions7,
        fields: [
          { subGroupIndex: 0, dataIndex: 'bapTotal' },
          { subGroupIndex: 1, dataIndex: 'bapScope12' },
          { subGroupIndex: 2, dataIndex: 'bapScope3' },
          { subGroupIndex: 3, dataIndex: 'bapScope34' },
        ],
      },
    ];
    groupDefs.forEach(group => {
      group.fields.forEach(field => {
        const row: any = {
          key: `${group.mainGroup}-${field.dataIndex}`,
          mainGroup: group.mainGroup,
          subGroupIndex: field.subGroupIndex,
        };
        // 组内数据
        Object.keys(data).forEach(year => {
          const yearData = data[year as unknown as number] as OverViewDataItem;
          row[year] = (yearData as any)[field.dataIndex] ?? null;
        });
        rows.push(row);
      });
    });
    return rows;
  };

  // 右侧年份列
  const yearColumns = Object.keys(tableData).map(year => ({
    title: year,
    dataIndex: year,
    width: 160,
    render: (text: any) => (text === null ? '-' : text),
  }));

  // 合并columns
  const columns = [...customLeftColumns, ...yearColumns];
  const dataSource = generateCustomDataSource(tableData);

  /** 获取详情表格数据 */
  const getDetailTableData = async () => {
    const { data } = await getComputationReductionPlanTableDetailApi();
    // @ts-ignore
    setTableData(data?.data);
  };

  useEffect(() => {
    getEmissionDataByGhg();
    getDetailTableData();
  }, [scopeType]);

  return (
    <div className={styles.dataOverContainer}>
      <div className={styles.cardGrid}>
        <EmissionsCard data={targetData} />
        <EmissionsCard data={latestData} />
        <EmissionsCard data={predictData} className={styles.predictCard} />
      </div>
      {/*  tip提示 */}
      <div className='baseText12Color666 flex self-end'>
        {I18N.eca.bauFullName}
      </div>
      {/*  折线图 横轴：2019-目标年份，纵轴：排放量（tCO₂e），展示实际排放量（tCO₂e）、SBT排放量（tCO₂e）、BAU排放量（tCO₂e）、BAP排放量（tCO₂e） */}
      <div className={styles.chartContainer}>
        <h3>{I18N.carbonFootPrintLCA.totalEmissions}</h3>
        {/* 折线图 */}
        <FlexibleLineChart
          data={overviewData?.valueList || []}
          xKey='year'
          series={[
            { key: 'actualValue', name: I18N.eca.actualEmissions },
            { key: 'sbtValue', name: I18N.eca.sbtEmissions },
            { key: 'bauValue', name: I18N.eca.bauEmissions },
            { key: 'bapValue', name: I18N.eca.bapEmissions },
          ]}
          yName={I18N.eca.unitTCo}
          xName={I18N.Factors.year}
        />
        {/* 柱状图 */}
        <FlexibleBarChart
          data={overviewData?.nameValueList || []}
          xKey='name'
          series={[{ key: 'value', name: I18N.carbonData.emissions }]}
          yName={I18N.eca.unitTCo}
          xName={I18N.Factors.year}
        />
      </div>

      {/* 数据详情表格区域 */}
      <div className={styles.chartContainer}>
        <ProTable
          headerTitle={I18N.eca.dataDetails}
          search={false}
          columns={columns as ProColumns<any, 'text'>[]} // 修复类型不兼容问题
          dataSource={dataSource}
          pagination={false}
          options={false}
          bordered
          scroll={{
            x: 'max-content',
          }}
          toolBarRender={() => {
            return compact([
              checkAuth(
                CarbonReductionPerms.targetExport,
                <LoadingButton
                  type='primary'
                  onClick={async () => {
                    const { data } =
                      await getComputationReductionPlanTableDetailExportApi();
                    const url = data?.data;
                    if (!url) return;
                    const fileName = extractFileNameFromUrl(url);
                    commonRequestDownloadFile(url, decodeURI(fileName));
                  }}
                >
                  {I18N.eca.export}
                </LoadingButton>,
              ),
            ]);
          }}
          size='small'
        />
      </div>
    </div>
  );
};

export default EmissionsOverview;
