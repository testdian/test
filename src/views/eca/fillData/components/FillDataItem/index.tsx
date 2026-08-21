import I18N from '@src/lang/I18N';
import { Button, Typography } from 'antd';
import { FC } from 'react';

import { CustomTag } from '@/views/components/CustomTag';
import {
  DATA_COLLECTION_PERIOD_OPTIONS_MAP,
  MONTH_OPTIONS,
  QUARTER_OPTIONS,
} from '@/views/eca/carbonMissionAccounting/component/FillingDeadlineModal/schemas';
import {
  fillStatusMap,
  reviewStatusMap,
} from '@/views/eca/carbonMissionAccounting/config';

import { FillDataColumnsActionType } from './config';
import styles from './index.module.less';
import { ComputationSourceResp } from '../../type';

const { Text } = Typography;

const { UN, UN_FILL, FILLING, FILL_COMPLETE } = fillStatusMap;

const { REVIEW_NOT_PASS } = reviewStatusMap;

const { SHOW, EDIT, SUBMIT } = FillDataColumnsActionType;

/**
 * 操作配置映射表
 */
const actionTypeData = [
  { type: SHOW, label: I18N.Factors.check, auth: '' },
  { type: EDIT, label: I18N.Factors.edit, auth: '' },
  { type: SUBMIT, label: I18N.dashborad.submit, auth: '' },
] as const;

const getAvailableActions = (fillStatus: number) => {
  /** 未填报-编辑、查看 */
  if (fillStatus === UN_FILL) {
    return actionTypeData.filter(item => [SHOW, EDIT].includes(item.type));
  }
  /**
   * 填报中-编辑、提交、查看
   */
  if (fillStatus === FILLING) {
    return actionTypeData.filter(item =>
      [SHOW, EDIT, SUBMIT].includes(item.type),
    );
  }
  if (fillStatus === FILL_COMPLETE) {
    return actionTypeData.filter(item => item.type === SHOW);
  }
  return [];
};

const { YEAR, QUARTER, MONTH } = DATA_COLLECTION_PERIOD_OPTIONS_MAP;

/** 获取数据收集周期 */
const getDataPeriod = (year?: string, dataPeriod?: string, idx?: string) => {
  let showText = '-';

  if (!year) return showText;

  /** 匹配季度 */
  const quarter = QUARTER_OPTIONS.find(
    item => String(item.value) === String(idx),
  )?.label;

  /** 匹配月份 */
  const month = MONTH_OPTIONS.find(
    item => String(item.value) === String(idx),
  )?.label;

  switch (String(dataPeriod)) {
    case YEAR:
      showText = year;
      break;
    case QUARTER:
      showText = `${year}-${quarter}`;
      break;
    case MONTH:
      showText = `${year}-${month}`;
      break;
    default:
      break;
  }

  return showText;
};

const FillDataItem: FC<{
  /** 填报数据 */
  item: ComputationSourceResp;
  /** 操作回调 */
  handleActionClick: (
    type: FillDataColumnsActionType,
    item: ComputationSourceResp,
  ) => void;
}> = ({ item, handleActionClick }) => {
  const fillStatus = Number(item.fillStatus);
  const fillStatusColor = {
    /** 填报状态：- 0 */
    [UN]: 'gray',
    /** 填报状态：未填报 1 */
    [UN_FILL]: 'red',
    /** 填报状态：填报中 2*/
    [FILLING]: 'gold',
    /** 填报状态：填报完成 3 */
    [FILL_COMPLETE]: 'green',
  };

  const dataPeriod = getDataPeriod(
    item?.year,
    item?.dataPeriod,
    item?.dataPeriodIdx,
  );

  return (
    <div className={styles.fillMainContainer}>
      <div className={styles.info}>
        <div className={styles.emissionSource}>
          <CustomTag
            color={fillStatusColor[fillStatus as keyof typeof fillStatusColor]}
            text={item?.fillStatus_name || '-'}
          />
          <span className={styles.naturalGas}>
            <Text
              style={{ width: 250 }}
              ellipsis={{
                tooltip: item?.sourceName,
              }}
            >
              {item?.sourceName}
            </Text>
          </span>
        </div>
        <div className={styles.initiator}>
          <div className={styles.infoContainer}>
            <span className={styles.initiatorLabel}>核算组织：</span>
            <div className={styles.userInfo}>
              <span className={styles.nameLiXiaoYun}>{item?.orgName}</span>
            </div>
          </div>
          <div className={styles.infoContainer}>
            <span className={styles.initiatorLabel}>
              {I18N.eca.accountingYear}
            </span>
            <div className={styles.userInfo}>
              <span className={styles.nameLiXiaoYun}>{dataPeriod}</span>
            </div>
          </div>
          <div className={styles.infoContainer}>
            <span className={styles.initiatorLabel}>{I18N.eca.informant2}</span>
            <div className={styles.userInfo}>
              <span className={styles.nameLiXiaoYun}>{item?.roleNames}</span>
            </div>
          </div>
          <div className={styles.infoContainer1}>
            <span className={styles.fillerBaoRen}>{I18N.eca.updatePerson}</span>
            <div className={styles.userInfo2}>
              <span className={styles.nameLiuXinKai}>{item?.updateByName}</span>
            </div>
          </div>
          <div className={styles.infoContainer4}>
            <span className={styles.updateTime}>{I18N.eca.updateTime}</span>
            <span className={styles.time20240624140000}>
              {item?.updateTime}
            </span>
          </div>
        </div>
      </div>
      <div className={styles.form}>
        <div className={styles.frame}>
          <div className={styles.emissionLevel}>
            <div className={styles.title9}>
              <div className={styles.ghgProtocolStandard}>
                <span className={styles.ghgProtocol}>
                  {I18N.eca.ghgClassification2}
                </span>
              </div>
            </div>
            <div className={styles.textContainerA}>
              <span className={styles.scopeOne}> {item?.ghgCategory_name}</span>
              <span className={styles.fixedCombustion}>
                <Text
                  style={{ maxWidth: 272 }}
                  ellipsis={{
                    tooltip: item?.ghgClassify_name,
                  }}
                >
                  {item?.ghgClassify_name}
                </Text>
              </span>
            </div>
          </div>
          <div className={styles.emissionLevel}>
            <div className={styles.title9}>
              <div className={styles.ghgProtocolStandard}>
                <span className={styles.ghgProtocol}>ISO分类</span>
              </div>
            </div>
            <div className={styles.textContainerA}>
              <span className={styles.scopeOne}> {item?.isoCategory_name}</span>
              <span className={styles.fixedCombustion}>
                <Text
                  style={{ maxWidth: 272 }}
                  ellipsis={{
                    tooltip: item?.isoClassify_name,
                  }}
                >
                  {item?.isoClassify_name}
                </Text>
              </span>
            </div>
          </div>
          {/* 有通过/驳回原因才展示 */}
          {item?.auditComment && (
            <div className={styles.activityData}>
              <div className={styles.title}>
                <span className={styles.projectName}>
                  {I18N.eca.byRejectingTheOriginal}
                </span>
              </div>
              <div className={styles.tagInput}>
                <div className={styles.tagInput5}>
                  <Text
                    type={
                      item?.reviewStatus === REVIEW_NOT_PASS
                        ? 'danger'
                        : undefined
                    }
                    style={{ width: 272 }}
                    ellipsis={{
                      tooltip: item?.auditComment,
                    }}
                  >
                    {item?.auditComment}
                  </Text>
                </div>
              </div>
            </div>
          )}
        </div>
        <div className={styles.button}>
          {getAvailableActions(Number(item.fillStatus))?.map(
            (actionItem, index) => (
              <Button
                size='small'
                type={index === 0 ? 'primary' : 'default'}
                key={actionItem.type}
                className={styles.edit}
                onClick={() => handleActionClick(actionItem.type, item)}
                style={{
                  fontSize: '12px',
                }}
              >
                {actionItem.label}
              </Button>
            ),
          )}
        </div>
      </div>
    </div>
  );
};

export default FillDataItem;
