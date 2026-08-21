/*
 * @description: 添加、编辑、排放源详情
 */
import { ArrowLeftOutlined } from '@ant-design/icons';
import I18N from '@src/lang/I18N';
import { Affix, Button, Spin, Steps, TabsProps } from 'antd';
import { compact } from 'lodash-es';
import { FC, useEffect, useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';

import { FormActions } from '@/components/FormActions';
import { FullScreenModal } from '@/components/FullScreenModel';
import { usePageInfo } from '@/hooks';
import { EcaRouteMaps } from '@/router/utils/ecaEmums';
import {
  PAGE_TYPE_VAR,
  PageTypeInfo,
  virtualLinkTransform,
} from '@/router/utils/enums';
import { modal } from '@/store/module/notification';
import { Toast } from '@/utils';
import EmissionSourceComponent from '@/views/components/EmissionSource';

import { useSetEmissionSourceInfo } from '../../hooks';
import {
  addEmissionSourceApi,
  addEmissionSourceTemplateApi,
  deleteEmissionSourceTemplateApi,
  editEmissionSourceApi,
  getEmissionSourceDetailApi,
  getEmissionSourceTemplateDetailApi,
} from '../service';
import ChooseParamsTransfer from './ChooseParamsTransfer';
import ParameterManagement from './ChooseParamsTransfer/chooseModal';
import style from './index.module.less';
import { EmissionSourceTemplateResp } from '../type';
import ChooseTemplateParams from './ChooseTemplateParams';
import ParamsTable from './components/ParamsTable';
import { TemplateConfigForm } from './components/TemplateConfigForm';
import TemplateFormulaConfiguration from './components/TemplateFormulaConfiguration';
import TemplateRadioGroup from './components/TemplateRadioGroup';
import { TEMPLATE_CODE } from '../../util/constant';

type TargetKey = React.MouseEvent | React.KeyboardEvent | string;

const EmissionSourceInfo: FC<{
  /** 复用该组件时传进来的排放源id值 */
  propsEmissionSourceId: number;
  /** 自定义排放源页脚样式 */
  footerClassName?: string;
  /** 自定义取消按钮 */
  customCancel?: boolean;
  /** 自定义取消事件 */
  customCancelFn?: () => void;
  /** 自定义确定按钮 */
  customTemplateFooterSaveFn?: () => void;
  customTemplateFooterSave?: boolean;
}> = ({
  propsEmissionSourceId,
  footerClassName,
  customCancel,
  customTemplateFooterSave,
  customCancelFn,
  customTemplateFooterSaveFn,
}) => {
  const navigate = useNavigate();

  const [open, setOpen] = useState(false);

  const { pageTypeInfo, id } = useParams<{
    pageTypeInfo: PageTypeInfo;
    id: string;
  }>();

  const { isAdd, isDetail, isEdit } = usePageInfo();

  // 是否为复制页面
  const isCopy = pageTypeInfo === PageTypeInfo.copy;

  // 排放源ID
  const emissionSourceId = propsEmissionSourceId ?? Number(id);

  // 排放源详情信息
  const emissionSourceDetailData = useSetEmissionSourceInfo(emissionSourceId);

  const [current, setCurrent] = useState(0);

  const [loading, setLoading] = useState(false);

  // 设置模版ID
  const [activeKeyTemplateId, setActiveKeyTemplateId] = useState<number>();

  /** 设置模版name */
  const [templateName, setTemplateName] = useState<string>();

  // 设置模版列表数据
  const [templateList, setTemplateList] = useState<
    TabsProps['items'] | EmissionSourceTemplateResp[]
  >([]);

  // 设置模版详情数据
  const [currentTemplateDetail, setCurrentTemplateDetail] =
    useState<EmissionSourceTemplateResp>();

  // 设置step3因子对应的参数弹窗
  const [paramsModalOpen, setParamsModalOpen] = useState(false);

  // 设置选择参数弹窗
  const [chooseStepOneParamsModalOpen, setChooseStepOneParamsModalOpen] =
    useState(false);

  // 设置step2:模版详情的参数列表数据
  const [templateParamsList, setTemplateParamsList] = useState<
    EmissionSourceTemplateResp['paramList']
  >([]);
  /** 模版详情中不展示在模版中的参数列表数据 */
  const [notDisplayPramList, setNotDisplayPramList] = useState<
    EmissionSourceTemplateResp['notDisplayPramList']
  >([]);

  // 设置step2:模版详情的公式列表数据
  const [templateFormulaList, setTemplateFormulaList] = useState<
    EmissionSourceTemplateResp['formulaList']
  >([]);

  // 设置step3:模版详情的主要参数列表数据
  const [mainParamsList, setMainParamsList] = useState<
    EmissionSourceTemplateResp['mainParamList']
  >([]);

  /** 获取排放源的详情数据 */
  const fetchTemplateList = async (sourceId?: number) => {
    const sourceTargetId = sourceId ?? emissionSourceId;
    if (sourceTargetId) {
      const { data } = await getEmissionSourceDetailApi(sourceTargetId);
      return data?.data?.templateList || [];
    }
    return Toast('error', I18N.eca.notObtained);
  };

  /** 提取不同模板详情获取逻辑 */
  const fetchTemplateDetail = async (templateId: number) => {
    if (templateId) {
      setLoading(true);
      const { data } = await getEmissionSourceTemplateDetailApi(
        Number(emissionSourceId),
        templateId,
      ).finally(() => setLoading(false));
      return data?.data;
    }
    return Toast('error', I18N.eca.notObtained2);
  };

  /** 刷新模板详情 */
  const refreshTemplateDetail = async (templateId?: number) => {
    const targetId = templateId ?? activeKeyTemplateId;
    if (!targetId) return;
    // 1. 获取最新模板详情
    const emissionSourceTemplateDetail = await fetchTemplateDetail(targetId);
    // 2. 更新相关状态
    setCurrentTemplateDetail(
      emissionSourceTemplateDetail as EmissionSourceTemplateResp,
    );
    setActiveKeyTemplateId(emissionSourceTemplateDetail?.id);
    setTemplateName(
      (templateList as { id: number; label: string }[])?.find(
        item => item.id === Number(emissionSourceTemplateDetail?.id),
      )?.label,
    );
    setTemplateParamsList(emissionSourceTemplateDetail?.paramList || []);
    setNotDisplayPramList(
      emissionSourceTemplateDetail?.notDisplayPramList || [],
    );
    setTemplateFormulaList(emissionSourceTemplateDetail?.formulaList || []);
    setMainParamsList(emissionSourceTemplateDetail?.mainParamList || []);
  };

  /** 初始化排放源详情数据 */
  const initGetSourceDetail = async (sourceId?: number) => {
    // 1. 获取模板列表
    const templates = await fetchTemplateList(sourceId);
    // 2. 处理模板列表数据
    const processedTemplates = templates?.map?.((item, index) => ({
      ...item,
      label: item?.templateName || `${TEMPLATE_CODE}${index + 1}`,
      key: item.id,
    }));
    setTemplateList(processedTemplates);
    // 3. 如果有模板列表，则获取第一个模板的详情
    if (processedTemplates?.length) {
      const defaultTemplateId = Number(processedTemplates?.[0]?.id);
      await refreshTemplateDetail(defaultTemplateId);
    }
  };

  /** 新增模版 */
  const add = async () => {
    const newTemplateIndex = (templateList?.length ?? 0) + 1;
    const newTemplateName = `${TEMPLATE_CODE}${newTemplateIndex}`;

    await addEmissionSourceTemplateApi({
      emissionSourceId,
      templateName: newTemplateName || '',
    });
    initGetSourceDetail();
  };

  /** 删除模版 */
  const remove = async (targetKey: TargetKey) => {
    modal.confirm({
      title: I18N.eca.confirmToDeleteThis2,
      onOk: async () => {
        await deleteEmissionSourceTemplateApi(targetKey as string);
        initGetSourceDetail();
      },
    });
  };

  /** 确定/取消按钮的跳转 */
  const navigatePageTo = () => {
    navigate(EcaRouteMaps.emissionManage);
  };

  /** 点击选择参数按钮 */
  const chooseParamsBtnClick = () => {
    setChooseStepOneParamsModalOpen(true);
    refreshTemplateDetail();
  };
  /** 切换模版查询详情 */
  const checkTemplate = async (key: number) => {
    await refreshTemplateDetail(key);
  };

  useEffect(() => {
    (async () => {
      if (isDetail) {
        const templates = await fetchTemplateList(Number(emissionSourceId));
        // 2. 处理模板列表数据
        const processedTemplates = templates?.map?.((item, index) => ({
          ...item,
          label: item?.templateName || `${TEMPLATE_CODE}${index + 1}`,
          key: `${item.id}`,
        }));
        setTemplateList(processedTemplates);
      }
    })();
  }, []);

  const STEP_VALIDATORS = [
    // 第一步校验：参数列表
    (template: EmissionSourceTemplateResp) =>
      !!template?.fillTips &&
      !!template?.fillDesc &&
      (template?.paramList || [])?.length > 0,

    // 第二步校验：公式列表
    (template: EmissionSourceTemplateResp) =>
      (template?.formulaList || [])?.length > 0,

    // 第三步校验：主要参数
    (template: EmissionSourceTemplateResp) =>
      (template?.mainParamList || [])?.length > 0,
  ];

  const checkStepsValidity = () => {
    if (!currentTemplateDetail) return;

    // 计算每个步骤是否完成
    const stepsValidity = STEP_VALIDATORS.map(fn => fn(currentTemplateDetail));

    // 找到最后一个完成的步骤
    const lastCompletedStep = stepsValidity.lastIndexOf(true);

    // 自动限制当前步骤不超过已完成步骤
    if (current > lastCompletedStep) {
      setCurrent(lastCompletedStep + 1);
    }
  };

  useEffect(() => {
    checkStepsValidity();
  }, [currentTemplateDetail, current]);

  return (
    <>
      <div>
        <EmissionSourceComponent
          templateList={templateList as EmissionSourceTemplateResp[]}
          autoCreateSourceCode={isAdd || isCopy}
          readPretty={isDetail}
          emissionSourceId={emissionSourceId}
          activityDataVisible={false}
          noRequiredField=''
          emissionSourceDetailData={emissionSourceDetailData}
          onConfirmFn={async data => {
            if (isAdd) {
              const { data: addResult } = await addEmissionSourceApi(data);
              if (addResult?.data) {
                navigate(
                  virtualLinkTransform(
                    EcaRouteMaps.emissionManagInfo,
                    [PAGE_TYPE_VAR, ':id'],
                    [PageTypeInfo.edit, addResult?.data as unknown as string],
                  ),
                );
                setOpen(true);
                initGetSourceDetail(Number(addResult?.data));
              }
            }
            if (isEdit) {
              await editEmissionSourceApi(data);
              initGetSourceDetail();
              setOpen(true);
            }
          }}
          onCancelFn={() => {
            if (customCancel) {
              customCancelFn?.();
            } else {
              navigatePageTo();
            }
          }}
          footerClassName={footerClassName || ''}
        />
      </div>
      {/* 新增模版收集全屏弹窗页面  */}
      {open && (
        <FullScreenModal>
          <Affix offsetTop={0}>
            <div className={style.stepWrapper}>
              <Button
                icon={<ArrowLeftOutlined />}
                type='link'
                onClick={() => {
                  setOpen(false);
                }}
              >
                {I18N.components.templateCollection}
              </Button>
            </div>
            <div className={style.radioWrapper}>
              <TemplateRadioGroup
                emissionSourceId={emissionSourceId}
                templateList={templateList || []}
                activeKeyTemplateId={Number(activeKeyTemplateId)}
                onChange={value => {
                  const key = value;
                  setTemplateName(
                    (templateList as { key: string; label: string }[])?.find(
                      item => Number(item.key) === key,
                    )?.label,
                  );
                  setActiveKeyTemplateId(Number(key));
                  checkTemplate(Number(key));
                }}
                onAdd={add}
                onRemove={remove}
                onEditSuccess={() => {
                  // 编辑模板名称成功后刷新模板列表
                  initGetSourceDetail();
                }}
              />
            </div>
          </Affix>
          <div className={style.stepWrapperMain}>
            <Spin spinning={loading}>
              <div className={style.stepWrapperMainContent}>
                {activeKeyTemplateId && (
                  <Steps
                    progressDot
                    className={style.steps}
                    current={
                      STEP_VALIDATORS[0](currentTemplateDetail!) &&
                      STEP_VALIDATORS[1](currentTemplateDetail!)
                        ? 3
                        : STEP_VALIDATORS[1](currentTemplateDetail!)
                        ? 2
                        : 1
                    }
                    direction='vertical'
                    items={[
                      {
                        title: (
                          <div className={style.stepOne}>
                            <div>{I18N.eca.stepSelection2}</div>
                            <Button
                              onClick={() => {
                                chooseParamsBtnClick();
                              }}
                              type='primary'
                            >
                              {I18N.eca.selectParameters}
                            </Button>
                          </div>
                        ),
                        description: (
                          <div>
                            <ParameterManagement
                              visible={chooseStepOneParamsModalOpen}
                              onCancel={() => {
                                setChooseStepOneParamsModalOpen(false);
                              }}
                              emissionSourceId={emissionSourceId}
                              emissionSourceTemplateId={activeKeyTemplateId}
                              onSuccess={() => {
                                refreshTemplateDetail();
                                setChooseStepOneParamsModalOpen(false);
                              }}
                              currentTemplateDetail={
                                currentTemplateDetail || {}
                              }
                            />
                            {/* 选择参数Transfer弹窗 */}
                            <ChooseParamsTransfer
                              onClose={() => {
                                setChooseStepOneParamsModalOpen(false);
                              }}
                              onSuccess={() => {
                                setChooseStepOneParamsModalOpen(false);
                                refreshTemplateDetail();
                              }}
                              chooseParamsModalOpen={false}
                              emissionSourceId={emissionSourceId}
                              emissionSourceTemplateId={activeKeyTemplateId}
                            />
                            {/* 参数对应的表格 */}
                            <ParamsTable
                              paramsTitle={
                                templateName || I18N.dashborad.template
                              }
                              paramsData={templateParamsList || []}
                            />
                            {/* 不在模版中展示的参数对应表格 */}
                            {currentTemplateDetail?.notDisplayPramList
                              ?.length && (
                              <ParamsTable
                                paramsData={
                                  currentTemplateDetail?.notDisplayPramList ||
                                  []
                                }
                                paramsTitle={I18N.eca.notIncludedInTheTemplate}
                              />
                            )}
                            {/* 模版描述表单 */}
                            <TemplateConfigForm
                              emissionSourceId={emissionSourceId}
                              currentTemplateDetail={
                                currentTemplateDetail || {}
                              }
                              onSuccess={() => {
                                refreshTemplateDetail(activeKeyTemplateId);
                              }}
                            />
                          </div>
                        ),
                      },
                      {
                        title: (
                          <div className={style.stepOne}>
                            <div>{I18N.eca.stepLoss}</div>
                          </div>
                        ),
                        description: (
                          <div>
                            {STEP_VALIDATORS[0](currentTemplateDetail!) && (
                              <TemplateFormulaConfiguration
                                activeKeyTemplateId={Number(
                                  activeKeyTemplateId,
                                )}
                                emissionSourceId={emissionSourceId}
                                templateParamsList={templateParamsList || []}
                                notDisplayPramList={notDisplayPramList || []}
                                formulaList={templateFormulaList || []}
                                templateDetail={currentTemplateDetail}
                                onSuccess={() => {
                                  refreshTemplateDetail();
                                }}
                                isDetail={isDetail}
                              />
                            )}
                          </div>
                        ),
                        disabled: false,
                      },
                      {
                        title: (
                          <div className={style.stepOne}>
                            <div>{I18N.eca.stepSelection}</div>
                            {STEP_VALIDATORS[0](currentTemplateDetail!) &&
                              STEP_VALIDATORS[1](currentTemplateDetail!) && (
                                <Button
                                  type='primary'
                                  onClick={() => {
                                    setParamsModalOpen(true);
                                  }}
                                >
                                  {I18N.eca.selectTemplateParameters}
                                </Button>
                              )}
                          </div>
                        ),
                        description: (
                          <div>
                            {STEP_VALIDATORS[0](currentTemplateDetail!) &&
                              STEP_VALIDATORS[1](currentTemplateDetail!) && (
                                <div>
                                  <ChooseTemplateParams
                                    mainParamsList={mainParamsList || []}
                                    templateParamsList={
                                      templateParamsList || []
                                    }
                                    emissionSourceId={emissionSourceId}
                                    activeKeyTemplateId={activeKeyTemplateId}
                                    paramsModalOpen={paramsModalOpen}
                                    onAddMainParamsSuccess={() => {
                                      /** 增加主要参数成功后 */
                                      setParamsModalOpen(false);
                                      refreshTemplateDetail();
                                    }}
                                    onCancel={() => {
                                      setParamsModalOpen(false);
                                    }}
                                    onSaveFactorSuccess={() => {
                                      refreshTemplateDetail();
                                    }}
                                    onDeleteAllFactorSuccess={() => {
                                      refreshTemplateDetail();
                                    }}
                                  />
                                </div>
                              )}
                          </div>
                        ),
                        disabled: false,
                      },
                    ]}
                  />
                )}
              </div>
            </Spin>
          </div>
          <FormActions
            className='footWrapper'
            place='center'
            buttons={compact([
              !isDetail && {
                title: I18N.base.confirm,
                type: 'primary',
                onClick: async () => {
                  if (customTemplateFooterSave) {
                    customTemplateFooterSaveFn?.();
                  } else {
                    navigate(EcaRouteMaps.emissionManage);
                  }
                },
              },
              !isDetail && {
                title: I18N.Factors.cancel,
                onClick: async () => {
                  setOpen(false);
                  setActiveKeyTemplateId(undefined);
                  setCurrentTemplateDetail(undefined);
                },
              },
            ])}
          />
        </FullScreenModal>
      )}
    </>
  );
};
export default EmissionSourceInfo;
