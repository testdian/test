import { Select } from '@formily/antd-v5';
import I18N from '@src/lang/I18N';
import { Button } from 'antd';

import {
  renderFromGridSchema,
  renderFormItemSchema,
  renderEmptySchema,
  switchComponents,
  renderSchemaWithLayout,
} from '@/components/formily/utils';
import { SearchSchemaSelectUtils } from '@/utils/schema';
import {
  HasSubCategoryGas,
  TableSchemaProps,
} from '@/views/Factors/Info/utils/schemas';
import {
  InputTextLength100,
  InputTextLength20,
  InputTextLength50,
  RegNumAndLetters,
  RegNumberFive,
  RegNumberThree,
} from '@/views/eca/util/type';
import { RegValue } from '@/views/supplyChainCarbonManagement/utils';

export const baseSchema = () =>
  renderSchemaWithLayout(
    {},
    {
      grid: {
        ...renderFromGridSchema(),
        properties: {
          sourceName: renderFormItemSchema({
            title: '排放源名称',
            type: 'string',
            'x-component': 'Input',
            'x-component-props': {
              maxLength: InputTextLength100,
            },
          }),
          // sourceNameEn: renderFormItemSchema({
          //   title: I18N.eca.emissionSourceName2,
          //   type: 'string',
          //   'x-component': 'Input',
          //   'x-component-props': {
          //     maxLength: InputTextLength100,
          //   },
          // }),
          facility: renderFormItemSchema({
            title: '排放设施/活动',
            type: 'string',
            'x-component': 'Input',
            'x-component-props': {
              maxLength: InputTextLength100,
            },
          }),
          // facilityEn: renderFormItemSchema({
          //   title: I18N.eca.emissionFacilityActivity4,
          //   type: 'string',
          //   'x-component': 'Input',
          //   'x-component-props': {
          //     maxLength: InputTextLength100,
          //   },
          // }),
          sourceCode: renderFormItemSchema({
            title: I18N.eca.emissionSourceId,
            type: 'string',
            'x-validator': RegNumAndLetters,
            'x-component': 'Input',
            'x-component-props': {
              maxLength: InputTextLength20,
              disabled: true,
            },
          }),

          ghg: renderFormItemSchema({
            title: I18N.components.ghgCategories,
            type: 'string',
            'x-component': 'Cascader',
          }),
          iso: renderFormItemSchema({
            title: I18N.components.isoCategory,
            type: 'string',
            'x-component': 'Cascader',
          }),
          orgCode: renderFormItemSchema({
            title: '核算组织',
            type: 'string',
            'x-component': 'TreeSelect',
            'x-component-props': {
              placeholder: I18N.Factors.pleaseSelect,
              showSearch: true,
              allowClear: true,
              treeNodeFilterProp: 'label',
              treeDefaultExpandAll: true,
            },
          }),
          statisticType: renderFormItemSchema({
            title: '看板标识',
            type: 'string',
            'x-component': 'Select',
            'x-component-props': {
              allowClear: true,
            },
          }),
        },
      },
    },
  );

/** 活动数据表单配置 */
export const activityLVMHFormSchema = () =>
  renderSchemaWithLayout(
    {},
    {
      grid: {
        ...renderFromGridSchema(),
        properties: {
          roleIds: renderFormItemSchema({
            title: I18N.components.fillInRole,
            type: 'string',
            'x-component': 'Select',
            'x-component-props': {
              ...SearchSchemaSelectUtils,
              mode: 'multiple',
            },
          }),
          activityCategory: renderFormItemSchema({
            title: I18N.components.activityDataClass,
            type: 'string',
            'x-component': 'Select',
            'x-component-props': {
              allowClear: true,
            },
          }),
          activityScore: renderFormItemSchema({
            title: I18N.supplyChainCarbonManagement.activityDataReview,
            type: 'string',
            'x-component': 'Select',
            'x-component-props': {
              allowClear: true,
              disabled: true,
            },
          }),
          // /** 计算方式 */
          // calcMethod: renderFormItemSchema({
          //   title: I18N.carbonFootPrintLCA.calculationMethod,
          //   type: 'string',
          //   'x-component': 'Radio.Group',
          //   enum: CALCULATION_FORMULA,
          //   default: CALCULATION_FORMULA_ENUM.FORMULA,
          //   'x-disabled': true,
          // }),
          /** 数据收集周期 */
          dataPeriod: renderFormItemSchema({
            title: '数据收集周期',
            type: 'number',
            'x-component': 'Radio.Group',
            // default: COLLECT_CYCLE_ENUM.YEARLY,
          }),
        },
      },
    },
  );

export const activityFormSchema = () =>
  renderSchemaWithLayout(
    {},
    {
      grid: {
        ...renderFromGridSchema(),
        properties: {
          dataValue: renderFormItemSchema({
            title: I18N.eca.activityData,
            type: 'string',
            'x-component': 'NumberPicker',
            'x-validator': (value: number) =>
              RegValue(value, 99999999.9999, 0, 4, I18N.components.valueRange),
          }),
          activityUnit: renderFormItemSchema({
            title: I18N.eca.activityDataSheet,
            type: 'string',
            'x-component': 'Cascader',
            'x-component-props': {
              displayRender: (label: string[]) => {
                if (!label) return '';
                return label.slice(-1);
              },
              showSearch: true,
            },
          }),
          activityRecordWay: renderFormItemSchema({
            title: I18N.eca.activityDataRecording,
            required: false,
            type: 'string',
            'x-component': 'Input',
            'x-component-props': {
              maxLength: InputTextLength50,
            },
          }),
          activityRecordWayEn: renderFormItemSchema({
            title: I18N.eca.activityDataRecording2,
            required: false,
            type: 'string',
            'x-component': 'Input',
            'x-component-props': {
              maxLength: InputTextLength50,
            },
          }),
          activityDept: renderFormItemSchema({
            required: false,
            title: I18N.eca.activityDataProtection,
            type: 'string',
            'x-component': 'Input',
            'x-component-props': {
              maxLength: InputTextLength50,
            },
          }),
          activityDeptEn: renderFormItemSchema({
            required: false,
            title: I18N.eca.activityDataProtection2,
            type: 'string',
            'x-component': 'Input',
            'x-component-props': {
              maxLength: InputTextLength50,
            },
          }),
          activityCategory: renderFormItemSchema({
            title: I18N.components.activityDataClass,
            type: 'string',
            'x-component': 'Select',
            'x-component-props': {
              allowClear: true,
            },
          }),
          activityScore: renderFormItemSchema({
            title: I18N.supplyChainCarbonManagement.activityDataReview,
            type: 'string',
            'x-component': 'Select',
            'x-component-props': {
              allowClear: true,
              disabled: true,
            },
          }),
        },
      },
    },
  );

export const factorSchema = (
  readPretty: boolean,
  addGasListFn: (index?: number, row?: TableSchemaProps) => void,
  delGasListFn: (index?: number, row?: TableSchemaProps) => void,
  // gwpObj?: { [key: string | number]: number },
) => {
  return renderSchemaWithLayout(
    {},
    {
      grid: {
        ...renderFromGridSchema(),
        properties: {
          factorWay: renderFormItemSchema({
            type: 'string',
            'x-decorator-props': {
              gridSpan: 3,
            },
            'x-component': 'SelectButton',
            enum: [
              {
                label: I18N.Factors.emissionFactors,
                value: '1',
              },
              {
                label: I18N.components.newFactor,
                value: '2',
              },
              // {
              //   label: I18N.components.supplierData,
              //   value: '3',
              // },
            ],
            default: '1',
            'x-reactions': {
              target: '*(gasList,factorSource,factorSourceEn,year)',
              when: `{{$self.value !== '2'}}`,
              fulfill: {
                state: {
                  disabled: true,
                  required: false,
                },
              },
              otherwise: {
                state: {
                  disabled: !!readPretty,
                  required: !readPretty,
                },
              },
            },
          }),
          gasList: renderFormItemSchema({
            title: I18N.components.emissionFactors2,
            type: 'array',
            required: false,
            'x-decorator-props': {
              gridSpan: 3,
            },
            'x-component': 'ArrayTable',
            'x-component-props': {
              pagination: false,
            },
            'x-reactions': {
              dependencies: ['.factorWay'],
              fulfill: {
                schema: {
                  'x-visible': '{{$deps[0] !== "3"}}',
                },
              },
            },
            items: {
              properties: {
                columns1: {
                  type: 'void',
                  'x-component': 'ArrayTable.Column',
                  'x-component-props': {
                    title: I18N.Factors.greenhouseGasCategory,
                    onCell: (row: { gasType: string }) => {
                      return {
                        colSpan: row?.gasType?.includes('CO₂e') ? 2 : 1,
                      };
                    },
                  },
                  properties: {
                    gasType: renderEmptySchema(
                      { type: 'string' },
                      {
                        showVal: (row: { gasType: string }) => row?.gasType,
                      },
                    ),
                  },
                },
                columns2: {
                  type: 'void',
                  'x-component': 'ArrayTable.Column',
                  'x-component-props': {
                    title: I18N.Factors.greenhouseGases,
                    onCell: (row: { gasType: string }) => {
                      return {
                        colSpan: row?.gasType?.includes('CO₂e') ? 0 : 1,
                      };
                    },
                  },
                  properties: {
                    gas: {
                      ...renderFormItemSchema({
                        validateTitle: I18N.Factors.greenhouseGases,
                        'x-component': 'Select',
                        required: false,
                      }),
                      'x-component': switchComponents<Record<string, any>>({
                        renderFn: ({ row, props }) => {
                          if (
                            Object.keys(HasSubCategoryGas).some(g =>
                              row?.gasType?.includes(g),
                            )
                          ) {
                            return (
                              <Select
                                {...props}
                                placeholder={I18N.Factors.pleaseSelect}
                                options={props.dataSource}
                                allowClear
                              />
                            );
                          }
                          return <div>{row?.gas || ''}</div>;
                        },
                      }),
                    },
                  },
                },
                columns3: {
                  type: 'void',
                  'x-component': 'ArrayTable.Column',
                  'x-component-props': { title: I18N.Factors.factorValue },
                  properties: {
                    factorValue: renderFormItemSchema({
                      validateTitle: I18N.Factors.factorValue,
                      required: false,
                      'x-component': 'NumberPicker',
                      'x-validator': [...RegNumberThree],
                      'x-component-props': {
                        min: 0.0000000001,
                        max: 99999999999.99998,
                        style: { with: '100%' },
                      },
                    }),
                  },
                },
                columns4: {
                  type: 'void',
                  'x-component': 'ArrayTable.Column',
                  'x-component-props': {
                    title: I18N.Factors.factorUnit,
                    width: 400,
                  },
                  properties: {
                    config: {
                      type: 'void',
                      'x-component': 'FormGrid',
                      properties: {
                        factorUnitZ: renderFormItemSchema({
                          validateTitle: I18N.Factors.molecularUnit,
                          required: false,
                          'x-component': 'Select',
                          'x-component-props': {
                            placeholder: I18N.Factors.molecularUnit,
                            allowClear: true,
                          },
                          'x-decorator-props': {
                            addonAfter: '/',
                          },
                        }),
                        factorUnitM: renderFormItemSchema({
                          validateTitle: I18N.Factors.denominatorUnit,
                          required: false,
                          'x-component': 'Cascader',
                          'x-component-props': {
                            placeholder: I18N.Factors.denominatorUnit,
                            displayRender: (label: string[]) => {
                              if (!label) return '';
                              return label.slice(-1);
                            },
                            showSearch: true,
                          },
                        }),
                      },
                    },
                  },
                },
                columns6: {
                  type: 'void',
                  'x-component': 'ArrayTable.Column',
                  'x-component-props': {
                    title: I18N.Factors.operation,
                    width: 100,
                  },
                  'x-reactions': {
                    dependencies: ['factorWay'],
                    fulfill: {
                      schema: {
                        'x-visible': '{{$deps[0] === "2" }}',
                      },
                    },
                  },
                  properties: {
                    showAdd: renderEmptySchema(
                      { type: 'string' },
                      {
                        showVal: (row, index) => {
                          if (readPretty) {
                            return null;
                          }
                          return row?.showAdd ? (
                            [
                              I18N.eca.perfluorocarbonP,
                              I18N.eca.hydrofluorocarbons,
                              'Hydrofluorocarbons（HFCs）',
                              'Perfluorocarbon（PFCs）',
                            ].indexOf(row.gasType) >= 0 ? (
                              <Button
                                type='link'
                                onClick={() => {
                                  addGasListFn(index || 0, row);
                                }}
                              >
                                {I18N.carbonAccount.add}
                              </Button>
                            ) : (
                              ''
                            )
                          ) : (
                            <Button
                              type='link'
                              onClick={() => {
                                delGasListFn(index || 0, row);
                              }}
                            >
                              {I18N.Factors.delete}
                            </Button>
                          );
                        },
                      },
                    ),
                  },
                },
              },
            },
          }),
          // supplierData: {
          //   type: 'object',
          //   'x-reactions': {
          //     dependencies: ['.factorWay'],
          //     fulfill: {
          //       schema: {
          //         'x-visible': '{{$deps[0] === "3"}}',
          //       },
          //     },
          //   },
          //   properties: {
          //     productName: renderFormItemSchema({
          //       title: I18N.components.purchasingProducts,
          //       type: 'string',
          //       required: false,
          //       'x-component': 'Input',
          //       'x-component-props': {
          //         placeholder: I18N.components.purchasingProducts,
          //       },
          //     }),
          //     factorValue: renderFormItemSchema({
          //       title: I18N.carbonFootPrint.unitProductScheduling2,
          //       type: 'number',
          //       required: false,
          //       'x-component': 'Input',
          //       'x-component-props': {
          //         placeholder: I18N.carbonFootPrint.unitProductScheduling2,
          //       },
          //     }),
          //     factorUnit: {
          //       type: 'void',
          //       title: I18N.Factors.unit,
          //       'x-decorator': 'FormItem',
          //       'x-component': 'FormGrid',
          //       properties: {
          //         factorUnitZ: renderFormItemSchema({
          //           validateTitle: I18N.Factors.molecularUnit,
          //           'x-component': 'Select',
          //           'x-component-props': {
          //             placeholder: I18N.Factors.molecularUnit,
          //           },
          //           'x-decorator-props': {
          //             addonAfter: '/',
          //           },
          //         }),
          //         factorUnitM: renderFormItemSchema({
          //           validateTitle: I18N.Factors.denominatorUnit,
          //           'x-component': 'Cascader',
          //           'x-component-props': {
          //             placeholder: I18N.Factors.denominatorUnit,
          //           },
          //         }),
          //       },
          //     },
          //   },
          // },
        },
      },
    },
  );
};

export const factorBaseSchema = () =>
  renderSchemaWithLayout(
    {},
    {
      grid: {
        ...renderFromGridSchema(),
        properties: {
          unitConver: renderFormItemSchema({
            title: I18N.components.unitConversionRatio4,
            type: 'string',
            'x-validator': RegNumberFive,
            'x-component': 'NumberPicker',
            'x-component-props': {
              min: '0.0000000001',
              max: '99999999999.9999999999',
            },
          }),
          factorType: renderFormItemSchema({
            title: I18N.components.emissionFactors3,
            type: 'string',
            'x-component': 'Select',
            'x-component-props': {
              allowClear: true,
            },
          }),
          factorScore: renderFormItemSchema({
            title: I18N.supplyChainCarbonManagement.emissionFactorAssessment,
            type: 'string',
            'x-component': 'Input',
            'x-component-props': {
              disabled: true,
            },
          }),
          factorSource: renderFormItemSchema({
            title: I18N.eca.emissionFactors,
            type: 'string',
            'x-component': 'Input',
            'x-component-props': {
              maxLength: InputTextLength100,
            },
          }),
          factorSourceEn: renderFormItemSchema({
            title: I18N.eca.emissionFactors2,
            type: 'string',
            'x-component': 'Input',
            'x-component-props': {
              maxLength: InputTextLength100,
            },
          }),
          year: renderFormItemSchema({
            title: I18N.Factors.yearOfPublication,
            type: 'string',
            'x-component': 'Select',
          }),
        },
      },
    },
  );
