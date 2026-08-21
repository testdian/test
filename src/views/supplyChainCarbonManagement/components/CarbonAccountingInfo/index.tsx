/*
 * @@description: 企业碳核算信息（结果、过程、报告）（供应商碳数据、碳数据审核、供应商管理-详情-企业碳核算公用的页面）
 * @Author: liuxinxin xinxin@carbonstop.net
 * @Date: 2023-06-02 15:33:23
 * @LastEditors: liuxinxin xinxin@carbonstop.net
 * @LastEditTime: 2023-06-18 23:26:55
 */
import I18N from '@src/lang/I18N';
import type { RadioChangeEvent } from 'antd';
import { Radio } from 'antd';
import { compact } from 'lodash-es';
import { useEffect, useState } from 'react';

import {
  ComputationProcess,
  ComputationResult,
  getSupplychainProcessComputationPage,
  getSupplychainResultComputationApplyInfoId,
} from '@/sdks_v2/new/supplychainV2ApiDocs';
import { FileListType, SearchParamses } from '@/views/components/utils/types';

import style from './index.module.less';
import { CarbonDataPropsType } from '../../utils/type';
import CarbonAccountingProcess from '../CarbonAccountingProcess';
import CarbonAccountingResult from '../CarbonAccountingResult';
import Report from '../Report';

function CarbonAccountingInfo({
  /** 申请数据id */
  id,
  /** 表单数据禁用 */
  disabled,
  /** 数据请求类型 1: 核算结果 2: 核算过程 */
  applyType,
  /** 数据请求的详情 */
  cathRecord,
  /** 过程列表的详情按钮 */
  onDetailClick,
}: CarbonDataPropsType) {
  /** 请求类型是否为核算过程 */
  const isProcess = Number(applyType) === 2;

  /** 当前切换的顶部Tab栏 */
  const [currentTab, changeCurrentTab] = useState<string>('1');

  /** 页码配置 */
  const [searchParams, setSearchParams] = useState<SearchParamses>({
    current: 1,
    pageSize: 10,
  });

  /** 表格加载 */
  const [loading, changeLoading] = useState(false);

  /** 表格数据总数 */
  const [total, setTotal] = useState<number>(0);

  /** 企业碳核算-核算结果数据 */
  const [computationResult, setComputationResult] =
    useState<ComputationResult>();

  /** 企业碳核算-核算过程数据 */
  const [computationProcess, setComputationProcess] =
    useState<ComputationProcess[]>();

  /** 上传文件列表 */
  const [fileList, setFileList] = useState<FileListType[]>([]);

  /** 获取企业碳核算的填报数据的数据 */
  useEffect(() => {
    if (id && applyType) {
      /** 核算过程 */
      if (isProcess) {
        changeLoading(true);
        getSupplychainProcessComputationPage({
          applyInfoId: Number(id),
          pageNum: searchParams.current,
          pageSize: searchParams.pageSize || 10,
        }).then(({ data }) => {
          if (data.code === 200) {
            setComputationProcess(data?.data?.list || []);
            setTotal(data?.data?.total || 0);
            changeLoading(false);
          }
        });
      }
      /** 核算结果 */
      getSupplychainResultComputationApplyInfoId({
        applyInfoId: Number(id),
      }).then(({ data }) => {
        if (data.code === 200) {
          const report = JSON.parse(data.data.report || '[]');
          setFileList(report);
          setComputationResult(data.data);
        }
      });
    }
  }, [id, applyType]);

  /** tabs展示列表 */
  const tabList = compact([
    {
      label: I18N.supplyChainCarbonManagement.enterpriseCarbonAccounting3,
      key: '1',
    },
    isProcess && {
      label: I18N.supplyChainCarbonManagement.enterpriseCarbonAccounting2,
      key: '2',
    },
    {
      label: I18N.supplyChainCarbonManagement.enterpriseCarbonAccounting,
      key: '3',
    },
  ]);

  /** 切换tab展示不同的信息 */
  const tabsShowInfo = () => {
    switch (Number(currentTab)) {
      /** 企业碳核算结果 */
      case 1:
        return (
          <CarbonAccountingResult
            id={id}
            disabled={disabled}
            cathRecord={cathRecord}
            computationResult={computationResult}
          />
        );
      /** 企业碳核算过程 */
      case 2:
        return (
          <CarbonAccountingProcess
            basicInfo={[
              {
                label: I18N.carbonFootPrint.supplierName,
                value: cathRecord?.supplierName || '-',
              },
              {
                label: I18N.components.accountingYear,
                value: cathRecord?.year || '-',
              },
              {
                label: I18N.eca.summaryOfEmissions,
                value: computationResult?.total || '-',
              },
            ]}
            computationProcess={computationProcess}
            loading={loading}
            total={total}
            searchParams={searchParams}
            onchange={(current: number, pageSize: number) => {
              setSearchParams({
                current,
                pageSize,
              });
            }}
            onDetailClick={onDetailClick}
          />
        );
      /** 企业碳核算报告 */
      default:
        return fileList && fileList.length > 0 ? (
          <Report
            fileList={fileList}
            fileType='.png,.jpg,.jpeg,.xls,.xlsx,.doc,.docx,.pdf,.rar,.zip'
            maxCount={10}
            maxSize={10 * 1024 * 1024}
            errorTip={I18N.components.fileSizeNotAppropriate}
            disabled
          />
        ) : (
          I18N.supplyChainCarbonManagement.unsubmittedReport
        );
    }
  };

  return (
    <div className={style.wrapper}>
      <Radio.Group
        defaultValue='1'
        buttonStyle='solid'
        onChange={({ target: { value } }: RadioChangeEvent) => {
          changeCurrentTab(value);
        }}
      >
        {tabList &&
          tabList.map(item => {
            return (
              <Radio.Button value={item.key} key={item.key}>
                {item.label}
              </Radio.Button>
            );
          })}
      </Radio.Group>
      <div className={style.wrapper_main}>{tabsShowInfo()}</div>
    </div>
  );
}
export default CarbonAccountingInfo;
