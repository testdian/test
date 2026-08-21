import { Button, Space, Spin, Steps, TabsProps } from 'antd';
import { FC, useEffect, useState } from 'react';

import CustomDrawer from '@/components/CustomDrawer';
import { ModalFooter } from '@/components/ModalFooter';
import I18N from '@/lang/I18N';
import { Toast } from '@/utils';
import ChooseTemplateParams from '@/views/eca/emissionManage/Info/ChooseTemplateParams';
import ParamsTable from '@/views/eca/emissionManage/Info/components/ParamsTable';
import { TemplateConfigForm } from '@/views/eca/emissionManage/Info/components/TemplateConfigForm';
import TemplateFormulaConfiguration from '@/views/eca/emissionManage/Info/components/TemplateFormulaConfiguration';
import TemplateRadioGroup from '@/views/eca/emissionManage/Info/components/TemplateRadioGroup';
import {
  getEmissionSourceDetailApi,
  getEmissionSourceTemplateDetailApi,
} from '@/views/eca/emissionManage/service';
import { EmissionSourceTemplateResp } from '@/views/eca/emissionManage/type';
import { TEMPLATE_CODE } from '@/views/eca/util/constant';

import style from './index.module.less';

interface EditFactorDrawerProps {
  computationSourceId?: number;
  emissionSourceId: number;
  visible: boolean;
  onClose: () => void;
  onSuccessSave: () => void;
}

const EditFactorDrawer: FC<EditFactorDrawerProps> = ({
  computationSourceId,
  emissionSourceId,
  visible,
  onSuccessSave,
  onClose,
}) => {
  const [activeKeyTemplateId, setActiveKeyTemplateId] = useState<
    number | string
  >();

  /** 设置模版name */
  const [templateName, setTemplateName] = useState<string>();

  const [loading, setLoading] = useState(false);
  // 设置模版列表数据
  const [templateList, setTemplateList] = useState<
    TabsProps['items'] | EmissionSourceTemplateResp[]
  >([]);

  // 设置step3因子对应的参数弹窗
  const [paramsModalOpen, setParamsModalOpen] = useState(false);

  // 设置模版详情数据
  const [currentTemplateDetail, setCurrentTemplateDetail] =
    useState<EmissionSourceTemplateResp>();

  // 设置step2:模版详情的参数列表数据
  const [templateParamsList, setTemplateParamsList] = useState<
    EmissionSourceTemplateResp['paramList']
  >([]);

  // 设置不展示在模版中的参数列表数据
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
    const emissionSourceTemplateDetail = await fetchTemplateDetail(+targetId);
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

  /** 获取排放源的详情数据 */
  const fetchTemplateList = async (sourceId?: number) => {
    const sourceTargetId = sourceId ?? emissionSourceId;
    if (sourceTargetId) {
      const { data } = await getEmissionSourceDetailApi(sourceTargetId);
      return data?.data?.templateList || [];
    }
    return Toast('error', I18N.eca.notObtained);
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

  useEffect(() => {
    if (!emissionSourceId || !visible) return;
    initGetSourceDetail(emissionSourceId);
  }, [emissionSourceId, visible]);

  /** 切换模版查询详情 */
  const checkTemplate = async (key: number) => {
    await refreshTemplateDetail(key);
  };

  return (
    <CustomDrawer
      visible={visible}
      width='80%'
      title={
        <Space>
          <div>{I18N.eca.editFactors}</div>
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
            isShow
          />
        </Space>
      }
      footer={
        <ModalFooter
          isView={false}
          onCancel={onClose}
          onOk={() => {
            onSuccessSave?.();
          }}
        />
      }
      onClose={() => {
        onClose?.();
      }}
    >
      <div className={style.stepWrapperMain}>
        <Spin spinning={loading}>
          <div className={style.stepWrapperMainContent}>
            {activeKeyTemplateId && (
              <Steps
                progressDot
                className={style.steps}
                current={3}
                direction='vertical'
                items={[
                  {
                    title: (
                      <div className={style.stepOne}>
                        <div>{I18N.eca.stepSelection2}</div>
                      </div>
                    ),
                    description: (
                      <div>
                        {/* 参数对应的表格 */}
                        <ParamsTable
                          paramsTitle={templateName || I18N.dashborad.template}
                          paramsData={templateParamsList || []}
                        />
                        {/* 不在模版中展示的参数对应表格 */}
                        {currentTemplateDetail?.notDisplayPramList?.length && (
                          <ParamsTable
                            paramsData={
                              currentTemplateDetail?.notDisplayPramList || []
                            }
                            paramsTitle={I18N.eca.notIncludedInTheTemplate}
                          />
                        )}
                        {/* 模版描述表单 */}
                        <TemplateConfigForm
                          isDetail
                          emissionSourceId={emissionSourceId}
                          currentTemplateDetail={currentTemplateDetail || {}}
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
                      // 模版公式列表
                      <TemplateFormulaConfiguration
                        emissionSourceId={emissionSourceId}
                        activeKeyTemplateId={Number(activeKeyTemplateId)}
                        templateParamsList={templateParamsList || []}
                        notDisplayPramList={notDisplayPramList || []}
                        formulaList={templateFormulaList || []}
                        templateDetail={currentTemplateDetail}
                        onSuccess={() => {}}
                        isDetail
                      />
                    ),
                    disabled: false,
                  },
                  {
                    title: (
                      <div className={style.stepOne}>
                        <div>{I18N.eca.stepSelection}</div>
                        <Button
                          type='primary'
                          onClick={() => {
                            setParamsModalOpen(true);
                          }}
                        >
                          {I18N.eca.selectTemplateParameters}
                        </Button>
                      </div>
                    ),
                    description: (
                      <div>
                        <ChooseTemplateParams
                          mainParamsList={mainParamsList || []}
                          templateParamsList={templateParamsList || []}
                          emissionSourceId={emissionSourceId}
                          computationSourceId={computationSourceId}
                          activeKeyTemplateId={+activeKeyTemplateId}
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
                    ),
                    disabled: false,
                  },
                ]}
              />
            )}
          </div>
        </Spin>
      </div>
    </CustomDrawer>
  );
};

export default EditFactorDrawer;
