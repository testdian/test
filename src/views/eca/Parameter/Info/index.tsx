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
  Toast,
} from '@/utils';
import { changeFactorM2cascaderOptions } from '@/views/Factors/Info/utils';
import { useAllEnumsBatch } from '@/views/dashborad/Dicts/hooks';

import style from './index.module.less';
import { paramsSchema } from './schemas';
import { useDynamicDict } from '../../hooks';
import { COMMON_PARAM_TYPE } from '../../util/constant';
import { calculateErrorRange } from '../../util/paramsUtil/correctParams';
import {
  DEFAULT_SELECT,
  INIT_SINGLE_TYPE,
  onDataSettingOptionsFn,
  PARAMETER_TYPE,
  TIME_DEFAULT_TYPE,
  UNIT_TYPE,
} from '../../util/paramsUtil/paramsSchema/constant';
import FormliySelectButton from '../component/FormliySelectButton';
import {
  addParameterAPi,
  editParameterAPi,
  getParameterAllListAPi,
  getParameterDetailAPi,
} from '../service';
import { CorrectRangeClassProps, Param } from '../type';
import { SOURCE_TYPE_MAPPING } from './constant';

const { add, edit, show, copy } = PageTypeInfo;

const { TEXT, TIME, NUMBER } = COMMON_PARAM_TYPE;

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
  /** 列表操作按钮的类型 */
  actionBtnType?: string;
  /** 数据字段item的具体ID */
  dataFiledId?: number;
  /** 保存方法 */
  onOk: () => void;
  /** 取消方法 */
  onClose: () => void;
}
export const FieldPropertiesInfo = ({
  open,
  actionBtnType,
  dataFiledId,
  onOk,
  onClose,
}: ProductManagementInfoProps) => {
  const isAdd = actionBtnType === add;
  const isDetail = actionBtnType === show;
  const isEdit = actionBtnType === edit;
  const isCopy = actionBtnType === copy;

  /** 抽屉标题 */
  const titleMap = {
    [add]: I18N.eca.addNewParameters,
    [edit]: I18N.eca.editParameters,
    [show]: I18N.eca.viewParameters,
    [copy]: I18N.eca.copyParameters,
  };
  const title = titleMap[actionBtnType as keyof typeof titleMap];

  /** 表单中枚举值的列表 */
  const { data: dictTypeList } = useDynamicDict({}, [open]);

  /** 单位枚举 */
  const unitOption = useAllEnumsBatch('factorUnitM')?.factorUnitM;

  /** 获取所有参数列表数据 */
  const [parameterList, setParameterList] = useState<Param[]>([]);

  /** 保存按钮的loading */
  const [btnLoading, setBtnLoading] = useState(false);

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

  /** 保存时的api接口 */
  const postApi = {
    [add]: addParameterAPi,
    [edit]: editParameterAPi,
    [copy]: addParameterAPi,
  };

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
    /** 新增操作 */
    if (isAdd && !dataFiledId && open) {
      /** 属性格式默认展示文本 */
      setInputTypeValue(TEXT);
      /** 监听表单变化 */
      addFormListener();
    }
    /** 编辑操作 */
    if (isEdit) {
      /** 字段标识、字段类型不能编辑 */
      form.setFieldState('*(paramCode,paramName,paramType,paramScope)', {
        disabled: true,
      });
    }

    /** 获取数据字段详情 */
    if (!isAdd && dataFiledId) {
      getParameterDetailAPi(dataFiledId.toString()).then(({ data }) => {
        const {
          unit1,
          unit2,
          paramType,
          textType,
          timeType,
          correctRangeClass,
          warningRangeClass,
          languageSourceList,
        } = data?.data || {};
        /** 设置属性格式 */
        form.setFieldState('textType', {
          dataSource: onDataSettingOptionsFn(paramType as number),
        });

        /** 单位处理 */
        const unitCodeZBack = unit1 ? unit1.split(',') : undefined;

        const unitCodeMBack = unit2 ? unit2.split(',') : undefined;

        // 辅助函数：处理区间值并生成完整的表单字段
        const processRangeClass = (
          prefix: string,
          rangeClass: CorrectRangeClassProps,
        ) => {
          if (!rangeClass) return {};
          /** 警告区间和正确区间的表单字段 */
          return {
            [`${prefix}MaxNum`]: rangeClass.maxNum && Number(rangeClass.maxNum),
            [`${prefix}MinNum`]: rangeClass.minNum && Number(rangeClass.minNum),
            [`${prefix}MaxSymbol`]:
              rangeClass.maxSymbol && Number(rangeClass.maxSymbol),
            [`${prefix}MinSymbol`]:
              rangeClass.minSymbol && Number(rangeClass.minSymbol),
          };
        };

        // 定义paramType到textType的映射
        const textTypeMap: Record<number, number | undefined> = {
          [TIME]: timeType,
          [TEXT]: textType,
        };

        /** 反处理多语言 */
        const langFields = reverseHandleLangFields(languageSourceList);

        form.setValues({
          ...data?.data,
          unit1: unitCodeZBack,
          unit2: unitCodeMBack,
          textType: (paramType && textTypeMap[paramType]) || INIT_SINGLE_TYPE,
          decimal_place: data?.data?.len,
          // 合并处理后的区间值
          ...processRangeClass('correctRangeClass', correctRangeClass),
          ...processRangeClass('warningRangeClass', warningRangeClass),
          ...langFields,
        });

        setDictTypeValue(data?.data?.dictEnum);
        setParameterTypeValue(data?.data?.paramScope);
        setFixedParameterValue(data?.data?.defaultValue);

        /** 复制操作 */
        if (isCopy) {
          /** 1. 参数名称和参数ID字段为空，其他字段自动带出。 */
          form.reset('*(paramName,paramCode)');
        }

        /** 监听表单变化 */
        addFormListener();
      });
    }
  }, [isAdd, isCopy, dataFiledId, open]);

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
            loading={btnLoading}
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
                ...(paramType !== TEXT && {
                  textType: undefined,
                }),
                ...(paramType !== TIME && {
                  timeType: undefined,
                }),
                // 如果是时间类型字段，则取值textType的值
                ...(paramType === TIME && {
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
              try {
                setBtnLoading(true);
                const api = postApi[actionBtnType as keyof typeof postApi];
                await api(JSON.parse(JSON.stringify(result)));
                Toast('success', I18N.Factors.saveSuccessful);
                setBtnLoading(false);
                form.reset();
                setInputTypeValue(undefined);
                onOk();
              } catch (e) {
                setBtnLoading(false);
                throw e;
              }
            }}
          >
            {I18N.Factors.preserve}
          </Button>
        ),
      ]}
    >
      <Form form={form} previewTextPlaceholder='-'>
        <SchemaField schema={paramsSchema} scope={{ calculateErrorRange }} />
      </Form>
    </Drawer>
  );
};
