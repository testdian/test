/**
 * @description 碳数据-企业碳核算
 */
import { LightFilter, ProFormInstance } from '@ant-design/pro-components';
import I18N from '@src/lang/I18N';
import { Tabs } from 'antd';
import classNames from 'classnames';
import { ReactElement, useEffect, useRef, useState } from 'react';
import { useSelector } from 'react-redux';

import {
  getComputationDataDashboardMetricList,
  getComputationDataDashboardUserList,
} from '@/sdks_v2/new/computationV2ApiDocs';
import { RootState } from '@/store/types';

import EmissionClassification from './EmissionClassification';
import EmissionIntensityAnalysis from './EmissionIntensityAnalysis';
import EmissionTrendAnalysis from './EmissionTrendAnalysis';
import GasPathway from './GasPathway';
import OrgEmissionAnalysis from './OrgEmissionAnalysis';
import TopEmission from './TopEmission';
import { ProSelect } from './component/ProSelect';
import { ORG_FITTER, ORG_FITTER_OPTION } from './constant';
import style from './index.module.less';
import { IntensityProps, OrgOptionType, TopSearchFormType } from './type';

function CarbonDataECA(): ReactElement {
  /** 左侧菜单栏 */
  const { sidebar } = useSelector<RootState, RootState['systemOperations']>(
    s => s.systemOperations,
  );
  const [currentTab, setCurrentTab] = useState<string>('1');
  /** 当前账号组织 */
  const { orgId, orgName } = useSelector<RootState, RootState['userInfo']>(
    u => u.userInfo,
  );

  /** 所属组织枚举 */
  const [orgOption, setOrgOption] = useState<OrgOptionType[]>([]);
  useEffect(() => {
    getComputationDataDashboardUserList({}).then(({ data }) => {
      const orgs = data?.data?.map(item => {
        return { label: item.orgName, value: item.id };
      });
      setOrgOption(orgs);
    });
  }, []);

  /** 获取orgId对应的label */
  const getOrgName = (targetOrg?: number) => {
    return orgOption.filter(item => item.value === targetOrg)[0]?.label;
  };

  /** 顶部搜索表单 */
  const topSearchForm = useRef<ProFormInstance>();

  /** 初始值 */
  const initialValues = {
    orgId: Number(orgId),
    includeChild: ORG_FITTER.INCLUDE_SUB_ORG,
  };

  /** 顶部搜索表单值 */
  const [topSearchFormValues, setTopSearchFormValues] =
    useState<TopSearchFormType>(initialValues);

  /** 选中的组织label */
  const [selectOrgName, setSelectOrgName] = useState<string>(orgName || '');

  /** 排放强度下拉框options */
  const [metricsOptions, setMetricsOptions] = useState<
    IntensityProps['metricsOptions']
  >([]);

  const getMetricsOptions = async () => {
    const { data } = await getComputationDataDashboardMetricList({
      ...topSearchFormValues,
    });
    const options = data?.data?.map(item => {
      const { metricsName, metricsUnitName } = item;
      const label = metricsName
        ? `${metricsName}（tCO₂e/${metricsUnitName || '-'}）`
        : '';
      return {
        label,
        value: item?.id,
        unit: item?.metricsUnitName,
      };
    });
    setMetricsOptions(options);
  };

  useEffect(() => {
    getMetricsOptions();
  }, [topSearchFormValues]);
  const returnOptionFn = () => {
    if (!topSearchFormValues.includeChild) {
      return [
        { label: I18N.carbonData.emissionTrendScore, key: '1' },
        { label: I18N.carbonData.emissionIntensityTrend2, key: '2' },
        {
          label: I18N.carbonData.emissionClassificationProportion4,
          key: '3',
        },
        { label: I18N.carbonData.topEmissions5, key: '4' },
        { label: I18N.carbonData.greenhouseGasProduction2, key: '5' },
        { label: I18N.carbonData.organizationalEmissionScore, key: '6' },
      ];
    }
    return [
      { label: I18N.carbonData.emissionTrendScore, key: '1' },
      // { label: I18N.carbonData.emissionIntensityTrend2, key: '2' },
      {
        label: I18N.carbonData.emissionClassificationProportion4,
        key: '3',
      },
      { label: I18N.carbonData.topEmissions5, key: '4' },
      { label: I18N.carbonData.greenhouseGasProduction2, key: '5' },
      { label: I18N.carbonData.organizationalEmissionScore, key: '6' },
    ];
  };
  useEffect(() => {
    if (currentTab === '2' && topSearchFormValues.includeChild) {
      setCurrentTab('1');
    }
  }, [topSearchFormValues]);

  return (
    <div className={style.wrapper}>
      <div
        className={classNames(style.affix, {
          [style.sideOpen]: sidebar.opened,
        })}
      >
        <Tabs
          activeKey={currentTab}
          onChange={key => {
            setCurrentTab(key);
          }}
          className={style.tabs}
          tabPosition='top'
          items={returnOptionFn()}
        />
        <LightFilter<TopSearchFormType>
          formRef={topSearchForm}
          onValuesChange={(_, values) => {
            setSelectOrgName(getOrgName(values.orgId) || '');
            setTopSearchFormValues(values);
          }}
          initialValues={initialValues}
        >
          <ProSelect
            props={{
              name: 'orgId',
              placeholder: I18N.carbonData.affiliatedOrganization,
              options: orgOption,
              width: 192,
            }}
          />
          <ProSelect
            props={{
              name: 'includeChild',
              placeholder: I18N.carbonData.includeSubOrganizations,
              options: ORG_FITTER_OPTION,
              width: 192,
            }}
          />
        </LightFilter>
      </div>
      {/* 排放量趋势分析 */}
      {Number(currentTab) === 1 && (
        <EmissionTrendAnalysis
          topSearchFormValues={topSearchFormValues}
          selectOrgName={selectOrgName}
        />
      )}
      {/* 排放强度趋势分析 */}
      {Number(currentTab) === 2 && (
        <EmissionIntensityAnalysis
          topSearchFormValues={topSearchFormValues}
          selectOrgName={selectOrgName}
          metricsOptions={metricsOptions}
        />
      )}
      {/* 排放分类占比 */}
      {Number(currentTab) === 3 && (
        <EmissionClassification
          topSearchFormValues={topSearchFormValues}
          selectOrgName={selectOrgName}
        />
      )}
      {/* TOP排放源/排放类别 */}
      {Number(currentTab) === 4 && (
        <TopEmission
          topSearchFormValues={topSearchFormValues}
          selectOrgName={selectOrgName}
        />
      )}
      {/* 温室气体产生路径 */}
      {Number(currentTab) === 5 && (
        <GasPathway
          topSearchFormValues={topSearchFormValues}
          selectOrgName={selectOrgName}
        />
      )}
      {/* 组织排放分析 */}
      {Number(currentTab) === 6 && (
        <OrgEmissionAnalysis
          topSearchFormValues={topSearchFormValues}
          orgName={orgName || ''}
        />
      )}
    </div>
  );
}

export default CarbonDataECA;
