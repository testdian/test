import I18N from '@src/lang/I18N';
import { Col, Row, Spin } from 'antd';
import classNames from 'classnames';
import React, { useEffect, useState } from 'react';

import style from './index.module.less';
import ComputationCascader from '../ComputationCascader';
import { getPredictionEmissionReductionApi } from './service';
import { ForecastInfoData } from './type';
import { FlexibleAreaChart } from '../DataOverview/chart';

const baseYear = 2019;

const Forecasted: React.FC = () => {
  const [scopeType, setScopeType] = useState<string>();
  const [forecastData, setForecastData] = useState<ForecastInfoData>();
  const [latestYear, setLatestYear] = useState<number>();
  const [predictYear, setPredictYear] = useState<number>();
  const [loading, setLoading] = useState<boolean>(false);

  // 获取预测数据
  const getForecastData = async () => {
    if (!scopeType) return;
    try {
      setLoading(true);
      const { data } = await getPredictionEmissionReductionApi({
        scopeType,
      }).finally(() => {
        setLoading(false);
      });
      setForecastData(data?.data);
      setLatestYear(data?.data?.latestYear);
      setPredictYear(data?.data?.predictYear);
    } catch (error) {
      console.error(I18N.eca.obtainPredictedNumbers, error);
    }
  };

  useEffect(() => {
    getForecastData();
  }, [scopeType]);

  // 定义数据项配置
  const dataItems = [
    {
      key: 'latestEmission',
      label: I18N.eca.latestYearActual3,
      yearKey: 'latestYear',
    },
    {
      key: 'latestSales',
      label: I18N.eca.latestYearActual2,
      yearKey: 'latestYear',
    },
    {
      key: 'latestEmissionPerSales',
      label: I18N.eca.theLatestYearEvery,
      yearKey: 'latestYear',
    },
    {
      key: 'predictEmission',
      label: I18N.eca.nextYearsForecast2,
      yearKey: 'predictYear',
    },
    {
      key: 'predictSales',
      label: I18N.eca.nextYearsForecast,
      yearKey: 'predictYear',
    },
    { key: 'predictGrowthRate', label: I18N.eca.annualNetSales },
  ];

  return (
    <div>
      <div className={style.forecastYear}>
        <span>{I18N.eca.forecastSituation}</span>
        <ComputationCascader
          onChange={(value: number[]) => setScopeType(value?.toString())}
        />
      </div>

      {/* <div className={style.refreshText}>
        <span>{I18N.eca.theSystemWillBeBasedOn}</span>
        <Button
          type='link'
          onClick={() => {
            getForecastData();
          }}
        >
          {I18N.eca.refreshImmediately}
        </Button>
      </div> */}

      <div className={style.forecastInfo}>
        <Spin spinning={loading}>
          <Row gutter={[24, 24]}>
            {dataItems.map(item => {
              const yearMap: Record<string, number | undefined> = {
                latestYear,
                predictYear,
              };
              const yearValue =
                yearMap[item.yearKey as keyof typeof yearMap] ?? '';
              const displayLabel = yearValue
                ? `${yearValue} ${item.label}`
                : item.label;
              const value =
                (forecastData as Record<string, any>)?.[item.key] ?? '-';
              return (
                <Col key={item.key} span={8}>
                  <div className={style.forecastInfoItem}>
                    <span className={style.forecastInfoItemTitle}>
                      {displayLabel}
                    </span>
                    <span className={style.forecastInfoItemValue}>{value}</span>
                  </div>
                </Col>
              );
            })}
          </Row>
        </Spin>
        <div className='baseText12Color666 mt-16'>
          {I18N.eca.thePredictedResultsAreOnly}
        </div>
        <div className={style.forecastInfoRatio}>
          {/* 面积图 */}
          <FlexibleAreaChart
            data={forecastData?.valueList || []}
            xKey='year'
            series={[
              {
                key: 'sbtValue',
                name: I18N.eca.sbtEmissions,
                color: 'rgba(73, 190, 165, 1)',
              },
              {
                key: 'bauValue',
                name: I18N.eca.bauEmissions,
                color: 'rgba(250, 145, 88, .7)',
              },
            ]}
            xName={I18N.Factors.year}
            height={400}
            extraOptions={{
              yAxis: {
                name: I18N.eca.unitTCo,
                splitLine: {
                  show: false,
                },
              },
            }}
          />
          {/* 展示BAU和SBT与基准年相比的增长率 */}
          {(forecastData?.bauRatio || forecastData?.sbtRatio) && (
            <div className={style.forecastInfoRatioRight}>
              <div className={style.ratioTitle}>
                <div className={classNames(style.ratio, style.orangeText)}>
                  {forecastData?.bauRatio}
                </div>
                <div className={style.year}>vs {baseYear}</div>
              </div>
              <div className={style.forecastInfoUpIcon} />
              <div className={style.ratioTitle}>
                <div className={classNames(style.ratio, style.greenText)}>
                  {forecastData?.sbtRatio}
                </div>
                <div className={style.year}>vs {baseYear}</div>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default Forecasted;
