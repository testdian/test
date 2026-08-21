import I18N from '@src/lang/I18N';

import {
  ColumnsActionType,
  fillStatusMap,
  matchFactorStatusMap,
  reviewStatusMap,
} from '../config';
import { ComputationSourceResp } from '../type';

const { UN, UN_FILL, FILLING, FILL_COMPLETE } = fillStatusMap;

const { UN: RE_UN, UN_REVIEW, REVIEW_PASS, REVIEW_NOT_PASS } = reviewStatusMap;

const { WAIT_MATCH_FACTOR } = matchFactorStatusMap;

const { VIEW, EDIT, REVIEW, WITHDRAW, NO_NEED_FILL, MATCH_FACTOR } =
  ColumnsActionType;

/**
 * 操作配置类型
 */
type ActionConfig = {
  label: string; // 中文文案
  auth: string; // 权限标识
};

/**
 * 状态动作映射配置
 */
type StatusActionMapConfig<
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  StatusType extends string | number | symbol,
  ActionType extends string | number | symbol,
> = {
  actionConfigMap: Record<ActionType, ActionConfig>;
  statusActionMap: Record<string, ActionType[]>;
  specialHandlers?: ((record: any) => ActionType[])[];
  defaultActions?: ActionType[];
};

/**
 * 创建状态动作映射处理器
 */
export const createStatusActionHandler = <
  ActionType extends string | number | symbol,
>(
  config: StatusActionMapConfig<string | number | symbol, ActionType>,
) => {
  return (
    record: ComputationSourceResp,
  ): { type: ActionType; config: ActionConfig }[] => {
    const {
      actionConfigMap,
      statusActionMap,
      specialHandlers = [],
      defaultActions = [Object.keys(actionConfigMap)[0] as ActionType],
    } = config;

    // 构建状态键
    const statusKey = `${record.fillStatus}-${record.reviewStatus}`;

    // 获取基础操作
    let actions = statusActionMap[statusKey] || defaultActions;

    // 应用特殊处理逻辑
    specialHandlers.some(handler => {
      const specialActions = handler(record);
      if (specialActions) {
        actions = specialActions;
        return true;
      }
      return false;
    });

    // 映射为操作配置
    return actions.map(type => ({
      type,
      config: actionConfigMap[type],
    }));
  };
};

// 碳排放核算模块的配置
const carbonTaskConfig = {
  actionConfigMap: {
    [VIEW]: {
      label: () => I18N.Factors.check,
      auth: '/carbonMissionAccounting/show',
    },
    [EDIT]: {
      label: () => I18N.Factors.edit,
      auth: '/carbonMissionAccounting/edit',
    },
    // [DELETE]: {
    //   label: () => I18N.Factors.delete,
    //   auth: '/carbonMissionAccountingInfo/del',
    // },
    [MATCH_FACTOR]: {
      label: () => I18N.eca.matchFactor,
      auth: '/carbonMissionAccounting/match',
    },
    [REVIEW]: {
      label: () => I18N.eca.toExamine,
      auth: '/carbonMissionAccounting/audit',
    },
    [WITHDRAW]: {
      label: () => '退回',
      auth: '/carbonMissionAccounting/withdraw',
    },
    [NO_NEED_FILL]: {
      label: () => '无需填报',
      auth: '/carbonMissionAccounting/show',
    },
  },
  // statusActionMap: {
  //   // 未开始-未审核
  //   [`${UN}-${RE_UN}`]: [EDIT, DELETE],
  //   // 未填报-未审核
  //   [`${UN_FILL}-${RE_UN}`]: [VIEW, EDIT, DELETE, NO_NEED_FILL],
  //   // 填报中-未审核
  //   [`${FILLING}-${UN}`]: [VIEW, DELETE, NO_NEED_FILL],
  //   // 填报完成-未审核
  //   [`${FILL_COMPLETE}-${UN_REVIEW}`]: [REVIEW, VIEW, WITHDRAW],
  //   // 填报完成-审核通过
  //   [`${FILL_COMPLETE}-${REVIEW_PASS}`]: [VIEW, WITHDRAW],
  //   // 填报中-审核驳回
  //   [`${FILLING}-${REVIEW_NOT_PASS}`]: [VIEW, DELETE, NO_NEED_FILL],
  // },
  statusActionMap: {
    // 未开始-未审核
    [`${UN}-${RE_UN}`]: [EDIT],
    // 未填报-未审核
    [`${UN_FILL}-${RE_UN}`]: [VIEW, EDIT, NO_NEED_FILL],
    // 填报中-未审核
    [`${FILLING}-${UN}`]: [VIEW, NO_NEED_FILL],
    // 填报完成-未审核
    [`${FILL_COMPLETE}-${UN_REVIEW}`]: [REVIEW, VIEW],
    // 填报完成-审核通过
    [`${FILL_COMPLETE}-${REVIEW_PASS}`]: [VIEW, WITHDRAW],
    // 填报中-审核驳回
    [`${FILLING}-${REVIEW_NOT_PASS}`]: [VIEW, NO_NEED_FILL],
  },
  specialHandlers: [
    (record: {
      fillStatus: number;
      reviewStatus: number;
      factorMatchStatus: number;
    }) => {
      // 特殊处理：显示匹配因子、查看操作的情况
      // 1.填报完成且未审核的状态下，如果匹配因子状态为待匹配，则显示匹配因子、查看操作
      // 2.填报完成且审核通过的状态下，如果匹配因子状态为待匹配，则显示匹配因子、查看操作
      if (
        record.fillStatus === FILL_COMPLETE &&
        record.factorMatchStatus === WAIT_MATCH_FACTOR &&
        (record.reviewStatus === UN_REVIEW ||
          record.reviewStatus === REVIEW_PASS)
      ) {
        return [MATCH_FACTOR, VIEW];
      }
      return null; // 返回空数组而不是 null
    },
  ],
};

/** 碳排放核算模块任务样式、清单样式的操作处理器  */
export const getCarbonTaskActions = createStatusActionHandler(
  carbonTaskConfig as any,
);
