import I18N from '@src/lang/I18N';
import moment, { Moment } from 'moment';

import {
  renderFormItemSchema,
  renderSchemaWithLayout,
  renderFromGridSchema,
  renderEmptySchema,
} from '@/components/formily/utils';

export const infoSchema = () =>
  renderSchemaWithLayout(
    {},
    {
      grid: {
        ...renderFromGridSchema(),

        properties: {
          supplierName: renderFormItemSchema({
            title: I18N.carbonFootPrint.supplierName,
            required: false,
            'x-component': 'Input',
            'x-component-props': {
              maxLength: 100,
            },
            'x-disabled': true,
          }),
          year: renderFormItemSchema({
            title: I18N.components.accountingYear,
            'x-component': 'Select',
          }),
          deadline: renderFormItemSchema({
            title: I18N.supplyChainCarbonManagement.deadline,
            'x-component': 'DatePicker',
            'x-component-props': {
              disabledDate: (current: Moment) => {
                return current && current < moment();
              },
              showToday: false,
            },
          }),
          applyType: renderFormItemSchema({
            title: I18N.supplyChainCarbonManagement.dataRequestClass,
            'x-component': 'Radio.Group',
            default: 1,
          }),
          standardTypes: renderFormItemSchema({
            title: I18N.supplyChainCarbonManagement.enterpriseCarbonAccounting4,
            'x-component': 'Checkbox.Group',
            default: [1],
          }),
          empty: renderEmptySchema(),
          ghgCategories: renderFormItemSchema({
            title: I18N.supplyChainCarbonManagement.accountingScopeG,
            'x-decorator-props': {
              gridSpan: 3,
            },
            'x-component': 'Checkbox.Group',
            default: [1, 2],
            'x-reactions': {
              dependencies: ['standardTypes'],
              fulfill: {
                schema: {
                  'x-visible': '{{$deps[0].includes(1)}}',
                },
              },
            },
          }),
          isoCategories: renderFormItemSchema({
            title: I18N.supplyChainCarbonManagement.accountingScopeI,
            'x-decorator-props': {
              gridSpan: 3,
            },
            'x-component': 'Checkbox.Group',
            'x-reactions': {
              dependencies: ['standardTypes'],
              fulfill: {
                schema: {
                  'x-visible': '{{$deps[0].includes(2)}}',
                },
              },
            },
          }),
          requireDesc: renderFormItemSchema({
            title: I18N.supplyChainCarbonManagement.dataRequirementDescription,
            required: false,
            'x-decorator-props': {
              gridSpan: 2,
            },
            'x-component': 'TextArea',
            'x-component-props': {
              placeholder: I18N.base.pleaseEnter,
              maxLength: 1000,
              style: {
                height: 100,
                alignItems: 'flex-start',
              },
            },
          }),
        },
      },
    },
  );
