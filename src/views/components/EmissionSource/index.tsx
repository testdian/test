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
  Radio,
  TreeSelect,
} from '@formily/antd-v5';
import { createForm, onFieldValueChange, onFormInit } from '@formily/core';
import { createSchemaField } from '@formily/react';
import I18N from '@src/lang/I18N';
// eslint-disable-next-line import/no-extraneous-dependencies
import { cloneDeep, compact, isEmpty, omit } from 'lodash-es';
import { useEffect, useMemo, useRef, useState } from 'react';

import { FormActions } from '@/components/FormActions';
import { usePageInfo } from '@/hooks';
import { useOrgTreeData } from '@/hooks/useOrgTreeData';
import {
  FactorGasRes,
  getSystemFactorId,
  getSystemLibUnitUnitConvert,
} from '@/sdks/systemV2ApiDocs';
import {
  EmissionSourceGas,
  getComputationEnumsRelGhg2iso,
  getComputationEnumsRelGhg2isoProps,
  getComputationEnumsRelIso2ghg,
  getComputationEnumsRelIso2ghgProps,
} from '@/sdks_v2/new/computationV2ApiDocs';
import {
  ApiLanguageSourceList,
  getSearchParams,
  handleLangFields,
  LANG_TYPE,
  processItems,
  randomString,
  reverseHandleLangFields,
} from '@/utils';
import {
  changeFactorM2cascaderOptions,
  factorDetailsetGasSelectOptions,
  gasEnumsMap,
  gasObjFn,
  gasTableData,
  setGasSelectOptions,
} from '@/views/Factors/Info/utils';
import { publishYear } from '@/views/Factors/utils';
import SelectButton from '@/views/components/SelectButton';
import {
  changeEnum2Options,
  useAllEnumsBatch,
} from '@/views/dashborad/Dicts/hooks';
import { useRoles } from '@/views/dashborad/Role/hooks';
import {
  EmissionSourceReqRequest,
  EmissionSourceTemplateResp,
} from '@/views/eca/emissionManage/type';
import { ComputationEnums } from '@/views/eca/hooks';
import { useComputationEnum } from '@/views/eca/hooks/useComputationEnum';
import { returnReportText } from '@/views/eca/util/utils';

import style from './index.module.less';
import TemplateCollectionCard from '../TemplateCollectionCard';
import { CHOOSE_FACTOR, FACTOR_SELECT_WAY } from './utils/constant';
import { activityLVMHFormSchema, baseSchema } from './utils/schemas';

const SchemaField = createSchemaField({
  components: {
    FormItem,
    FormGrid,
    FormLayout,
    Input,
    Select,
    Cascader,
    ArrayTable,
    SelectButton,
    NumberPicker,
    Radio,
    TreeSelect,
  },
});
const EmissionSourceComponent = ({
  autoCreateSourceCode = false,
  readPretty = false,
  emissionSourceId,
  activityDataVisible = false,
  noRequiredField = '',
  disabledFieldPath = '',
  emissionSourceDetailData,
  onCancelFn,
  isNeedFooter = true,
  onConfirmFn,
  templateList = [],
  isCheck = false,
  footerClassName,
}: {
  /** 是否自动创建排放源id */
  autoCreateSourceCode?: boolean;
  /** 页面是否为readPretty模式 */
  readPretty?: boolean;
  /** 排放源id */
  emissionSourceId: number;
  /** 活动数据是否展示 */
  activityDataVisible?: boolean;
  /** 非必填的字段 */
  noRequiredField?: string;
  /** 禁用的字段 */
  disabledFieldPath?: string;
  /** 详情数据 */
  emissionSourceDetailData?: EmissionSourceReqRequest;
  /** 点击取消或者返回的方法 */
  onCancelFn: () => void;
  /** 点击确定按钮的方法 */
  onConfirmFn: (data: EmissionSourceReqRequest) => void;
  isNeedFooter?: boolean;
  /** 模版收集详情 */
  templateList: EmissionSourceTemplateResp[];
  /** 是否查看该页面 */
  isCheck?: boolean;
  /** 自定义排放源页脚 */
  footerClassName: string;
}) => {
  const { isDetail, isEdit } = usePageInfo();
  // 路由携带的参数
  const search = { ...getSearchParams()[0] };

  // 是否是排放源库详情页面/accountingAllocation/emissionManage/ 是则显示看板标识
  const isEmissionSourceInfo = useMemo(() => {
    return window.location.pathname.includes(
      '/accountingAllocation/emissionManage/',
    );
  }, []);

  // 获取选择因子和供应商数据后，表单数据
  const formValuesBack = JSON.parse(search[CHOOSE_FACTOR.FORM_VALUES] || '{}');

  /** 获取排放源ID */
  const [factorSourceId, setFactorSourceId] = useState(
    Number(search[CHOOSE_FACTOR.FACTOR_ID]),
  );

  // 枚举值分别为 排放因子各气体对应的分子单位、 活动数据单位/分母单位、氢氟碳化物（HFCs）、全氟化碳（PFCs）、供应商数据-分子单位
  const enums = useAllEnumsBatch(
    `${Object.values(gasEnumsMap).join(
      ',',
    )},factorUnitM,PFCseNUM,HFCsEnum,cequivalentUnitZ`,
  );
  // GHG类别枚举
  const GHGCategoryArr = ComputationEnums('GHGCategory');
  // ISO类别枚举
  const ISOCategoryArr = ComputationEnums('ISOCategory');
  // 活动数据类别枚举
  const ActivityCategoryArr = ComputationEnums('ActivityCategory');
  // 看板标识枚举
  const StatisticTypeArr = ComputationEnums('StatisticType');
  // 排放因子类别枚举 lvmh 不需要
  // const factorTypeArr = ComputationEnums('factorType');
  /** 填报角色 */
  const roles = useRoles();

  /** 数据收集周期类型 */
  const collectCycleType = useComputationEnum({
    enumType: 'DataPeriod',
  });

  /** 接口返回的languageSourceList */
  const [apiLanguageSourceList, setApiLanguageSourceList] =
    useState<ApiLanguageSourceList[]>();

  // 设置ghg或者iso切换后的值
  const [ghgOrIsoValue, setGhgOrIsoValue] = useState<{
    type: string;
    value?: number[];
  }>({
    type: '',
  });

  // 设置排放数据选择方式
  const [factorSelectWay, setFactorSelectWay] = useState<'1' | '2' | '3'>('1');

  /** 组织树数据 */
  const [orgTreeData] = useOrgTreeData();

  const form = useMemo(() => {
    return createForm({
      readPretty,
      effects() {
        onFormInit(current => {
          current.setFieldState('gasList', {
            title: readPretty
              ? I18N.Factors.emissionFactors
              : I18N.components.emissionFactorsAreBasedOn,
          });
          current.setFieldState('statisticType', {
            visible: isEmissionSourceInfo,
          });
        });
      },
    });
  }, [readPretty]);

  /** 设置非必填的字段 */
  useEffect(() => {
    if (noRequiredField) {
      form.setFieldState(`*(${noRequiredField})`, {
        required: false,
      });
    }
  }, [noRequiredField]);

  /** 设置禁用字段 */
  useEffect(() => {
    if (disabledFieldPath) {
      form.setFieldState(`*(${disabledFieldPath})`, {
        disabled: true,
        required: false,
      });
    }
  }, [disabledFieldPath]);

  /** 是否展示活动数据 */
  useEffect(() => {
    form.setFieldState('dataValue', {
      visible: activityDataVisible,
    });
  }, [activityDataVisible]);

  /** 自动生成排放源ID */
  useEffect(() => {
    if (autoCreateSourceCode) {
      form.setValues({
        sourceCode: randomString(),
      });
    }
  }, [autoCreateSourceCode]);

  /** 单位换算比例 */
  const unitCovertFn = async () => {
    // 因子分母单位值
    const factorUnitM = form.getValuesIn('gasList[0].factorUnitM')?.[1];
    // 供应商分母单位值
    const supplierUnitM = form.getValuesIn('supplierData.factorUnitM')?.[1];
    // 活动数据单位
    const activityUnit = form.getValuesIn('activityUnit')?.[1];

    const unitM = factorUnitM || supplierUnitM;

    if (!(unitM && activityUnit)) {
      return;
    }

    getSystemLibUnitUnitConvert({
      unitFrom: activityUnit,
      unitTo: unitM,
    }).then(({ data }) => {
      if (data.code === 200) {
        form.setFieldState('unitConver', {
          value: data?.data,
        });
      }
    });
  };

  // ghg 和 iso 的 联动
  useEffect(() => {
    const ghg = form.getValuesIn('ghg');
    const iso = form.getValuesIn('iso');
    const { type, value } = ghgOrIsoValue;
    if (type === 'ghg') {
      const [ghgCategory, ghgClassify] = value || [];
      if (!ghgCategory || !ghgClassify) return;
      getComputationEnumsRelGhg2iso({
        ghgCategory,
        ghgClassify,
      } as getComputationEnumsRelGhg2isoProps).then(({ data }) => {
        if (data.code === 200) {
          const { categoryCode, classifyCode } = data?.data || {};
          const [code1 = '', code2 = ''] = iso || [];
          if (code1 === categoryCode && code2 === classifyCode) {
            return;
          }
          form.setValues({ iso: [categoryCode, classifyCode] });
        }
      });
    }
    if (type === 'iso') {
      const [isoCategory, isoClassify] = value || [];
      if (!isoCategory || !isoClassify) return;
      getComputationEnumsRelIso2ghg({
        isoCategory,
        isoClassify,
      } as getComputationEnumsRelIso2ghgProps).then(({ data }) => {
        if (data.code === 200) {
          const { categoryCode, classifyCode } = data?.data || {};
          const [code1 = '', code2 = ''] = ghg || [];
          if (code1 === categoryCode && code2 === classifyCode) {
            return;
          }
          form.setValues({ ghg: [categoryCode, classifyCode] });
        }
      });
    }
  }, [ghgOrIsoValue]);

  /** 监听表单变化 */
  const onAddFormListenFn = () => {
    form.addEffects('*', () => {
      onFieldValueChange('ghg', field => {
        setGhgOrIsoValue({ type: 'ghg', value: field.value });
      });
      onFieldValueChange('iso', field => {
        setGhgOrIsoValue({ type: 'iso', value: field.value });
      });
      // 排放因子-分母单位统一
      onFieldValueChange('gasList.*.factorUnitM', field => {
        form.setFieldState('gasList.*.factorUnitM', {
          value: field.value,
        });
      });
      onFieldValueChange('gasList.*.factorUnitZ', field => {
        if (
          form.getValuesIn('gasList')[field.path?.segments[1]].gasCurtType ===
          'HFCs'
        ) {
          const { value } = field;
          form
            .getValuesIn('gasList')
            .forEach(
              (
                element: { gasCurtType: string; factorUnitZ: any },
                index: number,
              ) => {
                if (element.gasCurtType === 'HFCs') {
                  form.setFieldState(`gasList.${index}.factorUnitZ`, {
                    value,
                  });
                }
              },
            );
        }
        if (
          form.getValuesIn('gasList')[field.path?.segments[1]].gasCurtType ===
          'PFCs'
        ) {
          const { value } = field;
          form
            .getValuesIn('gasList')
            .forEach(
              (
                element: { gasCurtType: string; factorUnitZ: any },
                index: number,
              ) => {
                if (element.gasCurtType === 'PFCs') {
                  form.setFieldState(`gasList.${index}.factorUnitZ`, {
                    value,
                  });
                }
              },
            );
        }
      });
      // 活动数据单位/分母单位切换时，自动计算单位换算比例
      // 排放因子-分母单位
      onFieldValueChange('gasList[0].factorUnitM', () => {
        unitCovertFn();
      });
      // 活动数据单位
      onFieldValueChange('activityUnit', () => {
        unitCovertFn();
      });
      // 切换排放因子选择时，清空数据
      onFieldValueChange('factorWay', field => {
        setFactorSelectWay(field.value);
        form.setValues({
          gasList: cloneDeep(gasTableData),
        });
        setFactorSourceId(0);
        form.reset(
          '*(supplierData,unitConver,factorType,factorScore,factorSource,factorSourceEn,year)',
        );
      });
    });
    form.addEffects('gasList', () => {
      onFieldValueChange('.gasList', () => {
        if (enums?.HFCsEnum) {
          setGasSelectOptions(form, enums);
        }
      });
    });
    form.addEffects('gasList.*.gas', () => {
      onFieldValueChange('gasList.*.gas', () => {
        if (enums?.HFCsEnum) {
          setGasSelectOptions(form, enums);
        }
      });
    });

    // 监听活动数据类别
    form.addEffects('activityCategory', () => {
      onFieldValueChange('.activityCategory', field => {
        const { value, dataSource } = field;
        // 查找分数
        const score = dataSource?.find(v => v.value === value)?.score;
        form.setValues({
          activityScore: score,
        });
      });
    });
    // 排放因子类别
    form.addEffects('factorType', () => {
      onFieldValueChange('.factorType', field => {
        const { value, dataSource } = field;
        // 查找分数
        const score = dataSource?.find(v => v.value === value)?.score;
        form.setValues({
          factorScore: score,
        });
      });
    });
  };
  // 排放因子表格数据处理
  type GasTableDataProp = (FactorGasRes | EmissionSourceGas)[];
  const setGasList = (gasList?: GasTableDataProp) => {
    return gasList?.map(g => {
      return {
        ...g,
        factorUnitM: g.factorUnitM?.split(','),
      };
    });
  };

  // 选择因子或选择排放源后返回的数据
  const factorIdDetailFn = async () => {
    const { factorWay } = formValuesBack;

    // 排放因子 => 选择排放因子
    if (factorWay === FACTOR_SELECT_WAY.FACTOR && factorSourceId) {
      await getSystemFactorId({
        id: factorSourceId,
      }).then(({ data }) => {
        const result = data?.data;
        // 排放因子数据
        const newArr = setGasList(result?.gasList);
        const newGasList = processItems(newArr || []);
        const langUageObj: { [ket: string]: any } = {};
        result?.languageSourceList?.forEach(
          (item: {
            sourceType_name: any;
            langType_name: any;
            sourceValue: any;
            id: any;
          }) => {
            langUageObj[`${item.sourceType_name}En`] = item.sourceValue;
          },
        );
        const { dataSource } = form.getFieldState('factorType');
        const obj = {
          ...result,
          ...formValuesBack,
          factorSource: result?.institution,
          gasList: newGasList?.map((g: { gasType: any }) => {
            return {
              ...g,
              gasCurtType: gasObjFn()[g?.gasType || ''],
            };
          }),
          factorSourceEn: langUageObj.institutionEn, // 排放因子来源
          factorType: Number(result?.sourceLevel),
          factorScore: (dataSource || [])?.find(
            item => item.value === Number(result?.sourceLevel),
          )?.score,
        };
        form.setValues({
          ...obj,
        });

        if (enums) {
          factorDetailsetGasSelectOptions(obj.gasList, form, enums);
        }
      });
    }

    // 供应商数据-选择供应商数据;
    // if (factorWay === FACTOR_SELECT_WAY.SUPPLIER && factorSourceId) {
    //   const { factorUnitM, supplierName, year } = supplierData;

    //   // 排放因子类别默认为 制造厂提供系数
    //   const factorTypeItem = factorTypeArr.find(
    //     v => v.label === '制造厂提供系数',
    //   );

    //   formValuesBack.supplierData = {
    //     ...supplierData,
    //     factorUnitM: factorUnitM?.split(','),
    //   };

    //   form.setValues({
    //     ...formValuesBack,
    //     factorType: factorTypeItem?.value,
    //     factorSource: supplierName,
    //     year,
    //   });
    // }
    // 单位换算
    unitCovertFn();

    // 选择页面点击取消按钮回来表单直接赋值
    if (!factorSourceId) {
      form.setValues({
        ...formValuesBack,
      });
    }

    // 监听表单
    onAddFormListenFn();
  };

  // 获取排放源详情
  const getEmissionSourceDetailFn = async () => {
    const {
      activityUnit,
      factorId,
      ghgCategory,
      ghgClassify,
      isoCategory,
      isoClassify,
      sourceCode,
      languageSourceList,
    } = emissionSourceDetailData || {};
    const langFields = reverseHandleLangFields(
      languageSourceList as ApiLanguageSourceList[],
    );
    // 支撑材料反显处理
    form.setValues({
      ...emissionSourceDetailData,
      sourceCode: autoCreateSourceCode ? randomString() : sourceCode,
      activityUnit: activityUnit?.split(','),
      ghg: [ghgCategory, ghgClassify],
      iso: [isoCategory, isoClassify],
      roleIds: emissionSourceDetailData?.roleIds?.split(',').map(Number),
      ...langFields,
    });
    setApiLanguageSourceList(languageSourceList as ApiLanguageSourceList[]);
    setFactorSourceId(factorId || 0);

    // 监听表单变化
    onAddFormListenFn();
  };

  // 设置因子单位选项
  useEffect(() => {
    if (enums) {
      setGasSelectOptions(form, enums);
    }
  }, [enums, form.getValuesIn('gasList')]);
  useEffect(() => {
    if (isEmpty(enums)) {
      return;
    }
    // // gwp数据不可以为空
    // if (isEmpty(gwpObj)) {
    //   return;
    // }

    // 路由中含有选择排放因子/选择供应商的数据时，调用选择数据的方法
    if (!isEmpty(formValuesBack) && form && enums) {
      factorIdDetailFn();
      return;
    }

    // 排放源详情处理
    if (emissionSourceId && !isEmpty(emissionSourceDetailData)) {
      form.setFieldState('sourceCode', {
        disabled: true,
        required: false,
      });

      getEmissionSourceDetailFn();
      return;
    }

    if (emissionSourceId) {
      return;
    }
    form.setValues({
      gasList: gasTableData,
    });

    // 监听表格变化
    onAddFormListenFn();
  }, [emissionSourceId, emissionSourceDetailData, enums]);

  const scrollRef = useRef<HTMLDivElement>(null);
  const scrollToElement = () => {
    const element = scrollRef.current;
    if (element && !isEmpty(formValuesBack)) {
      element?.scrollIntoView({
        behavior: 'smooth',
      });
    }
  };
  useEffect(() => {
    scrollToElement();
  }, [scrollRef.current]);

  // 设置表单枚举值
  useEffect(() => {
    // GHG类别
    form.setFieldState('ghg', {
      dataSource: GHGCategoryArr,
    });

    // ISO类别
    form.setFieldState('iso', {
      dataSource: ISOCategoryArr,
    });

    // 活动数据类别
    form.setFieldState('activityCategory', {
      dataSource: ActivityCategoryArr,
    });

    // 填报角色
    form.setFieldState('roleIds', {
      dataSource:
        roles?.map(role => ({
          label: role.roleName,
          value: role.id,
        })) || [],
    });

    // 发布年份
    form.setFieldState('year', {
      dataSource: publishYear().map(v => ({ label: v, value: v })),
    });

    // 活动数据单位、排放数据-分母单位（排放因子、供应商数据）
    form.setFieldState(
      '*(activityUnit,gasList.*.factorUnitM,supplierData.factorUnitM)',
      {
        dataSource: changeFactorM2cascaderOptions(enums?.factorUnitM || []),
      },
    );

    form.setFieldState(`*(supplierData.factorUnitZ)`, {
      dataSource: changeEnum2Options(enums?.cequivalentUnitZ),
    });

    if (enums && factorSelectWay) {
      // 排放数据-因子表格中。气体、分子单位枚举
      setGasSelectOptions(form, enums);
    }

    /** 核算组织 */
    if (orgTreeData?.length) {
      form.setFieldState('orgCode', {
        dataSource: orgTreeData,
      });
    }

    /** 数据收集周期 */
    if (collectCycleType?.length) {
      form.setFieldState('dataPeriod', {
        dataSource: collectCycleType,
      });
    }
    /** 看板标识 */
    if (StatisticTypeArr?.length) {
      form.setFieldState('statisticType', {
        dataSource: StatisticTypeArr,
      });
    }
  }, [
    enums,
    roles,
    factorSelectWay,
    GHGCategoryArr,
    ISOCategoryArr,
    ActivityCategoryArr,
    StatisticTypeArr,
    form,
    orgTreeData,
    collectCycleType,
  ]);

  return (
    <main className={style.wrapper}>
      {/* 表单区域 */}
      <Form form={form} previewTextPlaceholder='-'>
        <section className={style.card}>
          <h3 className={style.cardTitle}>
            <div>{I18N.components.basicInformation}</div> {returnReportText()}{' '}
          </h3>
          <SchemaField schema={baseSchema()} />
        </section>
        <section className={style.card}>
          <h3>{I18N.eca.activityData}</h3>
          <SchemaField schema={activityLVMHFormSchema()} />
        </section>
        {(isDetail || isCheck) && (
          <section className={style.card}>
            <h3>{I18N.components.templateCollection}</h3>
            {/* 模版收集详情区域 */}
            <TemplateCollectionCard templateList={templateList} />
          </section>
        )}
      </Form>
      {isNeedFooter && (
        <FormActions
          className={footerClassName}
          place='center'
          buttons={compact([
            !readPretty && {
              title: isEdit
                ? I18N.components.saveAndEdit
                : I18N.components.saveAndAdd,
              type: 'primary',
              onClick: async () => {
                return form.submit(
                  async (
                    values: EmissionSourceReqRequest & {
                      ghg: string[];
                      iso: string[];
                    },
                  ) => {
                    const { ghg, iso } = values || {};

                    const [ghgCategory, ghgClassify] = ghg;
                    const [isoCategory, isoClassify] = iso;
                    const result = omit(
                      {
                        ...values,
                        ghgCategory,
                        ghgClassify,
                        isoCategory,
                        isoClassify,
                      },
                      ['ghg', 'iso', 'gasList'],
                    );

                    /** 处理多语言 */
                    const languageSourceList = handleLangFields({
                      rawData: result,
                      langType: LANG_TYPE.EN,
                      sourceTypeMapping: {
                        sourceName: 1,
                        facility: 2,
                      },
                      apiLanguageSourceList,
                    });
                    const submitData = {
                      ...result,
                      roleIds: values?.roleIds?.toString(),
                      languageSourceList,
                    };
                    return onConfirmFn?.({
                      ...submitData,
                    } as EmissionSourceReqRequest);
                  },
                );
              },
            },
            {
              title: readPretty ? I18N.Factors.return : I18N.Factors.cancel,
              onClick: async () => {
                onCancelFn();
              },
            },
          ])}
        />
      )}
    </main>
  );
};
export default EmissionSourceComponent;
