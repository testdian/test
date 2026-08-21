import I18N from '@src/lang/I18N';

import {
  renderFormItemSchema,
  renderSchemaWithLayout,
  renderFromGridSchema,
} from '@/components/formily/utils';
import {
  RegAccountValue,
  RegAccountUnitValue,
  RegFactorValue,
} from '@/views/components/utils';

/** 基本信息schema */
export const basicSchema = () =>
  renderSchemaWithLayout(
    {},
    {
      grid: {
        ...renderFromGridSchema({
          'x-component-props': {
            maxColumns: 3,
            minColumns: 1,
            columnGap: 35,
          },
        }),
        properties: {
          materialsType: renderFormItemSchema({
            title: I18N.carbonFootPrintLCA.type,
            type: 'string',
            'x-component': 'Select',
          }),
          materialsTypeFormula: renderFormItemSchema({
            title: I18N.carbonFootPrintLCA.calculationMethod,
            type: 'number',
            'x-component': 'Radio.Group',
            enum: [
              { label: I18N.components.productByMileage, value: 1 },
              { label: I18N.components.loadCapacityBasedOnMileage, value: 2 },
              {
                label: I18N.carbonFootPrintLCA.accordingToEnergyConsumption,
                value: 3,
              },
            ],
            default: 1,
            'x-reactions': [
              {
                dependencies: ['materialsType'],
                fulfill: {
                  schema: {
                    'x-visible': I18N.components.depsOperation,
                  },
                },
              },
            ],
          }),
          materialName: renderFormItemSchema({
            title: I18N.eca.name,
            type: 'string',
            'x-component': 'Input',
            'x-component-props': {
              maxLength: 100,
            },
          }),
          quantity: {
            type: 'void',
            title: I18N.carbonFootPrintLCA.quantity,
            'x-decorator': 'FormItem',
            'x-component': 'FormGrid',
            'x-reactions': [
              {
                fulfill: {
                  schema: {
                    'x-decorator-props': {
                      asterisk: `{{!$form.readPretty}}`,
                    },
                  },
                },
              },
              {
                dependencies: ['materialsTypeFormula'],
                fulfill: {
                  schema: {
                    'x-visible': '{{![1, 2].includes($deps[0])}}',
                  },
                },
              },
            ],

            properties: {
              weight: renderFormItemSchema({
                validateTitle: I18N.carbonFootPrintLCA.quantity,
                type: 'number',
                'x-component': 'NumberPicker',
                'x-validator': (value: number) => RegAccountValue(value),
              }),
              maMeasure: renderFormItemSchema({
                validateTitle: I18N.Factors.unit,
                'x-component': 'Cascader',
                'x-component-props': {
                  placeholder: I18N.carbonFootPrint.pleaseSelectAUnit,
                  showSearch: true,
                },
              }),
            },
          },
          productWeight: {
            type: 'void',
            title: I18N.components.productWeight,
            required: true,
            'x-decorator': 'FormItem',
            'x-component': 'FormGrid',
            'x-reactions': [
              {
                fulfill: {
                  schema: {
                    'x-decorator-props': {
                      asterisk: `{{!$form.readPretty}}`,
                    },
                  },
                },
              },
              {
                dependencies: ['materialsTypeFormula'],
                fulfill: {
                  schema: {
                    'x-visible': '{{$deps[0] === 1}}',
                  },
                },
              },
            ],
            properties: {
              weight2: renderFormItemSchema({
                validateTitle: I18N.carbonFootPrintLCA.quantity,
                type: 'number',
                'x-component': 'NumberPicker',
                'x-validator': (value: number) => RegAccountValue(value),
              }),
              maMeasure2: renderFormItemSchema({
                validateTitle: I18N.carbonFootPrintLCA.quantityUnit,
                'x-component': 'Select',
                'x-component-props': {
                  placeholder: I18N.carbonFootPrint.pleaseSelectAUnit,
                },
                enum: [
                  { label: 't', value: 't' },
                  { label: 'kg', value: 'kg' },
                  { label: 'g', value: 'g' },
                ],
              }),
            },
          },
          weight3: renderFormItemSchema({
            title: I18N.components.loadRatio,
            type: 'number',
            'x-component': 'Input',
            'x-validator': (value: number) => RegAccountValue(value),
            'x-reactions': {
              dependencies: ['materialsTypeFormula'],
              fulfill: {
                schema: {
                  'x-visible': '{{$deps[0] === 2}}',
                },
              },
            },
          }),
          distance: renderFormItemSchema({
            title: I18N.components.transportationMileage,
            type: 'number',
            'x-component': 'Input',
            'x-validator': (value: number) => RegAccountValue(value),
            'x-reactions': {
              dependencies: ['materialsTypeFormula'],
              fulfill: {
                schema: {
                  'x-visible': '{{[1, 2].includes($deps[0])}}',
                },
              },
            },
          }),
        },
      },
    },
  );

/** 排放数据选择schema */
export const emissionTypeSchema = (isDetail: boolean) => ({
  type: 'void',
  properties: {
    factorType: {
      type: 'number',
      enum: [
        {
          value: 0,
          label: I18N.Factors.emissionFactors,
        },
        {
          value: 1,
          label: I18N.components.newFactor,
        },
        {
          value: 2,
          label: I18N.components.supplierData,
        },
      ],
      default: 0,
      'x-reactions': {
        target:
          'factorInfoObj.*(factorName,factorValue,factorUnit,factorSource,factorYear)',
        when: '{{ $self.value !== 1}}',
        fulfill: {
          state: {
            disabled: true,
            required: false,
          },
        },
        otherwise: {
          state: {
            disabled: !!isDetail,
            required: true,
          },
        },
      },
      'x-component': 'SelectButton',
    },
  },
});

/** 排放数据schema （自建因子\新建因子\供应商数据） */
export const emissionDataSchema = () =>
  renderSchemaWithLayout(
    {},
    {
      grid: {
        ...renderFromGridSchema({
          'x-component-props': {
            maxColumns: 3,
            minColumns: 1,
          },
        }),
        properties: {
          factorInfoObj: {
            type: 'object',
            properties: {
              factorName: renderFormItemSchema({
                title: I18N.components.emissionFactorName,
                type: 'string',
                'x-component': 'Input',
                'x-component-props': {
                  maxLength: 100,
                },
              }),
              factorValue: renderFormItemSchema({
                title: I18N.components.numberOfEmissionFactors,
                type: 'number',
                'x-component': 'Input',
                'x-validator': (value: number) => RegFactorValue(value),
              }),
              factorUnit: {
                type: 'void',
                title: I18N.components.emissionFactorSheet,
                'x-decorator': 'FormItem',
                'x-component': 'FormGrid',
                'x-reactions': [
                  {
                    dependencies: ['factorType'],
                    fulfill: {
                      schema: {
                        'x-decorator-props': {
                          asterisk:
                            '{{$deps[0] === 1}}' || `{{!$form.readPretty}}`,
                        },
                      },
                    },
                  },
                ],
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
                      showSearch: true,
                    },
                  }),
                },
              },
              percentMeasure: renderFormItemSchema({
                title: I18N.components.unitConversionRatio2,
                type: 'number',
                'x-component': 'NumberPicker',
                'x-validator': (value: number) => RegAccountUnitValue(value),
              }),
              factorSource: renderFormItemSchema({
                title: I18N.components.emissionFactors,
                type: 'string',
                'x-component': 'Input',
                'x-component-props': {
                  maxLength: 10,
                },
              }),
              factorYear: renderFormItemSchema({
                title: I18N.Factors.yearOfPublication,
                'x-component': 'Select',
              }),
            },
          },
        },
      },
    },
  );
