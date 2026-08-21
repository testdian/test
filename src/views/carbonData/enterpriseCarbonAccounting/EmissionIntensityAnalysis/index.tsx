/**
 * @deprecated 排放强度趋势分析
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
import { filter, find } from 'lodash-es';
import { FC, useEffect, useMemo, useRef, useState } from 'react';

import {
  getComputationDataDashboardIntensityTrend,
  IntensityTrendResp,
  postComputationDataDashboardDownloadIntensityTrend,
} from '@/sdks_v2/new/computationV2ApiDocs';
import { Toast } from '@/utils';

import style from './index.module.less';
import { downloadFile, generateImgName, useDownloadHandler } from '../commonFn';
import { DateYearRangePicker } from '../component/DateYearRangePicker';
import DownloadIcon from '../component/DownloadIcon';
import FlexCards from '../component/FlexCards';
import { ProSelect } from '../component/ProSelect';
import {
  BUTTON,
  BUTTON_ALL_OPTION,
  COMMON_BAR_WIDTH,
  COMMON_COLOR,
} from '../constant';
import { IntensityProps } from '../type';

/** 组织名称 */
let orgName = '';

const EmissionIntensityAnalysis: FC<IntensityProps> = ({
  topSearchFormValues,
  selectOrgName,
  metricsOptions,
}) => {
  const intensitySearchForm = useRef<ProFormInstance>();

  const [intensityData, setIntensityData] = useState<IntensityTrendResp>();

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

  /** 初始排放强度id */
  const initialMetricId = metricsOptions?.[0]?.value;

  /** 获取初始排放强度单位 */
  const getInitialUnit = () =>
    find(metricsOptions, { value: initialMetricId })?.unit || '';

  /** 当前排放强度单位 */
  const [currentUnit, setCurrentUnit] = useState(getInitialUnit());

  /** 排放量卡片数据 */
  const cardsOptions = [
    {
      label: I18N.carbonData.thisYearsUnit,
      unit: `(tCO₂e/${currentUnit})`,
      value: intensityData?.carbonIntensity,
    },
    {
      label: I18N.carbonData.lastYearsUnit,
      unit: `(tCO₂e/${currentUnit})`,
      value: intensityData?.lastYearCarbonIntensity,
    },
    {
      label: I18N.carbonData.yoY,
      unit: '(%)',
      value: intensityData?.carbonIntensityRatio,
      growth: intensityData?.growth,
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
        name: I18N.template(I18N.carbonData.unitTCo, { val1: currentUnit }),
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
        intensitySearchForm,
        I18N.carbonData.emissionIntensityTrend,
      ),
    'intensityAnalysisPng',
  );

  /** 下载清单功能 */
  const getTableExcel = async () => {
    await postComputationDataDashboardDownloadIntensityTrend(
      {
        ...topSearchFormValues,
        ...intensitySearchForm.current?.getFieldsFormatValue?.(),
      },
      {
        responseType: 'blob',
      },
    ).then(res => {
      downloadFile(res?.data, res);
    });
  };

  /** 处理Echarts数据 */
  const renderEchartsData = () => {
    const xData = intensityData?.trendChart?.dataX || [];
    const yData = intensityData?.trendChart?.dataY || [];

    /** 不需要展示的图例 */
    const filterLegend = isTotal
      ? [I18N.carbonData.comparedToTheBaseYear]
      : [I18N.carbonData.annualUnitRefersTo];

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

      if (item.name === I18N.carbonData.baseYearUnit) {
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
  const renderColumns = useMemo(() => {
    const yearColumn = {
      title: I18N.carbonData.year,
      dataIndex: 'year',
      width: 80,
      fixed: 'left',
    };

    const dataColumns =
      intensityData?.trendChart?.dataY?.map(item => {
        return {
          title:
            item.name === I18N.carbonData.yoY ||
            item.name === I18N.carbonData.comparedToTheBaseYear
              ? `${item.name}（%）`
              : `${item.name}（tCO₂e/${currentUnit}）`,
          dataIndex: item.name || '',
          width: 150,
        };
      }) || [];

    return [yearColumn, ...dataColumns] || [];
  }, [intensitySearchForm.current?.getFieldsValue?.()]);

  /** 处理表格数据 */
  const renderDataSource = useMemo(() => {
    const yearArray = intensityData?.trendChart?.dataX || [];
    const dataArray = intensityData?.trendChart?.dataY || [];
    const dataSource = yearArray?.map((year, index) => {
      const row: { [key: string]: string } = { year };
      dataArray?.forEach(series => {
        const columnName = series?.name || '';
        const columnValue = series?.value?.[index];
        row[columnName] = columnValue || '-';
      });
      return row;
    });
    return dataSource || [];
  }, [intensityData]);

  /** 获取数据 */
  const getIntensityData = async () => {
    const { data } = await getComputationDataDashboardIntensityTrend({
      ...topSearchFormValues,
      ...intensitySearchForm.current?.getFieldsFormatValue?.(),
    });
    setIntensityData(data?.data);
    orgName = selectOrgName || '';
  };

  useEffect(() => {
    intensitySearchForm?.current?.setFieldValue('metricId', initialMetricId);
    setCurrentUnit(getInitialUnit());
    getIntensityData();
  }, [topSearchFormValues, metricsOptions]);

  useEffect(() => {
    renderEchartsData();
  }, [intensityData]);

  return (
    <div className={style.card}>
      <div className={style.cardHeader}>
        <div className={style.cardTitle}>
          {I18N.carbonData.emissionIntensityTrend2}
        </div>
        <LightFilter
          formRef={intensitySearchForm}
          onValuesChange={(changedValues, values) => {
            const { startYear, endYear, metricId } = changedValues;
            const { standardAllType } = values;
            setIsTotal(standardAllType === BUTTON.TOTAL);
            if (metricId) {
              const unit = find(metricsOptions, {
                value: metricId,
              })?.unit;
              setCurrentUnit(unit || '');
            }
            if (Number(endYear) - Number(startYear) > 9) {
              return Toast('error', I18N.carbonData.startYearEnd);
            }
            return getIntensityData();
          }}
        >
          <ProFormRadio.Group
            name='standardAllType'
            radioType='button'
            options={BUTTON_ALL_OPTION}
            initialValue={BUTTON.TOTAL}
          />
          <DateYearRangePicker />
          <ProSelect
            props={{
              name: 'metricId',
              placeholder: I18N.carbonData.emissionIntensity,
              options: metricsOptions,
              initialValue: initialMetricId,
            }}
          />
        </LightFilter>
      </div>
      <FlexCards options={cardsOptions} />
      <Row gutter={24} className={style.chart}>
        {/* 排放强度趋势图 */}
        <Col span={24} className={style.chartLeft}>
          <div className={style.cardHeader}>
            <div className={style.cardTitle}>
              {I18N.carbonData.emissionIntensityTrend}
            </div>
            <DownloadIcon onClick={downloadImgFn} />
          </div>
          <div className={style.mulletLine} id='intensityAnalysisPng'>
            <ReactECharts
              option={option}
              className={style.lineChart}
              key={JSON.stringify(seriesData.series)}
            />
          </div>
        </Col>
      </Row>
      <Row gutter={24}>
        {/* 排放强度清单 */}
        <Col span={24}>
          <div className={style.cardHeader}>
            <div className={style.cardTitle}>
              {I18N.carbonData.clearEmissionIntensity}
            </div>
            <DownloadIcon onClick={getTableExcel} />
          </div>
          <Table
            dataSource={renderDataSource}
            columns={renderColumns}
            scroll={{ x: 800, y: 232 }}
            pagination={false}
          />
        </Col>
      </Row>
    </div>
  );
};
export default EmissionIntensityAnalysis;
