import { StepProps, Steps } from 'antd';

import style from './index.module.less';

export const ConfigSteps = ({
  currentStep,
  stepsConfig,
}: {
  currentStep: number;
  stepsConfig: StepProps[];
}) => (
  <Steps
    className={style.steps}
    current={currentStep}
    direction='vertical'
    items={stepsConfig}
  />
);
