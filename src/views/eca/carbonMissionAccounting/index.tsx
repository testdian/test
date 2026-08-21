/**
 * @description 碳排放核算
 */
import I18N from '@src/lang/I18N';
import { Button, Spin } from 'antd';
import { useEffect, useState } from 'react';

import { useDrawer } from '@/hooks/useDrawer';
import usePageType from '@/hooks/usePageType';
import { checkAuth } from '@/layout/utills';
import { PageTypeInfo } from '@/router/utils/enums';

import CreateAccountingTaskDrawer from './component/CreateAccountingTaskDrawer';
import { HeaderSection } from './component/HeaderSection';
import ListStyleInfo from './component/ListStyleInfo';
import TaskStyleOrgList from './component/TaskStyleOrgList';
import { TabKey } from './config';
import styles from './index.module.less';
import {
  getComputationDataDetailApi,
  getTaskEmissionSourceTreeApi,
} from './service';
import { AccountYearComputation } from './type';
import { AccountModelInfoTreeDatum } from '../accountingModel/Info/type';

const { add } = PageTypeInfo;

const CarbonMissionAccounting = () => {
  const { visible, showDrawer, onClose } = useDrawer();

  const { pageType, setModelAction } = usePageType(add);

  /** 设置tab切换 */
  const [tabKey, setTabKey] = useState(TabKey.Task);

  const [loading, setLoading] = useState<boolean>(false);

  const [currentYear, setCurrentYear] = useState(new Date().getFullYear());

  const [hasAccountingTask, setHasAccountingTask] =
    useState<AccountYearComputation>();

  /** 核算id */
  const computationId = Number(hasAccountingTask?.id);

  /** 设置排放源树 */
  const [treeData, setTreeData] = useState<AccountModelInfoTreeDatum[]>([]);

  // 检查核算任务
  const checkAccountingTask = async (year: string) => {
    setLoading(true);
    try {
      const { data } = await getComputationDataDetailApi(year);
      setHasAccountingTask(data?.data);
    } catch {
      setHasAccountingTask({});
    } finally {
      setLoading(false);
    }
  };

  /** 创建核算成功 */
  const onSuccessSaveInit = async (values: AccountYearComputation) => {
    checkAccountingTask(values?.year as unknown as string);
    onClose();
  };

  /** 获取清单样式数据 */
  const getTreeData = async () => {
    if (!computationId) return;
    const { data } = await getTaskEmissionSourceTreeApi({
      computationId,
    });

    // 将 groupList 字段重命名为 computationSourceList，递归处理 children
    function replaceGroupListWithComputationSourceList(nodes: any[]): any[] {
      return (
        nodes?.map(node => {
          const { groupList, children, ...rest } = node;
          const newNode: any = { ...rest };
          newNode.computationSourceList = groupList || [];
          if (children) {
            newNode.children =
              replaceGroupListWithComputationSourceList(children);
          }
          return newNode;
        }) || []
      );
    }
    const newData = replaceGroupListWithComputationSourceList(data?.data);

    setTreeData(newData);
  };

  useEffect(() => {
    if (tabKey === TabKey.Tree) {
      getTreeData();
    }
  }, [tabKey, computationId]);

  // 年份变化时触发检查
  useEffect(() => {
    if (!currentYear) {
      return;
    }
    checkAccountingTask(currentYear as unknown as string);
  }, []);

  return (
    <div className={styles.carbonMissionMainContainerWrapper}>
      <div className={styles.carbonMissionMainContainer}>
        {/* 顶部年份切换&核算管理 */}
        <HeaderSection
          hasAccountingTaskId={hasAccountingTask?.id}
          currentYear={currentYear}
          onYearChange={year => {
            setCurrentYear(year);
            checkAccountingTask(year.toString());
          }}
          onOpenAccountingDrawer={() => {
            setModelAction(PageTypeInfo.edit);
            showDrawer();
            checkAccountingTask(currentYear.toString());
          }}
          onTabChange={value => {
            setTabKey(value);
          }}
        />
      </div>
      <Spin spinning={loading}>
        <div className={styles.CarbonMissionAccounting}>
          {!hasAccountingTask?.id ? (
            <div className={styles.noTask}>
              <div>{I18N.eca.thisYearIsNotYetAvailable}</div>
              {checkAuth(
                '/carbonMissionAccountingInfo/add',
                <Button
                  type='primary'
                  onClick={() => {
                    /* 创建核算任务逻辑 */
                    setHasAccountingTask({
                      year: currentYear,
                    });
                    setModelAction(PageTypeInfo.add);
                    showDrawer();
                  }}
                >
                  {I18N.eca.createAccountingResponsibilities}
                </Button>,
              )}
            </div>
          ) : (
            <div className={styles.task}>
              {/* 任务样式 */}
              {tabKey === TabKey.Task && (
                <TaskStyleOrgList
                  accountingInfo={hasAccountingTask}
                  currentYear={currentYear}
                />
              )}
              {/* 清单列表 */}
              {tabKey === TabKey.Tree && (
                <ListStyleInfo
                  accountingInfo={hasAccountingTask}
                  treeData={treeData}
                  computationId={computationId}
                  onAddEmissionSourceSuccess={() => {
                    getTreeData();
                  }}
                />
              )}
            </div>
          )}
        </div>
      </Spin>
      {/* 核算管理抽屉 */}
      <CreateAccountingTaskDrawer
        actionBtnType={pageType}
        accountingInfo={hasAccountingTask || {}}
        year={currentYear}
        visible={visible}
        onClose={() => {
          onClose();
        }}
        onSuccessSave={value => {
          onSuccessSaveInit(value);
        }}
      />
    </div>
  );
};

export default CarbonMissionAccounting;
