/*
 * @@description: 基准年 新增 编辑  详情
 * @Date: 2023-01-13 17:16:36
 * @LastEditors: ljh255 jinhai@carbonstop.net
 * @LastEditTime: 2023-06-16 18:34:45
 */
import {
  ArrayTable,
  DatePicker,
  Form,
  FormGrid,
  FormItem,
  FormLayout,
  Input,
  Radio,
  Select,
} from '@formily/antd-v5';
import { createForm, onFieldValueChange, onFormInit } from '@formily/core';
import { createSchemaField } from '@formily/react';
import I18N from '@src/lang/I18N';
import { compact, isNull } from 'lodash-es';
import { useEffect, useMemo, useState } from 'react';
import { useParams } from 'react-router-dom';

import { FormActions } from '@/components/FormActions';
import { Tree } from '@/components/formily/Tree';
import { PageTypeInfo } from '@/router/utils/enums';
import {
  EmissionStandard,
  getComputationEmissionStandardId,
  postComputationEmissionStandardAdd,
  postComputationEmissionStandardEdit,
} from '@/sdks/computation/computationV2ApiDocs';
import { getComputationEmissionStandardComputationList } from '@/sdks_v2/new/computationV2ApiDocs';
import {
  LANG_TYPE,
  Toast,
  handleLangFields,
  reverseHandleLangFields,
} from '@/utils';

import { ComButton } from './component/ComButton';
import { ComTable } from './component/ComTable';
import style from './index.module.less';
import { BASE_YEAR_TYPE_MAPPING } from './utils/en';
import { Schema } from './utils/schemas';
import { TextArea } from '../../component/TextArea';
import { useOrganizationSelect } from '../../hooks/useOrganizationSelect';
import { returnReportText } from '../../util/utils';

export type DataType = {
  year: string;
  total: string | number | null;
  scopeOne: string | number | null;
  scopeTwo: string | number | null;
  scopeThree: string | number | null;
  direct: string | number | null; // 直接
  energy: string | number | null; // 能源
  transport: string | number | null; // 运输
  outsourcing: string | number | null; // 外购
  supplyChain: string | number | null; // 供应链
  rests: string | number | null; // 其他
  [key: string]: any;
};

const SchemaField = createSchemaField({
  components: {
    FormItem,
    Input,
    FormGrid,
    FormLayout,
    Tree,
    Radio,
    DatePicker,
    ComTable,
    ArrayTable,
    Select,
    TextArea,
    ComButton,
  },
});
const BaseYearInfo = () => {
  const { id, pageTypeInfo } = useParams<{
    id: string;
    pageTypeInfo: PageTypeInfo;
  }>();
  const [detailFromValue, setDetailFromValue] = useState<EmissionStandard>({
    settingType: '1',
  });

  /** 品牌类型枚举 */
  const { getBrandOrgOptions } = useOrganizationSelect();

  const brandEnum = getBrandOrgOptions();

  const initalValue = {
    total: null,
    scopeOne: null,
    scopeTwo: null,
    scopeThree: null,
    direct: null, // 直接
    energy: null, // 能源
    transport: null, // 运输
    outsourcing: null, // 外购
    supplyChain: null, // 供应链
    rests: null, // 其他
  };
  /** 企业碳核算 */
  const ENTERPRISE_CARBON_ACCOUNTING = 0;

  const [emissionStandardEdit] = useState(ENTERPRISE_CARBON_ACCOUNTING);

  // 获取系统设置
  // const getCarbonDetailFn = async () => {
  //   await getSystemAppConfigGetAndSave({}).then(({ data }) => {
  //     data.data.forEach(item => {
  //       if (item.type === ENTERPRISE_CARBON_ACCOUNTING) {
  //         setEmissionStandardEdit(Number(item.emissionStandardEdit) || 0);
  //       }
  //     });
  //   });
  // };

  // 获取排放量数据
  const computationList = async () => {
    if (!form.getValuesIn('orgId')) {
      return;
    }
    if (Number(form.getValuesIn('settingType')) === 1) {
      if (!form.getValuesIn('startYear')) {
        return;
      }
    }
    if (Number(form.getValuesIn('settingType')) === 2) {
      if (!form.getValuesIn('[startYear,endYear]')[0]) {
        return;
      }
    }
    const newArr = [];
    if (+form.getValuesIn('settingType') === 2) {
      for (
        let index = Number(form.getValuesIn('[startYear,endYear]')[0]);
        index <= Number(form.getValuesIn('[startYear,endYear]')[1]);
        index++
      ) {
        // const element = array[index];
        newArr.push(index);
      }
    }
    await getComputationEmissionStandardComputationList({
      orgId: form.getValuesIn('orgId'),
      yearList:
        +form.getValuesIn('settingType') === 1
          ? form.getValuesIn('startYear')
          : newArr.toString(),
    }).then(({ data }) => {
      const resultData = (data?.data || [])?.map?.(item => {
        return {
          ...item,
          total: item?.carbonEmission,
          noEdit: true,
          isEditPage: pageTypeInfo === PageTypeInfo.edit,
        };
      });
      form.setFieldState('dataList', state => {
        // 对于初始联动，如果字段找不到，setFieldState会将更新推入更新队列，直到字段出现再执行操作
        if (+form.getValuesIn('settingType') === 2) {
          const newArr: DataType[] = [];
          for (
            let index = Number(form.getValuesIn('[startYear,endYear]')[0]);
            index <= Number(form.getValuesIn('[startYear,endYear]')[1]);
            index++
          ) {
            // const element = array[index];
            newArr.push({
              year: index as unknown as string,
              ...initalValue,
            });
            const finNalArr = newArr.map(item => {
              return (
                resultData?.find(
                  it => Number(it.year) === Number(item?.year),
                ) || { ...item }
              );
            });
            state.value = [...(finNalArr || [])];
          }
        } else {
          state.value =
            resultData?.length === 0
              ? [{ ...initalValue, year: form.getValuesIn('startYear') }]
              : [...(resultData || [])];
        }
      });
    });
  };
  const form = useMemo(() => {
    return createForm({
      readPretty: pageTypeInfo === PageTypeInfo.show,
      values: {
        ...detailFromValue,
        startYear: detailFromValue?.startYear
          ? `${detailFromValue?.startYear}`
          : undefined,
        endYear: detailFromValue?.endYear
          ? `${detailFromValue?.endYear}`
          : undefined,
      },
      effects() {
        onFormInit(current => {
          // 获取当前用户下的组织
          current.setFieldState('orgId', {
            dataSource: brandEnum?.map(item => {
              return {
                label: `${item.label}`,
                value: item.value,
              };
            }),
          });
        });
        onFieldValueChange('orgId', field => {
          if (!field.value) {
            return;
          }
          computationList();
        });
        onFieldValueChange('settingType', () => {
          form.setFieldState('dataList', state => {
            // 对于初始联动，如果字段找不到，setFieldState会将更新推入更新队列，直到字段出现再执行操作
            state.value = [];
          });
          form.reset('[startYear,endYear]');
          form.reset('startYear');
        });
        onFieldValueChange('startYear', field => {
          if (!field.value) {
            return;
          }
          computationList();
        });
        onFieldValueChange('[startYear,endYear]', field => {
          if (!field.value) {
            return;
          }
          computationList();
          // const newArr: DataType[] = [];
          // for (
          //   let index = Number(field.value[0]);
          //   index <= Number(field.value[1]);
          //   index++
          // ) {
          //   // const element = array[index];
          //   newArr.push({
          //     year: index as unknown as string,
          //     ...initalValue,
          //   });
          //   form.setFieldState('dataList', state => {
          //     // 对于初始联动，如果字段找不到，setFieldState会将更新推入更新队列，直到字段出现再执行操作
          //     state.value = [...newArr];
          //   });
          // }
        });
      },
    });
  }, [id, pageTypeInfo, detailFromValue, brandEnum]);

  /** 基准年信息 */
  useEffect(() => {
    if (id && PageTypeInfo.add !== pageTypeInfo) {
      getComputationEmissionStandardId({ id: +id }).then(({ data }) => {
        if (data.code === 200) {
          const langFields = reverseHandleLangFields(
            data?.data?.languageSourceList || [],
          );
          setDetailFromValue({
            ...data.data,
            ...langFields,
            settingType: data?.data?.settingType
              ? `${data?.data?.settingType}`
              : '1',
          });
        }
      });
    }
    // getCarbonDetailFn();
  }, [id, pageTypeInfo]);

  return (
    <div className={style.wrapper}>
      {returnReportText()}
      <Form form={form} previewTextPlaceholder='-'>
        <SchemaField
          schema={Schema(pageTypeInfo, computationList, emissionStandardEdit)}
        />
      </Form>
      <FormActions
        place='center'
        buttons={compact([
          pageTypeInfo !== PageTypeInfo.show && {
            title: I18N.Factors.preserve,
            type: 'primary',
            onClick: async () => {
              return form.submit(async values => {
                /** 处理多语言 */
                const languageSourceList = handleLangFields({
                  rawData: values,
                  langType: LANG_TYPE.EN,
                  sourceTypeMapping: BASE_YEAR_TYPE_MAPPING,
                  apiLanguageSourceList: [],
                });

                const newValue = {
                  ...values,
                  languageSourceList,
                };

                if (
                  !newValue.dataList.every(
                    // @ts-ignore
                    (it: {
                      scopeOne: string;
                      scopeTwo: string;
                      scopeThree: string;
                      direct: string;
                      energy: string;
                      transport: string;
                      outsourcing: string;
                      supplyChain: string;
                      rests: string;
                    }) => {
                      return (
                        !isNull(it.scopeOne) ||
                        !isNull(it.scopeTwo) ||
                        !isNull(it.scopeThree) ||
                        !isNull(it.transport) ||
                        !isNull(it.supplyChain) ||
                        !isNull(it.direct) ||
                        !isNull(it.energy) ||
                        !isNull(it.outsourcing) ||
                        !isNull(it.rests)
                      );
                    },
                  )
                ) {
                  Toast('error', I18N.eca.pleaseFillInTheBenchmark);
                } else {
                  if (Number(id) > 0) {
                    await postComputationEmissionStandardEdit({
                      // @ts-ignore
                      req: {
                        ...newValue,
                        id: Number(id),
                      },
                    }).then(({ data }) => {
                      if (data.code === 200) {
                        history.go(-1);
                      }
                    });
                    return;
                  }
                  await postComputationEmissionStandardAdd({
                    // @ts-ignore
                    req: {
                      ...newValue,
                    },
                  }).then(({ data }) => {
                    if (data.code === 200) {
                      history.go(-1);
                    }
                  });
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
    </div>
  );
};

export default BaseYearInfo;
