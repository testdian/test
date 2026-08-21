/**
 * @description 结果汇总
 */
import { ActionType, ProTable } from '@ant-design/pro-components';
import { Button, Col, Empty, Row, Spin } from 'antd';
import ReactECharts from 'echarts-for-react';
import { compact } from 'lodash-es';
import { useEffect, useRef, useState } from 'react';

import { FormActions } from '@/components/FormActions';
import { InfoTitle } from '@/components/InfoTitle';
import I18N from '@/lang/I18N';
import { getSearchParams } from '@/utils';

import { columns } from './columns';
import { SUNBURST_TYPE } from './constant';
import style from './index.module.less';
import {
  getResultsSummaryPreEmission,
  getResultsSummarySunburst,
  getResultsSummaryTop,
  getSaleProductListApi,
} from '../../service';
import { SaleProductResp, SunDTO } from '../../type';
import IndustrialProcessFlowDiagram from '../components/IndustrialProcessFlowDiagram';

const { PRECURSOR, PROCESS } = SUNBURST_TYPE;

interface ResultsSummaryProps {
  /** cbam报表id */
  cbamId: number;
  /** 返回方法 */
  onClickBack: () => void;
}

const ResultsSummary = ({ cbamId, onClickBack }: ResultsSummaryProps) => {
  /** ****************************************** 公共部分 ********************************************************/
  const search = { ...getSearchParams()[0] };
  const authNo = search?.authNo;

  /** ****************************************** 结果汇总列表部分 ********************************************************/
  /** 表格ref */
  const tableRef = useRef<ActionType>();

  const isFirstLoad = useRef(true);

  /** 表格选中项 */
  const [selectRows, setSelectRows] = useState<SaleProductResp[]>();

  /** 选中的数据Key */
  const [selectedRowKeys, setSelectedRowKeys] = useState<React.Key[]>([]);

  /** 选中表格 */
  const onSelectChange = (
    newSelectedRowKeys: React.Key[],
    selectedRows: SaleProductResp[],
  ) => {
    setSelectedRowKeys(newSelectedRowKeys);
    setSelectRows(selectedRows);
  };

  const rowSelection = {
    selectedRowKeys,
    onChange: onSelectChange,
    preserveSelectedRowKeys: true,
  };

  /** ****************************************** 过程排放明细（旭日图）部分 ********************************************************/
  /** 当前旭日图状态 */
  const [currentSunburstStatus, setCurrentSunburstStatus] = useState(PRECURSOR);
  /** 当前展示前体数据 */
  const isShowPrecursor = currentSunburstStatus === PRECURSOR;
  /** 过程排放明细loading-旭日图 */
  const [loadingSunburst, setLoadingSunburst] = useState(false);
  /** 过程排放明细数据-旭日图 */
  const [dataSunburst, setDataSunburst] = useState<SunDTO[]>();
  /** 过程排放明细-旭日图-全是0 */
  const [sunburstALlZero, setSunburstALlZero] = useState(false);

  /** 过程排放明细-旭日图option */
  const optionSunburst = {
    tooltip: {
      trigger: 'item',
      formatter: (params: SunDTO) => {
        const apiData = params?.data || {};
        let content = '';
        if (apiData) {
          const { name, showValue, per } = apiData;

          const unit = 'tCO₂e';

          /** showValue不存在则是中间的返回按钮 */
          if (showValue) {
            /** 名称 */
            content += `${name || ''}<br>`;

            const emissionTitleText = I18N.cbam.emissionTitle;

            /** 排放量 */
            content += `${emissionTitleText}${showValue || '-'}${unit}<br>`;

            /** 占比 */
            content += `${I18N.carbonFootPrintLCA.proportionRat}${per || '-'}%`;
          } else {
            content = I18N.carbonFootPrintLCA.returnToThePreviousDisplay;
          }
        }

        return content;
      },
    },
    series: {
      type: 'sunburst',
      emphasis: {
        focus: 'ancestor',
      },
      sort: undefined,
      data: dataSunburst,
      radius: [0, '100%'],
      itemStyle: {
        borderRadius: 7,
        borderWidth: 2,
      },
      label: {
        show: true,
        formatter(params: SunDTO) {
          const apiData = params?.data || {};
          const { name = '', isChildren, per } = apiData;
          // 小于1%时不展示label
          if (Number(per) < 1) {
            return ' ';
          }
          // 内圈
          if (!isChildren && name.length > 6) {
            return `${name?.substring(0, 5)}…`;
          }
          // 外圈
          if (isChildren && name.length > 4) {
            return `${name?.substring(0, 3)}…`;
          }
          return name;
        },
      },
      levels: [
        {},
        {
          r0: '28%',
          r: '72%',
          itemStyle: {
            borderWidth: 2,
          },
          label: {
            align: 'right',
          },
        },
        {
          r0: '72%',
          r: '100%',
        },
      ],
    },
  };

  /** 检查旭日图阶段数据是否全0 */
  const checkSunburstDataAllZero = (sunburstData: SunDTO[]) => {
    const allZero = !sunburstData?.some(item => Number(item.outPower));
    setSunburstALlZero(allZero);
  };

  /** 处理旭日图数据 */
  const handleSunburstData = (sunburst: SunDTO, isChildren?: boolean) => {
    if (isChildren) {
      sunburst.isChildren = true;
    }

    sunburst.showValue = sunburst.outPower;

    sunburst.value = Number(sunburst.outPower);
    sunburst.name = sunburst.processName;

    if (sunburst.child) {
      sunburst.children = sunburst.child?.map(child =>
        handleSunburstData(child, true),
      );
    }

    return sunburst;
  };

  /** 获取旭日图数据 */
  const getSunburstData = async () => {
    const productProcessId = selectRows?.[0]?.processId;
    if (productProcessId) {
      setLoadingSunburst(true);
      getResultsSummarySunburst({
        authNo,
        productProcessId,
        type: currentSunburstStatus,
      })
        .then(({ data: result }) => {
          const sunburstData = result?.data || [];
          /** 检查旭日图是否全为0 */
          checkSunburstDataAllZero(sunburstData);
          /** 处理旭日图数据 */
          const newData = sunburstData?.map(sunburstItem =>
            handleSunburstData(sunburstItem),
          );
          setDataSunburst(newData || []);
        })
        .finally(() => {
          setLoadingSunburst(false);
        });
    }
  };

  /** ****************************************** 前置工序排放情况（堆叠图）部分 ********************************************************/
  /** 前置工序图表数据loading */
  const [loadingPre, setLoadingPre] = useState(false);

  /** 前置工序图表数据 */
  const [preEmissionData, setPreEmissionData] = useState<{
    unitName?: string;
    xData: (string | undefined)[];
    yDataDirect: (number | undefined)[];
    yDataInDirect: (number | undefined)[];
  }>();

  /** 前置工序排放情况-柱状图option */
  const optionPreEmission = {
    title: {
      subtext: `tCO₂e/${preEmissionData?.unitName || '-'}`,
      subtextStyle: {
        color: '#999EA4',
        fontWeight: 400,
        fontSize: 12,
      },
    },
    tooltip: {
      trigger: 'axis',
      axisPointer: {
        type: 'shadow',
      },
    },
    grid: {
      containLabel: true,
      left: 16,
      right: 16,
      bottom: 16,
    },
    legend: {},
    xAxis: [
      {
        type: 'category',
        data: preEmissionData?.xData || [],
        axisPointer: {
          type: 'shadow',
        },
        axisLabel: {
          color: '#999EA4',
          fontSize: 12,
        },
        axisLine: {
          lineStyle: {
            color: '#D2D6DA',
          },
        },
      },
    ],
    yAxis: [
      {
        type: 'value',
        name: '',
        splitLine: {
          lineStyle: {
            color: '#D2D6DA',
            type: 'dashed',
          },
        },
        axisLabel: {
          color: '#999EA4',
          fontSize: 12,
        },
      },
    ],
    series: [
      {
        name: I18N.cbam.directEmissions3,
        type: 'bar',
        stack: 'Ad',
        emphasis: {
          focus: 'series',
        },
        data: preEmissionData?.yDataDirect || [],
      },
      {
        name: I18N.cbam.indirectEmissions,
        type: 'bar',
        stack: 'Ad',
        emphasis: {
          focus: 'series',
        },
        data: preEmissionData?.yDataInDirect || [],
      },
    ],
  };

  /** 处理前置工序图表数据 */
  const handlePreEmissionData = (preData: SunDTO[]) => {
    const newPreEmission = {
      unitName: preData?.[0]?.unitName,
      xData: preData?.map(item => item.processName),
      yDataDirect: preData?.map(item => item.outPower),
      yDataInDirect: preData?.map(item => item.inputPower),
    };

    return newPreEmission;
  };

  /** 获取前置工序图表数据 */
  const getPreEmissionData = async () => {
    const productProcessId = selectRows?.[0]?.processId;
    if (productProcessId) {
      setLoadingPre(true);
      getResultsSummaryPreEmission({
        authNo,
        productProcessId,
      })
        .then(({ data: result }) => {
          const preData = result?.data || [];
          /** 处理数据 */
          const newData = handlePreEmissionData(preData);
          setPreEmissionData(newData);
        })
        .finally(() => {
          setLoadingPre(false);
        });
    }
  };

  /** ****************************************** TOP10预估碳税总量产品（堆叠图）部分 ********************************************************/
  /** TOP10预估需净缴纳碳税产品loading */
  const [loadingTop, setLoadingTop] = useState(false);

  /** TOP10预估需净缴纳碳税产品 */
  const [topData, setTopData] = useState<{
    currencyTypeName?: string;
    activityUnit?: string;
    xData: (string | undefined)[];
    yDataPayTax: (number | undefined)[];
    yDataOffset: (number | undefined)[];
  }>();

  /** TOP10预估需净缴纳碳税产品-柱状图option */
  const optionTop = {
    title: {
      subtext: `${topData?.currencyTypeName || '-'}/${
        topData?.activityUnit || '-'
      }`,
      subtextStyle: {
        color: '#999EA4',
        fontWeight: 400,
        fontSize: 12,
      },
    },
    tooltip: {
      trigger: 'axis',
      axisPointer: {
        type: 'shadow',
      },
    },
    grid: {
      containLabel: true,
      left: 16,
      right: 16,
      bottom: 16,
    },
    legend: {},
    xAxis: [
      {
        type: 'category',
        data: topData?.xData || [],
        axisPointer: {
          type: 'shadow',
        },
        axisLabel: {
          color: '#999EA4',
          fontSize: 12,
        },
        axisLine: {
          lineStyle: {
            color: '#D2D6DA',
          },
        },
      },
    ],
    yAxis: [
      {
        type: 'value',
        name: '',
        splitLine: {
          lineStyle: {
            color: '#D2D6DA',
            type: 'dashed',
          },
        },
        axisLabel: {
          color: '#999EA4',
          fontSize: 12,
        },
      },
    ],
    series: [
      {
        name: I18N.cbam.expectedToBePaid,
        type: 'bar',
        stack: 'Ad',
        emphasis: {
          focus: 'series',
        },
        data: topData?.yDataPayTax || [],
      },
      {
        name: I18N.cbam.offsetAmount,
        type: 'bar',
        stack: 'Ad',
        emphasis: {
          focus: 'series',
        },
        data: topData?.yDataOffset || [],
      },
    ],
  };

  /** 处理TOP10预估需净缴纳碳税产品数据 */
  const handleTopData = (preData: SunDTO[]) => {
    const newTop = {
      currencyTypeName: preData?.[0]?.currencyTypeName,
      activityUnit: preData?.[0]?.activityUnit,
      xData: preData?.map(item => item.productName),
      yDataPayTax: preData?.map(item => item.payTax),
      yDataOffset: preData?.map(item => item.offsetPrice),
    };

    return newTop;
  };

  /** 获取TOP10预估需净缴纳碳税产品数据 */
  const getTopData = async () => {
    if (authNo) {
      setLoadingTop(true);
      getResultsSummaryTop({
        authNo,
      })
        .then(({ data: result }) => {
          const preData = result?.data || [];
          /** 处理数据 */
          const newData = handleTopData(preData);
          setTopData(newData);
        })
        .finally(() => {
          setLoadingTop(false);
        });
    }
  };

  /** ****************************************** 公共部分 ********************************************************/
  /** 初始化 */
  const onInit = () => {
    /** 清空过程排放明细旭日图 */
    setDataSunburst([]);
    /** 重置旭日图是否全为0 */
    setSunburstALlZero(false);
    /** 清空前置工序排放情况 */
    setPreEmissionData(undefined);
    /** 清空TOP10预估需净缴纳碳税产品数据 */
    setTopData(undefined);
  };

  useEffect(() => {
    if (selectedRowKeys) {
      /** 获取旭日图数据 */
      getSunburstData();
    }
  }, [selectedRowKeys, currentSunburstStatus]);

  useEffect(() => {
    if (selectedRowKeys) {
      /** 获取前置工序图表数据 */
      getPreEmissionData();
    }
  }, [selectedRowKeys]);

  useEffect(() => {
    onInit();
    if (authNo) {
      /** 获取TOP10预估需净缴纳碳税产品数据 */
      getTopData();
    }
  }, [authNo]);

  return (
    <div className={style.emissionWrapper}>
      {/* 结果汇总列表 */}
      <div>
        <InfoTitle title={I18N.cbam.resultsSummary} />
        <ProTable<SaleProductResp>
          columns={columns()}
          scroll={{ x: 5000 }}
          actionRef={tableRef}
          search={false}
          key={`resultsSummaryTable${cbamId}`}
          pagination={false}
          toolBarRender={false}
          params={{
            authNo,
          }}
          request={async params => {
            if (params?.authNo) {
              return getSaleProductListApi({
                authNo: params?.authNo,
              }).then(({ data }) => {
                /** 默认选中第一个 */
                if (isFirstLoad?.current && data?.data?.length) {
                  setSelectedRowKeys([Number(data?.data?.[0]?.id)]);
                  setSelectRows([data?.data?.[0]]);
                }
                isFirstLoad.current = false;
                return {
                  data: data?.data || [],
                  success: true,
                  total: data?.data?.length || 0,
                };
              });
            }
            return { data: [], success: true };
          }}
          rowSelection={{
            type: 'radio',
            columnWidth: 48,
            ...rowSelection,
          }}
          rowKey='id'
        />
      </div>

      {/* 过程排放明细 */}
      <div className={style.sunburstWrapper}>
        <InfoTitle
          title={I18N.cbam.processEmissions}
          borderLeft={false}
          rightRender={
            <Button
              loading={loadingSunburst}
              key={currentSunburstStatus}
              onClick={() => {
                setCurrentSunburstStatus(isShowPrecursor ? PROCESS : PRECURSOR);
              }}
            >
              {isShowPrecursor
                ? I18N.cbam.clickToSwitchExhibitions2
                : I18N.cbam.clickToSwitchExhibitions}
            </Button>
          }
        />
        {dataSunburst && dataSunburst?.length > 0 && !sunburstALlZero ? (
          <div className={style.chartWrap}>
            <Spin spinning={loadingSunburst}>
              <ReactECharts
                className={style.chart}
                style={{ height: 400 }}
                key={`${cbamId}sunburst`}
                option={optionSunburst}
              />
            </Spin>
          </div>
        ) : (
          <Empty
            image={Empty.PRESENTED_IMAGE_SIMPLE}
            description={
              sunburstALlZero ? I18N.utils.noData : I18N.utils.noData
            }
          />
        )}
      </div>

      <Row gutter={24}>
        <Col span={12}>
          {/* 前置工序排放情况 */}
          <InfoTitle
            title={I18N.cbam.preProcessScheduling}
            borderLeft={false}
          />
          <div className={style.chartWrap}>
            <Spin spinning={loadingPre}>
              <ReactECharts
                className={style.chart}
                option={optionPreEmission}
                key={`${cbamId}preEmission`}
              />
            </Spin>
          </div>
        </Col>
        <Col span={12}>
          {/* TOP10预估碳税总量产品 */}
          <InfoTitle title={I18N.cbam.topEstimation} borderLeft={false} />
          <div className={style.chartWrap}>
            <Spin spinning={loadingTop}>
              <ReactECharts option={optionTop} key={`${cbamId}top`} />
            </Spin>
          </div>
        </Col>
      </Row>

      {/* 工业过程流程图 */}
      <IndustrialProcessFlowDiagram authNo={authNo} />

      <FormActions
        place='center'
        buttons={compact([
          {
            title: I18N.Factors.return,
            hidden: true,
            onClick: async () => {
              onClickBack();
            },
          },
        ])}
      />
    </div>
  );
};

export default ResultsSummary;
