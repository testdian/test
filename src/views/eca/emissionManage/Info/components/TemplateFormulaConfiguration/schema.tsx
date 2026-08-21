import { QuestionCircleOutlined } from '@ant-design/icons';
import { NumberPicker } from '@formily/antd-v5';
import { Form } from '@formily/core';
import I18N from '@src/lang/I18N';
import { Tooltip } from 'antd';

import {
  renderFormItemSchema,
  renderFromGridSchema,
  renderEmptySchema,
  renderFormilyTableAction,
  switchComponents,
} from '@/components/formily/utils';
import { modal } from '@/store/module/notification';
import { SearchSchemaSelectUtils } from '@/utils/schema';

import { ACTIVITY_DATA_ENUM } from './constant';
import style from './index.module.less';
import { FormulaListResp } from '../../../type';

const externalOperators = [
  I18N.eca.plus,
  I18N.eca.minusSign,
  I18N.eca.times,
  I18N.eca.divisionSign,
  I18N.eca.absoluteValue,
  I18N.eca.parentheses,
  I18N.eca.squareBrackets,
  I18N.eca.brace,
];

export const formulaSchema = ({
  isDetail,
  activeKeyTemplateId,
  editingRows,
  toggleRowEditing,
  formulaForm,
  onDelete,
  onAdd,
  onBasicInfoChange,
  onSave,
}: {
  isDetail: boolean;
  activeKeyTemplateId?: number;
  editingRows: Record<number, boolean>;
  toggleRowEditing: (rowId: number, isEditing: boolean) => void;
  formulaForm: Form;
  onSuccess?: () => void;
  onDelete: (row: FormulaListResp) => void;
  onAdd: (value: string) => void;
  onBasicInfoChange: (
    field: 'emissionSourceParamCode' | 'dataSourceParamCode' | 'emissionUnit',
    value: string | number,
  ) => void;
  onSave: (row: FormulaListResp) => void;
}) => {
  return {
    type: 'object',
    properties: {
      layout: {
        type: 'void',
        'x-component': 'FormLayout',
        'x-component-props': {
          layout: 'vertical',
        },
        properties: {
          grid: {
            ...renderFromGridSchema({ columns: 6 }),
            properties: {
              emissionSourceParamCode: renderFormItemSchema({
                type: 'string',
                title: '排放源名称',
                'x-decorator': 'FormItem',
                'x-component': 'Select',
                'x-component-props': {
                  ...SearchSchemaSelectUtils,
                  onChange: (value: string) => {
                    onBasicInfoChange?.('emissionSourceParamCode', value);
                  },
                },
                'x-decorator-props': {
                  gridSpan: 2,
                },
              }),
              dataSourceParamCode: renderFormItemSchema({
                type: 'string',
                title: '数据来源',
                required: false,
                'x-decorator': 'FormItem',
                'x-component': 'Select',
                'x-component-props': {
                  ...SearchSchemaSelectUtils,
                  onChange: (value: string) => {
                    onBasicInfoChange?.('dataSourceParamCode', value);
                  },
                },
                'x-decorator-props': {
                  gridSpan: 2,
                },
              }),
              empty1: renderEmptySchema({
                'x-decorator-props': {
                  gridSpan: 2,
                },
              }),
              emissionUnit: renderFormItemSchema({
                type: 'string',
                title: '排放量单位',
                'x-decorator': 'FormItem',
                'x-component': 'Select',
                'x-component-props': {
                  onChange: (value: number) => {
                    onBasicInfoChange?.('emissionUnit', value);
                  },
                },
                'x-decorator-props': {
                  gridSpan: 2,
                },
              }),
              empty3: renderEmptySchema({
                'x-decorator-props': {
                  gridSpan: 4,
                },
              }),
              formula: renderFormItemSchema({
                type: 'string',
                title: I18N.eca.calculationFormula,
                'x-decorator': 'FormItem',
                'x-component': 'CustomFormulaInput',
                'x-decorator-props': {
                  gridSpan: 3,
                  tooltip: '请先保存当前未保存的公式行，再添加新公式',
                },
                'x-component-props': {
                  // 表单原始字段数据
                  emissionSourceTemplateId: activeKeyTemplateId,
                  onSuccess: async () => {
                    // onSuccess();
                    // getEmissionSourceFormulaList();
                  },
                  onAdd: (value: string) => {
                    onAdd?.(value);
                  },
                },
              }),
              /** 公式解释区域 */
              formula_explain: {
                type: 'string',
                title: I18N.eca.formulaExplanation,
                'x-decorator': 'FormItem',
                'x-component': 'CalculatingFiled',
                'x-component-props': {
                  operators: externalOperators,
                },
                'x-decorator-props': {
                  gridSpan: 3,
                },
              },
              /** 公式列表 */
              formulaList: {
                type: 'array',
                'x-component': 'ArrayTable',
                'x-decorator': 'FormItem',
                'x-decorator-props': {
                  gridSpan: 6,
                },
                'x-component-props': {
                  pagination: false,
                  bordered: false,
                },
                default: [],
                required: false,
                items: {
                  type: 'object',
                  properties: {
                    columns1: {
                      type: 'void',
                      'x-component': 'ArrayTable.Column',
                      'x-component-props': {
                        title: I18N.carbonFootPrintLCA.number,
                        width: 88,
                      },
                      properties: {
                        allIndex: renderEmptySchema(
                          { type: 'string' },
                          {
                            showVal: (_row, index) => Number(index) + 1,
                          },
                        ),
                      },
                    },
                    columns2: {
                      type: 'void',
                      'x-component': 'ArrayTable.Column',
                      'x-component-props': {
                        title: I18N.eca.formula,
                        width: 400,
                      },
                      properties: {
                        formula: renderFormItemSchema({
                          'x-component': 'TextArea',
                          required: false,
                          'x-disabled': true,
                          'x-component-props': {
                            style: {
                              width: '100%',
                            },
                            rows: 3,
                          },
                        }),
                      },
                    },
                    columns11: {
                      type: 'void',
                      'x-component': 'ArrayTable.Column',
                      'x-component-props': {
                        title: (
                          <span>
                            活动数据
                            <Tooltip title='请在配置公式时注明'>
                              <QuestionCircleOutlined
                                className={style.iconTip}
                              />
                            </Tooltip>
                          </span>
                        ),
                        width: 400,
                      },
                      properties: {
                        activityDataGrid: {
                          type: 'void',
                          'x-component': 'FormGrid',
                          'x-component-props': {
                            maxColumns: 2,
                            minColumns: 2,
                            columnGap: 8,
                          },
                          properties: {
                            activityDataType: renderFormItemSchema({
                              type: 'string',
                              'x-component': 'Select',
                              'x-decorator': 'FormItem',
                            }),
                            /** 选择参数时显示的下拉框 */
                            activityDataSelect: renderFormItemSchema({
                              'x-component': 'Select',
                              'x-component-props': {
                                placeholder: '选择参数',
                                ...SearchSchemaSelectUtils,
                              },
                              'x-reactions': [
                                {
                                  dependencies: ['.activityDataType'],
                                  fulfill: {
                                    state: {
                                      visible: `{{$deps[0] === ${ACTIVITY_DATA_ENUM.SELECT_PARAMS}}}`,
                                    },
                                  },
                                },
                              ],
                            }),
                            /** 公式计算时显示的输入框 */
                            activityDataFormula: renderFormItemSchema({
                              'x-component': 'Input',
                              'x-component-props': {
                                placeholder: '输入公式',
                              },
                              'x-reactions': [
                                {
                                  dependencies: ['.activityDataType'],
                                  fulfill: {
                                    state: {
                                      visible: `{{$deps[0] === ${ACTIVITY_DATA_ENUM.FORMULA_CALCULATION}}}`,
                                    },
                                  },
                                },
                              ],
                            }),
                          },
                        },
                      },
                    },
                    columns12: {
                      type: 'void',
                      'x-component': 'ArrayTable.Column',
                      'x-component-props': {
                        title: '活动数据单位',
                        width: 400,
                      },
                      properties: {
                        activityDataUnitList: renderFormItemSchema({
                          type: 'array',
                          'x-component': 'Cascader',
                          'x-component-props': {
                            placeholder: I18N.Factors.pleaseSelect,
                            displayRender: (label: string[]) => {
                              if (!label) return '';
                              return label.slice(-1);
                            },
                            showSearch: true,
                            style: {
                              width: '100%',
                            },
                            multiple: true,
                            // 禁止选择父级节点，只能选择叶子节点
                            changeOnSelect: false,
                            showCheckedStrategy: 'SHOW_CHILD',
                          },
                          required: false,
                        }),
                      },
                    },
                    columns3: {
                      type: 'void',
                      'x-component': 'ArrayTable.Column',
                      'x-component-props': {
                        title: I18N.dashborad.sort,
                        width: 120,
                      },
                      properties: {
                        sort: renderFormItemSchema({
                          required: false,
                          'x-component': switchComponents<FormulaListResp>({
                            renderFn: ({ props }) => {
                              return (
                                <NumberPicker
                                  {...props}
                                  min={0}
                                  placeholder={I18N.Factors.pleaseSelect}
                                />
                              );
                            },
                          }),
                        }),
                      },
                    },
                    columns5: isDetail
                      ? {}
                      : {
                          ...renderFormilyTableAction({
                            width: 120,
                            actionBtns: ({ row, index }) => {
                              // 从行数据中读取编辑状态，这样当字段更新时会触发重新渲染
                              const isEditing =
                                (row as any).editingState !== undefined
                                  ? (row as any).editingState
                                  : !row.id ||
                                    (row.id && editingRows[row.id as number]);

                              return [
                                {
                                  label: I18N.Factors.delete,
                                  key: 'del',
                                  onClick: async () => {
                                    modal.confirm({
                                      title: I18N.eca.confirmToDeleteThis,
                                      onOk: async () => {
                                        onDelete?.(row);
                                      },
                                    });
                                  },
                                },
                                {
                                  label: isEditing
                                    ? I18N.Factors.preserve
                                    : I18N.Factors.edit,
                                  key: isEditing ? 'save' : 'edit',
                                  onClick: async () => {
                                    if (isEditing) {
                                      // 保存逻辑
                                      onSave?.(row);
                                    } else {
                                      // 点击编辑的方法
                                      if (!row.id) return;
                                      toggleRowEditing(row.id, true);
                                      // 更新该行的 editingState 字段，触发重新渲染
                                      const currentFormulaList = (formulaForm
                                        .values.formulaList || []) as any[];
                                      const updatedList = [
                                        ...currentFormulaList,
                                      ];
                                      updatedList[index] = {
                                        ...updatedList[index],
                                        editingState: true,
                                      };
                                      formulaForm.setValues({
                                        ...formulaForm.values,
                                        formulaList: updatedList,
                                      });
                                      // 设置该行为可编辑状态
                                      formulaForm.setFieldState(
                                        `formulaList.${index}.*(activityDataType,activityDataSelect,activityDataFormula,activityDataUnitList,sort)`,
                                        {
                                          readPretty: false,
                                        },
                                      );
                                    }
                                  },
                                },
                              ];
                            },
                          }),
                        },
                  },
                },
              },
            },
          },
        },
      },
    },
  };
};
