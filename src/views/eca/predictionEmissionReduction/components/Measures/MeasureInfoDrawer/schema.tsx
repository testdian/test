import { ISchema } from '@formily/react';
import I18N from '@src/lang/I18N';

import {
  renderFormItemSchema,
  renderFromGridSchema,
  renderSchemaWithLayout,
} from '@/components/formily/utils';
import type { EnumOptionResp } from '@/views/eca/hooks';
import { InputTextLength200 } from '@/views/eca/util/type';

import { feasibilityOptions, measureTypeOptions } from '../utils';

/** 措施基本信息（FormGrid 默认 3 列）；ghgCategoryTree 与填报页 GHG 分类 Cascader 同源（GHGCategory） */
export const measureBaseSchema = (
  ghgCategoryTree: EnumOptionResp[] = [],
): ISchema =>
  renderSchemaWithLayout(
    {},
    {
      grid: {
        ...renderFromGridSchema(),
        properties: {
          measureName: renderFormItemSchema({
            type: 'string',
            title: I18N.eca.measureName,
            required: true,
            customValidate: I18N.eca.pleaseInputMeasures,
            'x-component': 'Input.TextArea',
            'x-validator': [
              { max: 200, message: I18N.eca.theMeasureNameIsNot },
            ],
            'x-component-props': {
              maxLength: InputTextLength200,
              autoSize: { minRows: 1, maxRows: 2 },
            },
          }),
          measureDesc: {
            type: 'string',
            title: I18N.carbonFootPrint.describe,
            required: false,
            'x-decorator': 'FormItem',
            'x-component': 'Input.TextArea',
            'x-validator': [
              { max: 200, message: I18N.eca.theDescriptionCannotExceed },
            ],
            'x-component-props': {
              placeholder: I18N.utils.pleaseEnter,
              maxLength: InputTextLength200,
              autoSize: { minRows: 1, maxRows: 2 },
            },
          },
          ghgClassify: renderFormItemSchema({
            type: 'array',
            title: I18N.Factors.ghgClassifyCol2,
            required: true,
            'x-component': 'Cascader',
            'x-component-props': {
              allowClear: true,
              showSearch: true,
              changeOnSelect: false,
              expandTrigger: 'hover',
              placeholder: I18N.utils.pleaseSelect,
              options: ghgCategoryTree,
              style: { width: '100%' },
            },
          }),
          measureType: renderFormItemSchema({
            type: 'number',
            title: I18N.eca.typeOfMeasures,
            required: true,
            customValidate: I18N.eca.pleaseSelectMeasures,
            'x-component': 'Select',
            'x-component-props': {
              allowClear: true,
              showSearch: true,
              optionFilterProp: 'label',
              options: measureTypeOptions,
            },
          }),
          /** startTime / endTime 由 MeasureInfoDrawer 以 React state DatePicker 渲染，不在 schema 中声明 */
          feasibilityType: renderFormItemSchema({
            type: 'number',
            title: I18N.eca.feasibility,
            required: true,
            customValidate: I18N.eca.pleaseChooseFeasibleOption,
            'x-component': 'Radio.Group',
            'x-component-props': {
              optionType: 'default',
              options: feasibilityOptions,
            },
          }),
        },
      },
    },
  );
