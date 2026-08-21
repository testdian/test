import { ISchema } from '@formily/react';
import I18N from '@src/lang/I18N';

import {
  renderFormItemSchema,
  renderSchemaWithLayout,
  renderFromGridSchema,
} from '@/components/formily/utils';

import { PeriodTypeEnum } from '../../const';

/** 生成数值字段schema */
const generateValueFields = (periodType: PeriodTypeEnum) => {
  const fieldMap = {
    1: { count: 1, labels: [I18N.eca.annualIndicatorCount] },
    2: {
      count: 4,
      labels: [
        I18N.eca.quarterlyIndicators4,
        I18N.eca.quarterlyIndicators3,
        I18N.eca.quarterlyIndicators2,
        I18N.eca.quarterlyIndicators,
      ],
    },
    3: {
      count: 12,
      labels: Array.from({ length: 12 }, (_, i) =>
        I18N.template(I18N.eca.numberOfIndicatorsForMonthI, { val1: i + 1 }),
      ),
    },
  };

  const { count, labels } = fieldMap[periodType];

  return Array.from({ length: count }, (_, index) =>
    renderFormItemSchema({
      type: 'number',
      title: labels[index],
      required: false,
      'x-component': 'NumberPicker',
      'x-component-props': {
        min: 0,
        precision: 4,
      },
      'x-decorator-props': {
        gridSpan: periodType === 3 ? 1 : 3, // 月度每列显示1格
      },
      'x-validator': [
        {
          required: true,
          message: I18N.template(I18N.eca.pleaseEnterLa, {
            val1: labels[index],
          }),
        },
      ],
    }),
  );
};

/** 指标表格弹窗数据 */
export const fillDataFormSchema = (periodType: PeriodTypeEnum = 1): ISchema =>
  renderSchemaWithLayout(
    {},
    {
      grid: {
        ...renderFromGridSchema({
          columns: 3,
        }),
        properties: {
          // 动态数值字段
          ...Object.fromEntries(
            generateValueFields(periodType).map((schema, index) => [
              `value${index + 1}`,
              schema,
            ]),
          ),
        },
      },
    },
  );
