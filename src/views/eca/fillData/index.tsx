/*
 * @@description: 排放数据填报
 */

import I18N from '@src/lang/I18N';
import { Cascader, DatePicker, Empty, Pagination, Radio, Spin } from 'antd';
import { useEffect, useState } from 'react';

import { Page } from '@/components/Page';
import { useDrawer } from '@/hooks/useDrawer';
import { useOrgTreeData } from '@/hooks/useOrgTreeData';
import usePageType from '@/hooks/usePageType';
import { PageTypeInfo } from '@/router/utils/enums';
import { modal } from '@/store/module/notification';

import { GenericSearchForm } from './SeachDataForm';
import FillDataEditDrawer from './components/FillDataEditDrawer';
import FillDataItem from './components/FillDataItem';
import { FillDataColumnsActionType } from './components/FillDataItem/config';
import style from './index.module.less';
import { schema } from './schema';
import {
  getComputationDataFillPageApi,
  submitComputationDataFillApi,
} from './service';
import { ComputationSourceResp, DataFillPageRequest } from './type';
import MatchFactorModal from '../carbonMissionAccounting/component/MatchFactorModal';
import { calcEmissionSourceGroupFactorApi } from '../carbonMissionAccounting/component/MatchFactorModal/service';
import { ComputationSourceRequest } from '../carbonMissionAccounting/type';
import { ComputationEnums } from '../hooks';

const { SHOW, EDIT, SUBMIT } = FillDataColumnsActionType;

const { add, edit, show } = PageTypeInfo;

/** 填报任务类型切换枚举值 待处理、全部 */
export enum FillTaskType {
  pending = 1,
  all = 0,
}
/** 待处理任务和全部任务切换枚举值 待处理、全部 */
export const FillTaskOptions = [
  {
    label: I18N.eca.pendingTasks,
    value: FillTaskType.pending,
  },
  {
    label: I18N.eca.allTasks,
    value: FillTaskType.all,
  },
];

const EmissionDataFilling = () => {
  const [orgTreeData] = useOrgTreeData();

  const [dataSource, setDataSource] = useState<ComputationSourceResp[]>([]);

  const GHGCategoryArr = ComputationEnums('GHGCategory');

  /** 设置页面抽屉状态 */
  const { pageType, setModelAction } = usePageType(add);

  const { visible, showDrawer, onClose } = useDrawer();

  /** 设置数据填报切换 */
  const [pendingFlag, setPendingFlag] = useState<number>(FillTaskType.pending);

  const [loading, setLoading] = useState<boolean>(false);

  /** 核算详情信息 */
  const [computationDetail, setComputationDetail] =
    useState<ComputationSourceResp>();

  /** 设置匹配因子状态 */
  const [matchFactorInfo, setMatchFactorInfo] = useState<{
    visible: boolean;
    matchFactorId: number | null;
  }>({
    visible: false,
    matchFactorId: null,
  });

  /** 分页和筛选状态 */
  const [pagination, setPagination] = useState({
    pageNum: 1,
    pageSize: 10,
    total: 0,
  });

  /** 表单搜索值 */
  const [searchInfo, setSearchInfo] = useState<Record<string, string>>();

  /** 获取数据填报 */
  const getFillingData = async () => {
    setLoading(true);
    // 合并默认参数（pageNum、pageSize、pendingFlag）与传入参数
    const requestParams: DataFillPageRequest = {
      pageNum: pagination.pageNum,
      pageSize: pagination.pageSize,
      pendingFlag,
      ...searchInfo,
    };
    const { data } = await getComputationDataFillPageApi(requestParams).finally(
      () => {
        setLoading(false);
      },
    );
    // 更新数据和分页信息
    setDataSource((data?.data?.list as ComputationSourceResp[]) || []);
    setPagination({
      ...pagination,
      total: data?.data?.total || 0,
    });
  };

  const handleActionClick = async (
    actionType: FillDataColumnsActionType,
    item: ComputationSourceResp,
  ) => {
    // 根据不同的操作类型执行对应逻辑
    switch (actionType) {
      case SHOW:
        // 处理查看逻辑
        setComputationDetail(item);
        setModelAction(show);
        showDrawer();
        break;
      case EDIT:
        setComputationDetail(item);
        setModelAction(edit);
        showDrawer();
        // 处理编辑逻辑
        break;
      case SUBMIT:
        setComputationDetail(item);
        // 处理提交逻辑
        /** 如果未匹配因子 展示匹配因子弹窗 */
        if (item?.factorMatchStatus === 1) {
          if (!item?.id) return;
          setMatchFactorInfo({
            visible: true,
            matchFactorId: Number(item?.id),
          });
        } else {
          modal.confirm({
            title: I18N.Factors.prompt,
            content: I18N.eca.pleaseConfirmIfItIs3,
            onOk: async () => {
              if (!item?.id) return;
              await submitComputationDataFillApi({ id: item?.id });
              getFillingData();
            },
          });
        }
        break;
      default:
        break;
    }
  };

  useEffect(() => {
    getFillingData();
  }, [searchInfo, pendingFlag, pagination.pageNum, pagination.pageSize]);

  return (
    <Page title={I18N.supplyChainCarbonManagement.dataReporting}>
      {/* 搜索区域 */}
      <GenericSearchForm
        schema={schema({ GHGCategoryArr, orgTreeData })}
        widgets={{ DatePicker, Cascader }}
        onSearch={async values => {
          const dataPeriod = values?.dataPeriod?.[0] || undefined;
          const idx = values?.dataPeriod?.[1] || undefined;

          setSearchInfo({
            ...values,
            ghg: values?.ghg?.join(','),
            year: values?.year,
            dataPeriod,
            idx,
          });
          setPagination({
            ...pagination,
            pageNum: 1,
          });
        }}
        onReset={() => {
          setSearchInfo(undefined);
          setPagination({
            pageNum: 1,
            pageSize: 10,
            total: 10,
          });
        }}
      />
      {/* 待处理任务、全部任务切换 */}
      <Radio.Group
        className='mt-16'
        onChange={e => {
          setPendingFlag(e.target.value);
          setPagination({
            ...pagination,
            pageNum: 1,
          });
        }}
        options={FillTaskOptions}
        defaultValue={pendingFlag}
        optionType='button'
      />
      <Spin spinning={loading}>
        <div>
          {dataSource?.map(item => {
            return (
              <FillDataItem
                key={item.id}
                item={item}
                handleActionClick={handleActionClick}
              />
            );
          })}
          {dataSource.length > 0 ? (
            <div className={style.fillDataItemContainer}>
              <Pagination
                size='small'
                current={pagination.pageNum}
                pageSize={pagination.pageSize}
                total={pagination.total}
                showSizeChanger
                onChange={(page, pageSize) => {
                  setPagination({
                    pageNum: page,
                    pageSize,
                    total: pagination.total,
                  });
                }}
              />
            </div>
          ) : (
            <Empty image={Empty.PRESENTED_IMAGE_SIMPLE} />
          )}
        </div>
      </Spin>
      {/* 编辑数据填报抽屉 */}
      <FillDataEditDrawer
        actionType={pageType}
        visible={visible}
        computationDetail={computationDetail as ComputationSourceResp}
        onClose={() => {
          setModelAction(add);
          setComputationDetail(undefined);
          onClose();
        }}
        onSuccessSave={() => {
          setModelAction(add);
          setComputationDetail(undefined);
          getFillingData();
          onClose();
        }}
      />
      {/* 匹配因子弹窗 */}
      <MatchFactorModal
        emissionSourceDetail={computationDetail as ComputationSourceRequest}
        tipsText={I18N.eca.thereIsAMismatch2}
        matchFactorId={Number(matchFactorInfo.matchFactorId)}
        visible={matchFactorInfo.visible}
        okText={I18N.dashborad.submit}
        onCancel={async () => {
          try {
            setMatchFactorInfo({
              visible: false,
              matchFactorId: null,
            });
            if (!matchFactorInfo.matchFactorId) return;
            await calcEmissionSourceGroupFactorApi({
              groupId: Number(computationDetail?.computationSourceGroupId),
            });
          } finally {
            getFillingData();
          }
        }}
        onSave={async () => {
          try {
            if (!matchFactorInfo.matchFactorId) return;
            /** 关闭和保存的弹窗都调用这个因子计算接口 */
            await calcEmissionSourceGroupFactorApi({
              groupId: Number(computationDetail?.computationSourceGroupId),
            });
            /** 提交数据 */
            await submitComputationDataFillApi({
              id: matchFactorInfo.matchFactorId,
            });
            setMatchFactorInfo({
              visible: false,
              matchFactorId: null,
            });
          } finally {
            getFillingData();
          }
        }}
      />
    </Page>
  );
};

export default EmissionDataFilling;
