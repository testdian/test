/*
 * @@description:
 * @Author: qifeng qifeng@carbonstop.net
 * @Date: 2023-01-16 09:48:53
 * @LastEditors: ljh255 jinhai@carbonstop.net
 * @LastEditTime: 2023-06-16 17:59:11
 */
import { ISchema } from '@formily/react';
import I18N from '@src/lang/I18N';
import { TreeProps } from 'antd';
import { TreeNodeNormal } from 'antd/lib/tree/Tree';

import { renderFormItemSchema } from '@/components/formily/utils';
import { PageTypeInfo } from '@/router/utils/enums';
import { modal } from '@/store/module/notification';
import { returnNoIconModalStyle } from '@/utils';
import { TextAreaMaxLength500 } from '@/views/eca/util/type';

export type CheckInfo<T extends TreeNodeNormal = any> = Parameters<
  NonNullable<TreeProps<T>['onCheck']>
>[1];

export const Schema = (
  pageTypeInfo?: PageTypeInfo,
  computationList?: () => void,
  emissionStandardEdit?: number,
  update?: boolean,
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
              maxColumns: 3,
              minColumns: 1,
            },
            properties: {
              orgId: renderFormItemSchema({
                title: I18N.carbonData.affiliatedOrganization,
                required: true,
                type: 'string',
                'x-component': 'Select',
                'x-component-props': {
                  disabled: pageTypeInfo !== PageTypeInfo.add,
                  style: {
                    width: '100%',
                  },
                  showSearch: true,
                  filterOption: (input: string, option: any) =>
                    (option?.label ?? '')
                      .toLowerCase()
                      .includes(input.toLowerCase()),
                },
              }),
              settingType: renderFormItemSchema({
                type: 'string',
                title: I18N.eca.setType,
                'x-decorator': 'FormItem',
                'x-component': 'Radio.Group',
                enum: [
                  {
                    label: I18N.eca.singleYear,
                    value: '1',
                  },
                  {
                    label: I18N.eca.annualAverage,
                    value: '2',
                  },
                ],
                'x-component-props': {
                  placeholder: I18N.base.pleaseEnter,
                },
              }),
              startYear: renderFormItemSchema({
                type: 'string',
                title: I18N.eca.baseYear,
                'x-decorator': 'FormItem',
                'x-component': 'DatePicker',
                'x-component-props': {
                  picker: 'year',
                },
                'x-reactions': {
                  dependencies: ['settingType'],
                  fulfill: {
                    state: {
                      display: `{{$deps[0]==='1'?'visible':'hidden'}}`,
                    },
                  },
                },
              }),
              '[startYear,endYear]': renderFormItemSchema({
                type: 'string',
                title: I18N.eca.baseYear,
                'x-validator': (value: string[]) => {
                  if (!value[0]) {
                    return I18N.eca.pleaseSelectABenchmark;
                  }
                  if (Number(value[1]) - Number(value[0]) >= 10) {
                    return I18N.eca.selectionRangeNotAvailable;
                  }
                  return '';
                },
                'x-decorator': 'FormItem',
                'x-component': 'DatePicker.RangePicker',
                'x-component-props': {
                  placeholder: [
                    I18N.carbonFootPrintLCA.startDate,
                    I18N.carbonFootPrintLCA.endDate,
                  ],
                  picker: 'year',
                },
                'x-reactions': {
                  dependencies: ['settingType'],
                  fulfill: {
                    state: {
                      display: `{{$deps[0]==='2'?'visible':'hidden'}}`,
                    },
                  },
                },
              }),
              policy: renderFormItemSchema({
                type: 'string',
                title: I18N.eca.baselineEmissions3,
                'x-decorator': 'FormItem',
                'x-component': 'TextArea',
                'x-decorator-props': { gridSpan: 3 },
                'x-component-props': {
                  placeholder: I18N.eca.enterprisesShouldBeInTheEnterprise,
                  style: {
                    height: 200,
                    alignItems: 'flex-start',
                  },
                  maxLength: TextAreaMaxLength500,
                },
              }),
              policyEn: renderFormItemSchema({
                type: 'string',
                title: I18N.eca.baselineEmissions2,
                'x-decorator': 'FormItem',
                'x-component': 'TextArea',
                'x-decorator-props': { gridSpan: 3 },
                'x-component-props': {
                  placeholder: I18N.eca.enterprisesShouldBeInTheEnterprise,
                  style: {
                    height: 200,
                    alignItems: 'flex-start',
                  },
                  maxLength: TextAreaMaxLength500,
                },
              }),
              changeDateSource: {
                type: 'void',
                'x-decorator': 'FormItem',
                'x-component': 'ComButton',
                'x-display':
                  pageTypeInfo === PageTypeInfo.show ? 'none' : 'visible',
                'x-decorator-props': {
                  gridSpan: 3,
                  style: {
                    marginBottom: '10px',
                  },
                },
                'x-component-props': {
                  title: I18N.eca.updateData,
                  onclickFn: () => {
                    modal.confirm({
                      title: I18N.Factors.prompt,
                      ...returnNoIconModalStyle,
                      content: I18N.eca.newNumberOfQueries,
                      okText: I18N.carbonFootPrintLCA.confirm,
                      cancelText: I18N.Factors.cancel,
                      onOk: computationList,
                    });
                  },
                },
              },
              dataList: {
                type: 'string',
                title: (
                  <span>
                    {I18N.eca.benchmarkEmissions2}
                    <span className='textSpan'>
                      {I18N.eca.benchmarkEmissions3}
                    </span>
                    {I18N.eca.benchmarkEmissions4}
                  </span>
                ),
                'x-decorator': 'FormItem',
                'x-component': 'ComTable',
                'x-decorator-props': { gridSpan: 3 },
                'x-validator': [
                  { require: true, message: I18N.eca.pleaseFillInTheBenchmark },
                ],
                'x-component-props': {
                  placeholder: I18N.eca.enterprisesShouldBeInTheEnterprise,
                  style: {
                    height: 200,
                  },
                  emissionStandardEdit,
                  update,
                },
              },
            },
          },
        },
      },
    },
  };
};
