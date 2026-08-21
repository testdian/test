import I18N from '@src/lang/I18N';

import {
  renderFormItemSchema,
  renderSchemaWithLayout,
  renderFromGridSchema,
  renderEmptySchema,
} from '@/components/formily/utils';

import { SOURCE_SYSTEM } from './constant';

export const infoSchema = () =>
  renderSchemaWithLayout(
    {},
    {
      grid: {
        ...renderFromGridSchema(),
        properties: {
          productName: renderFormItemSchema({
            title: I18N.Factors.productName,
            'x-component': 'Input',
            'x-component-props': {
              maxLength: 100,
            },
          }),
          // orgId: renderFormItemSchema({
          //   title: I18N.carbonData.affiliatedOrganization,
          //   'x-component': 'Select',
          //   'x-component-props': {
          //     showSearch: true,
          //     optionFilterProp: 'label',
          //     allowClear: true,
          //   },
          //   'x-disabled': !isAdd,
          // }),
          productUnit: renderFormItemSchema({
            title: I18N.carbonFootPrint.accountingUnit,
            'x-component': 'Cascader',
            'x-component-props': {
              showSearch: true,
            },
          }),
          materialNo: renderFormItemSchema({
            title: I18N.supplyChainCarbonManagement.materialNumber,
            required: false,
            'x-component': 'Input',
            'x-component-props': {
              maxLength: 100,
            },
          }),
          sourceSystem: renderFormItemSchema({
            title: I18N.supplyChainCarbonManagement.sourceSystem,
            required: false,
            'x-component': 'Select',
            'x-disabled': true,
            default: SOURCE_SYSTEM.MANUAL_REPORTING,
          }),
          productModel: renderFormItemSchema({
            title: I18N.carbonFootPrintLCA.specificationAndModel,
            required: false,
            'x-component': 'Input',
            'x-component-props': {
              maxLength: 100,
            },
          }),
          emptyOne: renderEmptySchema(),
          productDesc: renderFormItemSchema({
            title: I18N.carbonFootPrintLCA.productDescription,
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
