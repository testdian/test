import I18N from '@src/lang/I18N';

import {
  renderFormItemSchema,
  renderSchemaWithLayout,
  renderFromGridSchema,
} from '@/components/formily/utils';

import { FILL_WAY_ENUM, FILL_WAY_OPTIONS } from '../../../constant';

const { MANUAL, SUPPLY_FILL } = FILL_WAY_ENUM;

export const precursorSchema = () =>
  renderSchemaWithLayout(
    {},
    {
      grid: {
        ...renderFromGridSchema({
          columns: 2,
        }),
        properties: {
          preName: renderFormItemSchema({
            title: I18N.cbam.nameOfPrecursor,
            'x-component': 'Input',
            'x-component-props': {
              maxLength: 100,
            },
            'x-decorator-props': {
              gridSpan: 2,
            },
          }),
          productCategoryName: renderFormItemSchema({
            title: I18N.cbam.outsourcedPrecursorProducts,
            'x-component': 'Input',
            'x-decorator-props': {
              gridSpan: 2,
            },
          }),
          productRouteNames: renderFormItemSchema({
            title: I18N.cbam.productionRoute,
            'x-component': 'Input',
            'x-decorator-props': {
              gridSpan: 2,
            },
          }),
        },
      },
    },
  );

export const supplySchema = () =>
  renderSchemaWithLayout(
    {},
    {
      grid: {
        ...renderFromGridSchema({
          columns: 2,
        }),
        properties: {
          manual: renderFormItemSchema({
            default: MANUAL,
            enum: FILL_WAY_OPTIONS,
            'x-component': 'Radio.Group',
            'x-decorator-props': {
              gridSpan: 2,
            },
          }),
          supplierName: renderFormItemSchema({
            title: I18N.carbonFootPrint.supplierName,
            required: false,
            'x-disabled': true,
            'x-component': 'Input',
            'x-component-props': {
              maxLength: 100,
              placeholder: '-',
            },
            'x-reactions': {
              dependencies: ['manual'],
              fulfill: {
                schema: {
                  'x-visible': `{{ $deps[0] === ${SUPPLY_FILL} }}`,
                },
              },
            },
          }),
          fillStatus: renderFormItemSchema({
            title: I18N.cbam.fillInStatus,
            required: false,
            'x-component': 'Input',
            'x-disabled': false,
            'x-hidden': true,
          }),
          fillStatus_name: renderFormItemSchema({
            title: I18N.cbam.fillInStatus,
            required: false,
            'x-disabled': true,
            'x-component': 'Select',
            'x-component-props': {
              showSearch: true,
              optionFilterProp: 'label',
              allowClear: true,
              placeholder: '-',
            },
            'x-reactions': {
              dependencies: ['manual'],
              fulfill: {
                schema: {
                  'x-visible': `{{ $deps[0] === ${SUPPLY_FILL} }}`,
                },
              },
            },
          }),
          countryCode: renderFormItemSchema({
            title: I18N.cbam.sourceCountryName,
            'x-component': 'Select',
            'x-component-props': {
              showSearch: true,
              optionFilterProp: 'label',
              allowClear: true,
            },
            'x-reactions': {
              dependencies: ['manual'],
              when: `{{ $deps[0] === ${MANUAL} }}`,
              fulfill: {
                schema: {
                  required: true,
                  'x-disabled': `{{ $form.readPretty }}`,
                  'x-component-props': {
                    placeholder: I18N.utils.pleaseSelect,
                  },
                },
              },
              otherwise: {
                schema: {
                  required: false,
                  'x-disabled': true,
                  'x-component-props': {
                    placeholder: '-',
                  },
                },
              },
            },
          }),
          linkId: renderFormItemSchema({
            title: I18N.cbam.relatedSupply,
            required: false,
            'x-component': 'Input',
            'x-hidden': true,
          }),
        },
      },
    },
  );
