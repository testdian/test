/**
 * @description: 碳排放核算/核算管理抽屉/核算模型详情页面 这里复用了核算模型详情页面 path：/accountingAllocation/accountingModel/
 */
import I18N from '@src/lang/I18N';
import { Button, StepProps, Steps } from 'antd';
import { FC, useState } from 'react';

import CustomDrawer from '@/components/CustomDrawer';
import AccountingModelInfo from '@/views/eca/accountingModel/Info/AccountingModelInfo';
import SelectDataInfo from '@/views/eca/accountingModel/Info/SelectData';
import { ANALYSIS_STEP_TYPE } from '@/views/eca/accountingModel/Info/config';

import style from './index.module.less';

const AccountModelDetail: FC<{
  /** 核算模型ID */
  modelId: number;
  accountModelDetailVisible: boolean;
  onNavigateCustomBackFn: () => void;
}> = ({ onNavigateCustomBackFn, accountModelDetailVisible, modelId }) => {
  /** 当前步骤 */
  const [currentStep, setCurrentStep] = useState<number>(
    ANALYSIS_STEP_TYPE.SELECT_DATA,
  );
  /** 步骤条枚举 */
  const [stepOptions] = useState<StepProps[]>([
    {
      title: I18N.Factors.basicInformation,
    },
    {
      title: I18N.Factors.accountingModel,
    },
  ]);
  const initClose = () => {
    setCurrentStep(ANALYSIS_STEP_TYPE.SELECT_DATA);
    onNavigateCustomBackFn();
  };
  return (
    <CustomDrawer
      title={
        <div className={style.stepWrapper}>
          <div className={style.backBtn} onClick={initClose}>
            <span className={style.backName}>{I18N.eca.modelDetails}</span>
          </div>
          <div className={style.step}>
            <Steps
              current={currentStep}
              size='small'
              responsive={false}
              items={stepOptions}
              onChange={currentStepValue => {
                setCurrentStep(currentStepValue);
              }}
            />
          </div>
        </div>
      }
      visible={accountModelDetailVisible}
      onClose={initClose}
      footer={[
        <Button key='back' onClick={initClose}>
          {I18N.carbonFootPrintLCA.close}
        </Button>,
      ]}
    >
      <div className={style.wrapper}>
        <div className={style.container}>
          {/* 选择数据表单内容组件 */}
          {currentStep === ANALYSIS_STEP_TYPE.SELECT_DATA && (
            <SelectDataInfo
              drawerOptions={{
                isDetail: true,
                isDrawer: true,
                isNoFooter: true,
                drawerAccountModelId: modelId,
              }}
            />
          )}
          {/* 模板收集表单内容组件 */}
          {currentStep === ANALYSIS_STEP_TYPE.ANALYSIS_CONFIG && (
            <AccountingModelInfo
              drawerOptions={{
                currentStep,
                isDetail: true,
                isDrawer: true,
                isNoFooter: true,
                drawerAccountModelId: modelId,
              }}
            />
          )}
        </div>
      </div>
    </CustomDrawer>
  );
};

export default AccountModelDetail;
