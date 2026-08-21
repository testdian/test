/**
 * @deprecated 温室气体产生路径
 */
import {
  LightFilter,
  ProFormInstance,
  ProFormRadio,
} from '@ant-design/pro-components';
import I18N from '@src/lang/I18N';
import { Input } from 'antd';
import ReactECharts from 'echarts-for-react';
import { uniqBy } from 'lodash-es';
import { FC, useEffect, useRef, useState } from 'react';

import { getMainComputationList } from '@/api/compution';
import {
  getComputationDataDashboardPathway,
  PathwayResp,
} from '@/sdks_v2/new/computationV2ApiDocs';
import { returnComputationNameFn } from '@/utils';

import style from './index.module.less';
import { generateImgName, useDownloadHandler } from '../commonFn';
import DownloadIcon from '../component/DownloadIcon';
import { ProYearSelect } from '../component/ProSelect';
import { BUTTON, BUTTON_OPTION, GAS } from '../constant';
import { CommonProps } from '../type';

/** 组织名称 */
let orgName = '';
const currentYear = new Date().getFullYear();

const GasPathway: FC<CommonProps> = ({
  topSearchFormValues,
  selectOrgName,
}) => {
  const gasSearchForm = useRef<ProFormInstance>();

  const [gasData, setGasData] = useState<PathwayResp>();
  const [computationData, setComputationData] = useState<any>();
  const [selectYear, setSelectYear] = useState(currentYear);

  /** echarts option */
  const option: echarts.EChartsOption = {
    color: [
      '#695BE7',
      '#010101',
      '#695BE7',
      '#F06E6E',
      '#EE8F58',
      '#F6C06B',
      '#64DBC5',
      '#698CFF',
    ],
    tooltip: {
      trigger: 'item',
      triggerOn: 'mousemove',
      // 类型有问题
      formatter: (params: any) => {
        const dataName = params?.name || '';
        const dataValue = params?.value;
        const targetName = params?.data?.target || '';
        const dataType = params?.dataType;
        /** 需要用特殊单位的温室气体 */
        const isGas = GAS.includes(dataName) || GAS.includes(targetName);
        /** 标签内容 */
        let formatterLabel = `${dataName.replace('>', '--')}：${dataValue}t`;
        if (isGas && dataType === 'node') {
          formatterLabel = `${formatterLabel}${dataName}`;
        } else if (isGas && dataType === 'edge') {
          formatterLabel = `${formatterLabel}${targetName}`;
        } else {
          formatterLabel += 'CO₂e';
        }

        return formatterLabel;
      },
    },
    series: {
      nodeWidth: 40,
      nodeGap: 8,
      type: 'sankey',
      lineStyle: {
        color: 'source',
        opacity: 0.25,
      },
      // 非0则自动排序
      layoutIterations: 0,
      data: uniqBy(gasData?.nodes, 'name') || [],
      links: gasData?.links || [],
    },
  };

  /** 下载图片 */
  const downloadImgFn = useDownloadHandler(
    () =>
      generateImgName(
        orgName,
        gasSearchForm,
        I18N.carbonData.greenhouseGasProduction,
        true,
      ),
    'gasPng',
  );

  /** 获取数据 */
  const getGasData = async () => {
    const { data } = await getComputationDataDashboardPathway({
      ...topSearchFormValues,
      ...gasSearchForm?.current?.getFieldsValue(),
    });
    setGasData(data?.data);
  };

  useEffect(() => {
    getGasData();
    orgName = selectOrgName || '';
  }, [topSearchFormValues]);
  // 获取年份对应的核算数据
  const getMainComputationListFn = async () => {
    const { data } = await getMainComputationList({
      ...topSearchFormValues,
      ...gasSearchForm.current?.getFieldsFormatValue?.(),
      startYear: gasSearchForm.current?.getFieldsFormatValue?.().year,
      endYear: gasSearchForm.current?.getFieldsFormatValue?.().year,
    });
    setComputationData([...(data.data || [])]);
  };
  useEffect(() => {
    getMainComputationListFn();
  }, [topSearchFormValues]);
  return (
    <div className={style.card}>
      <div className={style.cardHeader}>
        <div className={style.cardTitle}>
          {I18N.carbonData.greenhouseGasProduction}
        </div>
        <LightFilter
          formRef={gasSearchForm}
          onValuesChange={(_, values) => {
            const { year } = values;
            setSelectYear(year);
            getGasData();
            getMainComputationListFn();
          }}
        >
          <ProFormRadio.Group
            name='standardAllType'
            radioType='button'
            options={BUTTON_OPTION}
            initialValue={BUTTON.GHG}
          />
          <ProYearSelect />
          <DownloadIcon onClick={downloadImgFn} />
          <Input
            disabled
            value={returnComputationNameFn(selectYear, computationData)}
          />
        </LightFilter>
      </div>
      <div className={style.mulletLine} id='gasPng'>
        <ReactECharts option={option} className={style.lineChart} />
      </div>
    </div>
  );
};
export default GasPathway;
