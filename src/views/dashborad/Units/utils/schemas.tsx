import { ISchema } from '@formily/react';
import I18N from '@src/lang/I18N';
import { compact } from 'lodash-es';
import { SearchProps } from 'table-render/dist/src/types';

import { xRenderSeachSchema } from '@/components/x-render/TableRender/utils/xRender';
import { RegNumberFore } from '@/utils/regs';

import { DictMap } from '../../Dicts/hooks';

const validateUnit = (dependencies: string[]) => {
  return [
    {
      dependencies,
      fulfill: {
        state: {
          selfErrors:
            '{{ !$self.errors.length  && ($deps[0] && $self.value && $self.value === $deps[0] ? validateTip : "")}}',
        },
      },
    },
  ];
};

export const modalSchema = (): ISchema => ({
  type: 'object',
  properties: {
    layout: {
      type: 'void',
      'x-component': 'FormLayout',
      'x-component-props': {
        layout: 'vertical',
      },
      properties: {
        unitClass: {
          type: 'string',

          'x-decorator': 'FormItem',
          'x-component': 'Select',
          'x-component-props': {
            placeholder: I18N.Factors.pleaseSelect,
          },
          title: I18N.dashborad.unitType,
          'x-validator': [
            { required: true, message: I18N.dashborad.pleaseSelectAUnit3 },
          ],
        },
        unitFrom: {
          type: 'string',
          'x-decorator': 'FormItem',
          'x-component': 'Select',
          'x-component-props': {
            placeholder: I18N.Factors.pleaseSelect,
          },
          'x-reactions': validateUnit(['unitTo']),
          title: I18N.dashborad.unit3,
          'x-validator': [
            { required: true, message: I18N.dashborad.pleaseSelectAUnit2 },
          ],
        },
        unitTo: {
          type: 'string',
          'x-decorator': 'FormItem',
          'x-component': 'Select',
          'x-reactions': validateUnit(['unitFrom']),
          'x-component-props': {
            placeholder: I18N.Factors.pleaseSelect,
          },
          title: I18N.dashborad.unit2,
          'x-validator': [
            { required: true, message: I18N.dashborad.pleaseSelectAUnit },
          ],
        },
        unitValue: {
          type: 'number',
          'x-decorator': 'FormItem',
          'x-component': 'NumberPicker',
          'x-reactions': [],
          title: I18N.dashborad.unit,
          'x-validator': [
            { required: true, message: I18N.dashborad.pleaseEnterTheUnit },
            ...RegNumberFore,
          ],

          'x-component-props': {
            placeholder: I18N.base.pleaseEnter,
            min: 0,
            // precision: '9999999999'.length,
          },
        },
      },
    },
  },
});
const dictLabelMapObj = {
  'en-US': 'dictLabelLanguage',
  'zh-CN': 'dictLabel',
};
export const searchSchema = (
  units: DictMap,
  locale: keyof typeof dictLabelMapObj,
): SearchProps<any>['schema'] => {
  return {
    type: 'object',
    properties: {
      // fixme unit
      unit: xRenderSeachSchema({
        type: 'string',
        placeholder: I18N.Factors.unit,
        enum: compact(units.enums.map(u => u.dictValue)),
        enumNames: compact(
          // @ts-ignore
          units.enums.map(u => u?.[dictLabelMapObj?.[locale]]),
        ),
        widget: 'select',
        props: {
          allowClear: true,
        },
      }),
      unitClass: xRenderSeachSchema({
        type: 'string',
        placeholder: I18N.dashborad.unitType,
        enum: compact(units.type.map(u => u.dictValue)),
        enumNames: compact(
          // @ts-ignore
          units.type.map(u => u?.[dictLabelMapObj?.[locale]]),
        ),
        widget: 'select',
        props: {
          allowClear: true,
        },
      }),
    },
  };
};
