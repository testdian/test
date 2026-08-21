/**
 * @file 模板公式配置表单
 */
import {
  Form,
  NumberPicker,
  FormItem,
  FormLayout,
  FormGrid,
  ArrayTable,
  Select,
  Radio,
  Input,
  Cascader,
} from '@formily/antd-v5';
import { createForm, onFieldValueChange } from '@formily/core';
import { createSchemaField } from '@formily/react';
import I18N from '@src/lang/I18N';
import { FC, useEffect, useMemo, useState } from 'react';

import { TextArea } from '@/components/formily/TextArea';
import { useAllEnumsBatch } from '@/hooks/dict';
import { Toast, changeFactorM2cascaderOptions } from '@/utils';
import { useComputationEnum } from '@/views/eca/hooks/useComputationEnum';
import { COMMON_PARAM_TYPE } from '@/views/eca/util/constant';

import { ACTIVITY_DATA_ENUM } from './constant';
import { formulaSchema } from './schema';
import CalculatingFiled from '../../../component/CalculatingFiled';
import { CustomFormulaInput } from '../../../component/CustomFormulaInput';
import {
  deleteEmissionSourceFormulaApi,
  editEmissionSourceFormulaApi,
  editEmissionSourceFormulaBasicInfoApi,
  saveEmissionSourceFormulaApi,
} from '../../../service';
import {
  EditEmissionSourceFormulaBasicInfoReqRequest,
  EmissionSourceFormula,
  EmissionSourceParam,
  EmissionSourceTemplateResp,
  FormulaListResp,
} from '../../../type';

const SchemaField = createSchemaField({
  components: {
    NumberPicker,
    Form,
    FormItem,
    FormLayout,
    FormGrid,
    ArrayTable,
    CalculatingFiled,
    CustomFormulaInput,
    Select,
    Radio,
    Input,
    Cascader,
    TextArea,
  },
});

interface TemplateFormulaConfigurationProps {
  /** 当前选择的模板id */
  activeKeyTemplateId?: number;
  /** 排放源id */
  emissionSourceId?: number;
  /** 当前模板对应的参数列表 */
  templateParamsList: EmissionSourceParam[];
  /** 不展示在模版中的参数列表 */
  notDisplayPramList: EmissionSourceParam[];
  /** 当前模板对应的公式列表 */
  formulaList: EmissionSourceFormula[];
  /** 模板详情数据 */
  templateDetail?: EmissionSourceTemplateResp;
  /** 编辑排序成功、校验公式成功 */
  isDetail?: boolean;
  onSuccess?: () => void;
}
const TemplateFormulaConfiguration: FC<TemplateFormulaConfigurationProps> = ({
  formulaList,
  templateParamsList,
  notDisplayPramList,
  activeKeyTemplateId,
  emissionSourceId,
  templateDetail,
  onSuccess,
  isDetail = false,
}) => {
  /** 排放量单位 */
  const emissionUnit = useComputationEnum({
    enumType: 'EmissionUnit',
  });

  /** 活动数据类型 */
  const activityCategory = useComputationEnum({
    enumType: 'ActivityDataType',
  });

  /** 单位枚举 */
  const unitOption = useAllEnumsBatch('factorUnitM')?.factorUnitM;

  const formulaForm = useMemo(
    () =>
      createForm({
        readPretty: isDetail,
      }),
    [isDetail, formulaList],
  );

  /** 维护每行的编辑状态 key: row.id, value: isEditing */
  const [editingRows, setEditingRows] = useState<Record<number, boolean>>({});
  /** 切换行的编辑状态 */
  const toggleRowEditing = (rowId: number, isEditing: boolean) => {
    setEditingRows(prev => ({
      ...prev,
      [rowId]: isEditing,
    }));
  };

  // 监听 activityDataSelect 字段变化，自动填充 unit1
  useEffect(() => {
    formulaForm.removeEffects('activityDataSelectEffect');
    formulaForm.addEffects('activityDataSelectEffect', () => {
      onFieldValueChange('formulaList.*.activityDataSelect', field => {
        const value = field.value as string;
        const index = field.path?.segments?.[1] as number;

        if (value && typeof index === 'number') {
          // 从参数列表中找到对应的参数
          const allParamsList = [...templateParamsList, ...notDisplayPramList];
          const selectedParam = allParamsList.find(
            item => item.paramName === value,
          );

          // 如果找到参数且有 unit1，则自动填充到活动数据单位
          if (selectedParam?.unit1) {
            // 将 unit1 转换为 Cascader 需要的格式 [["1","1"]]
            const unit1Array = [selectedParam.unit1.split(',')];
            formulaForm.setFieldState(
              `formulaList.${index}.activityDataUnitList`,
              {
                value: unit1Array,
              },
            );
          }
        }
      });
    });
  }, [formulaForm, templateParamsList, notDisplayPramList]);

  useEffect(() => {
    if (isDetail) {
      formulaForm.setFieldState('*(formula_explain,formula)', {
        display: 'none',
      });
    }
  }, [isDetail]);

  // 设置参数列表的dataSource
  useEffect(() => {
    if (templateParamsList && templateParamsList.length > 0) {
      const paramsList = templateParamsList.map(
        (item: EmissionSourceParam) => ({
          label: item?.paramName,
          value: item?.paramCode,
        }),
      );

      // 设置排放源名称和数据来源的dataSource
      formulaForm.setFieldState('emissionSourceParamCode', {
        dataSource: paramsList,
      });
      formulaForm.setFieldState('dataSourceParamCode', {
        dataSource: paramsList,
      });

      const allParamsList = [...templateParamsList, ...notDisplayPramList];
      const paramsActivityList = allParamsList
        ?.filter(item => item.paramType === COMMON_PARAM_TYPE.NUMBER)
        .map((item: EmissionSourceParam) => ({
          ...item,
          label: item?.paramName,
          value: item?.paramName,
          unit1: item?.unit1,
        }));

      // 设置选择参数的dataSource
      formulaForm.setFieldState('*(formulaList.*.activityDataSelect)', {
        dataSource: paramsActivityList,
      });
    }
  }, [templateParamsList]);

  /** 保存基本信息 */
  const saveBasicInfo = async (
    field: 'emissionSourceParamCode' | 'dataSourceParamCode' | 'emissionUnit',
    value: string | number,
  ) => {
    if (!emissionSourceId || !activeKeyTemplateId) return;

    try {
      const formValues = formulaForm.values as {
        emissionSourceParamCode?: string;
        dataSourceParamCode?: string;
        emissionUnit?: number;
      };
      const params: EditEmissionSourceFormulaBasicInfoReqRequest = {
        emissionSourceId,
        id: activeKeyTemplateId,
        emissionSourceParamCode: formValues.emissionSourceParamCode,
        dataSourceParamCode: formValues.dataSourceParamCode,
        emissionUnit: formValues.emissionUnit,
        // 更新当前修改的字段
        [field]: value,
      };

      await editEmissionSourceFormulaBasicInfoApi(params);
      onSuccess?.();
    } catch (error) {
      // 保存失败
    }
  };

  useEffect(() => {
    if (!formulaList.length) {
      formulaForm.setFieldState('formulaList', {
        visible: false,
      });
      // 没有任何行时，启用添加按钮
      formulaForm.setFieldState('formula', {
        disabled: false,
      });
    }
    if (formulaList.length) {
      const formulaListData = formulaList.map(item => {
        // 根据活动数据类型反处理 activityDataFormula
        const isParams =
          item.activityDataType === ACTIVITY_DATA_ENUM.SELECT_PARAMS;

        // 处理活动数据单位：将后端返回的 ["1,1", "2,1"] 转换为 Cascader 需要的 [["1","1"], ["2","1"]]
        let activityDataUnitListValue;
        if (Array.isArray(item.activityDataUnitList)) {
          // 将字符串数组转换为二维数组
          activityDataUnitListValue = item.activityDataUnitList.map(unitStr =>
            typeof unitStr === 'string' ? unitStr.split(',') : unitStr,
          );
        } else {
          activityDataUnitListValue = undefined;
        }

        return {
          ...item,
          // 反处理单位：转换为 Cascader 需要的格式
          activityDataUnitList: activityDataUnitListValue,
          // 反处理活动数据：根据类型分别赋值
          activityDataSelect: isParams ? item.activityDataFormula : undefined,
          activityDataFormula: isParams ? undefined : item.activityDataFormula,
          // 添加编辑状态标记，用于触发按钮重新渲染
          editingState:
            item.id && editingRows[item.id] !== undefined
              ? editingRows[item.id]
              : !item.id,
        };
      });

      // 初始化编辑状态：新行（无 id）默认可编辑，已保存的行默认不可编辑
      const newEditingRows: Record<number, boolean> = {};
      formulaListData.forEach(item => {
        if (item.id) {
          // 已保存的行，检查是否在编辑状态中
          newEditingRows[item.id] =
            editingRows[item.id] !== undefined ? editingRows[item.id] : false;
        }
      });
      setEditingRows(newEditingRows);

      // 更新 formulaListData 中的 editingState 字段
      const updatedFormulaListData = formulaListData.map(item => ({
        ...item,
        editingState:
          item.id && newEditingRows[item.id] !== undefined
            ? newEditingRows[item.id]
            : !item.id,
      }));

      // 重新设置表单值，确保 _editingState 字段被正确设置
      formulaForm.setValues({
        formulaList: updatedFormulaListData,
      });

      // 使用 setTimeout 确保在表单值设置完成后再设置 readPretty
      setTimeout(() => {
        updatedFormulaListData.forEach((item, index) => {
          if (item.id) {
            // 为已保存的行设置 readPretty 状态
            const isEditing = newEditingRows[item.id];
            formulaForm.setFieldState(
              `formulaList.${index}.*(activityDataType,activityDataSelect,activityDataFormula,activityDataUnitList,sort)`,
              {
                readPretty: !isEditing,
              },
            );
          }
        });
      }, 0);

      // 检查是否有未保存的行（没有 id 的行）
      const hasUnsavedRow = formulaListData.some(item => !item.id);
      // 根据是否有未保存的行来禁用/启用添加公式按钮
      formulaForm.setFieldState('formula', {
        disabled: hasUnsavedRow,
      });
    }
  }, [formulaList]);

  // 初始化基本信息字段
  useEffect(() => {
    if (templateDetail) {
      const detail = templateDetail as EmissionSourceTemplateResp & {
        emissionSourceParamCode?: string;
        dataSourceParamCode?: string;
        emissionUnit?: number;
      };
      formulaForm.setValues({
        emissionSourceParamCode: detail?.emissionSourceParamCode,
        dataSourceParamCode: detail?.dataSourceParamCode,
        emissionUnit: detail?.emissionUnit,
      });
    }
  }, [templateDetail]);

  /** 设置枚举值 */
  useEffect(() => {
    /** 排放量单位 */
    if (emissionUnit) {
      formulaForm.setFieldState('emissionUnit', {
        dataSource: emissionUnit,
      });
    }
    /** 活动数据类型 */
    if (activityCategory) {
      formulaForm.setFieldState('*(formulaList.*.activityDataType)', {
        dataSource: activityCategory,
      });
    }
    /** 单位 */
    if (unitOption) {
      formulaForm.setFieldState('*(formulaList.*.activityDataUnitList)', {
        dataSource: changeFactorM2cascaderOptions(unitOption),
      });
    }
  }, [emissionUnit, activityCategory, unitOption, formulaForm]);

  return (
    <div>
      <Form form={formulaForm} style={{ margin: '14px 14px' }}>
        <SchemaField
          schema={formulaSchema({
            isDetail,
            activeKeyTemplateId: Number(activeKeyTemplateId),
            editingRows,
            toggleRowEditing,
            formulaForm,
            onSuccess: () => {
              onSuccess?.();
            },
            onDelete: async (row: FormulaListResp) => {
              if (row.id) {
                // 如果有 id，调用接口删除
                await deleteEmissionSourceFormulaApi(Number(row.id));
                onSuccess?.();
              } else {
                // 如果没有 id，直接从表单中移除
                const formValues = formulaForm.values as {
                  formulaList?: FormulaListResp[];
                };
                const currentFormulaList = formValues.formulaList || [];
                const updatedList = currentFormulaList.filter(
                  item => item !== row,
                );

                formulaForm.setValues({
                  ...formulaForm.values,
                  formulaList: updatedList,
                });

                // 删除未保存的行后，检查是否还有其他未保存的行
                const hasUnsavedRow = updatedList.some(item => !item.id);
                formulaForm.setFieldState('formula', {
                  disabled: hasUnsavedRow,
                });
              }
            },
            onAdd: (value: string) => {
              const formValues = formulaForm.values as {
                formulaList?: FormulaListResp[];
              };
              const currentFormulaList = formValues.formulaList || [];
              formulaForm.setValues({
                ...formulaForm.values,
                formulaList: [...currentFormulaList, { formula: value }],
              });
              // 判断当前formulaList的visible状态，如果为false则修改为true
              const formulaListState = formulaForm.getFieldState('formulaList');
              if (!formulaListState?.visible) {
                formulaForm.setFieldState('formulaList', {
                  visible: true,
                });
              }
              // 清空计算公式的值
              formulaForm.reset('formula');
              // 添加新行后禁用添加按钮
              formulaForm.setFieldState('formula', {
                disabled: true,
              });
            },
            onBasicInfoChange: (field, value) => {
              saveBasicInfo(field, value);
            },
            onSave: async (row: FormulaListResp) => {
              if (!activeKeyTemplateId) return;

              /** 选择参数 */
              const isParams =
                row.activityDataType === ACTIVITY_DATA_ENUM.SELECT_PARAMS;
              /** 公式计算 */
              const isFormula =
                row.activityDataType === ACTIVITY_DATA_ENUM.FORMULA_CALCULATION;
              // 校验必填项
              if (!row.formula) {
                Toast('error', '请填写公式');
                return;
              }

              if (
                row.activityDataType === undefined ||
                row.activityDataType === null
              ) {
                Toast('error', '请选择活动数据类型');
                return;
              }

              // 根据活动数据类型校验对应字段
              if (isParams) {
                if (!row.activityDataSelect) {
                  Toast('error', '请选择参数');
                  return;
                }
              } else if (isFormula) {
                if (!row.activityDataFormula) {
                  Toast('error', '请输入公式');
                  return;
                }
              }

              if (
                !row.activityDataUnitList ||
                !(row.activityDataUnitList as string[])?.length
              ) {
                Toast('error', '请选择活动数据单位');
                return;
              }

              if (!row.sort && row.sort !== 0) {
                Toast('error', '请填写排序');
                return;
              }

              const saveApi = row.id
                ? editEmissionSourceFormulaApi
                : saveEmissionSourceFormulaApi;

              // 处理活动数据单位：将 Cascader 返回的 [["1","1"], ["2","1"]] 转换为后端需要的 ["1,1","2,1"]
              const processedUnitList = Array.isArray(row.activityDataUnitList)
                ? row.activityDataUnitList.map(item =>
                    Array.isArray(item) ? item.join(',') : item,
                  )
                : row.activityDataUnitList;

              try {
                const response = await saveApi({
                  ...row,
                  emissionSourceTemplateId: activeKeyTemplateId,
                  // 活动数据单位：转换后的数据传给后端
                  activityDataUnitList: processedUnitList,
                  activityDataFormula: isParams
                    ? row?.activityDataSelect
                    : row?.activityDataFormula,
                });
                Toast('success', I18N.Factors.saveSuccessful);

                // 保存成功后，将该行设置为不可编辑状态
                const savedRowId = row.id || response?.data?.data;
                if (savedRowId) {
                  setEditingRows(prev => ({
                    ...prev,
                    [Number(savedRowId)]: false,
                  }));
                }

                // 更新表单中该行的 editingState 字段为 false，触发重新渲染
                const currentFormulaList = (formulaForm.values.formulaList ||
                  []) as any[];
                const rowIndex = currentFormulaList.findIndex(
                  (item: any) =>
                    item === row || (item.id && row.id && item.id === row.id),
                );
                if (rowIndex !== -1) {
                  const updatedList = [...currentFormulaList];
                  updatedList[rowIndex] = {
                    ...updatedList[rowIndex],
                    editingState: false,
                  };
                  formulaForm.setValues({
                    ...formulaForm.values,
                    formulaList: updatedList,
                  });
                }

                // 保存成功后调用 onSuccess 刷新数据（会重新加载 formulaList）
                onSuccess?.();
              } catch (error) {
                // 保存失败
              }
            },
          })}
        />
      </Form>
    </div>
  );
};

export default TemplateFormulaConfiguration;
