import {
  renderFormItemSchema,
  renderFromGridSchema,
  renderSchemaWithLayout,
} from '@/components/formily/utils';
import { getYear } from '@/utils';

import { CONFIG_TYPE_OPTIONS, CONFIG_TYPE } from '../constant';

const { FIXED_VALUE, MAPPING_RELATION } = CONFIG_TYPE;

const YEAR_OPTIONS = [
  {
    label: '每年通用',
    value: 0,
  },
  ...getYear().map(item => ({
    label: `${item}`,
    value: item,
  })),
];

export const schema = () =>
  renderSchemaWithLayout(
    {},
    {
      grid: {
        ...renderFromGridSchema({ columns: 2 }),
        properties: {
          emissionSourceId: renderFormItemSchema({
            title: '排放源名称',
            'x-component': 'Select',
            'x-component-props': {
              showSearch: true,
              allowClear: true,
              optionFilterProp: 'label',
            },
          }),
          year: renderFormItemSchema({
            title: '核算年份',
            enum: YEAR_OPTIONS,
            'x-component': 'Select',
            'x-component-props': {
              showSearch: true,
              allowClear: true,
              optionFilterProp: 'label',
            },
          }),
          paramConfigType: renderFormItemSchema({
            title: '配置类型',
            enum: CONFIG_TYPE_OPTIONS,
            'x-component': 'Radio.Group',
            'x-decorator-props': {
              gridSpan: 2,
            },
          }),
          mainParamList: renderFormItemSchema({
            title: '选择参数',
            'x-component': 'FormilyCheckboxInputList',
            'x-reactions': [
              {
                dependencies: ['paramConfigType'],
                fulfill: {
                  schema: {
                    'x-visible': `{{$deps[0] === ${FIXED_VALUE}}}`,
                  },
                },
              },
              `{{ useAsyncParamListDataSource() }}`,
            ],
          }),
          mainParamCodeList: renderFormItemSchema({
            title: '选择主要参数',
            'x-component': 'FormilyCheckboxList',
            'x-reactions': [
              {
                dependencies: ['paramConfigType'],
                fulfill: {
                  schema: {
                    'x-visible': `{{$deps[0] === ${MAPPING_RELATION}}}`,
                  },
                },
              },
              `{{ useAsyncParamListDataSource() }}`,
            ],
          }),
          associatedParamCodeList: renderFormItemSchema({
            title: '选择关联参数',
            'x-component': 'FormilyCheckboxList',
            'x-reactions': [
              {
                dependencies: ['paramConfigType'],
                fulfill: {
                  schema: {
                    'x-visible': `{{$deps[0] === ${MAPPING_RELATION}}}`,
                  },
                },
              },
              `{{ useAsyncParamListDataSource() }}`,
            ],
          }),
        },
      },
    },
  );
