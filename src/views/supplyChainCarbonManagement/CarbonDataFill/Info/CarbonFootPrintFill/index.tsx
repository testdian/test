/**
 * @description 供应商数据填报-详情-数据填报（产品碳足迹）
 */
import {
  Cascader,
  DatePicker,
  Form,
  FormGrid,
  FormItem,
  FormLayout,
  Input,
} from '@formily/antd-v5';
import { createForm } from '@formily/core';
import { createSchemaField } from '@formily/react';
import { Button, Space, Table } from 'antd';
import classNames from 'classnames';
import { compact, includes, omit } from 'lodash-es';
import { useEffect, useMemo, useState } from 'react';
import { useNavigate } from 'react-router-dom';

import { FormActions } from '@/components/FormActions';
import { FormilyFileUpload } from '@/components/FormilyFileUpload';
import I18N from '@/lang/I18N';
import { checkAuth } from '@/layout/utills';
import { PageTypeInfo } from '@/router/utils/enums';
import { LCARouteMaps } from '@/router/utils/lcaEnums';
import { SccmRouteMaps } from '@/router/utils/sccmEnums';
import { modal } from '@/store/module/notification';
import {
  Toast,
  changeFactorM2cascaderOptions,
  changeTableColumnsNoText,
  modalText,
  modelFooterBtnStyle,
} from '@/utils';
import { useAllEnumsBatch } from '@/views/dashborad/Dicts/hooks';
import {
  ALL_CYCLE,
  APPLY_TYPE,
} from '@/views/supplyChainCarbonManagement/utils/constant';
import {
  TypeApplyInfoResp,
  UploadFile,
} from '@/views/supplyChainCarbonManagement/utils/type';

import ModelPlanInfo from './ModelPlanInfo';
import { AssessmentResp } from './ModelPlanInfo/type';
import { InputCellProps, columns } from './columns';
import style from './index.module.less';
import { schema, fileSchema, fillSchema } from './schemas';
import {
  getFillAssessmentData,
  getFootprintFillData,
  postFootprintFillDataSave,
  postFootprintFillDataSaveAndSubmit,
} from './service';
import { FootprintFillDataSaveRequest, TargetTable } from './type';
import { APPLY_STATUS, APPLY_TYPE_TEXT } from '../../constant';

const { NOT_FILLED_IN, FILLING_IN, REVIEW_FAILED, WITHDRAWN, REPORTED } =
  APPLY_STATUS;

const SchemaField = createSchemaField({
  components: {
    Input,
    Cascader,
    Form,
    FormItem,
    FormGrid,
    FormLayout,
    FormilyFileUpload,
    DatePicker,
  },
});

interface CarbonFootPrintFillProps {
  /** 申请id */
  id?: string;
  /** 是否禁用 */
  isDetail?: boolean;
  /** 数据请求类型 1: 核算结果 2: 核算过程 */
  applyType?: number;
  /** 数据详情 */
  cathRecord?: TypeApplyInfoResp;
}

const CarbonFootPrintFill = ({
  id,
  isDetail,
  applyType,
  cathRecord,
}: CarbonFootPrintFillProps) => {
  const navigate = useNavigate();

  /** 是否是填报 */
  const [isFill, setIsFill] = useState(false);

  /** 仅展示 */
  const onlyShow = isDetail || !isFill;

  /** 可填报 */
  const canFill = !isDetail && isFill;

  /** 产品碳足迹结果 */
  const form = useMemo(
    () =>
      createForm({
        readPretty: onlyShow,
      }),
    [],
  );

  /** 填报要求 */
  const fillForm = useMemo(
    () =>
      createForm({
        readPretty: true,
      }),
    [],
  );

  /** 是否是全生命周期 */
  const isAllCycle = Number(cathRecord?.systemBoundaryType) === ALL_CYCLE;

  /** 请求类型是否为全部核算过程 */
  const isProcess = Number(applyType) === APPLY_TYPE.ALL_PROCESS;

  /** 核算单位的枚举值 */
  const accountsUnitsList = useAllEnumsBatch('factorUnitM');

  /** 关联方案id */
  const [linkAssessmentId, setLinkAssessmentId] = useState<number>();

  /** 关联模型id */
  const [linkModalId, setLinkModalId] = useState<number>();

  /** 控制选择评价方案弹窗显隐 */
  const [planOpen, setPlanOpen] = useState<boolean>(false);

  /** 选择评价方案弹窗确定按钮loading */
  const [confirmLoading, setConfirmLoading] = useState<boolean>(false);

  /** 是否禁用 */
  const disabled = !!linkAssessmentId || isProcess || onlyShow;

  /** 产品碳足迹填报部分的路径 */
  const carbonFootprintFillPath =
    'productName,productUnit,specification,productCycle,funcUnit';

  /** 评价指标表格数据 */
  const [targetDataSource, setTargetDataSource] = useState<TargetTable[]>([]);

  /** 是否展示表格校验 */
  const [showTableError, setShowTableError] = useState<boolean>(false);

  /** 保存/提交按钮loading */
  const [saveLoading, setSaveLoading] = useState<boolean>(false);

  /** 保存/提交按钮loading */
  const [submitLoading, setSubmitLoading] = useState<boolean>(false);

  /** 填写数值单元格的方法 */
  const onInputData = ({ value, row, dataIndex }: InputCellProps) => {
    const newRow = {
      ...row,
      [dataIndex]: value,
    };
    const newTargetDataSource =
      targetDataSource?.map(item =>
        item?.assessmentTarget === row?.assessmentTarget ? newRow : item,
      ) || [];

    setTargetDataSource(newTargetDataSource);

    setShowTableError(false);
  };

  /** 清空填报内容 */
  const onResetFillData = () => {
    form.reset(`*(${carbonFootprintFillPath})`);
    setLinkAssessmentId(undefined);
    setLinkModalId(undefined);
    /** 重置表格 */
    const resetTargetDataSource =
      targetDataSource?.map(item => {
        return {
          ...item,
          resultData: undefined,
          // 半生命周期
          rawMaterialStage: undefined,
          packagingMaterialStage: undefined,
          entranceTransportationStage: undefined,
          productionManufacturing: undefined,
          wasteStage: undefined,
          // 全生命周期
          productProductionStage: undefined,
          constructionProductionStage: undefined,
          usageStage: undefined,
          endStage: undefined,
          additional: undefined,
        };
      }) || [];
    setTargetDataSource(resetTargetDataSource);
    setShowTableError(false);
  };

  /** 选择方案获取id去请求接口获取产品环境足迹结果详情 */
  const onChangeSelected = async ({
    selectRows,
  }: {
    selectRows: AssessmentResp[];
  }) => {
    setConfirmLoading(true);
    const rowValue = selectRows?.[0] || {};

    if (rowValue?.id && id) {
      try {
        // 请求接口获取详情并赋值
        const { data } = await getFillAssessmentData({
          assessmentId: rowValue?.id,
          applyInfoId: Number(id),
        });

        /** 先清空填报数据 */
        onResetFillData();

        const {
          productName,
          specification,
          funcUnit,
          startTime,
          endTime,
          productUnit,
          resultList = [],
        } = data?.data || {};

        /** 核算单位相关处理 */
        const productUnitArr = productUnit ? productUnit?.split(',') : [];

        form.setValues({
          productName,
          productUnit: productUnitArr,
          specification,
          productCycle: startTime && endTime ? [startTime, endTime] : undefined,
          funcUnit,
        });

        /** 处理表格数据 */
        const selectedTable = resultList?.map(item => {
          const { dataValueList = [] } = item || {};
          return {
            assessmentTarget: item?.assessmentTarget || '-',
            assessmentTargetName: item?.assessmentTargetName || '-',
            unit: item?.unit || '-',
            resultData: dataValueList?.[0],
            // 半生命周期
            rawMaterialStage: dataValueList?.[1],
            packagingMaterialStage: dataValueList?.[2],
            entranceTransportationStage: dataValueList?.[3],
            productionManufacturing: dataValueList?.[4],
            wasteStage: dataValueList?.[5],
            // 全生命周期
            productProductionStage: dataValueList?.[1],
            constructionProductionStage: dataValueList?.[2],
            usageStage: dataValueList?.[3],
            endStage: dataValueList?.[4],
            additional: dataValueList?.[5],
          };
        });
        setTargetDataSource(selectedTable || []);

        setLinkAssessmentId(rowValue?.id);
        setLinkModalId(rowValue?.modelId);

        setPlanOpen(false);
      } finally {
        setConfirmLoading(false);
      }
    }
  };

  /** 处理表单数据 */
  const handleFormValues = (values: FootprintFillDataSaveRequest) => {
    const {
      productCycle,
      funcUnit,
      productName,
      productUnit,
      specification,
      supportFile,
    } = values;

    /** 半生命周期 */
    const resultListHalf = targetDataSource?.map(item => {
      return {
        assessmentTarget: item.assessmentTarget,
        dataValueList: [
          item.resultData,
          item.rawMaterialStage || null,
          item.packagingMaterialStage || null,
          item.entranceTransportationStage || null,
          item.productionManufacturing || null,
          item.wasteStage || null,
        ],
      };
    });
    /** 全生命周期 */
    const resultListAll = targetDataSource?.map(item => {
      return {
        assessmentTarget: item.assessmentTarget,
        dataValueList: [
          item.resultData,
          item.productProductionStage ?? null,
          item.constructionProductionStage ?? null,
          item.usageStage ?? null,
          item.endStage ?? null,
          item.additional ?? null,
        ],
      };
    });

    const resultList = isAllCycle ? resultListAll : resultListHalf;

    /** 支撑材料的处理 */
    const supportMaterialsList =
      supportFile?.map((file: any) => {
        const { name: fileName, uid, url } = file || {};
        return omit(
          {
            ...file,
            fileId: uid,
            fileName,
            fileUrl: url,
          },
          ['name', 'uid', 'url'],
        );
      }) || [];
    /** 支撑材料 */
    const supportFiles = supportMaterialsList?.length
      ? JSON.stringify(supportMaterialsList)
      : undefined;

    const result = {
      applyInfoId: Number(id),
      assessmentId: linkAssessmentId || 0,
      endTime: productCycle?.[1] ? `${productCycle?.[1]} 23:59:59` : undefined,
      startTime: productCycle?.[0]
        ? `${productCycle?.[0]} 00:00:00`
        : undefined,
      funcUnit,
      productName,
      productUnit: productUnit ? String(productUnit) : undefined,
      resultList,
      specification,
      supportFile: supportFiles,
    };

    return result;
  };

  /** 设置枚举值 */
  useEffect(() => {
    /** 核算单位 */
    if (accountsUnitsList) {
      const accountUnitsDicts = accountsUnitsList.factorUnitM;
      form.setFieldState('productUnit', {
        dataSource: changeFactorM2cascaderOptions(accountUnitsDicts),
      });
      fillForm.setFieldState('fillApplyData.productUnit', {
        dataSource: changeFactorM2cascaderOptions(accountUnitsDicts),
      });
    }
  }, [accountsUnitsList]);

  useEffect(() => {
    if (cathRecord) {
      /** 填报要求表单赋值 */
      fillForm.setValues({
        fillApplyData: cathRecord,
      });
    }
  }, [cathRecord]);

  /** 首次进入获取的产品环境足迹结果/证据材料详情 */
  useEffect(() => {
    if (id) {
      getFootprintFillData({ applyInfoId: Number(id) }).then(({ data }) => {
        const result = data?.data || {};
        const {
          startTime,
          endTime,
          productUnit,
          assessmentId,
          modelId,
          resultList = [],
          supportFile,
          applyStatus,
        } = result;

        /** 是否有保存按钮 */
        const hasSave = includes(
          [NOT_FILLED_IN, FILLING_IN, REVIEW_FAILED, WITHDRAWN, REPORTED],
          applyStatus,
        );
        setIsFill(hasSave);

        /** 核算单位相关处理 */
        const productUnitArr = productUnit ? productUnit?.split(',') : [];

        /** 支撑材料 */
        let supportMaterialsFileList = [];
        if (supportFile && typeof supportFile === 'string') {
          try {
            const parsedFileData = JSON.parse(supportFile) || [];
            supportMaterialsFileList = parsedFileData?.map(
              (file: UploadFile) => {
                const { fileName, fileId, fileUrl } = file || {};
                return {
                  ...file,
                  name: fileName,
                  uid: fileId,
                  url: fileUrl,
                };
              },
            );
          } catch (error) {
            // 防止脏数据导致页面空白
          }
        } else {
          supportMaterialsFileList = [];
        }

        form.setValues({
          ...result,
          productUnit: productUnitArr,
          productCycle: startTime && endTime ? [startTime, endTime] : undefined,
          supportFile: supportMaterialsFileList,
        });

        /** 处理表格 */
        const resultData = resultList?.map(item => {
          const { dataValueList = [] } = item || {};
          return {
            assessmentTarget: item?.assessmentTarget || '-',
            assessmentTargetName: item?.assessmentTargetName || '-',
            unit: item?.unit || '-',
            resultData: dataValueList?.[0],
            // 半生命周期
            rawMaterialStage: dataValueList?.[1],
            packagingMaterialStage: dataValueList?.[2],
            entranceTransportationStage: dataValueList?.[3],
            productionManufacturing: dataValueList?.[4],
            wasteStage: dataValueList?.[5],
            // 全生命周期
            productProductionStage: dataValueList?.[1],
            constructionProductionStage: dataValueList?.[2],
            usageStage: dataValueList?.[3],
            endStage: dataValueList?.[4],
            additional: dataValueList?.[5],
          };
        });
        setTargetDataSource(resultData || []);

        setLinkAssessmentId(assessmentId);
        setLinkModalId(modelId);
      });
    }
  }, [id]);

  /** 有关联方案id/是核算过程 则禁用产品碳足迹填报内容 */
  useEffect(() => {
    form.setFieldState(`*(${carbonFootprintFillPath})`, {
      disabled,
    });
    form.setFieldState('funcUnit', {
      required: !disabled,
    });
  }, [disabled]);

  return (
    <div className={style.wrapper}>
      <Form form={fillForm} previewTextPlaceholder='-'>
        <h4>{I18N.supplyChainCarbonManagement.fillingRequirements}</h4>
        <SchemaField schema={fillSchema()} />
      </Form>
      <Form form={form} previewTextPlaceholder='-'>
        <div className={style.titleHeader}>
          <h4>
            {I18N.supplyChainCarbonManagement.theProductEnvironmentIsSufficient}
            <Button
              type='link'
              className={classNames({
                [style.linkDisabled]: !linkAssessmentId,
              })}
              onClick={() => {
                if (linkAssessmentId) {
                  window.open(
                    `${LCARouteMaps.lcaModelInfo.replace(
                      ':pageTypeInfo',
                      `${PageTypeInfo.show}`,
                    )}?id=${linkModalId}`,
                    '_blank',
                  );
                } else {
                  Toast(
                    'warning',
                    I18N.supplyChainCarbonManagement.currentlyNotAssociated,
                  );
                }
              }}
            >
              {I18N.supplyChainCarbonManagement.viewProductEnvironment}
            </Button>
          </h4>
          {canFill && (
            <Space>
              {!isProcess && (
                <Button
                  onClick={() => {
                    if (linkAssessmentId) {
                      modal.confirm({
                        title: I18N.Factors.prompt,
                        icon: '',
                        content: (
                          <span>
                            {
                              I18N.supplyChainCarbonManagement
                                .clearAndFillInTheReport2
                            }
                          </span>
                        ),
                        ...modelFooterBtnStyle,
                        okText: I18N.base.confirm,
                        cancelText: I18N.Factors.cancel,
                        onOk: () => {
                          onResetFillData();
                        },
                      });
                    } else {
                      onResetFillData();
                    }
                  }}
                >
                  {I18N.supplyChainCarbonManagement.clearAndFillInTheReport}
                </Button>
              )}
              <Button
                type='primary'
                onClick={() => {
                  if (linkAssessmentId) {
                    modal.confirm({
                      title: I18N.Factors.prompt,
                      icon: '',
                      content: (
                        <span>
                          {I18N.supplyChainCarbonManagement.reSelectParty}
                        </span>
                      ),
                      ...modelFooterBtnStyle,
                      okText: I18N.base.confirm,
                      cancelText: I18N.Factors.cancel,
                      onOk: () => {
                        setPlanOpen(true);
                      },
                    });
                  } else {
                    setPlanOpen(true);
                  }
                }}
              >
                {I18N.certificationReviewCenter.selectEvaluator}
              </Button>
            </Space>
          )}
        </div>

        <SchemaField schema={schema()} />
        <div className={style.tableWrapper}>
          <Table
            dataSource={targetDataSource}
            columns={changeTableColumnsNoText(
              columns({
                isAllCycle,
                onInputData,
                isDisabled: disabled,
              }),
              '-',
            )}
            scroll={{ x: 1400 }}
            bordered
            pagination={false}
          />
          {showTableError && (
            <div className='ant-formily-item-error-help'>
              {I18N.supplyChainCarbonManagement.pleaseFillInTheUnit}
            </div>
          )}
        </div>
        <h4>{I18N.supplyChainCarbonManagement.evidenceMaterials}</h4>
        <SchemaField schema={fileSchema()} />
      </Form>
      <ModelPlanInfo
        systemBoundaryType={cathRecord?.systemBoundaryType}
        handleOk={onChangeSelected}
        open={planOpen}
        handleCancel={() => {
          setPlanOpen(false);
        }}
        confirmLoading={confirmLoading}
      />

      <FormActions
        place='center'
        buttons={compact([
          canFill &&
            checkAuth('/supplyChain/carbonDataFill/submit', {
              title: I18N.supplyChainCarbonManagement.saveAndSubmit2,
              key: 'submit',
              type: 'primary',
              loading: submitLoading,
              onClick: async () => {
                if (disabled && !linkAssessmentId) {
                  Toast(
                    'warning',
                    I18N.supplyChainCarbonManagement.pleaseSelectAReview,
                  );
                  return;
                }

                /** 校验表格结果列 */
                const checkResult = targetDataSource.every(
                  item => item.resultData || item.resultData === 0,
                );

                /** 只有非禁用的时候才校验表格 */
                setShowTableError(!checkResult && !disabled);

                /** 校验表单 */
                const values =
                  await form.submit<FootprintFillDataSaveRequest>();

                /** 产品名称 */
                const productName = values?.productName || ' ';

                if (checkResult || disabled) {
                  modal.confirm({
                    title: I18N.Factors.prompt,
                    icon: '',
                    content: (
                      <span>
                        {I18N.eca.confirmSubmissionOfThis}
                        <span className={modalText}>（{productName}）</span>
                        {I18N.supplyChainCarbonManagement.of}
                        {applyType ? APPLY_TYPE_TEXT[applyType] : ''}
                      </span>
                    ),
                    ...modelFooterBtnStyle,
                    okText: I18N.base.confirm,
                    cancelText: I18N.Factors.cancel,
                    onCancel: () => {
                      setSubmitLoading(false);
                    },
                    onOk: async () => {
                      setSubmitLoading(true);

                      try {
                        const result = handleFormValues(values);
                        await postFootprintFillDataSaveAndSubmit(result);
                        Toast(
                          'success',
                          I18N.supplyChainCarbonManagement.submittedPleaseWait,
                        );
                        navigate(SccmRouteMaps.sccmFill);
                      } finally {
                        setSubmitLoading(false);
                      }
                    },
                  });
                }
              },
            }),
          canFill &&
            checkAuth('/supplyChain/carbonDataFill/fill', {
              title: I18N.Factors.preserve,
              key: 'save',
              type: 'primary',
              loading: saveLoading,
              onClick: async () => {
                setSaveLoading(true);
                try {
                  const { values } = form.getState();
                  const result = handleFormValues(values);
                  await postFootprintFillDataSave(result);
                  Toast('success', I18N.Factors.saveSuccessful);
                  navigate(SccmRouteMaps.sccmFill);
                } finally {
                  setSaveLoading(false);
                }
              },
            }),
          {
            title: onlyShow ? I18N.Factors.return : I18N.Factors.cancel,
            key: 'return',
            onClick: async () => {
              navigate(SccmRouteMaps.sccmFill);
            },
          },
        ])}
      />
    </div>
  );
};
export default CarbonFootPrintFill;
