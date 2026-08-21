/*
 * @@description:
 * @Author: qifeng qifeng@carbonstop.net
 * @Date: 2023-01-16 09:48:53
 * @LastEditors: liuxinxin xinxin@carbonstop.net
 * @LastEditTime: 2023-06-19 18:39:13
 */
import { Select } from '@formily/antd-v5';
import { ISchema } from '@formily/react';
import I18N from '@src/lang/I18N';
import { TreeProps } from 'antd';
import { DefaultOptionType } from 'antd/lib/select';
import { TreeNodeNormal } from 'antd/lib/tree/Tree';

import {
  renderFormItemSchema,
  renderEmptySchema,
  switchComponents,
} from '@/components/formily/utils';
import { HasSubCategoryGas } from '@/views/Factors/Info/utils/schemas';
import { publishYear } from '@/views/Factors/utils';
import {
  InputTextLength100,
  InputTextLength20,
  InputTextLength50,
  RegNumAndLetters,
  RegNumberFive,
  RegNumberThree,
} from '@/views/eca/util/type';

export type CheckInfo<T extends TreeNodeNormal = any> = Parameters<
  NonNullable<TreeProps<T>['onCheck']>
>[1];

export const baseSchema = (): ISchema => {
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
            type: 'void',
            'x-component': 'FormGrid',
            'x-component-props': {
              rowGap: 2,
              columnGap: 24,
              maxColumns: 3,
              minColumns: 1,
            },
            properties: {
              sourceName: {
                type: 'string',
                title: I18N.eca.emissionSourceName,
                'x-validator': [
                  {
                    required: true,
                    message:
                      I18N.supplyChainCarbonManagement.pleaseEnterEmissions3,
                  },
                ],
                'x-decorator': 'FormItem',
                'x-component': 'Input',
                'x-component-props': {
                  placeholder: I18N.base.pleaseEnter,
                  maxLength: InputTextLength50,
                },
              },
              sourceCode: {
                type: 'string',
                title: I18N.eca.emissionSourceId,
                'x-validator': [
                  {
                    required: true,
                    message:
                      I18N.supplyChainCarbonManagement.pleaseEnterEmissions2,
                  },
                  RegNumAndLetters,
                ],
                'x-decorator': 'FormItem',
                'x-component': 'Input',
                'x-component-props': {
                  placeholder: I18N.base.pleaseEnter,
                  maxLength: InputTextLength20,
                },
              },
              facility: {
                type: 'string',
                title: I18N.eca.emissionFacilityActivity,
                'x-validator': [
                  {
                    required: true,
                    message:
                      I18N.supplyChainCarbonManagement.pleaseEnterEmissions,
                  },
                ],
                'x-decorator': 'FormItem',
                'x-component': 'Input',
                'x-component-props': {
                  placeholder: I18N.base.pleaseEnter,
                  maxLength: InputTextLength100,
                },
              },
              ghgCategory: {
                type: 'string',
                title: I18N.eca.ghgClassification,
                'x-validator': [
                  {
                    required: true,
                    message: I18N.supplyChainCarbonManagement.pleaseSelectGh2,
                  },
                ],
                'x-decorator': 'FormItem',
                'x-component': 'Select',
                'x-component-props': {
                  placeholder: I18N.base.pleaseEnter,
                },
              },
              ghgClassify: {
                type: 'string',
                title: I18N.components.ghgCategories,
                'x-validator': [
                  {
                    required: true,
                    message: I18N.supplyChainCarbonManagement.pleaseSelectGh,
                  },
                ],
                'x-decorator': 'FormItem',
                'x-component': 'Select',
                'x-decorator-props': {
                  gridSpan: 2,
                },
                'x-component-props': {
                  placeholder: I18N.Factors.pleaseSelect,
                  style: {
                    width: '50%',
                  },
                },
              },
              isoCategory: {
                type: 'string',
                title: I18N.eca.isoClassification,
                'x-validator': [
                  {
                    required: true,
                    message: I18N.supplyChainCarbonManagement.pleaseSelectIs2,
                  },
                ],
                'x-decorator': 'FormItem',
                'x-component': 'Select',
                'x-component-props': {
                  placeholder: I18N.Factors.pleaseSelect,
                },
              },
              isoClassify: {
                type: 'string',
                title: I18N.components.isoCategory,
                'x-validator': [
                  {
                    required: true,
                    message: I18N.supplyChainCarbonManagement.pleaseSelectIs,
                  },
                ],
                'x-decorator': 'FormItem',
                'x-component': 'Select',
                'x-component-props': {
                  placeholder: I18N.Factors.pleaseSelect,
                },
              },
            },
          },
        },
      },
    },
  };
};
export const activityFormSchema = (): ISchema => {
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
            type: 'void',
            'x-component': 'FormGrid',
            'x-component-props': {
              rowGap: 2,
              columnGap: 24,
              maxColumns: 3,
              minColumns: 1,
            },
            properties: {
              dataValue: {
                type: 'string',
                title: I18N.eca.activityData,
                'x-validator': [
                  {
                    required: true,
                    message:
                      I18N.supplyChainCarbonManagement.pleaseEnterTheActivity3,
                  },
                ],
                'x-decorator': 'FormItem',
                'x-component': 'Input',
              },
              activityUnit: {
                type: 'string',
                title: I18N.eca.activityDataSheet,
                'x-validator': [
                  {
                    required: true,
                    message:
                      I18N.supplyChainCarbonManagement.pleaseSelectAnActivity2,
                  },
                ],
                'x-decorator': 'FormItem',
                'x-component': 'Cascader',
                'x-component-props': {
                  placeholder: I18N.Factors.pleaseSelect,
                  displayRender: (label: string[]) => {
                    if (!label) return '';
                    return label.slice(-1);
                  },
                  showSearch: (inputValue: string, path: DefaultOptionType[]) =>
                    path.some(
                      option =>
                        (option.label as string)
                          .toLowerCase()
                          .indexOf(inputValue.toLowerCase()) > -1,
                    ),
                },
              },
              activityRecordWay: {
                type: 'string',
                title: I18N.components.activityDataRecording,
                'x-validator': [
                  {
                    required: true,
                    message:
                      I18N.supplyChainCarbonManagement.pleaseEnterTheActivity2,
                  },
                ],
                'x-decorator': 'FormItem',
                'x-component': 'Input',
                'x-component-props': {
                  placeholder: I18N.base.pleaseEnter,
                  maxLength: InputTextLength50,
                },
              },
              activityDept: {
                type: 'string',
                title: I18N.components.activityDataProtection,
                'x-validator': [
                  {
                    required: true,
                    message:
                      I18N.supplyChainCarbonManagement.pleaseEnterTheActivity,
                  },
                ],
                'x-decorator': 'FormItem',
                'x-component': 'Input',
                'x-component-props': {
                  placeholder: I18N.base.pleaseEnter,
                  maxLength: InputTextLength50,
                },
              },
              activityCategory: {
                type: 'string',
                title: I18N.components.activityDataClass,
                'x-validator': [
                  {
                    required: true,
                    message:
                      I18N.supplyChainCarbonManagement.pleaseSelectAnActivity,
                  },
                ],
                'x-decorator': 'FormItem',
                'x-component': 'Select',
                'x-component-props': {
                  placeholder: I18N.supplyChainCarbonManagement.pleaseSelect,
                },
              },
              activityScore: {
                type: 'string',
                title: I18N.supplyChainCarbonManagement.activityDataReview,
                'x-decorator': 'FormItem',
                'x-component': 'Input',
                'x-component-props': {
                  placeholder:
                    I18N.supplyChainCarbonManagement.activityDataReview,
                  disabled: true,
                },
              },
            },
          },
        },
      },
    },
  };
};
export const factorSchema = (
  // isPageDetail: boolean,
  gwpObj?: { [key: string | number]: number },
): ISchema => {
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
            type: 'void',
            'x-component': 'FormGrid',
            'x-component-props': {
              rowGap: 2,
              columnGap: 24,
              maxColumns: 1,
              minColumns: 1,
            },
            properties: {
              factorWay: {
                type: 'string',
                enum: [
                  {
                    label: I18N.Factors.emissionFactors,
                    value: '1',
                  },
                  {
                    label: I18N.components.newFactor,
                    value: '2',
                  },
                  {
                    label: I18N.components.supplierData,
                    value: '3',
                  },
                ],
                default: '1',
                'x-decorator': 'FormItem',
                'x-component': 'SelectButton',
                'x-decorator-props': {
                  gridSpan: 3,
                },
                'x-reactions': {
                  target:
                    '*(gasList,supplierData,factorScore,factorScore,year,factorSource)',
                  when: `{{$self.value !== '2'}}`,
                  fulfill: {
                    state: {
                      disabled: true,
                      required: false,
                    },
                  },
                  otherwise: {
                    state: {
                      disabled: true,
                      required: true,
                    },
                  },
                },
              },
              gasList: {
                title: I18N.components.emissionFactors2,
                type: 'array',
                'x-component': 'ArrayTable',
                'x-decorator-props': {
                  gridSpan: 3,
                },
                'x-decorator': 'FormItem',
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
                        onCell: (row: any) => {
                          return {
                            colSpan: row?.gasType?.includes('CO₂e') ? 2 : 1,
                          };
                        },
                      },
                      properties: {
                        gasType: renderEmptySchema(
                          { type: 'string' },
                          {
                            showVal: row => {
                              if (
                                row?.gasType === I18N.Factors.carbonDioxideWhen2
                              ) {
                                return (
                                  <>
                                    {window.location.pathname.indexOf(
                                      'show',
                                    ) === -1 && (
                                      <span className='ant-formily-item-asterisk'>
                                        *
                                      </span>
                                    )}
                                    {row?.gasType}
                                  </>
                                );
                              }
                              return row?.gasType;
                            },
                          },
                        ),
                      },
                    },
                    columns2: {
                      type: 'void',
                      'x-component': 'ArrayTable.Column',
                      'x-component-props': {
                        title: I18N.Factors.greenhouseGases,
                        onCell: (row: any) => {
                          return {
                            colSpan: row?.gasType?.includes('CO₂e') ? 0 : 1,
                          };
                        },
                        disabled: true,
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
                                  row?.gasType?.includes?.(g),
                                )
                              ) {
                                return (
                                  <Select
                                    {...props}
                                    placeholder={I18N.Factors.pleaseSelect}
                                    options={props.dataSource}
                                  />
                                );
                              }
                              // @ts-ignore
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
                          'x-component': 'NumberPicker',
                          'x-validator': [...RegNumberThree],

                          'x-component-props': {
                            min: 0,
                            style: { with: '100%' },
                          },
                          'x-reactions': [
                            {
                              when: `{{ $self.form.getValuesIn($self.path.toString().replace('factorValue', 'gasType')).includes('CO₂e')}}`,
                              otherwise: {
                                state: {
                                  required: false,
                                },
                              },
                            },
                          ],
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
                              'x-component': 'Select',
                              'x-component-props': {
                                placeholder: I18N.Factors.molecularUnit,
                              },
                              'x-decorator-props': {
                                addonAfter: '/',
                              },
                              'x-reactions': [
                                {
                                  when: `{{ $self.form.getValuesIn($self.path.toString().replace('factorUnitZ', 'gasType')).includes('CO₂e')}}`,
                                  otherwise: {
                                    state: {
                                      required: false,
                                    },
                                  },
                                },
                              ],
                            }),
                            factorUnitM: renderFormItemSchema({
                              validateTitle: I18N.Factors.denominatorUnit,
                              'x-component': 'Cascader',
                              'x-component-props': {
                                placeholder: I18N.Factors.denominatorUnit,
                              },
                            }),
                          },
                        },
                      },
                    },
                    columns5: {
                      type: 'void',
                      'x-component': 'ArrayTable.Column',
                      'x-component-props': {
                        title: 'GWP',
                        visible: false,
                        hidden: true,
                      },
                      properties: {
                        gwp: renderEmptySchema(
                          { type: 'string' },
                          {
                            showVal: row => {
                              return (
                                `${(gwpObj && gwpObj[row?.gas]) || '-'}` || '-'
                              );
                            },
                          },
                        ),
                      },
                    },
                  },
                },
              },
              supplierData: {
                type: 'object',
                'x-reactions': {
                  dependencies: ['.factorWay'],
                  fulfill: {
                    schema: {
                      'x-visible': '{{$deps[0] === "3"}}',
                    },
                  },
                },
                properties: {
                  productName: renderFormItemSchema({
                    title: I18N.components.purchasingProducts,
                    type: 'string',
                    required: false,
                    'x-component': 'Input',
                    'x-component-props': {
                      placeholder: I18N.components.purchasingProducts,
                    },
                  }),
                  factorValue: renderFormItemSchema({
                    title: I18N.carbonFootPrint.unitProductScheduling2,
                    type: 'number',
                    required: false,
                    'x-component': 'Input',
                    'x-component-props': {
                      placeholder: I18N.carbonFootPrint.unitProductScheduling2,
                    },
                  }),
                  factorUnit: {
                    type: 'void',
                    title: I18N.Factors.unit,
                    'x-decorator': 'FormItem',
                    'x-component': 'FormGrid',
                    properties: {
                      factorUnitZ: renderFormItemSchema({
                        validateTitle: I18N.Factors.molecularUnit,
                        'x-component': 'Select',
                        'x-component-props': {
                          placeholder: I18N.Factors.molecularUnit,
                        },
                        'x-decorator-props': {
                          addonAfter: '/',
                        },
                      }),
                      factorUnitM: renderFormItemSchema({
                        validateTitle: I18N.Factors.denominatorUnit,
                        'x-component': 'Cascader',
                        'x-component-props': {
                          placeholder: I18N.Factors.denominatorUnit,
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
export const factorBaseSchema = (): ISchema => {
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
            type: 'void',
            'x-component': 'FormGrid',
            'x-component-props': {
              rowGap: 2,
              columnGap: 24,
              maxColumns: 3,
              minColumns: 1,
            },
            properties: {
              unitConver: {
                type: 'string',
                title: I18N.components.unitConversionRatio4,
                'x-validator': [
                  {
                    required: true,
                    message:
                      I18N.supplyChainCarbonManagement.pleaseEnterTheUnit,
                  },
                  ...RegNumberFive,
                ],
                'x-decorator': 'FormItem',
                'x-component': 'NumberPicker',
                'x-component-props': {
                  placeholder:
                    I18N.supplyChainCarbonManagement.unitConversionRatio,
                },
              },
              factorType: {
                type: 'string',
                title: I18N.components.emissionFactors3,
                'x-validator': [
                  {
                    required: true,
                    message:
                      I18N.supplyChainCarbonManagement.pleaseSelectEmissions,
                  },
                ],
                'x-decorator': 'FormItem',
                'x-component': 'Select',
                'x-component-props': {
                  placeholder: I18N.Factors.pleaseSelect,
                },
              },
              factorScore: {
                type: 'string',
                title:
                  I18N.supplyChainCarbonManagement.emissionFactorAssessment,
                'x-decorator': 'FormItem',
                'x-component': 'Input',
                'x-component-props': {
                  placeholder:
                    I18N.supplyChainCarbonManagement.emissionFactorAssessment,
                  disabled: true,
                },
              },
              GWP: {
                type: 'void',
                title: I18N.supplyChainCarbonManagement.gwpVersion,
                'x-decorator': 'FormItem',
                'x-component': 'CousInputText',
                'x-component-props': {
                  placeholder: I18N.supplyChainCarbonManagement.gwpVersion,
                  disabled: true,
                  initialValue: I18N.supplyChainCarbonManagement.ipccSection,
                },
                'x-reactions': {
                  dependencies: ['.factorWay'],
                  fulfill: {
                    schema: {
                      'x-visible': '{{$deps[0] !== "3"}}',
                    },
                  },
                },
              },
              factorSource: {
                type: 'string',
                title: I18N.components.emissionFactors,
                'x-decorator': 'FormItem',
                'x-component': 'Input',
                'x-component-props': {
                  placeholder: I18N.base.pleaseEnter,
                  maxLength: InputTextLength100,
                },
              },
              year: {
                type: 'string',
                title: I18N.Factors.yearOfPublication,
                'x-decorator': 'FormItem',
                'x-component': 'Select',
                enum: publishYear(),
                'x-component-props': {
                  placeholder: I18N.Factors.pleaseSelect,
                  picker: 'year',
                },
              },
            },
          },
        },
      },
    },
  };
};
