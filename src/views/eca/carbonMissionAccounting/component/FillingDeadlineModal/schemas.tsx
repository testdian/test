import I18N from '@src/lang/I18N';
import { SearchProps } from 'table-render/dist/src/types';

import { xRenderSeachSchema } from '@/components/x-render/TableRender/utils/xRender';
import { SearchSchemaSelectUtils } from '@/utils/schema';

export const DEADLINE = {
  /**  是 */
  YES: 1,
  /**  否 */
  NO: 0,
};

export const DEADLINE_FILTER_OPTIONS = [
  { label: I18N.eca.yes, value: DEADLINE.YES },
  { label: I18N.eca.no, value: DEADLINE.NO },
];

export const DATA_COLLECTION_PERIOD_OPTIONS_MAP = {
  /** 按年度 */
  YEAR: '1',
  /** 按季度 */
  QUARTER: '2',
  /** 按月份 */
  MONTH: '3',
};
const { YEAR, QUARTER, MONTH } = DATA_COLLECTION_PERIOD_OPTIONS_MAP;

export const QUARTER_OPTIONS = [
  { label: '一季度', value: '1' },
  { label: '二季度', value: '2' },
  { label: '三季度', value: '3' },
  { label: '四季度', value: '4' },
];

export const MONTH_OPTIONS = Array.from({ length: 12 }, (_, i) => ({
  label: `${i + 1}月`,
  value: `${i + 1}`,
}));

/** 数据收集周期 */
export const DATA_COLLECTION_PERIOD_OPTIONS = [
  { label: '按年度', value: YEAR },
  {
    label: '按季度',
    value: QUARTER,
    children: QUARTER_OPTIONS,
  },
  {
    label: '按月份',
    value: MONTH,
    children: MONTH_OPTIONS,
  },
];

/** 日期选项：前1天到前7天 */
export const BEFORE_DAY_OPTIONS = Array.from({ length: 7 }, (_, i) => ({
  label: `前${i + 1}天`,
  value: i + 1,
}));

/** 日期选项：1天到7天 */
export const AFTER_DAY_OPTIONS = Array.from({ length: 7 }, (_, i) => ({
  label: `${i + 1}天`,
  value: i + 1,
}));

/** 时间选项：0点到23点 */
export const HOUR_OPTIONS = Array.from({ length: 24 }, (_, i) => ({
  label: `${i}点`,
  value: i,
}));

export const searchSchema = (): SearchProps<any>['schema'] => {
  return {
    type: 'object',
    properties: {
      likeSourceName: xRenderSeachSchema({
        type: 'string',
        placeholder: '排放源名称',
      }),
      hasDeadline: xRenderSeachSchema({
        type: 'number',
        widget: 'select',
        placeholder: I18N.eca.pleaseChooseWhetherOrNot,
        enum: DEADLINE_FILTER_OPTIONS?.map(item => item.value),
        enumNames: DEADLINE_FILTER_OPTIONS?.map(item => item.label),
        ...SearchSchemaSelectUtils,
      }),
      dataPeriod: xRenderSeachSchema({
        type: 'array',
        placeholder: '数据收集周期',
        widget: 'cascader',
        props: {
          changeOnSelect: true,
          options: DATA_COLLECTION_PERIOD_OPTIONS,
          showSearch: true,
          expandTrigger: 'hover',
          filterOption: (
            input: string,
            option?: { label?: string; value?: string },
          ) =>
            (option?.label ?? '').toLowerCase().includes(input.toLowerCase()),
        },
      }),
    },
  };
};

const SelectWidth = 120;

export const schema = () => ({
  type: 'object',
  properties: {
    // 填报提醒
    fillingReminders: {
      type: 'array',
      'x-component': 'ArrayItems',
      'x-decorator': 'FormItem',
      title: '填报提醒',
      items: {
        type: 'object',
        properties: {
          space: {
            type: 'void',
            'x-component': 'Space',
            'x-component-props': {
              size: 8,
              align: 'center',
            },
            properties: {
              tipTextBefore: {
                type: 'string',
                'x-decorator': 'FormItem',
                'x-component': () => <span>截止</span>,
              },
              dateValue: {
                type: 'number',
                enum: BEFORE_DAY_OPTIONS,
                'x-decorator': 'FormItem',
                'x-component': 'Select',
                'x-component-props': {
                  style: {
                    width: SelectWidth,
                  },
                  placeholder: '请选择天数',
                  showSearch: true,
                },
                'x-validator': [
                  {
                    required: true,
                    message: '请选择天数',
                  },
                ],
              },
              timeValue: {
                type: 'number',
                enum: HOUR_OPTIONS,
                'x-decorator': 'FormItem',
                'x-component': 'Select',
                'x-component-props': {
                  style: {
                    width: SelectWidth,
                  },
                  placeholder: '请选择时间',
                  showSearch: true,
                },
                'x-validator': [
                  {
                    required: true,
                    message: '请选择时间',
                  },
                ],
              },
              tipTextAfter: {
                type: 'string',
                'x-decorator': 'FormItem',
                'x-component': () => <span>提醒</span>,
              },
              remove: {
                type: 'void',
                'x-decorator': 'FormItem',
                'x-component': 'ArrayItems.Remove',
                'x-reactions': {
                  dependencies: ['fillingReminders'],
                  fulfill: {
                    state: {
                      disabled: '{{$deps[0]?.length <= 1}}',
                    },
                  },
                },
              },
            },
          },
        },
      },
      properties: {
        add: {
          type: 'void',
          title: '添加填报提醒',
          'x-component': 'ArrayItems.Addition',
        },
      },
    },
    // 超期提醒
    overdueReminders: {
      type: 'array',
      'x-component': 'ArrayItems',
      'x-decorator': 'FormItem',
      title: '超期提醒',
      items: {
        type: 'object',
        properties: {
          space: {
            type: 'void',
            'x-component': 'Space',
            'x-component-props': {
              size: 8,
              align: 'center',
            },
            properties: {
              tipTextBefore: {
                type: 'string',
                'x-decorator': 'FormItem',
                'x-component': () => <span>超期后每隔</span>,
              },
              dateValue: {
                type: 'number',
                enum: AFTER_DAY_OPTIONS,
                'x-decorator': 'FormItem',
                'x-component': 'Select',
                'x-component-props': {
                  style: {
                    width: SelectWidth,
                  },
                  placeholder: '请选择天数',
                  showSearch: true,
                },
                'x-validator': [
                  {
                    required: true,
                    message: '请选择天数',
                  },
                ],
              },
              timeValue: {
                type: 'number',
                enum: HOUR_OPTIONS,
                'x-decorator': 'FormItem',
                'x-component': 'Select',
                'x-component-props': {
                  style: {
                    width: SelectWidth,
                  },
                  placeholder: '请选择时间',
                  showSearch: true,
                },
                'x-validator': [
                  {
                    required: true,
                    message: '请选择时间',
                  },
                ],
              },
              tipTextAfter: {
                type: 'string',
                'x-decorator': 'FormItem',
                'x-component': () => <span>提醒</span>,
              },
              remove: {
                type: 'void',
                'x-decorator': 'FormItem',
                'x-component': 'ArrayItems.Remove',
                'x-reactions': {
                  dependencies: ['overdueReminders'],
                  fulfill: {
                    state: {
                      disabled: '{{$deps[0]?.length <= 1}}',
                    },
                  },
                },
              },
            },
          },
        },
      },
      properties: {
        add: {
          type: 'void',
          title: '添加超期提醒',
          'x-component': 'ArrayItems.Addition',
        },
      },
    },
  },
});
