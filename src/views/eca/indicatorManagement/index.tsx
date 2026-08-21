/**
 * @file: 指标管理
 */

import { PlusOutlined } from '@ant-design/icons';
import { ProTable } from '@ant-design/pro-components';
import I18N from '@src/lang/I18N';
import { Carousel, Spin, Typography } from 'antd';
import classNames from 'classnames';
import { chunk } from 'lodash-es';
import React, { useEffect, useState } from 'react';

import { Page } from '@/components/Page';
import { useDrawer } from '@/hooks/useDrawer';
import usePageType from '@/hooks/usePageType';
import { checkAuth } from '@/layout/utills';
import { PageTypeInfo } from '@/router/utils/enums';
import { modal } from '@/store/module/notification';
import { ActionTypeEnum } from '@/utils/actionType';

import { generatePeriodColumns } from './columns';
import FillDataIndicatorTableModal from './components/FillDataIndicatorTableModal';
import IndicatorDrawer from './components/IndicatorDrawer';
import { PeriodTypeEnum } from './const';
import styles from './index.module.less';
import {
  deleteIndicatorApi,
  deleteIndicatorTableApi,
  getIndicatorListApi,
  getIndicatorTableListApi,
} from './service';
import { IndicatorInfoDatumType, IndicatorInfoTableItemDatum } from './type';

const { Text } = Typography;

const { add, edit, show } = PageTypeInfo;
const IndicatorManagement: React.FC = () => {
  /** 设置指标管理 */
  const [indicatorManagement, setIndicatorManagement] = useState<
    IndicatorInfoDatumType[]
  >([]);
  /** 设置页面抽屉状态 */
  const { pageType, setModelAction } = usePageType(add);

  const { visible, showDrawer, onClose } = useDrawer();

  /** 设置数据 id 值 */
  const [dataId, setDataId] = useState<number>();

  /** 默认选中的指标卡片值 */
  const [checkedCardInfoValue, setCheckedCardInfoValue] =
    useState<IndicatorInfoDatumType>();

  /** 设置指标维度数据 */
  const [indicatorDimension, setIndicatorDimension] = useState([]);

  /** 指标管理表格 loading */
  const [indicatorManagementLoading, setIndicatorManagementLoading] =
    useState(false);

  /** 表格修改弹窗 */
  const [tableModalVisible, setTableModalVisible] = useState(false);
  /** 表格项详情 */
  const [tableItemInfo, setTableItemInfo] =
    useState<IndicatorInfoTableItemDatum>();

  /** 表格详情状态弹窗 */
  const [tableModalType, setTableModalType] = useState<PageTypeInfo>(edit);

  /** 获取指标管理 */
  const getIndicatorManagement = async () => {
    const { data } = await getIndicatorListApi();
    const items = data?.data || [];
    setIndicatorManagement(items);
    // 优先保留当前选中的卡片（通过 id 匹配），避免编辑后选中状态错位
    const currentId = checkedCardInfoValue?.id;
    const preserved =
      (currentId && items.find(item => item.id === currentId)) || items[0];
    setCheckedCardInfoValue(preserved);
  };
  /** 切换指标管理获取指标维度数据 */
  const changeIndicatorManagement = async () => {
    if (!checkedCardInfoValue?.id) {
      setIndicatorDimension([]);
      return;
    }
    setIndicatorManagementLoading(true);
    const { data } = await getIndicatorTableListApi(
      Number(checkedCardInfoValue?.id),
    ).finally(() => {
      setIndicatorManagementLoading(false);
    });
    setIndicatorDimension(data?.data || []);
  };
  /** 初始化刷新 */
  const refresh = () => {
    setModelAction(add);
    setDataId(undefined);
    onClose();
  };
  /** 指标编辑 */
  const handleEdit = (item: IndicatorInfoDatumType) => {
    if (!item.id) return;
    setDataId(item.id);
    setModelAction(edit);
    showDrawer();
  };
  /** 指标删除 */
  const handleDelete = (item: IndicatorInfoDatumType) => {
    modal.confirm({
      title: I18N.Factors.prompt,
      content: I18N.dashborad.pleaseConfirmIfItIs2,
      onOk: async () => {
        await deleteIndicatorApi(item.id);
        refresh();
        getIndicatorManagement();
      },
    });
  };

  /** 表格编辑、查看、删除操作 */
  const handelTableAction = (
    actionType: ActionTypeEnum,
    record: IndicatorInfoTableItemDatum,
  ) => {
    switch (actionType) {
      case ActionTypeEnum.EDIT:
        setTableModalType(edit);
        setTableItemInfo(record);
        setTableModalVisible(true);
        break;
      case ActionTypeEnum.SHOW:
        setTableModalType(show);
        setTableItemInfo(record);
        setTableModalVisible(true);
        break;
      case ActionTypeEnum.DELETE:
        modal.confirm({
          title: I18N.Factors.prompt,
          content: I18N.dashborad.pleaseConfirmIfItIs2,
          onOk: async () => {
            if (!record.id) return;
            await deleteIndicatorTableApi(record.id);
            refresh();
            changeIndicatorManagement();
          },
        });
        break;
      default:
    }
  };

  useEffect(() => {
    changeIndicatorManagement();
  }, [checkedCardInfoValue?.id]);

  useEffect(() => {
    getIndicatorManagement();
  }, []);

  return (
    <Page
      title={I18N.eca.indexManagement}
      actionBtnChildArr={[
        {
          button: checkAuth(
            '/pom/add',
            <div>
              <PlusOutlined /> {I18N.eca.newIndicatorsAdded}
            </div>,
          ),
          click: () => {
            setModelAction(add);
            showDrawer();
          },
        },
      ]}
    >
      {/* 指标管理顶部滑动列表 */}
      <Carousel
        className={styles.indicatorCarousel}
        arrows
        infinite={false}
        dots={false}
      >
        {chunk(indicatorManagement, 3)?.map(group => {
          return (
            <div key={group.map(item => item.id).join('-')}>
              <div className={styles.carouselItem}>
                {group?.map?.(item => {
                  const isValidKey = (
                    key: any,
                  ): key is keyof typeof iconMapClass =>
                    [
                      I18N.eca.revenueAmount,
                      I18N.eca.coverAnArea,
                      I18N.eca.numberOfEmployees2,
                    ].includes(key);
                  const iconMapClass = {
                    营收金额: styles.moneyIcon,
                    占地面积: styles.areaIcon,
                    员工人数: styles.peopleIcon,
                  } as const; // 使用as const冻结类型

                  const className = isValidKey(item?.indexName)
                    ? iconMapClass[item.indexName]
                    : styles.defaultIcon; // 添加兜底样式
                  return (
                    <div
                      className={classNames(
                        styles.cardData,
                        checkedCardInfoValue?.id === item.id
                          ? styles.checkedCardData
                          : '',
                      )}
                      onClick={() => {
                        setCheckedCardInfoValue(item);
                      }}
                    >
                      <div className={styles.frame3}>
                        <div className={styles.frame4}>
                          <div
                            className={classNames(className, styles.amount)}
                          />
                          <div className={styles.frame5}>
                            <div className={styles.revenueAmount}>
                              {/* 指标名称 */}
                              {item?.indexName}
                            </div>
                            <div className={styles.unit}>
                              {/* 指标单位 */}（{item?.unitDesc}）
                            </div>
                            <div className={styles.year}>{item?.year}</div>
                          </div>
                        </div>
                        <div className={styles.valueMain}>
                          {/* 指标数值 */}
                          <Text
                            className={styles.comma}
                            ellipsis={{
                              tooltip: item?.dataValue || 0,
                            }}
                          >
                            {item?.dataValue || 0}
                          </Text>
                          {/* 指标编辑/删除区域 */}
                          <div className={styles.actionsBtn}>
                            {/* 编辑 */}
                            {checkAuth(
                              '/pom/edit',
                              <div
                                className={styles.edit}
                                onClick={() => handleEdit(item)}
                              />,
                            )}
                            {/* 删除 */}
                            {checkAuth(
                              '/pom/delete',
                              <div
                                className={styles.delete}
                                onClick={() => handleDelete(item)}
                              />,
                            )}
                          </div>
                        </div>
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>
          );
        })}
      </Carousel>

      <Spin spinning={indicatorManagementLoading}>
        <h4>{checkedCardInfoValue?.indexName}</h4>
        {/* 指标维度表格 */}
        <ProTable<{ id: number }>
          columns={generatePeriodColumns({
            periodType: Number(checkedCardInfoValue?.indexDataPeriod),
            year: checkedCardInfoValue?.year?.toString() || '',
            indexStatisticalName:
              checkedCardInfoValue?.indexStatistical_name || '',
            handelTableAction,
          })}
          rowKey='id'
          dataSource={indicatorDimension}
          pagination={false}
          search={false}
          options={{
            fullScreen: false,
            reload: false,
            setting: false,
          }}
          toolBarRender={false}
          size='small'
          scroll={{ x: '1200' }}
        />
      </Spin>

      {/* 添加指标抽屉 */}
      <IndicatorDrawer
        dataId={Number(dataId)}
        actionType={pageType}
        visible={visible}
        onClose={() => {
          refresh();
        }}
        onSuccessSave={() => {
          refresh();
          getIndicatorManagement();
          // id 不变仅年份等属性变化时，useEffect([id]) 不会重触发，需显式刷新维度表格
          changeIndicatorManagement();
        }}
      />
      {/* 修改指标表格数据弹窗 */}
      <FillDataIndicatorTableModal
        tableModalType={tableModalType}
        indexDataPeriod={
          checkedCardInfoValue?.indexDataPeriod as PeriodTypeEnum
        }
        indicatorInfo={tableItemInfo as IndicatorInfoTableItemDatum}
        visible={tableModalVisible}
        onCancel={() => {
          setTableItemInfo(undefined);
          setTableModalVisible(false);
          setModelAction(add);
        }}
        onSuccessSave={() => {
          setTableModalVisible(false);
          setTableItemInfo(undefined);
          changeIndicatorManagement();
          getIndicatorManagement();
        }}
      />
    </Page>
  );
};

export default IndicatorManagement;
