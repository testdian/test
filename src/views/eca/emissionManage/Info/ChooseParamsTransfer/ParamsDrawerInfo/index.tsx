/**
 * @description 数据字段详情抽屉
 */

import {
  Input,
  Radio,
  Select,
  Cascader,
  Space,
  Form,
  FormGrid,
  FormItem,
  FormLayout,
  NumberPicker,
} from '@formily/antd-v5';
import { createForm, onFieldValueChange } from '@formily/core';
import { createSchemaField } from '@formily/react';
import I18N from '@src/lang/I18N';
import { Button, Drawer } from 'antd';
import { useEffect, useMemo, useState } from 'react';

import { IconFont } from '@/components/IconFont';
import { PageTypeInfo } from '@/router/utils/enums';
import { getSystemDictenumListAllByDictTypeBatch } from '@/sdks/systemV2ApiDocs';
import {
  Dicts,
  handleLangFields,
  LANG_TYPE,
  reverseHandleLangFields,
} from '@/utils';
import { changeFactorM2cascaderOptions } from '@/views/Factors/Info/utils';
import { useAllEnumsBatch } from '@/views/dashborad/Dicts/hooks';
import FormliySelectButton from '@/views/eca/Parameter/component/FormliySelectButton';
import { getParameterAllListAPi } from '@/views/eca/Parameter/service';
import { Param } from '@/views/eca/Parameter/type';
import { useDynamicDict } from '@/views/eca/hooks';
import { calculateErrorRange } from '@/views/eca/util/paramsUtil/correctParams';
import {
  DEFAULT_SELECT,
  TIME_DEFAULT_TYPE,
} from '@/views/eca/util/paramsUtil/paramsSchema/constant';

import {
  INIT_SINGLE_TYPE,
  onDataSettingOptionsFn,
  PARAM_INPUT_TYPE,
  PARAMETER_TYPE,
  UNIT_TYPE,
  SOURCE_TYPE_MAPPING,
} from './constant';
import style from './index.module.less';
import { modalParamsSchema } from './schemas';

const { edit, show } = PageTypeInfo;

const { TEXT, TIME, NUMBER } = PARAM_INPUT_TYPE;

const { MONOMER_UNIT, COMPOUND_UNIT, NO_UNIT } = UNIT_TYPE;

const { DISTANCE_PARAMETER } = PARAMETER_TYPE;

const SchemaField = createSchemaField({
  components: {
    Space,
    Input,
    Select,
    Radio,
    NumberPicker,
    Cascader,
    Form,
    FormItem,
    FormGrid,
    FormLayout,
    FormliySelectButton,
  },
});
interface ProductManagementInfoProps {
  /** 抽屉的显隐 */
  open: boolean;
  /** 保存方法 */
  onOk: (currentData?: Param) => void;
  /** 取消方法 */
  onClose: () => void;
  currentInfo?: Param;
  /** 列表操作按钮的类型 */
  actionBtnType?: string;
  /** 需要disabled的字段 */
  disabledFields?: string[];
}
export const ParamsDrawerInfo = ({
  currentInfo,
  open,
  actionBtnType,
  disabledFields = [],
  onOk,
  onClose,
}: ProductManagementInfoProps) => {
  const isDetail = actionBtnType === show;
  const isEdit = actionBtnType === edit;

  /** 抽屉标题 */
  const titleMap = {
    [edit]: I18N.eca.editParameters,
    [show]: I18N.eca.viewParameters,
  };
  const title = titleMap[actionBtnType as keyof typeof titleMap];

  /** 表单中枚举值的列表 */
  const { data: dictTypeList } = useDynamicDict({}, [open]);

  /** 单位枚举 */
  const unitOption = useAllEnumsBatch('factorUnitM')?.factorUnitM;

  /** 获取所有参数列表数据 */
  const [parameterList, setParameterList] = useState<Param[]>([]);

  /** 当前选择的属性格式 */
  const [inputTypeValue, setInputTypeValue] = useState<number>();

  /** 当前选择的字典标识  */
  const [dictTypeValue, setDictTypeValue] = useState<string>();

  /** 枚举值对应的默认值列表数据 */
  const [dictTypeEnumValue, setDictTypeEnumValue] = useState<
    { label: string; value: string }[]
  >([]);

  /** 详情反显的默认值 */
  const [fixedParameterValue, setFixedParameterValue] = useState<string>();

  /** 设置参数类型 */
  const [parameterTypeValue, setParameterTypeValue] = useState<number>();

  const form = useMemo(
    () =>
      createForm({
        readPretty: isDetail,
      }),
    [actionBtnType, open],
  );

  /** 获取所有参数列表数据 */
  const getAllParamsList = async () => {
    const { data } = await getParameterAllListAPi({
      notGlobal: 0,
    });
    setParameterList(data?.data || []);
  };

  /** 监听表单 */
  const addFormListener = () => {
    form.removeEffects('*');
    form.addEffects('*', () => {
      /** 监听参数类型 */
      onFieldValueChange('paramScope', field => {
        setParameterTypeValue(field.value);
      });
      /** 监听属性格式 */
      onFieldValueChange('paramType', field => {
        setInputTypeValue(field.value);

        if (field.selfModified) {
          // 如果是时间则设置时间默认类型
          if (field.value === TIME) {
            form.setValuesIn('textType', TIME_DEFAULT_TYPE);
          } else {
            form.setValuesIn('textType', DEFAULT_SELECT);
          }
        }
      });
      /** 监听枚举值选中的字典标识 */
      onFieldValueChange('dictEnum', field => {
        form.reset('defaultValue');
        setFixedParameterValue(undefined);
        setDictTypeValue(field.value);
      });
      /** 切换单位类型 清空单位选择 */
      onFieldValueChange('unitType', field => {
        form.setFieldState('unit1', state => {
          state.componentProps = {
            ...state.componentProps,
            placeholder:
              field.value === MONOMER_UNIT
                ? I18N.Factors.pleaseSelect
                : I18N.Factors.molecularUnit,
          };
          state.decoratorProps = {
            ...state.decoratorProps,
            gridSpan: 1,
            addonAfter: field.value === COMPOUND_UNIT ? '/' : '',
          };
        });
        form.reset('*(unit1,unit2)');
      });
    });
  };

  /** 属性格式 */
  useEffect(() => {
    if (inputTypeValue) {
      /** 监听属性格式获取对应的样式展示选择框 */
      form.setFieldState('textType', {
        dataSource: onDataSettingOptionsFn(inputTypeValue),
      });
    }
  }, [inputTypeValue]);

  /** 关闭弹窗初始化 */
  const onCloseInit = () => {
    form.reset();
    setInputTypeValue(undefined);
    onClose();
  };

  useEffect(() => {
    /** 编辑操作 */
    if (isEdit) {
      /** 参数名称、参数ID、参数类型、参数格式，不能编辑 */
      form.setFieldState('*(paramCode,paramName,paramType,paramScope)', {
        disabled: true,
      });
      if (disabledFields.length) {
        form.setFieldState(`*(${disabledFields?.toString()})`, {
          disabled: true,
        });
      }
    }
    if (currentInfo && open) {
      const {
        unit1,
        unit2,
        paramType,
        textType,
        timeType,
        correctRangeClass,
        warningRangeClass,
        languageSourceList,
      } = currentInfo || {};
      /** 设置属性格式 */
      form.setFieldState('textType', {
        dataSource: onDataSettingOptionsFn(paramType as number),
      });

      /** 单位处理 */
      const unitCodeZBack = unit1 ? unit1.split(',') : undefined;

      const unitCodeMBack = unit2 ? unit2.split(',') : undefined;

      /** 反处理多语言 */
      const langFields = reverseHandleLangFields(languageSourceList);

      form.setValues({
        ...currentInfo,
        ...langFields,
        unit1: unitCodeZBack,
        unit2: unitCodeMBack,
        textType:
          paramType === TIME
            ? timeType
            : paramType === TEXT
            ? textType
            : INIT_SINGLE_TYPE,
        decimal_place: currentInfo?.len,
        correctRangeClassMaxNum:
          correctRangeClass?.maxNum && Number(correctRangeClass?.maxNum),
        correctRangeClassMinNum:
          correctRangeClass?.minNum && Number(correctRangeClass?.minNum),
        correctRangeClassMaxSymbol: correctRangeClass?.maxSymbol,
        correctRangeClassMinSymbol: correctRangeClass?.minSymbol,
        warningRangeClassMaxNum:
          warningRangeClass?.maxNum && Number(warningRangeClass?.maxNum),
        warningRangeClassMinNum:
          warningRangeClass?.minNum && Number(warningRangeClass?.minNum),
        warningRangeClassMaxSymbol: warningRangeClass?.maxSymbol,
        warningRangeClassMinSymbol: warningRangeClass?.minSymbol,
      });

      setDictTypeValue(currentInfo?.dictEnum);
      setParameterTypeValue(currentInfo?.paramScope);
      setFixedParameterValue(currentInfo?.defaultValue);

      /** 监听表单变化 */
      addFormListener();
    }
  }, [open]);

  /** 设置表单枚举值 */
  useEffect(() => {
    if (!actionBtnType) {
      return;
    }
    /** 枚举值 */
    if (dictTypeList) {
      form.setFieldState('dictEnum', {
        dataSource: dictTypeList.map(v => ({
          label: `${v.dictName}(${v.dictType})`,
          value: v.dictType,
        })),
      });
    }
    /** 单位 */
    if (unitOption) {
      form.setFieldState('*(unit1,unit2)', {
        dataSource: changeFactorM2cascaderOptions(unitOption),
      });
    }
  }, [dictTypeList, unitOption, actionBtnType]);

  useEffect(() => {
    if (parameterList) {
      form.setFieldState(
        '*(transModeParamCode,originParamCode,destinationParamCode)',
        {
          dataSource: parameterList.map(v => ({
            label: `${v.paramName}`,
            value: v.paramCode,
          })),
        },
      );
    }
  }, [parameterList]);

  useEffect(() => {
    form.setFieldState('defaultValue', {
      dataSource: dictTypeEnumValue,
      value:
        fixedParameterValue ||
        (dictTypeEnumValue && dictTypeEnumValue.length
          ? dictTypeEnumValue[0]?.value
          : undefined),
    });
  }, [dictTypeEnumValue]);

  /** 获取选择的字典标识下的枚举值且默认展示第一个 */
  useEffect(() => {
    if (dictTypeValue) {
      getSystemDictenumListAllByDictTypeBatch({
        dictTypes: dictTypeValue,
      }).then(({ data }: { code?: number; data?: any; msg?: string }) => {
        const result: Dicts[] = data?.data?.[dictTypeValue];
        const enums = result?.map(item => ({
          ...item,
          label: item.dictLabel,
          value: item.dictValue,
        }));
        setDictTypeEnumValue(enums);
      });
    }
  }, [dictTypeValue]);

  /** 获取距离参数对应的运输方式、始发地、目的地 */
  useEffect(() => {
    if (Number(parameterTypeValue) === DISTANCE_PARAMETER) {
      getAllParamsList();
    }
  }, [parameterTypeValue]);

  return (
    <Drawer
      className={`${style.wrapper}`}
      title={title}
      open={open}
      closeIcon={false}
      maskClosable={false}
      destroyOnClose
      placement='right'
      size='large'
      extra={
        <div className={style.closeIcon} onClick={() => onCloseInit()}>
          <IconFont icon='icon-icon-guanbi' />
        </div>
      }
      onClose={() => onCloseInit()}
      footer={[
        <Button onClick={() => onCloseInit()}>
          {isDetail ? I18N.carbonFootPrintLCA.close : I18N.Factors.cancel}
        </Button>,
        !isDetail && (
          <Button
            type='primary'
            onClick={async () => {
              const values = await form.submit<Param>();
              const {
                paramType,
                unitType,
                languageSourceList: apiLanguageSourceList,
              } = values;

              /** 处理多语言 */
              const languageSourceList = handleLangFields({
                rawData: values,
                langType: LANG_TYPE.EN,
                sourceTypeMapping: SOURCE_TYPE_MAPPING,
                apiLanguageSourceList: apiLanguageSourceList || [],
              });

              /** 单位处理判断方法 */
              const handleUnitCode = (unitCode: string | null | undefined) =>
                Array.isArray(unitCode) ? String(unitCode) : unitCode || '';

              // 字段过滤逻辑优化
              const result = {
                ...values,
                languageSourceList,
                // 处理文本/时间类型字段
                ...(paramType !== PARAM_INPUT_TYPE.TEXT && {
                  textType: undefined,
                }),
                ...(paramType !== PARAM_INPUT_TYPE.TIME && {
                  timeType: undefined,
                }),
                // 如果是时间类型字段，则取值textType的值
                ...(paramType === PARAM_INPUT_TYPE.TIME && {
                  timeType: values.textType,
                }),
                // 处理单位字段
                ...(unitType === COMPOUND_UNIT && {
                  unit1: handleUnitCode(values.unit1),
                  unit2: handleUnitCode(values.unit2),
                }),
                ...(unitType === MONOMER_UNIT && {
                  unit1: handleUnitCode(values.unit1),
                  unit2: undefined,
                }),
                ...(unitType === NO_UNIT && {
                  unit1: undefined,
                  unit2: undefined,
                }),
                // 处理数值类型字段
                ...(paramType === NUMBER && {
                  textType: undefined,
                  len: values?.decimal_place,
                  correctRangeClass: {
                    maxNum: values?.correctRangeClassMaxNum,
                    minNum: values?.correctRangeClassMinNum,
                    maxSymbol: values?.correctRangeClassMaxSymbol,
                    minSymbol: values?.correctRangeClassMinSymbol,
                  },
                  warningRangeClass: {
                    maxNum: values?.warningRangeClassMaxNum,
                    minNum: values?.warningRangeClassMinNum,
                    maxSymbol: values?.warningRangeClassMaxSymbol,
                    minSymbol: values?.warningRangeClassMinSymbol,
                  },
                }),
              };
              onOk(JSON.parse(JSON.stringify(result)) as Param);
              form.reset();
              setInputTypeValue(undefined);
            }}
          >
            {I18N.Factors.preserve}
          </Button>
        ),
      ]}
    >
      <Form form={form} previewTextPlaceholder='-'>
        <SchemaField
          schema={modalParamsSchema}
          scope={{ calculateErrorRange }}
        />
      </Form>
    </Drawer>
  );
};
