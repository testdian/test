/**
 * @description 碳足迹模型的详情(目标与范围、清单分析、影响评价、结果解释)
 */

import I18N from '@src/lang/I18N';
import { Modal, Steps, StepProps, Button, Space } from 'antd';
import './index.less';
import classNames from 'classnames';
import { useEffect, useRef, useState } from 'react';
import { useNavigate } from 'react-router-dom';

import CommonHeader from '@/components/CommonHeader';
import { usePageInfo } from '@/hooks';
import { LCARouteMaps } from '@/router/utils/lcaEnums';
import { modal } from '@/store/module/notification';
import {
  updateUrl,
  getSearchParams,
  Toast,
  modelFooterBtnStyle,
} from '@/utils';

import ImpactAssessment from './ImpactAssessment';
import InventoryAnalysis from './InventoryAnalysis';
import ObjectivesAndScope from './ObjectivesAndScope';
import { SYSTEM_BOUNDARY_TYPE } from './ObjectivesAndScope/constant';
import ResultsInterpretation from './ResultsInterpretation';
import { INFO_SOURCE, LIFE_CYCLE_TYPE, STEP_TYPE } from './constant';
import style from './index.module.less';
import BackIcon from '../Image/back.svg';
import { SetMainResearchObjModal } from '../components/SetMainResearchObjModal';
import {
  getCheckCalc,
  getModelDetail,
  postSetMainResearchObj,
} from '../service';
import { ModelInfo } from '../type';

const {
  OBJECTIVES_SCOPE,
  INVENTORY_ANALYSIS,
  IMPACT_ASSESSMENT,
  RESULTS_INTERPRETATION,
} = STEP_TYPE;

const { PRODUCTION_STAGE, PRODUCT_STAGE } = LIFE_CYCLE_TYPE;

const CarbonFootprintModel = () => {
  const navigate = useNavigate();

  /** 模型ID */
  const { id, isDetail } = usePageInfo();

  /** URL 携带的参数 */
  const search = { ...getSearchParams()[0] };

  /** 是否是环境足迹模型跳转过来的详情 是则展示返回 */
  const isModelInfo = search?.source === INFO_SOURCE.LCA_MODEL;

  /** 点击返回按钮的方法  返回到列表页 */
  const onBackClick = () => {
    navigate(LCARouteMaps.lcaModel);
  };

  /** ****************************************** 步骤条部分 ********************************************************/
  /** 步骤条枚举 */
  const [stepOptions, setStepOptions] = useState<StepProps[]>([
    {
      title: I18N.carbonFootPrintLCA.objectivesAndScope,
    },
    {
      title: I18N.carbonFootPrintLCA.inventoryAnalysis,
      disabled: true,
    },
    {
      title: I18N.carbonFootPrintLCA.impactAssessment,
      disabled: true,
    },
    {
      title: I18N.carbonFootPrintLCA.resultInterpretation,
      disabled: true,
    },
  ]);

  /** 当前步骤 */
  const [currentStep, setCurrentStep] = useState<number>(
    Number(search?.currentStep) || OBJECTIVES_SCOPE,
  );

  /** ****************************************** header部分 ********************************************************/
  /** 计算按钮loading */
  // const [calculateLoading, setCalculateLoading] = useState(false);
  /** 校验模型计算是否有错误 */
  const [calcError, setCalcError] = useState(false);
  /** 是否展示过程结构图 */
  const [showProcessStructureDiagram, setShowProcessStructureDiagram] =
    useState(false);
  /** 是否展示基准流 */
  const [showBaseLine, setShowBaseLine] = useState(false);

  /** ****************************************** 模型部分：目标与范围、清单分析 ********************************************************/
  /** 模型详情 */
  const [modelDetail, setModelDetail] = useState<ModelInfo>();
  const {
    productName,
    funcUnit,
    baselineNum,
    baselineUnitName,
    orgName,
    lifeCycleList: currentLifeCycleList,
    selectedDb,
    systemBoundaryType,
  } = modelDetail || {};

  /** 主要研究对象默认的生命周期阶段 */
  const defaultMainLifeCycleId =
    systemBoundaryType === SYSTEM_BOUNDARY_TYPE.COMPLETE_LIFE_CYCLE
      ? PRODUCT_STAGE
      : PRODUCTION_STAGE;

  /** 控制主要研究对象配置弹窗 */
  const [mainResearchObjOpen, setMainResearchObjOpen] = useState(false);
  /** 主要研究对象配置弹窗loading */
  const [mainResearchObjLoading, setMainResearchObjLoading] = useState(false);
  /** 清单分析ref */
  const InventoryAnalysisRef = useRef<{
    onClickProcessAdd: () => void;
    onRefresh: () => void;
  }>();

  /** ****************************************** 步骤条 ********************************************************/
  /** 步骤条状态 当没有模型id时，清单分析、影响评价、结果解释禁用 */
  useEffect(() => {
    const arr = stepOptions.map(item => ({
      ...item,
      disabled: !id,
    }));
    setStepOptions([...arr] as StepProps[]);
  }, [currentStep]);

  /** ****************************************** 模型部分：目标与范围、清单分析 ********************************************************/
  /** 获取模型详情 */
  useEffect(() => {
    setModelDetail(undefined);
    if (id) {
      getModelDetail({ id }).then(({ data }) => {
        setMainResearchObjOpen(!data?.data?.mainResearchObjectFlag);
        setModelDetail(data?.data);
      });
    }
  }, [id, currentStep]);

  return (
    <div>
      <Modal
        className='carbonFootprintModelWrapper'
        destroyOnClose
        mask={false}
        open
        width='100%'
        title={undefined}
        footer={null}
        closable={false}
        transitionName=''
        okText={I18N.base.confirm}
        cancelText={I18N.Factors.cancel}
      >
        <div className={style.wrapper}>
          <div className={style.container}>
            {/* 步骤条 */}
            <div className={style.stepWrapper}>
              {(!isDetail || isModelInfo) && (
                <div className={style.backBtn} onClick={() => onBackClick()}>
                  <img className={style.backIcon} src={BackIcon} alt='' />
                  <span className={style.backName}>
                    {I18N.carbonFootPrintLCA.carbonFootprintModel}
                  </span>
                </div>
              )}
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
                    setShowBaseLine(false);
                    setShowProcessStructureDiagram(false);
                    setCurrentStep(currentStepValue);
                  }}
                />
              </div>
            </div>

            {/* 头部展示信息 目标与范围时不展示 */}
            {currentStep !== OBJECTIVES_SCOPE && (
              <div className={style.headerWrapper}>
                <div className={style.commonHeaderWrapper}>
                  <CommonHeader
                    basicInfo={[
                      {
                        label: I18N.carbonFootPrintLCA.functionalUnits,
                        value: funcUnit,
                      },
                      {
                        label: I18N.carbonFootPrintLCA.benchmarkFlow,
                        value:
                          baselineNum && baselineUnitName
                            ? `${baselineNum}${baselineUnitName}`
                            : '-',
                      },
                      {
                        label: I18N.carbonData.affiliatedOrganization,
                        value: orgName,
                      },
                    ]}
                  />
                </div>
                {/* 只有清单分析有右侧按钮 */}
                {currentStep === INVENTORY_ANALYSIS && (
                  <div className={style.headerRightBtn}>
                    <Space size='middle'>
                      {!showProcessStructureDiagram && !isDetail && (
                        <>
                          {/* {!showBaseLine && (
                            <Button
                              key='calculate'
                              type='primary'
                              loading={calculateLoading}
                              onClick={async () => {
                                setCalculateLoading(true);
                                try {
                                  const { data } = await postCalc({
                                    modelId: id,
                                  });
                                  if (data?.data && data.data?.length) {
                                    modal.success({
                                      title: I18N.Factors.prompt,
                                      icon: '',
                                      content: (
                                        <span>
                                          {
                                            I18N.carbonFootPrintLCA
                                              .modelBaselineValue
                                          }
                                          <span className='warnRed'>
                                            {
                                              I18N.carbonFootPrintLCA
                                                .arithmeticError
                                            }
                                          </span>
                                          {
                                            I18N.carbonFootPrintLCA
                                              .possibleErrors
                                          }
                                        </span>
                                      ),
                                      ...modelFooterBtnStyle,
                                      okText: I18N.base.confirm,
                                      cancelText: I18N.Factors.cancel,
                                    });
                                  } else {
                                    Toast(
                                      'success',
                                      I18N.carbonFootPrintLCA
                                        .calculationCompleted,
                                    );
                                  }
                                } finally {
                                  setCalculateLoading(false);
                                }
                              }}
                            >
                              {I18N.carbonFootPrintLCA.calculate}
                            </Button>
                          )} */}
                          {/* {!showBaseLine && (
                            <Button
                              key='addProcess'
                              type='primary'
                              onClick={() => {
                                InventoryAnalysisRef?.current?.onClickProcessAdd();
                              }}
                            >
                              {I18N.carbonFootPrintLCA.newAdditionProcess}
                            </Button>
                          )} */}
                          {!showBaseLine && (
                            <div className={style.modelCheck}>
                              {I18N.carbonFootPrintLCA.modelValidation}
                              <span
                                className={classNames({
                                  [style.modelCheckTextError]: calcError,
                                  [style.modelCheckTextRight]: !calcError,
                                })}
                              >
                                {calcError
                                  ? I18N.carbonFootPrintLCA
                                      .thereIsAnIncorrectConfiguration
                                  : I18N.carbonFootPrintLCA.noErrorsFound}
                              </span>
                            </div>
                          )}
                          <Button
                            key='baseShow'
                            type='primary'
                            onClick={() => {
                              setShowBaseLine(!showBaseLine);
                            }}
                          >
                            {showBaseLine
                              ? I18N.carbonFootPrintLCA.switchRawNumbers
                              : I18N.carbonFootPrintLCA.switchBenchmarkFlow}
                          </Button>
                          {!showBaseLine && (
                            <Button
                              key='importList'
                              type='primary'
                              onClick={() => {
                                modal.confirm({
                                  title: I18N.Factors.prompt,
                                  icon: '',
                                  content: (
                                    <span>
                                      {I18N.carbonFootPrintLCA.importListWill}
                                      <span className='warnRed'>
                                        {I18N.carbonFootPrintLCA.clearCurrent}
                                      </span>
                                      {
                                        I18N.carbonFootPrintLCA
                                          .pleaseConfirmToContinue
                                      }
                                    </span>
                                  ),
                                  ...modelFooterBtnStyle,
                                  okText: I18N.base.confirm,
                                  cancelText: I18N.Factors.cancel,
                                  onOk: () => {
                                    navigate(
                                      `${LCARouteMaps.lcaModelInfoImport}?modelId=${id}`,
                                    );
                                  },
                                });
                              }}
                            >
                              {I18N.carbonFootPrintLCA.importInventory}
                            </Button>
                          )}
                        </>
                      )}
                      {!showBaseLine && (
                        <Button
                          key='processDiagram'
                          type='default'
                          onClick={() => {
                            setShowProcessStructureDiagram(
                              !showProcessStructureDiagram,
                            );
                          }}
                        >
                          {showProcessStructureDiagram
                            ? I18N.carbonFootPrintLCA.returnListPoints
                            : I18N.carbonFootPrintLCA.processStructureDiagram}
                        </Button>
                      )}
                    </Space>
                  </div>
                )}
              </div>
            )}

            {/* 目标与范围 */}
            {currentStep === OBJECTIVES_SCOPE && (
              <ObjectivesAndScope
                isModelInfo={isModelInfo}
                modelDetail={modelDetail}
                onSaveAndNextStepClick={({ id: modelId }) => {
                  updateUrl({
                    id: modelId,
                    currentStep: INVENTORY_ANALYSIS,
                  });
                  setCurrentStep(INVENTORY_ANALYSIS);
                }}
                onBackClick={() => onBackClick()}
              />
            )}
            {/* 配置主要研究对象 */}
            {currentStep !== OBJECTIVES_SCOPE &&
              currentLifeCycleList &&
              mainResearchObjOpen &&
              !isDetail && (
                <SetMainResearchObjModal
                  productName={productName}
                  defaultLifeCycleId={defaultMainLifeCycleId}
                  lifeCycleListIds={currentLifeCycleList}
                  open={mainResearchObjOpen}
                  confirmLoading={mainResearchObjLoading}
                  onCancel={() => {
                    setMainResearchObjOpen(false);
                    updateUrl({
                      ...search,
                      currentStep: OBJECTIVES_SCOPE,
                    });
                    setCurrentStep(OBJECTIVES_SCOPE);
                  }}
                  onOk={async val => {
                    try {
                      setMainResearchObjLoading(true);
                      await postSetMainResearchObj({ ...val, modelId: id });
                      Toast(
                        'success',
                        I18N.supplyChainCarbonManagement.operationSuccessful,
                      );
                      setMainResearchObjOpen(false);
                      if (currentStep === INVENTORY_ANALYSIS) {
                        InventoryAnalysisRef?.current?.onRefresh();
                      }
                    } finally {
                      setMainResearchObjLoading(false);
                    }
                  }}
                />
              )}
            {/* 清单分析 */}
            {currentStep === INVENTORY_ANALYSIS && (
              <InventoryAnalysis
                isModelInfo={isModelInfo}
                showBaseLine={showBaseLine}
                ref={InventoryAnalysisRef}
                lifeCycleListIds={currentLifeCycleList}
                selectedDb={selectedDb}
                onNextStepClick={() => {
                  updateUrl({
                    ...search,
                    currentStep: IMPACT_ASSESSMENT,
                  });
                  setCurrentStep(IMPACT_ASSESSMENT);
                }}
                onPreviousStepClick={() => {
                  updateUrl({
                    ...search,
                    currentStep: OBJECTIVES_SCOPE,
                  });
                  setCurrentStep(OBJECTIVES_SCOPE);
                }}
                onBackClick={() => onBackClick()}
                showProcessStructureDiagram={showProcessStructureDiagram}
                onCheckCalc={async () => {
                  const { data } = await getCheckCalc({ id });
                  setCalcError(!!data.data);
                }}
              />
            )}
            {/* 影响评价 */}
            {currentStep === IMPACT_ASSESSMENT && (
              <ImpactAssessment
                isModelInfo={isModelInfo}
                onNextStepClick={() => {
                  updateUrl({
                    ...search,
                    currentStep: RESULTS_INTERPRETATION,
                  });
                  setCurrentStep(RESULTS_INTERPRETATION);
                }}
                onPreviousStepClick={() => {
                  updateUrl({
                    ...search,
                    currentStep: INVENTORY_ANALYSIS,
                  });
                  setCurrentStep(INVENTORY_ANALYSIS);
                }}
                onBackClick={() => onBackClick()}
              />
            )}
            {/* 结果解释 */}
            {currentStep === RESULTS_INTERPRETATION && (
              <ResultsInterpretation
                isModelInfo={isModelInfo}
                onPreviousStepClick={() => {
                  updateUrl({
                    ...search,
                    currentStep: IMPACT_ASSESSMENT,
                  });
                  setCurrentStep(IMPACT_ASSESSMENT);
                }}
                onBackClick={() => onBackClick()}
              />
            )}
          </div>
        </div>
      </Modal>
    </div>
  );
};
export default CarbonFootprintModel;
