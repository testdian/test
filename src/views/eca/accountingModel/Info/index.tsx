/**
 * @@description: 核算模型-新增、编辑页面
 */

import { ArrowLeftOutlined } from '@ant-design/icons';
import I18N from '@src/lang/I18N';
import { StepProps, Steps } from 'antd';
import { FC, useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';

import { FullScreenModal } from '@/components/FullScreenModel';
import { usePageInfo } from '@/hooks';
import { EcaRouteMaps } from '@/router/utils/ecaEmums';
import {
  PAGE_TYPE_VAR,
  PageTypeInfo,
  virtualLinkTransform,
} from '@/router/utils/enums';
import { getSearchParams, updateUrl } from '@/utils';

import AccountingModelInfo from './AccountingModelInfo';
import SelectDataInfo from './SelectData';
import { ANALYSIS_STEP_TYPE } from './config';
import style from './index.module.less';

const AccountModelInfo: FC<{
  /** 是否自定义导航栏返回 */
  isNavigateCustomBack?: boolean;
  /** 自定义返回方法 */
  onNavigateCustomBackFn: () => void;
}> = ({ isNavigateCustomBack, onNavigateCustomBackFn }) => {
  const navigate = useNavigate();
  /** 模型ID */
  const { isAdd } = usePageInfo();

  /** URL 携带的参数 */
  const search = { ...getSearchParams()[0] };
  /** 步骤条枚举 */
  const [stepOptions, setStepOptions] = useState<StepProps[]>([
    {
      title: I18N.Factors.basicInformation,
    },
    {
      title: I18N.Factors.accountingModel,
      disabled: true,
    },
  ]);

  /** 当前步骤 */
  const [currentStep, setCurrentStep] = useState<number>(
    Number(search?.currentStep) || ANALYSIS_STEP_TYPE.SELECT_DATA,
  );

  /** 返回页面跳转 */
  const onBackClick = () => {
    if (isNavigateCustomBack) {
      onNavigateCustomBackFn();
    } else {
      navigate(EcaRouteMaps.accountingModel);
    }
  };

  /** 选择数据保存下一步 */
  const onSaveStepClick = (idValue: number) => {
    navigate(
      virtualLinkTransform(
        `${EcaRouteMaps.accountingModelInfo}?currentStep=${ANALYSIS_STEP_TYPE.ANALYSIS_CONFIG}` as EcaRouteMaps,
        [PAGE_TYPE_VAR, ':id'],
        [PageTypeInfo.edit, idValue],
      ),
    );
    setCurrentStep(ANALYSIS_STEP_TYPE.ANALYSIS_CONFIG);
  };

  /** 步骤条状态 当没有模型id时，分析配置禁用 */
  useEffect(() => {
    const arr = stepOptions.map(item => ({
      ...item,
      disabled: isAdd,
    }));
    setStepOptions([...arr] as unknown as StepProps[]);
  }, [currentStep]);

  return (
    <FullScreenModal>
      <div className={style.wrapper}>
        <div className={style.container}>
          {/* 步骤条 */}
          <div className={style.stepWrapper}>
            <div className={style.backBtn} onClick={() => onBackClick()}>
              <ArrowLeftOutlined className={style.backIcon} />
              <span className={style.backName}>
                {I18N.Factors.accountingModel}
              </span>
            </div>
            <div className={style.step}>
              <Steps
                current={currentStep}
                size='small'
                responsive={false}
                items={stepOptions}
                onChange={currentStepValue => {
                  updateUrl({
                    ...search,
                    currentStep: currentStepValue,
                  });
                  setCurrentStep(currentStepValue);
                }}
              />
            </div>
          </div>
          {/* 选择数据表单内容组件 */}
          {currentStep === ANALYSIS_STEP_TYPE.SELECT_DATA && (
            <SelectDataInfo onSaveStepClick={onSaveStepClick} />
          )}
          {/* 模板收集表单内容组件 */}
          {currentStep === ANALYSIS_STEP_TYPE.ANALYSIS_CONFIG && (
            <AccountingModelInfo />
          )}
        </div>
      </div>
    </FullScreenModal>
  );
};

export default AccountModelInfo;
