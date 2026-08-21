/**
 * @description 认证审核中心详情
 */
import {
  ArrayItems,
  ArrayTable,
  DatePicker,
  Form,
  FormGrid,
  FormItem,
  FormLayout,
  Input,
  NumberPicker,
  Select,
  Upload,
} from '@formily/antd-v5';
import { createForm, onFormInit } from '@formily/core';
import { FormConsumer, createSchemaField } from '@formily/react';
import I18N from '@src/lang/I18N';
import { Button, Tabs } from 'antd';
import { compact, omit } from 'lodash-es';
import { useEffect, useMemo, useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';

import {
  PostAuthData,
  PostAuthDataDetail,
  PostEditAuthData,
  getAuthCbamDetail,
  getAuthComputationInfo,
  getAuthLogPage,
} from '@/api/authData';
import { getAssessmentInfo, getReport } from '@/api/compution';
import { FormActions } from '@/components/FormActions';
import { FormilyFileUpload } from '@/components/formily/FormilyFileUpload';
import { AuthTypeOptionsArr } from '@/hooks';
import { CertifiCatioinReviewCenterMaps } from '@/router/utils/certificationReviewCenterEmums';
import { PageTypeInfo } from '@/router/utils/enums';
// import { getComputationComputationId } from '@/sdks/computation/computationV2ApiDocs';
import { generateDocumentNumber, getSearchParams } from '@/utils';
import LocalStore from '@/utils/store';
import {
  getReportDetailApi,
  getReportList,
} from '@/views/carbonFootPrintLCA/CarbonFootprintReport/service';
import ModelPlanInfo from '@/views/certificationReviewCenter/eca/Info/ModelPlanInfo/index';
import ApproveHistory from '@/views/components/ApproveInfo/ApproveHistory';
import { CHOOSE_FACTOR } from '@/views/components/EmissionSource/utils/constant';
import CardUpload from '@/views/eca/dataQualityManage/component/CardUpload';
import { culHistory } from '@/views/supplyChainCarbonManagement/utils';

import ChooseCbamModel from './ChooseCbamModel';
import { AssessmentResp } from './ModelPlanInfo/type';
import ChooseMession from './chooseMession';
import style from './index.module.less';
import { DOCUMENT_TYPE } from './utils/constant';
import {
  accountInformationSchema,
  reportInformationSchema,
  uploadMaterialSchema,
  schema,
  footerSchema,
  cbamSchema,
} from './utils/schemas';

const { ECA, LCA, CBAM } = DOCUMENT_TYPE;

const SchemaField = createSchemaField({
  components: {
    FormItem,
    Input,
    FormGrid,
    FormLayout,
    DatePicker,
    ArrayTable,
    ArrayItems,
    Select,
    NumberPicker,
    Button,
    Upload,
    CardUpload,
    FormilyFileUpload,
  },
});
export const removeStorageFn = () => {
  LocalStore.removeValue(CHOOSE_FACTOR.URLPARAMSDATA);
  LocalStore.removeValue(CHOOSE_FACTOR.CHOOSECARBONMISSIONID);
  LocalStore.removeValue(CHOOSE_FACTOR.CHOOSECARBONMISSIONDATA);
};
const OrgInfo = () => {
  const navigate = useNavigate();

  /** CBAM报表弹窗open */
  const [cbamOpen, setCbamOpen] = useState(false);
  /** 选择的CBAM报表ID */
  const [cbamId, setCbamId] = useState(0);

  const [open, setOpen] = useState(false);
  const [chooseMessionOpen, setChooseMessionOpen] = useState(false);
  const AuthTypeOptions = AuthTypeOptionsArr();
  const { id, pageTypeInfo } = useParams<{
    id: string;
    pageTypeInfo: PageTypeInfo;
  }>();
  const [currentKey, setCurrentKey] = useState('1');
  const [recordData, setRecordData] = useState<any[]>([]);
  // const [localData, setLocalData] = useState<any>({});
  const value = LocalStore.getValue(
    CHOOSE_FACTOR.URLPARAMSDATA,
  ) as unknown as object;
  // 用于判断  -  是否是产品碳足迹
  const cultureType = () => {
    return window.location.href.includes('Footprint');
  };
  // 获取 产品足迹报告列表
  const getReportListFn = async (orgId: number | undefined) => {
    const { data } = await getReportList({
      pageNum: 1,
      pageSize: 1000,
      orgId,
    });
    const newArr = data?.data?.list?.map(
      (item: { reportName: any; id: any }) => {
        return {
          label: item.reportName,
          value: item.id,
        };
      },
    );
    form.setFieldState('reportId', {
      dataSource: newArr,
    });
  };
  // 获取方案详情
  const getReportDetailApiFn = async (reportId: number | undefined) => {
    const { data } = await getReportDetailApi({ id: Number(reportId) });
    form.setFieldState('reportId', {
      dataSource: [
        {
          label: data.data.reportName,
          value: data.data.id,
        },
      ],
    });
  };
  // 获取 排放报告列表
  const getReportFn = async (id: number) => {
    const { data } = await getReport({
      pageNum: 1,
      pageSize: 100,
      computationId: Number(id),
    });
    const newOptions = data?.data?.list.map((item: any) => {
      return {
        label: item.reportName,
        value: item.id,
      };
    });
    form.setFieldState('reportId', {
      dataSource: newOptions,
    });
  };
  const [dataId, setassessmentId] = useState(0);
  const [computationId, setComputationId] = useState(0);
  /** URL 携带的参数 */
  const search = { ...getSearchParams()[0] };

  /** 方案id */
  const assessmentId = search?.assessmentId;
  useEffect(() => {
    if (assessmentId) {
      setassessmentId(Number(assessmentId));
    }
  }, [assessmentId]);
  // 获取方案信息
  const getAssessmentInfoFn = async (assessmentId: number) => {
    await getAssessmentInfo({ id: `${assessmentId}` }).then(
      async ({ data }) => {
        const assessmentInfo = data?.data || {};
        form.setValues({
          ...value,
          footerList: [assessmentInfo],
          productName: assessmentInfo?.productName,
          baselineUnitName: assessmentInfo?.baselineUnitName,
          specification: assessmentInfo?.specification,
          // reportId: null,
        });
        // if (PageTypeInfo.add === pageTypeInfo) {
        await getReportListFn(assessmentInfo.orgId);
        // } else {
        //   debugger;
        //   await getReportDetailApiFn(assessmentInfo.reportId);
        // }
      },
    );
  };

  const form = useMemo(() => {
    return createForm({
      readPretty: pageTypeInfo === PageTypeInfo.show,
      // initialValues: localData,
      effects() {
        onFormInit(async current => {
          // 单据类型
          if (value) {
            return;
          }
          if (pageTypeInfo === PageTypeInfo.add) {
            current.setFieldState('authNo', {
              value: generateDocumentNumber(),
            });
            if (cultureType()) {
              current.setFieldState('authType', {
                value: 2,
              });
              current.setFieldState('authName', {
                value:
                  I18N.certificationReviewCenter
                    .theProductEnvironmentIsSufficient,
              });
            } else {
              current.setFieldState('authType', {
                value: 1,
              });
              current.setFieldState('authName', {
                value: I18N.certificationReviewCenter.carbonEmissionAccounting,
              });
            }
          }
        });
      },
    });
  }, [pageTypeInfo]);

  // 获取详情
  const PostAuthDataDetailFn = async (id: number) => {
    const { data } = await PostAuthDataDetail({ id: id || 0 });
    // 企业碳核算 数据处理
    form.setValues({
      ...data.data,
      carbonList: [{ ...data.data }],
      supportFile:
        data?.data?.supportFile && JSON.parse(data?.data?.supportFile),
    });
    // 产品碳足迹 数据处理
    setassessmentId(Number(data.data.dataId));
    await getReportDetailApiFn(data.data.reportId);

    // 判断 产品碳足迹 还是企业碳核算
  };
  const getAuthComputationInfoFn = async (id: number) => {
    if (!id) return;
    const { data } = await getAuthComputationInfo({ id: id || 0 });
    // 企业碳核算 数据处理
    form.setValues({
      ...data.data,
      carbonList: [{ ...data.data }],
      supportFile:
        data?.data?.supportFile && JSON.parse(data?.data?.supportFile),
    });
    setComputationId(data.data.computationId);
    getReportFn(data.data.computationId);

    // 判断 产品碳足迹 还是企业碳核算
  };

  /** 获取CBAM类型页面详情 */
  const getCbamDetail = async () => {
    if (!id) return;
    const { data } = await getAuthCbamDetail({ id: Number(id) });
    const {
      cbamId: apiCbamId,
      startDate,
      endDate,
      supportFile,
    } = data?.data || {};

    form.setValues({
      ...data.data,
      cbamList: [
        {
          ...data?.data,
          id: apiCbamId,
          collectDate: startDate && endDate ? `${startDate}-${endDate}` : '-',
        },
      ],
      supportFile: supportFile && JSON.parse(supportFile),
    });
    setCbamId(Number(apiCbamId));
  };

  useEffect(() => {
    if (AuthTypeOptions) {
      form.setFieldState('authType', {
        dataSource: AuthTypeOptions,
      });
    }
  }, [value, AuthTypeOptions, currentKey]);

  useEffect(() => {
    // 详情 编辑 获取  审核单据数据

    if (culHistory('Footprint')) {
      if (id && form) {
        PostAuthDataDetailFn(Number(id) || 0);
      }
    } else if (culHistory('cbam')) {
      // cbam详情
      getCbamDetail();
    } else if (id && form) {
      getAuthComputationInfoFn(Number(id) || 0);
    }
  }, [id, form, AuthTypeOptions]);

  const changauthNameFn = (value: any) => {
    if (value === 1) {
      form.setValues({
        authName: I18N.certificationReviewCenter.carbonEmissionAccounting,
      });
    } else if (value === CBAM) {
      form.setValues({
        authName: I18N.certificationReviewCenter.cbamDataAuditDocument,
      });
    } else {
      form.setValues({
        authName:
          I18N.certificationReviewCenter.theProductEnvironmentIsSufficient,
      });
    }
  };

  const submitFn = (status?: number) => {
    return form.submit(async (values: any) => {
      const reportObj = (
        form.getFieldState('reportId')?.dataSource || []
      )?.filter(item => +item.value === Number(values?.reportId));
      const newValue = {
        ...omit(
          {
            ...values,
            supportFile: JSON.stringify(values?.supportFile),
            computationId,
            reportName: reportObj?.[0]?.label,
          },
          'deleted',
        ),
      };
      if (newValue?.authType === 2) {
        // 产品碳足迹 单独处理
        newValue.dataId = dataId;
        newValue.reportId = values?.reportId;
        newValue.year = values?.productName;
      }

      if (newValue?.authType === CBAM) {
        // CBAM 单独处理
        newValue.dataId = cbamId;
        newValue.reportId = values?.reportId;
        newValue.year = values?.cbamList?.[0]?.reportName || '';
        newValue.computationId = cbamId;
      }

      if (status) {
        newValue.authAuditStatus = 1;
      }

      if (Number(id)) {
        await PostEditAuthData({
          ...newValue,
          id: Number(id),
        }).then(({ data }) => {
          if (data.code === 200) {
            navigate(
              CertifiCatioinReviewCenterMaps.certificationReviewCenterEca,
            );
            removeStorageFn();
          }
        });
        return;
      }
      await PostAuthData({
        // @ts-ignore
        ...newValue,
      }).then(({ data }) => {
        if (data.code === 200) {
          navigate(CertifiCatioinReviewCenterMaps.certificationReviewCenterEca);
          removeStorageFn();
        }
      });
    });
  };
  const getAuthLogPageFn = async () => {
    const { data } = await getAuthLogPage({
      pageNum: 1,
      pageSize: 100,
      authDataId: id,
    });
    setRecordData(data?.data?.list);
  };
  useEffect(() => {
    if (Number(currentKey) === 2) {
      getAuthLogPageFn();
    }
  }, [currentKey]);

  useEffect(() => {
    if (dataId && form) {
      getAssessmentInfoFn(dataId);
    }
  }, [dataId, form]);
  // // 获取核算详情
  // const getComputationComputationIdFn = async (computationId: number) => {
  //   await getComputationComputationId({ id: computationId }).then(
  //     ({ data }) => {
  //       form.setValues({
  //         ...form.getValuesIn('*'),
  //         carbonList: [{ ...data.data }],
  //         year: data?.data?.year,
  //       });
  //     },
  //   );
  // };
  // useEffect(() => {
  //   if (computationId) {
  //     getComputationComputationIdFn(computationId);
  //   }
  // }, [computationId]);

  return (
    <main className={style.wrapper}>
      {pageTypeInfo === PageTypeInfo.show && (
        <Tabs
          className='customTabs'
          items={[
            {
              label: I18N.certificationReviewCenter.certificationInformation,
              key: '1',
            },
            {
              label: I18N.eca.reviewInformation,
              key: '2',
            },
          ]}
          activeKey={currentKey}
          onChange={key => {
            setCurrentKey(key);
          }}
        />
      )}
      {+currentKey === 1 && (
        <Form form={form} previewTextPlaceholder='-'>
          <section className={style.card}>
            <h3> {I18N.certificationReviewCenter.reviewDocumentLetter}</h3>
            <SchemaField
              schema={accountInformationSchema(pageTypeInfo, changauthNameFn)}
            />
          </section>
          <FormConsumer>
            {currentForm => {
              const authType = currentForm?.getFieldState('authType')?.value;

              /** 审核内容-选择按钮的文案 */
              const chooseBtnText = {
                [ECA]: I18N.router.chooseCarbonEmissions,
                [LCA]: I18N.certificationReviewCenter.selectEvaluator,
                [CBAM]: I18N.certificationReviewCenter.chooseCbam,
              } as { [key: number]: string };

              const isECA = Number(authType) === ECA;
              const isLCA = Number(authType) === LCA;
              const isCBAM = Number(authType) === CBAM;

              return (
                <div>
                  <section className={style.card}>
                    <h3>{I18N.certificationReviewCenter.reviewContent}</h3>
                    {pageTypeInfo !== PageTypeInfo.show && (
                      <Button
                        type='primary'
                        style={{ marginBottom: '10px' }}
                        onClick={() => {
                          if (isECA) {
                            setChooseMessionOpen(true);
                          }
                          if (isLCA) {
                            setOpen(true);
                          }
                          if (isCBAM) {
                            setCbamOpen(true);
                          }
                        }}
                      >
                        {chooseBtnText?.[Number(authType)]}
                      </Button>
                    )}

                    {!isCBAM && (
                      <SchemaField
                        schema={reportInformationSchema(
                          Number(currentForm.getFieldState('authType').value),
                        )}
                      />
                    )}
                  </section>
                  <section className={style.card}>
                    {isECA && (
                      <SchemaField
                        schema={schema(navigate, pageTypeInfo, id)}
                      />
                    )}
                    {isLCA && <SchemaField schema={footerSchema()} />}
                    {isCBAM && (
                      <SchemaField schema={cbamSchema(id, pageTypeInfo)} />
                    )}
                  </section>
                </div>
              );
            }}
          </FormConsumer>

          <section className={style.card}>
            <div className={style.flx}>
              <h3>{I18N.certificationReviewCenter.proofMaterials}</h3>
            </div>
            <SchemaField schema={uploadMaterialSchema()} />
          </section>
        </Form>
      )}
      {/* 审核记录 */}
      {+currentKey === 2 && (
        <div>
          <ApproveHistory recordDataSource={[...recordData]} />
        </div>
      )}
      {/* 选择报表弹窗-CBAM */}
      <ChooseCbamModel
        open={cbamOpen}
        handleCancel={() => {
          setCbamOpen(false);
        }}
        // @ts-ignore
        handleOk={({ selectRows }: { selectRows: AssessmentResp[] }) => {
          setCbamId(Number(selectRows[0]?.id));
          form.setValues({
            ...form.getValuesIn('*'),
            orgId: selectRows[0]?.orgId,
            reportId: null,
            cbamList: selectRows,
          });
          setCbamOpen(false);
        }}
      />
      {/* 评价方案弹窗 */}
      <ModelPlanInfo
        open={open}
        handleCancel={() => {
          setOpen(false);
        }}
        // @ts-ignore
        handleOk={({ selectRows }: { selectRows: AssessmentResp[] }) => {
          setassessmentId(Number(selectRows?.[0]?.id));
          form.setValues({
            ...form.getValuesIn('*'),
            orgId: selectRows[0]?.orgId,
            companyId: selectRows[0]?.companyId,
            reportId: null,
          });
          setOpen(false);
        }}
      />
      {/* 碳排放核算 */}
      <ChooseMession
        open={chooseMessionOpen}
        handleCancel={() => {
          setChooseMessionOpen(false);
        }}
        // @ts-ignore
        handleOk={(data: { selectRows: AssessmentResp[] }) => {
          form.setValues({
            ...value,
            carbonList: data.selectRows,
            companyId: data.selectRows?.[0]?.companyId,
            orgId: data.selectRows?.[0]?.orgId,
            companyName: data.selectRows?.[0]?.orgName,
            year: data.selectRows?.[0]?.year,
            reportId: null,
          });
          getReportFn(Number(data?.selectRows?.[0]?.id));
          setComputationId(Number(data?.selectRows?.[0]?.id));
          setChooseMessionOpen(false);
        }}
      />
      <FormActions
        place='center'
        buttons={compact([
          pageTypeInfo !== PageTypeInfo.show && {
            title: I18N.supplyChainCarbonManagement.saveAndSubmit,
            type: 'primary',
            onClick: async () => {
              submitFn(1);
            },
          },
          pageTypeInfo !== PageTypeInfo.show && {
            title: I18N.Factors.preserve,
            type: 'primary',
            onClick: async () => {
              submitFn();
            },
          },

          {
            title:
              PageTypeInfo.show !== pageTypeInfo
                ? I18N.Factors.cancel
                : I18N.Factors.return,
            onClick: async () => {
              navigate(
                CertifiCatioinReviewCenterMaps.certificationReviewCenterEca,
              );
              removeStorageFn();
            },
          },
        ])}
      />
    </main>
  );
};

export default OrgInfo;
