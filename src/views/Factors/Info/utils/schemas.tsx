/*
 * @@description:
 */
import { Select } from '@formily/antd-v5';
import I18N from '@src/lang/I18N';
import { DefaultOptionType } from 'antd/lib/select';

import {
  renderFormItemSchema,
  renderSchemaWithLayout,
  renderFromGridSchema,
  renderEmptySchema,
  switchComponents,
} from '@/components/formily/utils';
import { PageTypeInfo } from '@/router/utils/enums';
// import { formatNumber } from '@/utils';
import { RegNumberThree } from '@/views/eca/util/type';

// import style from '../index.module.less';

export const baseScheme = () =>
  renderSchemaWithLayout(
    {},
    {
      grid: {
        ...renderFromGridSchema(),

        properties: {
          name: renderFormItemSchema({
            title: '名称',
            'x-component': 'Input',
            'x-component-props': {
              maxLength: 200,
            },
          }),
          // nameEn: renderFormItemSchema({
          //   title: I18N.Factors.nameInEnglish,
          //   'x-component': 'Input',
          //   'x-component-props': {
          //     maxLength: 200,
          //   },
          // }),
          // empty4: renderEmptySchema(),
          firstClassify: renderFormItemSchema({
            title: I18N.Factors.firstLevelClassification,
            required: false,
            'x-component': 'Select',
            'x-component-props': {
              allowClear: true,
              showSearch: true,
              filterOption: (input: string, option: any) =>
                (option?.label ?? '')
                  .toLowerCase()
                  .includes(input.toLowerCase()),
            },
          }),
          secondClassify: renderFormItemSchema({
            title: I18N.Factors.secondaryClassification,
            required: false,
            'x-component': 'Select',
            'x-component-props': {
              allowClear: true,
              showSearch: true,
              filterOption: (input: string, option: any) =>
                (option?.label ?? '')
                  .toLowerCase()
                  .includes(input.toLowerCase()),
            },
          }),
          sourceLanguage: renderFormItemSchema({
            // 源语言。字典值 1中文 2英语 3法语 4德语
            title: I18N.Factors.sourceLanguage,
            required: false,
            'x-component': 'Select',
          }),
          // empty3: renderEmptySchema(),
          sourceLanguageName: renderFormItemSchema({
            title: I18N.Factors.nameSourceLanguage3,
            required: false,
            'x-component': 'Input',
            'x-component-props': {
              maxLength: 200,
            },
          }),
          sourceLanguageNameEn: renderFormItemSchema({
            title: I18N.Factors.nameSourceLanguage2,
            required: false,
            'x-component': 'Input',
            'x-component-props': {
              maxLength: 200,
            },
          }),
          // empty: renderEmptySchema(),
          // empty1: renderEmptySchema(),
          // empty2: renderEmptySchema(),
          description: renderFormItemSchema({
            title: '适用场景',
            'x-component': 'Input.TextArea',
            required: false,
            'x-decorator-props': {
              gridSpan: 2,
            },
            'x-component-props': {
              maxLength: 500,
            },
          }),
          // descriptionEn: renderFormItemSchema({
          //   title: I18N.Factors.applicableFieldJingying,
          //   'x-component': 'Input.TextArea',
          //   required: false,
          //   'x-decorator-props': {
          //     gridSpan: 1.5,
          //   },
          //   'x-component-props': {
          //     maxLength: 500,
          //   },
          // }),
        },
      },
    },
  );

export const sourceSchema = () =>
  renderSchemaWithLayout(
    {},
    {
      grid: {
        ...renderFromGridSchema(),
        properties: {
          institution: renderFormItemSchema({
            title: '发布机构',
            'x-component': 'Input',
            'x-component-props': {
              maxLength: 100,
            },
          }),
          // institutionEn: renderFormItemSchema({
          //   title: I18N.Factors.publishingInstitutionEnglish,
          //   'x-component': 'Input',
          //   'x-component-props': {
          //     maxLength: 100,
          //   },
          // }),
          year: renderFormItemSchema({
            title: I18N.Factors.yearOfPublication,
            'x-component': 'Select',
          }),
          sourceLevel: renderFormItemSchema({
            // 来源类别-字典
            title: I18N.Factors.sourceCategory,
            'x-component': 'Select',
          }),
          source: renderFormItemSchema({
            title: I18N.Factors.sourceFiles,
            required: false,
            'x-component': 'Input',
            'x-component-props': {
              maxLength: 200,
            },
          }),
          url: renderFormItemSchema({
            title: I18N.Factors.websiteLink,
            required: false,
            'x-component': 'Input',
            'x-decorator-props': {
              gridSpan: 2,
            },
            'x-component-props': {
              maxLength: 500,
            },
          }),
          areaRepresent: renderFormItemSchema({
            title: I18N.Factors.geographicalRepresentativeness,
            required: false,
            'x-component': 'Input',
            'x-component-props': {
              maxLength: 100,
            },
          }),
        },
      },
    },
  );
export enum HasSubCategoryGas {
  'HFCs' = 'HFCs',
  'PFCs' = 'PFCs',
}
export type TableSchemaProps = Record<HasSubCategoryGas, DefaultOptionType[]>;

export const tableSchema = (pageTypeInfo?: PageTypeInfo) => {
  return renderSchemaWithLayout(
    {},
    {
      gasList: {
        type: 'array',
        'x-component': 'ArrayTable',
        'x-decorator': 'FormItem',
        'x-component-props': {
          pagination: false,
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
                      if (row?.gasType === I18N.Factors.carbonDioxideWhen2) {
                        return (
                          <>
                            {window.location.pathname.indexOf('show') ===
                              -1 && (
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
                    stringMode: true,
                    formatter: (v: string | number) => `${v}`,
                    precision: 10,
                    max: '99999999.9999999999',
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
                      'x-component':
                        pageTypeInfo === PageTypeInfo.show
                          ? 'Input'
                          : 'Cascader',
                      'x-component-props': {
                        placeholder: I18N.Factors.denominatorUnit,
                        displayRender: (label: string[]) => {
                          if (!label) return '';
                          return label.slice(-1);
                        },
                        showSearch: (
                          inputValue: string,
                          path: DefaultOptionType[],
                        ) =>
                          path.some(
                            option =>
                              (option.label as string)
                                .toLowerCase()
                                .indexOf(inputValue.toLowerCase()) > -1,
                          ),
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
  );
};
