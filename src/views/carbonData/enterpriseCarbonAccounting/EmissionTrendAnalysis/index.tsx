/**
 * @deprecated 排放量趋势分析
 */
import {
  LightFilter,
  ProFormInstance,
  ProFormRadio,
} from '@ant-design/pro-components';
import I18N from '@src/lang/I18N';
import { Col, Row, Table } from 'antd';
import { EChartsOption } from 'echarts';
import ReactECharts from 'echarts-for-react';
import { filter } from 'lodash-es';
import { FC, useEffect, useMemo, useRef, useState } from 'react';

import { getMainComputationList } from '@/api/compution';
import {
  EmissionTrendResp,
  getComputationDataDashboardEmissionTrendAnalysis,
  postComputationDataDashboardDownloadEmissionTrend,
} from '@/sdks_v2/new/computationV2ApiDocs';
import { Toast } from '@/utils';

// import Dropdown from './Dropdown';
import style from './index.module.less';
import { downloadFile, generateImgName, useDownloadHandler } from '../commonFn';
import { DateYearRangePicker } from '../component/DateYearRangePicker';
import DownloadIcon from '../component/DownloadIcon';
import FlexCards from '../component/FlexCards';
import {
  BUTTON,
  BUTTON_ALL_OPTION,
  COMMON_BAR_WIDTH,
  COMMON_COLOR,
} from '../constant';
import { CommonProps } from '../type';

/** 组织名称 */
let orgName = '';

const EmissionTrendAnalysis: FC<CommonProps> = ({
  topSearchFormValues,
  selectOrgName,
}) => {
  const emissionSearchForm = useRef<ProFormInstance>();

  const [emissionData, setEmissionData] = useState<EmissionTrendResp>();
  const [computationData, setComputationData] = useState<any>();

  const [seriesData, setSeriesData] = useState<{
    xData: string[];
    series: EChartsOption['series'];
    legendData: string[];
  }>({
    xData: [],
    series: [],
    legendData: [],
  });

  /** 是否是总量 */
  const [isTotal, setIsTotal] = useState(true);

  /** 排放量卡片数据 */
  const cardsOptions = [
    {
      label: I18N.carbonData.emissionsForThisYear,
      unit: '(tCO₂e)',
      value: emissionData?.carbonEmission,
    },
    {
      label: I18N.carbonData.lastYearsEmissions,
      unit: '(tCO₂e)',
      value: emissionData?.lastYearCarbonEmission,
    },
    {
      label: I18N.carbonData.yoY,
      unit: '(%)',
      value: emissionData?.carbonEmissionRatio,
      growth: emissionData?.growth,
    },
  ];

  /** echarts option */
  const option: EChartsOption = {
    color: COMMON_COLOR,
    barWidth: COMMON_BAR_WIDTH,
    tooltip: {
      trigger: 'axis',
      axisPointer: {
        // 坐标轴指示器，坐标轴触发有效
        type: 'shadow',
      },
    },
    legend: {
      itemWidth: 14,
      itemHeight: 6,
      data: [...seriesData.legendData, I18N.carbonData.yoY],
    },
    grid: {
      left: '40',
      right: '40',
      bottom: '16',
      top: '70',
      containLabel: true,
    },
    xAxis: [
      {
        type: 'category',
        data: seriesData.xData,
        axisLine: {
          lineStyle: {
            color: '#999EA4',
          },
        },
      },
    ],
    yAxis: [
      {
        type: 'value',
        axisLabel: {
          color: '#999EA4',
          fontSize: 12,
        },
        axisLine: {
          show: false,
        },
        name: I18N.carbonData.unitTCo2,
        nameTextStyle: {
          color: '#999EA4',
          fontWeight: 400,
          fontSize: 12,
        },
        splitLine: {
          // 修改网格线为虚线并设置颜色
          lineStyle: {
            type: 'dashed',
            color: '#D2D6DA',
          },
        },
      },
      {
        type: 'value',
        name: I18N.carbonData.unit,
        nameTextStyle: {
          color: '#999EA4',
          fontWeight: 400,
          fontSize: 12,
        },
        axisLine: {
          show: false,
        },
        splitLine: {
          show: false,
        },
        axisLabel: {
          color: '#999EA4',
          fontSize: 12,
        },
      },
    ],
    series: seriesData.series,
  };

  /** 下载图片 */
  const downloadImgFn = useDownloadHandler(
    () =>
      generateImgName(
        orgName,
        emissionSearchForm,
        I18N.carbonData.emissionTrend,
      ),
    'trendAnalysisPng',
  );

  /** 下载清单功能 */
  const getTableExcel = async () => {
    await postComputationDataDashboardDownloadEmissionTrend(
      {
        ...topSearchFormValues,
        ...emissionSearchForm.current?.getFieldsFormatValue?.(),
      },
      {
        responseType: 'blob',
      },
    ).then(res => {
      downloadFile(res?.data, res);
    });
  };

  /** 获取数据 */
  const getEmissionData = async () => {
    const { data } = await getComputationDataDashboardEmissionTrendAnalysis({
      ...topSearchFormValues,
      ...emissionSearchForm.current?.getFieldsFormatValue?.(),
    });

    setEmissionData(data?.data);

    orgName = selectOrgName || '';
  };

  /** 处理Echarts数据 */
  const renderEchartsData = () => {
    const xData = emissionData?.trendChart?.dataX || [];
    const yData = emissionData?.trendChart?.dataY || [];

    /** 不需要展示的图例 */
    const filterLegend = isTotal
      ? [I18N.carbonData.comparedToTheBaseYear]
      : [I18N.carbonData.totalEmissions];

    const renderData = filter(
      yData,
      ({ name }) => !filterLegend.includes(name || ''),
    );

    const legendData: string[] = [];

    /** 提取图例数据 */
    const series = renderData?.map(item => {
      if (item.name === I18N.carbonData.yoY) {
        return {
          name: item.name,
          type: 'line',
          data: item?.value,
          yAxisIndex: 1,
        };
      }

      legendData.push(item.name || '');

      if (item.name === I18N.carbonData.baseYearEmissions) {
        return {
          name: item.name,
          type: 'line',
          data: item?.value,
          symbol: 'none',
        };
      }
      return {
        name: item.name,
        type: 'bar',
        stack: I18N.carbonData.stacking,
        data: item?.value,
      };
    }) as EChartsOption['series'];

    setSeriesData(pre => ({
      ...pre,
      xData,
      series,
      legendData,
    }));
  };

  /** 处理表格表头 */
  const renderColumns = () => {
    const yearColumn = {
      title: I18N.carbonData.year,
      dataIndex: 'year',
      width: 80,
      fixed: 'left',
    };
    const computationNameColumn = {
      title: I18N.eca.accountingName,
      dataIndex: 'computationName',
      width: 80,
      fixed: 'left',
    };
    // const orgNameColumn = {
    //   title: I18N.carbonData.organizationName,
    //   dataIndex: 'orgName',
    //   width: 80,
    //   fixed: 'left',
    // };

    const dataColumns =
      emissionData?.trendChart?.dataY?.map(item => {
        return {
          title:
            item.name === I18N.carbonData.yoY ||
            item.name === I18N.carbonData.comparedToTheBaseYear
              ? `${item.name}（%）`
              : `${item.name}（tCO₂e）`,
          dataIndex: item.name || '',
          width: 140,
        };
      }) || [];

    return [yearColumn, computationNameColumn, ...dataColumns] || [];
  };

  /** 处理表格数据 */
  const renderDataSource = useMemo(() => {
    const yearArray = emissionData?.trendChart?.dataX || [];
    const dataArray = emissionData?.trendChart?.dataY || [];
    const dataSource = yearArray?.map((year, index) => {
      const row: { [key: string]: string } = { year };
      dataArray?.forEach(series => {
        const columnName = series?.name || '';
        const columnValue = series?.value?.[index];
        row[columnName] = columnValue || '-';
        row.computationName =
          computationData?.filter(
            (item: { year: string }) => Number(item.year) === Number(year),
          )[0]?.computationName || '-';
        row.orgName =
          computationData?.filter(
            (item: { year: string }) => Number(item.year) === Number(year),
          )[0]?.orgName || '-';
      });
      return row;
    });
    return dataSource || [];
  }, [emissionData, computationData]);

  useEffect(() => {
    getEmissionData();
  }, [topSearchFormValues]);

  useEffect(() => {
    renderEchartsData();
  }, [emissionData]);
  // 获取年份对应的核算数据
  const getMainComputationListFn = async () => {
    const { data } = await getMainComputationList({
      ...topSearchFormValues,
      ...emissionSearchForm.current?.getFieldsFormatValue?.(),
    });
    setComputationData([...(data.data || [])]);
  };
  useEffect(() => {
    getMainComputationListFn();
  }, [topSearchFormValues]);

  return (
    <div className={style.card}>
      <div className={style.cardHeader}>
        <div className={style.cardTitle}>{I18N.carbonData.emissionTrend2}</div>
        <LightFilter
          formRef={emissionSearchForm}
          onValuesChange={(changedValues, values) => {
            const { startYear, endYear } = changedValues;
            const { standardAllType } = values;

            setIsTotal(standardAllType === BUTTON.TOTAL);
            if (Number(endYear) - Number(startYear) > 9) {
              return Toast('error', I18N.carbonData.startYearEnd);
            }
            getMainComputationListFn();
            return getEmissionData();
          }}
        >
          <ProFormRadio.Group
            name='standardAllType'
            radioType='button'
            options={BUTTON_ALL_OPTION}
            initialValue={BUTTON.TOTAL}
          />
          <DateYearRangePicker />
          {/* 碳排放核算配置 */}
          {/* <Dropdown options={[]} /> */}
        </LightFilter>
      </div>
      <FlexCards options={cardsOptions} />
      <Row gutter={24} className={style.chart}>
        {/* 排放量趋势图 */}
        <Col span={24}>
          <div className={style.cardHeader}>
            <div className={style.cardTitle}>
              {I18N.carbonData.emissionTrend}
            </div>
            <DownloadIcon onClick={downloadImgFn} />
          </div>
          <div className={style.mulletLine} id='trendAnalysisPng'>
            <ReactECharts
              option={option}
              className={style.lineChart}
              key={JSON.stringify(seriesData.series)}
            />
          </div>
        </Col>
      </Row>
      <Row gutter={24} className={style.chart}>
        {/* 排放量清单 */}
        <Col span={24}>
          <div className={style.cardHeader}>
            <div className={style.cardTitle}>
              {I18N.carbonData.emissionInventory}
            </div>
            <DownloadIcon onClick={getTableExcel} />
          </div>
          <Table
            dataSource={renderDataSource}
            columns={renderColumns()}
            scroll={{ x: 800, y: 232 }}
            pagination={false}
          />
        </Col>
      </Row>
    </div>
  );
};
export default EmissionTrendAnalysis;
