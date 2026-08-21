/*
 * @@description: 减排场景 新增 编辑 详情
 * @Date: 2023-01-13 17:16:36
 * @LastEditors: ljh255 jinhai@carbonstop.net
 * @LastEditTime: 2023-06-28 15:37:18
 */
import {
  Cascader,
  Checkbox,
  Form,
  FormGrid,
  FormItem,
  FormLayout,
  Input,
  NumberPicker,
  Radio,
  Select,
} from '@formily/antd-v5';
import { createForm, onFieldValueChange, onFormInit } from '@formily/core';
import { FormConsumer, createSchemaField } from '@formily/react';
import I18N from '@src/lang/I18N';
import { compact } from 'lodash-es';
import { useEffect, useMemo, useState } from 'react';
import { useParams } from 'react-router-dom';

import { FormActions } from '@/components/FormActions';
import { useLanguage } from '@/hooks';
import { PageTypeInfo } from '@/router/utils/enums';
import {
  ReductionSceneReq,
  getComputationReductionSceneId,
  postComputationReductionSceneAdd,
  postComputationReductionSceneEdit,
} from '@/sdks/computation/computationV2ApiDocs';
import { processData } from '@/utils';
import { changeFactorM2cascaderOptions } from '@/views/Factors/Info/utils';
import { useAllEnumsBatch } from '@/views/dashborad/Dicts/hooks';

import style from './index.module.less';
import { schema, totalSchema, unitSchema } from './utils/schemas';
import { Division, H4Compont, Median } from '../../component/Division';
import { CousCheckBox, CousRadio, TextArea } from '../../component/TextArea';
import { ReturnEmissionReductionScenarioOPtion } from '../../hooks';
import { useOrganizationSelect } from '../../hooks/useOrganizationSelect';
import { returnReportText } from '../../util/utils';

interface ReductionSceneInfoProps {
  /** 当外部传入时优先使用 */
  externalId?: string;
  /** 当外部传入时优先使用 */
  externalPageTypeInfo?: PageTypeInfo;
  /** 是否强制隐藏页脚 */
  hideFooter?: boolean;
}

const SchemaField = createSchemaField({
  components: {
    FormItem,
    Input,
    NumberPicker,
    FormGrid,
    FormLayout,
    Checkbox,
    Radio,
    Median,
    Select,
    Cascader,
    TextArea,
    CousRadio,
    CousCheckBox,
  },
});
const ReductionSceneInfo = (props: ReductionSceneInfoProps) => {
  const {
    id: paramsId,
    pageTypeInfo: paramsPageTypeInfo,
    sercenId,
    serenPageTypeInfo,
  } = useParams<{
    id: string;
    pageTypeInfo: PageTypeInfo;
    serenPageTypeInfo: PageTypeInfo;
    sercenId: string;
  }>();

  // 优先级：外部传入 > 路由参数
  const id = props.externalId || paramsId;
  const pageTypeInfo = props.externalPageTypeInfo || paramsPageTypeInfo;

  const [formValue, getFormValue] = useState<ReductionSceneReq>({});
  // 编辑 用于存储过的语言id
  const [langIdObj, setLangIdObj] = useState<{ [key: string]: number }>({});

  const { getBrandOrgOptions } = useOrganizationSelect();

  const ReturnEmissionReductionScenarioOPtionArr =
    ReturnEmissionReductionScenarioOPtion();
  // 获取枚举值
  const enums = useAllEnumsBatch(`factorUnitM`);
  // 出来多语言
  const gasEnums = useLanguage();
  const form = useMemo(() => {
    return createForm<ReductionSceneReq>({
      readPretty:
        serenPageTypeInfo === PageTypeInfo.show ||
        pageTypeInfo === PageTypeInfo.show,
      initialValues: {
        sceneType: ['1', '2'] as unknown as string,
      },
      values: {
        sceneName: formValue?.sceneName,
        orgId: formValue?.orgId,
        sceneType: formValue?.sceneType,
        sceneDesc: formValue?.sceneDesc,
        sceneDescEn: formValue.sceneDescEn,
        sceneNameEn: formValue.sceneNameEn,
      },
      effects() {
        onFormInit(current => {
          // 获取当前用户下的组织
          current.setFieldState('orgId', {
            dataSource: getBrandOrgOptions()?.map(item => {
              return {
                label: item.label,
                value: item.value,
              };
            }),
          });
        });
        onFieldValueChange('sceneType', async filed => {
          const { value } = filed;
          if (value?.indexOf('1') === -1) {
            totalForm?.reset();
          }
          if (value?.indexOf('2') === -1) {
            unitForm?.reset();
          }
          totalForm?.setFieldState('totalUnit', {
            dataSource: ReturnEmissionReductionScenarioOPtionArr,
          });
          unitForm?.setFieldState('*.*.*.unitDenominatorUnit', {
            dataSource: changeFactorM2cascaderOptions(enums?.factorUnitM || []),
          });
          unitForm?.setFieldState('*.*.*.unitNumeratorUnit', {
            dataSource: ReturnEmissionReductionScenarioOPtionArr,
          });
        });
      },
    });
  }, [
    pageTypeInfo,
    id,
    getBrandOrgOptions,
    ReturnEmissionReductionScenarioOPtionArr,
    formValue,
  ]);
  const totalForm = useMemo(() => {
    return createForm<ReductionSceneReq>({
      readPretty:
        serenPageTypeInfo === PageTypeInfo.show ||
        pageTypeInfo === PageTypeInfo.show,
      initialValues: {
        totalLessenType: '0',
      },
      values: {
        totalDesc: formValue?.totalDesc,
        totalDescEn: formValue.totalDescEn,
        totalLessenType: formValue?.totalLessenType,
        totalStartValue: formValue?.totalStartValue,
        totalEndValue: formValue?.totalEndValue,
        totalUnit: formValue?.totalUnit,
      },
      effects() {
        onFormInit(current => {
          // 单位选项
          current.setFieldState('totalUnit', {
            dataSource: ReturnEmissionReductionScenarioOPtionArr,
          });
        });
      },
    });
  }, [pageTypeInfo, id, ReturnEmissionReductionScenarioOPtionArr, formValue]);
  const unitForm = useMemo(() => {
    return createForm<ReductionSceneReq>({
      // disabled: pageTypeInfo === PageTypeInfo.show,
      readPretty:
        serenPageTypeInfo === PageTypeInfo.show ||
        pageTypeInfo === PageTypeInfo.show,
      initialValues: {
        unitLessenType: '0',
      },
      values: {
        unitDesc: formValue?.unitDesc,
        unitDescEn: formValue.unitDescEn,
        unitLessenType: formValue?.unitLessenType,
        unitStartValue: formValue?.unitStartValue,
        unitEndValue: formValue?.unitEndValue,
        unitNumeratorUnit: formValue?.unitNumeratorUnit,
        unitDenominatorUnit: formValue?.unitDenominatorUnit,
      },
      effects() {
        onFormInit(current => {
          current.setFieldState('*.*.*.unitDenominatorUnit', {
            dataSource: changeFactorM2cascaderOptions(enums?.factorUnitM || []),
          });
          current.setFieldState('*.*.*.unitNumeratorUnit', {
            dataSource: ReturnEmissionReductionScenarioOPtionArr,
          });
          current.setFieldState('unit', {
            required: true,
          });
        });
      },
    });
  }, [
    pageTypeInfo,
    id,
    ReturnEmissionReductionScenarioOPtionArr,
    formValue,
    enums,
  ]);

  /** 获取组织信息 */
  useEffect(() => {
    // 查询节点信息
    if (id && PageTypeInfo.add !== pageTypeInfo) {
      getComputationReductionSceneId({ id: Number(sercenId) || +id }).then(
        ({ data }) => {
          const langUageObj: { [ket: string]: any } = {};
          const langUageIdObj: { [ket: string]: any } = {};
          data?.data?.languageSourceList?.forEach(
            (item: {
              sourceType_name: any;
              langType_name: any;
              sourceValue: any;
              id: any;
            }) => {
              langUageObj[`${item.sourceType_name}En`] = item.sourceValue;
              langUageIdObj[`${item.sourceType_name}`] = item.id;
            },
          );
          // form.setValues(data?.data);
          const resultValue = {
            ...data.data,
            // @ts-ignore
            totalLessenType: `${data?.data?.totalLessenType || 0}`,
            // @ts-ignore
            unitLessenType: `${data?.data?.unitLessenType || 0}`,
            // @ts-ignore
            sceneType: data?.data?.sceneType?.split(','),
            // @ts-ignore
            unitDenominatorUnit: data?.data?.unitDenominatorUnit?.split(','),
            ...langUageObj,
          };
          // @ts-ignore
          getFormValue({ ...resultValue });

          setLangIdObj({ ...langUageIdObj });
          // form.setValues({ ...resultValue });
        },
      );
    }
    if (sercenId) {
      getComputationReductionSceneId({ id: Number(sercenId) }).then(
        ({ data }) => {
          const langUageObj: { [ket: string]: any } = {};
          const langUageIdObj: { [ket: string]: any } = {};
          data?.data?.languageSourceList?.forEach(
            (item: {
              sourceType_name: any;
              langType_name: any;
              sourceValue: any;
              id: any;
            }) => {
              langUageObj[`${item.sourceType_name}En`] = item.sourceValue;
              langUageIdObj[`${item.sourceType_name}`] = item.id;
            },
          );
          // form.setValues(data?.data);
          const resultValue = {
            ...data.data,
            // @ts-ignore
            totalLessenType: `${data?.data?.totalLessenType || 0}`,
            // @ts-ignore
            unitLessenType: `${data?.data?.unitLessenType || 0}`,
            // @ts-ignore
            sceneType: data?.data?.sceneType?.split(','),
            // @ts-ignore
            unitDenominatorUnit: data?.data?.unitDenominatorUnit?.split(','),
            ...langUageObj,
          };
          // @ts-ignore
          getFormValue({ ...resultValue });

          setLangIdObj({ ...langUageIdObj });
          // form.setValues({ ...resultValue });
        },
      );
    }
  }, []);
  return (
    <div className={style.wrapper}>
      {returnReportText()}
      <Form form={form} previewTextPlaceholder='-'>
        <SchemaField schema={schema(pageTypeInfo)} />
      </Form>
      <FormConsumer>
        {() => (
          <>
            {form?.values?.sceneType &&
              form?.values?.sceneType.indexOf('1') >= 0 && (
                <Form form={totalForm} previewTextPlaceholder='-'>
                  <Division />
                  <H4Compont>{I18N.eca.totalEmissionReduction}</H4Compont>
                  <SchemaField schema={totalSchema()} />
                </Form>
              )}

            {form?.values?.sceneType &&
              form?.values?.sceneType.indexOf('2') >= 0 && (
                <Form form={unitForm} previewTextPlaceholder='-'>
                  <Division />
                  <H4Compont>{I18N.eca.unitEmissionReduction}</H4Compont>
                  <SchemaField schema={unitSchema(pageTypeInfo)} />
                </Form>
              )}
          </>
        )}
      </FormConsumer>
      {!props?.hideFooter && (
        <FormActions
          place='center'
          buttons={compact([
            (pageTypeInfo !== PageTypeInfo.show &&
              serenPageTypeInfo === PageTypeInfo.show) ||
            pageTypeInfo === PageTypeInfo.show
              ? ''
              : {
                  title: I18N.Factors.preserve,
                  type: 'primary',
                  onClick: async () => {
                    await form.validate();
                    if (
                      form?.values?.sceneType &&
                      form?.values?.sceneType.indexOf('1') >= 0
                    ) {
                      await totalForm.validate();
                    }
                    if (
                      form?.values?.sceneType &&
                      form?.values?.sceneType.indexOf('2') >= 0
                    ) {
                      await unitForm.validate();
                    }
                    let finalData = {
                      ...form.values,
                    };
                    if (
                      form?.values?.sceneType &&
                      form?.values?.sceneType.indexOf('1') >= 0
                    ) {
                      finalData = {
                        ...finalData,
                        ...totalForm.values,
                      };
                    }
                    if (
                      form?.values?.sceneType &&
                      form?.values?.sceneType.indexOf('2') >= 0
                    ) {
                      finalData = {
                        ...finalData,
                        ...unitForm.values,
                        unitDenominatorUnit:
                          unitForm?.values?.unitDenominatorUnit?.toString() as unknown as ReductionSceneReq['unitNumeratorUnit'],
                      };
                    }
                    const processResult = processData(
                      finalData,
                      gasEnums || {},
                      langIdObj,
                    );

                    finalData = {
                      ...finalData,
                      sceneType: form?.values?.sceneType
                        ? form?.values?.sceneType.toString()
                        : '',
                      languageSourceList: [...(processResult || [])],
                    };

                    if (Number(id)) {
                      await postComputationReductionSceneEdit({
                        req: {
                          ...finalData,
                          id: Number(id),
                        },
                      }).then(({ data }) => {
                        if (data.code === 200) {
                          history.go(-1);
                        }
                      });
                      return;
                    }
                    await postComputationReductionSceneAdd({
                      req: {
                        ...finalData,
                      },
                    }).then(({ data }) => {
                      if (data.code === 200) {
                        history.go(-1);
                      }
                    });
                  },
                },
            {
              title:
                PageTypeInfo.show !== pageTypeInfo
                  ? I18N.Factors.cancel
                  : I18N.Factors.return,
              onClick: async () => {
                history.go(-1);
              },
            },
          ])}
        />
      )}
    </div>
  );
};

export default ReductionSceneInfo;
