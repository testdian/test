import I18N from '@src/lang/I18N';

import { OptionsType } from '../../type';
import { LIFE_CYCLE_TYPE } from '../constant';

/** 系统边界类型 */
export const SYSTEM_BOUNDARY_TYPE = {
  /** 半生命周期 */
  HALF_LIFE_CYCLE: 1,
  /** 全生命周期 */
  COMPLETE_LIFE_CYCLE: 2,
  /** 自定义生命周期 */
  CUSTOM_LIFE_CYCLE: 3,
} as const;

const { HALF_LIFE_CYCLE, COMPLETE_LIFE_CYCLE, CUSTOM_LIFE_CYCLE } =
  SYSTEM_BOUNDARY_TYPE;

/**
 * @description 获取系统边界option
 * @param lifeCycleList 生命周期阶段
 * @returns 系统边界option
 */
export const systemBoundaryOptionFn = ({
  halfLifeCycleList,
  completeLifeCycleList,
  customLifeCycleList,
}: {
  /** 半生命周期 */
  halfLifeCycleList: OptionsType[];
  /** 全生命周期 */
  completeLifeCycleList: OptionsType[];
  /** 自定义生命周期 */
  customLifeCycleList: OptionsType[];
}) => {
  /** 半生命周期 */
  const halfLiftCycle = halfLifeCycleList?.map(lifeCycle => {
    return {
      ...lifeCycle,
      checked: true,
    };
  });

  /** 全生命周期 */
  const fullLifecycle = completeLifeCycleList?.map(lifeCycle => {
    return {
      ...lifeCycle,
      checked: true,
    };
  });

  /** 自定义生命周期 */
  const customLifecycle = customLifeCycleList?.map(lifeCycle => {
    if (lifeCycle.value === LIFE_CYCLE_TYPE.PRODUCTION_STAGE) {
      return { ...lifeCycle, checked: true, disabled: true };
    }
    return { ...lifeCycle };
  });

  return [
    {
      label: I18N.carbonFootPrintLCA.halfLifeCycle,
      describe: I18N.carbonFootPrintLCA.cradleToGate,
      value: HALF_LIFE_CYCLE,
      selectedChildren: halfLiftCycle,
      children: undefined,
      btnDisabled: true,
    },
    {
      label: I18N.carbonFootPrintLCA.fullLifecycle,
      describe: I18N.carbonFootPrintLCA.cradleToTomb,
      value: COMPLETE_LIFE_CYCLE,
      selectedChildren: fullLifecycle,
      children: undefined,
      btnDisabled: true,
    },
    {
      label: I18N.carbonFootPrintLCA.customLife,
      value: CUSTOM_LIFE_CYCLE,
      selectedChildren: undefined,
      children: customLifecycle,
    },
  ];
};
