import { ISchema } from '@formily/react';
import I18N from '@src/lang/I18N';
import { TreeProps } from 'antd';
// import locale from 'antd/es/date-picker/locale/en_US';
import { DefaultOptionType } from 'antd/lib/select';
import { TreeNodeNormal } from 'antd/lib/tree/Tree';
import dayjs from 'dayjs';

import { renderEmptySchema } from '@/components/formily/utils';
// import 'dayjs/locale/zh-cn';

import {
  InputTextLength100,
  InputTextLength200,
  InputTextLength50,
  TextAreaMaxLength1000,
  TextAreaMaxLength500,
  TextAreaMaxLength5000,
} from '../../util/type';

export type CheckInfo<T extends TreeNodeNormal = any> = Parameters<
  NonNullable<TreeProps<T>['onCheck']>
>[1];

export const schema = (): ISchema => {
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
              orgId: {
                type: 'string',
                title: I18N.carbonData.affiliatedOrganization,
                'x-validator': [
                  {
                    required: true,
                    message: I18N.eca.pleaseSelectTheAffiliation,
                  },
                ],
                'x-decorator': 'FormItem',
                'x-component': 'Select',
                'x-component-props': {
                  placeholder: I18N.Factors.pleaseSelect,
                  filterOption: (input: string, option: any) =>
                    (option?.label ?? '').includes(input),
                  showSearch: true,
                },
              },
              version: {
                type: 'string',
                title: I18N.eca.versionNumber,
                'x-validator': [
                  { required: true, message: I18N.eca.pleaseEnterTheVersion },
                ],
                'x-decorator': 'FormItem',
                'x-component': 'Input',
                'x-component-props': {
                  placeholder: I18N.base.pleaseEnter,
                  maxLength: InputTextLength50,
                },
              },
              planDate: {
                type: 'string',
                title: I18N.eca.whenFormulatingRevisions,
                'x-validator': [
                  {
                    required: true,
                    message: I18N.eca.pleaseSelectTheFormulation,
                  },
                ],
                'x-decorator': 'FormItem',
                'x-component': 'DatePicker',
                'x-component-props': {
                  // locale,
                  placeholder: I18N.eca.whenFormulatingRevisions,
                  disabledDate: (current: Date) => {
                    const currentDate = dayjs().format('YYYY-MM-DD');
                    return dayjs(current)?.format('YYYY-MM-DD') > currentDate;
                  },
                },
              },
              planContent: {
                type: 'string',
                title: I18N.eca.withinTheFormulationAndRevision,
                'x-validator': [
                  {
                    required: true,
                    message: I18N.eca.pleaseEnterTheFormulation,
                  },
                ],
                'x-decorator': 'FormItem',
                'x-component': 'TextArea',
                'x-component-props': {
                  placeholder: I18N.eca.withinTheFormulationAndRevision,
                  style: {
                    height: 100,
                    alignItems: 'flex-start',
                  },
                  maxLength: TextAreaMaxLength500,
                },
              },
              remark: {
                type: 'string',
                title: I18N.dashborad.remarks,
                'x-decorator': 'FormItem',
                'x-component': 'TextArea',
                'x-component-props': {
                  placeholder: I18N.base.pleaseEnter,
                  style: {
                    height: 100,
                    alignItems: 'flex-start',
                  },
                  maxLength: TextAreaMaxLength500,
                },
              },
            },
          },
        },
      },
    },
  };
};
/** 产品或服务 */
export const controlSchema = (): ISchema => {
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
              serviceName: {
                type: 'string',
                title: I18N.eca.productsOrServices3,
                'x-validator': [
                  { required: true, message: I18N.eca.pleaseEnterTheProduct },
                ],
                'x-decorator': 'FormItem',
                'x-component': 'Input',
                'x-component-props': {
                  placeholder: I18N.base.pleaseEnter,
                  maxLength: InputTextLength50,
                },
              },

              serviceUnit: {
                type: 'string',
                title: I18N.eca.productsOrServices2,
                'x-validator': [
                  { required: true, message: I18N.eca.pleaseSelectAProduct },
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
              serviceDesc: {
                type: 'string',
                title: I18N.eca.productsOrServices5,
                'x-decorator': 'FormItem',
                'x-component': 'TextArea',
                'x-component-props': {
                  placeholder: I18N.eca.productsOrServices4,
                  maxlength: TextAreaMaxLength500,
                  alignItems: 'flex-start',
                },
              },
            },
          },
        },
      },
    },
  };
};
export const FormOneSchema = (): ISchema => {
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
              maxColumns: 2,
              minColumns: 2,
            },
            properties: {
              orgId: {
                type: 'string',
                title: I18N.carbonData.affiliatedOrganization,
                'x-validator': [
                  {
                    required: true,
                    message: I18N.carbonData.affiliatedOrganization,
                  },
                ],
                'x-decorator': 'FormItem',
                'x-component': 'Select',
                'x-component-props': {
                  disabled: true,
                  placeholder: I18N.Factors.pleaseSelect,
                  style: { width: '50' },
                  showSearch: true,
                  filterOption: (input: string, option: any) =>
                    (option?.label ?? '')
                      .toLowerCase()
                      .includes(input.toLowerCase()),
                },
              },
              version: {
                type: 'string',
                title: I18N.eca.versionNumber,
                'x-validator': [
                  { required: true, message: I18N.eca.versionNumber },
                ],
                'x-decorator': 'FormItem',
                'x-component': 'Input',
                'x-component-props': {
                  placeholder: I18N.base.pleaseEnter,
                  maxLength: InputTextLength50,
                },
              },
              planDate: {
                type: 'string',
                title: I18N.eca.whenFormulatingRevisions,
                'x-validator': [
                  {
                    required: true,
                    message: I18N.eca.whenFormulatingRevisions,
                  },
                ],
                'x-decorator': 'FormItem',
                'x-decorator-props': { gridSpan: 2 },
                'x-component': 'DatePicker',
                'x-component-props': {
                  // locale,
                  placeholder: I18N.eca.whenFormulatingRevisions,
                  style: { width: '50%' },
                  disabledDate: (current: Date) => {
                    const currentDate = dayjs().format('YYYY-MM-DD');
                    return dayjs(current)?.format('YYYY-MM-DD') > currentDate;
                  },
                },
              },
              planContent: {
                type: 'string',
                title: I18N.eca.withinTheFormulationAndRevision,
                'x-validator': [
                  {
                    required: true,
                    message: I18N.eca.withinTheFormulationAndRevision,
                  },
                ],
                'x-decorator': 'FormItem',
                'x-component': 'TextArea',
                'x-decorator-props': { gridSpan: 2 },

                'x-component-props': {
                  placeholder: I18N.eca.withinTheFormulationAndRevision,
                  style: {
                    height: 100,
                    alignItems: 'flex-start',
                  },
                  maxLength: TextAreaMaxLength500,
                },
              },
              remark: {
                type: 'string',
                title: I18N.dashborad.remarks,
                'x-decorator': 'FormItem',
                'x-decorator-props': { gridSpan: 2 },

                'x-component': 'TextArea',
                'x-component-props': {
                  placeholder: I18N.base.pleaseEnter,
                  style: {
                    height: 100,
                    alignItems: 'flex-start',
                  },
                  maxLength: TextAreaMaxLength500,
                },
              },
            },
          },
        },
      },
    },
  };
};
export const FormTwoSchema = (isEdit: boolean): ISchema => {
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
              maxColumns: 2,
              minColumns: 1,
            },
            properties: {
              orgName: {
                type: 'string',
                title: I18N.carbonData.organizationName,
                'x-validator': [
                  {
                    required: true,
                    message: I18N.eca.pleaseSelectAnOrganization3,
                  },
                ],
                'x-decorator': 'FormItem',
                'x-component': 'Select',
                'x-component-props': {
                  placeholder: I18N.Factors.pleaseSelect,
                },
              },
              deptName: {
                type: 'string',
                title: I18N.eca.carbonInventoryDepartment,
                'x-validator': [
                  {
                    required: true,
                    message: I18N.eca.pleaseEnterTheCarbonDisk,
                  },
                ],
                'x-decorator': 'FormItem',
                'x-component': 'Input',
                'x-component-props': {
                  placeholder: I18N.base.pleaseEnter,
                  maxLength: InputTextLength100,
                },
              },
              regCodes: {
                type: 'array',
                title: I18N.eca.registeredAddress,
                'x-validator': [
                  {
                    required: true,
                    message: I18N.eca.pleaseSelectRegistration,
                  },
                ],
                'x-decorator': 'FormItem',
                'x-component': 'Cascader',
                'x-component-props': {
                  placeholder: I18N.Factors.pleaseSelect,
                  fieldNames: {
                    value: 'code',
                    label: 'name',
                    children: 'children',
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
              regArea: {
                type: 'string',
                title: I18N.eca.registeredAddress,
                'x-validator': [
                  {
                    required: true,
                    message: I18N.eca.pleaseSelectRegistration,
                  },
                ],
                'x-decorator': 'FormItem',
                'x-component': 'Input',
              },
              regAddress: {
                type: 'string',
                title: I18N.eca.registeredAddressDetails,
                'x-validator': [
                  { required: true, message: I18N.eca.pleaseEnterRegistration },
                ],
                'x-decorator': 'FormItem',
                'x-component': 'Input',
                'x-component-props': {
                  placeholder: I18N.base.pleaseEnter,
                  maxLength: InputTextLength200,
                },
              },
              produceArea: {
                type: 'string',
                title: I18N.eca.productionAndOperationLocation2,
                'x-validator': [
                  { required: true, message: I18N.eca.pleaseSelectProduction },
                ],
                'x-decorator': 'FormItem',
                'x-component': 'Input',
              },
              produceCodes: {
                type: 'array',
                title: I18N.eca.productionAndOperationLocation2,
                'x-validator': [
                  { required: true, message: I18N.eca.pleaseSelectProduction },
                ],
                'x-decorator': 'FormItem',
                'x-component': 'Cascader',
                'x-component-props': {
                  placeholder: I18N.Factors.pleaseSelect,
                  fieldNames: {
                    value: 'code',
                    label: 'name',
                    children: 'children',
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
              produceAddress: {
                type: 'string',
                title: I18N.eca.productionAndOperationLocation3,
                'x-validator': [
                  { required: true, message: I18N.eca.pleaseEnterProduction },
                ],
                'x-decorator': 'FormItem',
                'x-component': 'Input',
                'x-component-props': {
                  placeholder: I18N.base.pleaseEnter,
                  style: { width: '100%' },
                  maxLength: InputTextLength200,
                },
              },
              empty: renderEmptySchema({
                'x-decorator-props': {
                  gridSpan: 2,
                },
              }),
              intro: {
                type: 'string',
                title: I18N.eca.inTheCompanyProfile,
                'x-validator': [
                  { required: true, message: I18N.eca.pleaseEnterTheCompany },
                ],
                'x-decorator': 'FormItem',
                'x-decorator-props': { gridSpan: 3 },
                'x-component': 'TextArea',
                'x-component-props': {
                  placeholder: I18N.base.pleaseEnter,
                  style: {
                    height: 100,
                    alignItems: 'flex-start',
                  },
                  maxLength: TextAreaMaxLength1000,
                },
              },
              introEn: {
                type: 'string',
                title: I18N.eca.enterpriseSimplifiedEnglish,
                'x-validator': [
                  { required: true, message: I18N.eca.pleaseEnterTheCompany },
                ],
                'x-decorator': 'FormItem',
                'x-decorator-props': { gridSpan: 3 },
                'x-component': 'TextArea',
                'x-component-props': {
                  placeholder: I18N.base.pleaseEnter,
                  style: {
                    height: 100,
                    alignItems: 'flex-start',
                  },
                  maxLength: TextAreaMaxLength1000,
                },
              },
              planeImg: {
                type: 'string',
                title: I18N.eca.organizationalPlanDisplay2,
                'x-decorator': 'FormItem',
                'x-decorator-props': {
                  gridSpan: 2,
                  extra: !window.location.pathname.includes('show')
                    ? isEdit
                      ? I18N.eca.supportedImages2
                      : ''
                    : '',
                },
                'x-component': 'CardUpload',
                'x-component-props': {
                  maxCount: 5,
                  isEdit,
                },
              },
              planeImgDesc: {
                type: 'string',
                title: I18N.eca.organizationalPlanDisplay4,
                'x-decorator': 'FormItem',
                'x-decorator-props': {
                  gridSpan: 2,
                },
                'x-component': 'TextArea',
                'x-component-props': {
                  placeholder: I18N.eca.organizationalPlanDisplay,
                  style: {
                    height: 100,
                    alignItems: 'flex-start',
                  },
                  maxLength: TextAreaMaxLength1000,
                },
              },
              planeImgDescEn: {
                type: 'string',
                title: I18N.eca.organizationalPlanDisplay3,
                'x-decorator': 'FormItem',
                'x-decorator-props': {
                  gridSpan: 2,
                },
                'x-component': 'TextArea',
                'x-component-props': {
                  placeholder: I18N.eca.organizationalPlanDisplay,
                  style: {
                    height: 100,
                    alignItems: 'flex-start',
                  },
                  maxLength: TextAreaMaxLength1000,
                },
              },
              gasGroupImg: {
                type: 'string',
                title: I18N.eca.greenhouseGasPipe2,
                'x-decorator': 'FormItem',
                'x-decorator-props': {
                  gridSpan: 2,
                  extra: !window.location.pathname.includes('show')
                    ? isEdit
                      ? I18N.eca.supportedImages2
                      : ''
                    : '',
                },
                'x-component': 'CardUpload',
                'x-component-props': {
                  maxCount: 5,
                  isEdit,
                },
              },
              gasGroupDesc: {
                type: 'string',
                title: I18N.eca.greenhouseGasPipe4,
                'x-decorator': 'FormItem',
                'x-decorator-props': {
                  gridSpan: 2,
                },
                'x-component': 'TextArea',
                'x-component-props': {
                  placeholder: I18N.eca.greenhouseGasPipe,
                  style: {
                    height: 100,
                    alignItems: 'flex-start',
                  },
                  maxLength: TextAreaMaxLength1000,
                },
              },
              gasGroupDescEn: {
                type: 'string',
                title: I18N.eca.greenhouseGasPipe3,
                'x-decorator': 'FormItem',
                'x-decorator-props': {
                  gridSpan: 2,
                },
                'x-component': 'TextArea',
                'x-component-props': {
                  placeholder: I18N.eca.greenhouseGasPipe,
                  style: {
                    height: 100,
                    alignItems: 'flex-start',
                  },
                  maxLength: TextAreaMaxLength1000,
                },
              },
            },
          },
        },
      },
    },
  };
};
export const FormForeSchema = (): ISchema => {
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
              borderMethod: {
                type: 'string',
                title: I18N.eca.organizationalBoundaryDesign,
                'x-validator': [
                  {
                    required: true,
                    message: I18N.eca.pleaseSelectAnOrganization2,
                  },
                ],
                'x-decorator': 'FormItem',
                'x-component': 'Select',
                'x-component-props': {
                  placeholder: I18N.Factors.pleaseSelect,
                  style: { width: '50%' },
                },
              },
              borderDesc: {
                type: 'string',
                title: I18N.eca.organizationalBoundaryTracing3,
                'x-validator': [
                  {
                    required: true,
                    message: I18N.eca.pleaseEnterTheOrganization,
                  },
                ],
                'x-decorator': 'FormItem',
                'x-component': 'TextArea',
                'x-component-props': {
                  placeholder: I18N.eca.organizationalBoundaryTracing,
                  style: {
                    maxWidth: 800,
                    height: 100,
                    alignItems: 'flex-start',
                  },
                  maxLength: TextAreaMaxLength1000,
                },
              },
              borderDescEn: {
                type: 'string',
                title: I18N.eca.organizationalBoundaryTracing2,
                'x-validator': [
                  {
                    required: true,
                    message: I18N.eca.pleaseEnterTheOrganization,
                  },
                ],
                'x-decorator': 'FormItem',
                'x-component': 'TextArea',
                'x-component-props': {
                  placeholder: I18N.eca.organizationalBoundaryTracing,
                  style: {
                    maxWidth: 800,
                    height: 100,
                    alignItems: 'flex-start',
                  },
                  maxLength: TextAreaMaxLength1000,
                },
              },
              borderChange: {
                type: 'string',
                title: I18N.eca.organizationalBoundaryChange3,
                'x-decorator': 'FormItem',
                'x-component': 'TextArea',
                'x-component-props': {
                  placeholder: I18N.eca.organizationalBoundaryChange,
                  style: {
                    maxWidth: 800,
                    height: 100,
                    alignItems: 'flex-start',
                  },
                  maxLength: TextAreaMaxLength1000,
                },
              },
              borderChangeEn: {
                type: 'string',
                title: I18N.eca.organizationalBoundaryChange2,
                'x-decorator': 'FormItem',
                'x-component': 'TextArea',
                'x-component-props': {
                  placeholder: I18N.eca.organizationalBoundaryChange,
                  style: {
                    maxWidth: 800,
                    height: 100,
                    alignItems: 'flex-start',
                  },
                  maxLength: TextAreaMaxLength1000,
                },
              },
            },
          },
        },
      },
    },
  };
};
export const FormSixSchema = (): ISchema => {
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
              rowGap: 1,
              columnGap: 24,
              maxColumns: 1,
              minColumns: 1,
            },
            properties: {
              dataQuality: {
                type: 'string',
                title: I18N.eca.dataQualityManagement,
                'x-validator': [
                  {
                    required: true,
                    message: I18N.eca.pleaseEnterData3,
                  },
                  (value: string) => {
                    if (value?.length >= TextAreaMaxLength5000) {
                      return I18N.eca.dataQualityManagement2;
                    }
                    return null;
                  },
                ],
                'x-decorator': 'FormItem',
                'x-component': 'TextArea',
                'x-component-props': {
                  placeholder: I18N.eca.internalQualityOfData,
                  style: {
                    width: '100%',
                    height: '400px',
                    alignItems: 'flex-start',
                  },
                  maxLengt: TextAreaMaxLength5000,
                  // showCount: true,
                },
              },
            },
          },
        },
      },
    },
  };
};
export const ControlDetailSchema = (): ISchema => {
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
              rowGap: 1,
              columnGap: 24,
              maxColumns: 2,
              minColumns: 2,
            },
            properties: {
              ghgCategory_name: {
                type: 'string',
                title: I18N.eca.emissionClassificationG,
                'x-decorator': 'FormItem',
                'x-component': 'Input',
                'x-component-props': {
                  placeholder: I18N.eca.emissionClassificationG,
                  disabled: true,
                },
              },
              isoCategory_name: {
                type: 'string',
                title: I18N.eca.emissionClassificationI,
                'x-decorator': 'FormItem',
                'x-component': 'Input',
                'x-component-props': {
                  placeholder: I18N.eca.emissionClassificationI,
                  disabled: true,
                },
              },
              ghgClassify_name: {
                type: 'string',
                title: I18N.eca.emissionCategoryG,
                'x-decorator': 'FormItem',
                'x-component': 'Input',
                'x-component-props': {
                  placeholder: I18N.eca.emissionCategoryG,
                  disabled: true,
                },
              },
              isoClassify_name: {
                type: 'string',
                title: I18N.eca.emissionCategoryI,
                'x-decorator': 'FormItem',
                'x-component': 'Input',
                'x-component-props': {
                  placeholder: I18N.eca.emissionCategoryI,
                  disabled: true,
                },
              },
              categoryDesc: {
                type: 'string',
                title: I18N.eca.categoryDescription2,
                'x-decorator': 'FormItem',
                'x-decorator-props': {
                  gridSpan: 2,
                },
                'x-component': 'TextArea',
                'x-component-props': {
                  placeholder: I18N.eca.categoryDescription2,
                  disabled: true,
                  style: { height: '200px', alignItems: 'flex-start' },
                },
              },

              computationFlag: {
                required: true,
                type: 'boolean',
                title: I18N.eca.whetherToIncludeCarbon,
                'x-decorator': 'FormItem',
                'x-validator': [
                  { required: true, message: I18N.eca.pleaseChooseWhetherTo },
                ],
                'x-decorator-props': {
                  gridSpan: 2,
                },
                'x-component': 'Select',
                'x-component-props': {
                  placeholder: I18N.Factors.pleaseSelect,
                  style: { width: '50%' },
                  options: [
                    {
                      label: I18N.eca.no,
                      value: false,
                    },
                    {
                      label: I18N.eca.yes,
                      value: true,
                    },
                  ],
                },
                'x-reactions': {
                  target:
                    '*(collectDesc,collectDes,calculateType,calculateDesc,storageDesc,activityDescEn,activityDesc,collectDescEn,calculateDescEn,storageDescEn)',
                  when: `{{$self.value === true}}`,
                  fulfill: {
                    state: {
                      display: 'visible',
                    },
                  },
                  otherwise: {
                    state: {
                      display: 'hidden',
                    },
                  },
                },
              },
              activityDesc: {
                type: 'string',
                title: I18N.eca.activityDescriptionIs4,
                'x-decorator': 'FormItem',
                'x-validator': [
                  { required: true, message: I18N.eca.pleaseEnterTheActivity },
                ],
                'x-decorator-props': {
                  gridSpan: 2,
                },
                'x-component': 'TextArea',
                'x-component-props': {
                  placeholder: I18N.eca.activityDescriptionIs2,
                  style: { height: '200px', alignItems: 'flex-start' },
                  maxLength: TextAreaMaxLength1000,
                },
              },
              activityDescEn: {
                type: 'string',
                title: I18N.eca.activityDescriptionIs3,
                'x-decorator': 'FormItem',
                'x-validator': [
                  { required: true, message: I18N.eca.pleaseEnterTheActivity },
                ],
                'x-decorator-props': {
                  gridSpan: 2,
                },
                'x-component': 'TextArea',
                'x-component-props': {
                  placeholder: I18N.eca.activityDescriptionIs2,
                  style: { height: '200px', alignItems: 'flex-start' },
                  maxLength: TextAreaMaxLength1000,
                },
              },
              collectDesc: {
                type: 'string',
                title: I18N.eca.dataCollectionTheory4,
                'x-decorator': 'FormItem',
                'x-decorator-props': {
                  gridSpan: 2,
                },
                'x-validator': [
                  {
                    required: true,
                    message: I18N.eca.pleaseEnterData2,
                  },
                ],
                'x-component': 'TextArea',
                'x-component-props': {
                  placeholder: I18N.eca.dataCollectionTheory,
                  style: { height: '200px', alignItems: 'flex-start' },
                  maxLength: TextAreaMaxLength1000,
                },
              },
              collectDescEn: {
                type: 'string',
                title: I18N.eca.dataCollectionTheory3,
                'x-decorator': 'FormItem',
                'x-decorator-props': {
                  gridSpan: 2,
                },
                'x-validator': [
                  {
                    required: true,
                    message: I18N.eca.pleaseEnterData2,
                  },
                ],
                'x-component': 'TextArea',
                'x-component-props': {
                  placeholder: I18N.eca.dataCollectionTheory,
                  style: { height: '200px', alignItems: 'flex-start' },
                  maxLength: TextAreaMaxLength1000,
                },
              },
              calculateType: {
                type: 'string',
                title: I18N.eca.computingMethod,
                'x-decorator': 'FormItem',
                'x-decorator-props': {
                  gridSpan: 2,
                },
                'x-validator': [
                  { required: true, message: I18N.eca.pleaseSelectCalculation },
                ],
                'x-component': 'Checkbox.Group',
                enum: [
                  {
                    label: I18N.eca.emissionFactorMethod,
                    value: '1',
                  },
                  {
                    label: I18N.eca.materialBalanceMethod,
                    value: '2',
                  },
                ],
                'x-component-props': {
                  placeholder: I18N.eca.computingMethod,
                },
              },
              calculateDesc: {
                type: 'string',
                title: I18N.eca.calculationMethodDescription3,
                'x-decorator': 'FormItem',
                'x-validator': [
                  {
                    required: true,
                    message: I18N.eca.pleaseEnterTheCalculation,
                  },
                ],
                'x-decorator-props': {
                  gridSpan: 2,
                },
                'x-component': 'TextArea',
                'x-component-props': {
                  placeholder: I18N.eca.calculationMethodDescription,
                  style: { height: '200px', alignItems: 'flex-start' },
                  maxLength: TextAreaMaxLength1000,
                },
              },
              calculateDescEn: {
                type: 'string',
                title: I18N.eca.calculationMethodDescription2,
                'x-decorator': 'FormItem',
                'x-validator': [
                  {
                    required: true,
                    message: I18N.eca.pleaseEnterTheCalculation,
                  },
                ],
                'x-decorator-props': {
                  gridSpan: 2,
                },
                'x-component': 'TextArea',
                'x-component-props': {
                  placeholder: I18N.eca.calculationMethodDescription,
                  style: { height: '200px', alignItems: 'flex-start' },
                  maxLength: TextAreaMaxLength5000,
                },
              },
              storageDesc: {
                type: 'string',
                title: I18N.eca.dataStorageTheory4,
                'x-decorator': 'FormItem',
                'x-validator': [
                  { required: true, message: I18N.eca.pleaseEnterData },
                ],
                'x-decorator-props': {
                  gridSpan: 2,
                },
                'x-component': 'TextArea',
                'x-component-props': {
                  placeholder: I18N.eca.dataStorageTheory,
                  style: { height: '200px', alignItems: 'flex-start' },
                  maxLength: TextAreaMaxLength1000,
                },
              },
              storageDescEn: {
                type: 'string',
                title: I18N.eca.dataStorageTheory3,
                'x-decorator': 'FormItem',
                'x-validator': [
                  { required: true, message: I18N.eca.pleaseEnterData },
                ],
                'x-decorator-props': {
                  gridSpan: 2,
                },
                'x-component': 'TextArea',
                'x-component-props': {
                  placeholder: I18N.eca.dataStorageTheory,
                  style: { height: '200px', alignItems: 'flex-start' },
                  maxLength: TextAreaMaxLength1000,
                },
              },
            },
          },
        },
      },
    },
  };
};
