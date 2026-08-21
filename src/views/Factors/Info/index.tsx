/*
 * @description: 因子详情
 */
import {
  ArrayTable,
  Cascader,
  Form,
  FormGrid,
  FormItem,
  FormLayout,
  Input,
  NumberPicker,
  Select,
} from '@formily/antd-v5';
import { createForm, onFieldValueChange } from '@formily/core';
import { createSchemaField } from '@formily/react';
import I18N from '@src/lang/I18N';
import { compact, isNull, isUndefined } from 'lodash-es';
import { useEffect, useMemo, useState } from 'react';
import { useParams } from 'react-router-dom';

import { FormActions } from '@/components/FormActions';
import { PageTypeInfo } from '@/router/utils/enums';
import {
  FactorReq,
  getSystemFactorId,
  postSystemFactorEdit,
  postSystemFactorAdd,
  FactorGasReq,
} from '@/sdks/systemV2ApiDocs';
import {
  handleLangFields,
  LANG_TYPE,
  reverseHandleLangFields,
  Toast,
} from '@/utils';
import {
  changeEnum2Options,
  useAllEnumsBatch,
} from '@/views/dashborad/Dicts/hooks';

import style from './index.module.less';
import {
  changeFactorM2cascaderOptions,
  gasEnumsMap,
  gasTableData,
  setGasSelectOptions,
} from './utils';
import { publishYear } from '../utils';
import { FACTOR_SOURCE_TYPE_MAPPING } from './utils/enFiled';
import { baseScheme, sourceSchema, tableSchema } from './utils/schemas';

const FactorInfo = () => {
  const { pageTypeInfo, id, factorPageInfo, factorId } = useParams<{
    pageTypeInfo: PageTypeInfo;
    id: string;
    factorPageInfo: PageTypeInfo;
    factorId: string;
  }>();
  const SchemaProvider = createSchemaField({
    components: {
      Input,
      Select,
      FormItem,
      FormGrid,
      FormLayout,
      ArrayTable,
      Cascader,
      NumberPicker,
    },
  });
  const form = useMemo(
    () =>
      createForm({
        initialValues: {
          gasList: gasTableData,
        },
        readPretty:
          factorPageInfo === PageTypeInfo.show ||
          pageTypeInfo === PageTypeInfo.show,
      }),
    [pageTypeInfo],
  );
  const enums = useAllEnumsBatch(
    `${Object.values(gasEnumsMap).join(
      ',',
    )},factorUnitM,firstClassify,secondClassify,PFCseNUM,HFCsEnum,sourceLanguage,sourceLevel,productOrigin`,
  );
  const firstClassify = enums?.firstClassify;
  const secondClassify = enums?.secondClassify;
  const factorUnitM = enums?.factorUnitM;
  const sourceLanguage = enums?.sourceLanguage;
  const sourceLevel = enums?.sourceLevel;
  const productOrigin = enums?.productOrigin;

  const [flag, setFlag] = useState<boolean>(false);
  // 获取详情信息
  useEffect(() => {
    if (
      (factorPageInfo
        ? factorPageInfo === PageTypeInfo.show
        : pageTypeInfo !== PageTypeInfo.add) &&
      enums
    ) {
      getSystemFactorId({
        id: Number(factorId) || Number(id),
      }).then(({ data }) => {
        const result = data?.data;
        /** 反处理多语言 */
        const langFields = reverseHandleLangFields(
          result?.languageSourceList || [],
        );
        pageTypeInfo === PageTypeInfo.edit && setFlag(true);
        form.setValues({
          ...result,
          ...langFields,
          gasList: result?.gasList?.map(g => {
            return {
              ...g,
              factorUnitM:
                // 详情要单独处理
                pageTypeInfo === PageTypeInfo.show
                  ? enums?.factorUnitM?.find(
                      u =>
                        String(u.dictValue) === g.factorUnitM?.split(',')?.[1],
                    )?.dictLabel
                  : g.factorUnitM?.split(','),
            };
          }),
        });

        // 监听
        addfactorUnitMListener();
      });
    }
  }, [id, pageTypeInfo, enums, factorId]);
  // 设置因子单位选项
  useEffect(() => {
    if (enums) {
      setGasSelectOptions(form, enums);
    }
  }, [enums]);
  const addfactorUnitMListener = () => {
    form.removeEffects('factorUnitM');
    form.addEffects('factorUnitM', () => {
      onFieldValueChange('gasList.*.factorUnitM', field => {
        form.removeEffects('factorUnitM');
        setTimeout(() => {
          form.setFieldState('gasList.*.factorUnitM', {
            value: field.value,
          });
          form.clearErrors('gasList.*.factorUnitM');
          setTimeout(addfactorUnitMListener, 100);
        });
      });
    });
  };
  // 添加表单生命周期
  useEffect(() => {
    // 联动数据过滤 分类 & 分母单位联动
    const setSecClassify = () => {
      form.addEffects('firstClassifyChange', () => {
        onFieldValueChange('.firstClassify', field => {
          const { value } = field;
          form.reset('.secondClassify');
          form.setFieldState('.secondClassify', {
            dataSource: changeEnum2Options(
              secondClassify?.filter(s => s.sourceType === value) || [],
            ),
          });
        });
      });
    };

    // 添加 - 直接注入监听
    if (pageTypeInfo === PageTypeInfo.add && secondClassify?.length) {
      setSecClassify();
    }
    // 等数据返回再做监听
    if (pageTypeInfo === PageTypeInfo.edit && secondClassify?.length && flag) {
      setSecClassify();
    }
    addfactorUnitMListener();
  }, [pageTypeInfo, secondClassify, firstClassify, flag]);
  // 设置分母单位
  useEffect(() => {
    if (factorUnitM)
      form.setFieldState('*.*.factorUnitM', {
        dataSource: changeFactorM2cascaderOptions(factorUnitM),
      });
  }, [factorUnitM]);
  useEffect(() => {
    if (
      sourceLanguage &&
      firstClassify &&
      sourceLevel &&
      secondClassify &&
      productOrigin
    ) {
      form.setFieldState('.sourceLanguage', {
        dataSource: changeEnum2Options(sourceLanguage),
      });
      form.setFieldState('.firstClassify', {
        dataSource: changeEnum2Options(firstClassify),
      });

      form.setFieldState('.sourceLevel', {
        dataSource: changeEnum2Options(sourceLevel),
      });
      form.setFieldState('areaRepresent', {
        dataSource: productOrigin?.map(item => ({
          ...item,
          label: item.dictLabel,
          value: item.dictValue,
        })),
      });
      if (pageTypeInfo !== PageTypeInfo.add) {
        form.setFieldState('.secondClassify', {
          dataSource: changeEnum2Options(secondClassify),
        });
      }
    }
  }, [
    sourceLanguage,
    firstClassify,
    sourceLevel,
    secondClassify,
    productOrigin,
  ]);

  useEffect(() => {
    form.setFieldState('.year', {
      dataSource: publishYear().map(v => ({ label: v, value: v })),
    });
  }, []);

  const getMissingFieldMessage = (gasItem: FactorGasReq) => {
    const fieldChecks: Array<{ field: keyof FactorGasReq; message: string }> = [
      { field: 'gas', message: I18N.Factors.gasType },
      { field: 'factorValue', message: I18N.Factors.factorValue },
      { field: 'factorUnitZ', message: I18N.Factors.molecularUnit },
    ];

    const missingField = fieldChecks.find(
      check => !gasItem || gasItem[check.field] == null,
    );

    return missingField ? missingField.message : '';
  };
  return (
    <main className={style.wrapper}>
      <Form form={form} previewTextPlaceholder='-'>
        <section className={style.card}>
          <h3>{I18N.Factors.basicInformation}</h3>
          <SchemaProvider schema={baseScheme()} />
        </section>
        <section className={style.card}>
          <h3>{I18N.Factors.factorData}</h3>
          <SchemaProvider schema={tableSchema(pageTypeInfo)} />
        </section>
        <section className={style.card}>
          <h3>{I18N.Factors.dataRepresentativeness}</h3>
          <SchemaProvider schema={sourceSchema()} />
        </section>
      </Form>
      <FormActions
        place='center'
        buttons={compact([
          (factorPageInfo
            ? factorPageInfo !== PageTypeInfo.show
            : pageTypeInfo !== PageTypeInfo.show) && {
            title: I18N.Factors.preserve,
            type: 'primary',

            onClick: async () => {
              form.submit((values: FactorReq) => {
                if (
                  (values?.gasList?.[3]?.factorValue ||
                    values?.gasList?.[3]?.gas ||
                    values?.gasList?.[3]?.factorUnitZ) &&
                  [
                    values?.gasList?.[3]?.factorValue,
                    values?.gasList?.[3]?.gas,
                    values?.gasList?.[3]?.factorUnitZ,
                  ].some(item => isNull(item) || isUndefined(item))
                ) {
                  return Toast(
                    'error',
                    I18N.template(I18N.Factors.pleaseMaintainHydrogenFluoride, {
                      val1: getMissingFieldMessage(values?.gasList?.[3]),
                    }),
                  );
                }
                if (
                  (values?.gasList?.[4]?.factorValue ||
                    values?.gasList?.[4]?.gas ||
                    values?.gasList?.[4]?.factorUnitZ) &&
                  [
                    values?.gasList?.[4]?.factorValue,
                    values?.gasList?.[4]?.gas,
                    values?.gasList?.[4]?.factorUnitZ,
                  ].some(item => isNull(item) || isUndefined(item))
                ) {
                  return Toast(
                    'error',
                    I18N.template(I18N.Factors.pleaseMaintainPerfluorinated, {
                      val1: getMissingFieldMessage(values?.gasList?.[4]),
                    }),
                  );
                }
                const result = {
                  ...values,
                  gasList: values.gasList?.map(l => ({
                    ...l,
                    factorUnitM: String(l?.factorUnitM),
                  })),
                };
                const languageSourceList = handleLangFields({
                  rawData: result,
                  langType: LANG_TYPE.EN,
                  sourceTypeMapping: FACTOR_SOURCE_TYPE_MAPPING,
                  apiLanguageSourceList: [],
                });
                if (pageTypeInfo === PageTypeInfo.add) {
                  return postSystemFactorAdd({
                    req: { ...result, languageSourceList },
                  }).then(({ data }) => {
                    if (data?.code === 200) {
                      Toast('success', I18N.Factors.newSuccessfullyAdded);
                      history.back();
                    }
                  });
                }
                return postSystemFactorEdit({
                  req: {
                    ...result,
                    languageSourceList,
                    id: Number(id),
                  },
                }).then(({ data }) => {
                  if (data?.code === 200) {
                    Toast('success', I18N.Factors.updateSuccessful);
                    history.back();
                  }
                });
              });
            },
          },
          {
            title:
              factorPageInfo === PageTypeInfo.show
                ? I18N.Factors.return
                : PageTypeInfo.show !== pageTypeInfo
                ? I18N.Factors.cancel
                : I18N.Factors.return,
            onClick: async () => {
              history.go(-1);
            },
          },
        ])}
      />
    </main>
  );
};

export default FactorInfo;
