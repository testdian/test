import I18N from '@src/lang/I18N';

import {
  renderFormItemSchema,
  renderSchemaWithLayout,
  renderFromGridSchema,
  renderEmptySchema,
} from '@/components/formily/utils';
import { RegValue } from '@/views/supplyChainCarbonManagement/utils';

export const infoSchema = () =>
  renderSchemaWithLayout(
    {},
    {
      grid: {
        ...renderFromGridSchema(),
        properties: {
          materialNo: renderFormItemSchema({
            title: I18N.supplyChainCarbonManagement.supplierMaterials,
            required: false,
            'x-component': 'Input',
            'x-component-props': {
              maxLength: 100,
            },
          }),
          unitPrice: renderFormItemSchema({
            title: I18N.supplyChainCarbonManagement.singlePriceElement,
            required: false,
            'x-component': 'NumberPicker',
            'x-component-props': {
              controls: false,
            },
            'x-reactions': {
              target: '.unitPrice',
              when: '{{!!$self.value}}',
              fulfill: {
                state: {
                  required: true,
                  validator: (value: number) =>
                    // @ts-ignore
                    RegValue(
                      value,
                      9999999999.9999,
                      0,
                      4,
                      I18N.supplyChainCarbonManagement.valueRange,
                    ),
                },
              },
              otherwise: {
                state: {
                  required: false,
                },
              },
            },
          }),
          emptyOne: renderEmptySchema(),
          supplierName: renderFormItemSchema({
            title: I18N.supplyChainCarbonManagement.merchantName,
            required: false,
            'x-disabled': true,
            'x-component': 'Input',
            'x-component-props': {
              maxLength: 100,
              placeholder: '-',
            },
          }),
          // orgName: renderFormItemSchema({
          //   title: I18N.carbonData.affiliatedOrganization,
          //   required: false,
          //   'x-disabled': true,
          //   'x-component': 'Input',
          //   'x-component-props': {
          //     placeholder: '-',
          //   },
          // }),
          supplierType_name: renderFormItemSchema({
            title: I18N.supplyChainCarbonManagement.merchantType,
            required: false,
            'x-disabled': true,
            'x-component': 'Input',
            'x-component-props': {
              placeholder: '-',
            },
          }),
          uniqueCode: renderFormItemSchema({
            title:
              I18N.supplyChainCarbonManagement
                .theSoleRepresentativeOfTheEnterprise,
            'x-component': 'Input',
            required: false,
            'x-disabled': true,
            'x-component-props': {
              placeholder: '-',
            },
          }),
          contactEmail: renderFormItemSchema({
            title: I18N.supplyChainCarbonManagement.contactEmail,
            'x-component': 'Input',
            required: false,
            'x-disabled': true,
            'x-component-props': {
              maxLength: 50,
              placeholder: '-',
            },
          }),
          supplierCode: renderFormItemSchema({
            title: I18N.supplyChainCarbonManagement.merchantCode,
            'x-component': 'Input',
            'x-component-props': {
              maxLength: 50,
              placeholder: '-',
            },
            required: false,
            'x-disabled': true,
          }),
          contactName: renderFormItemSchema({
            title: I18N.supplyChainCarbonManagement.contactName,
            'x-component': 'Input',
            'x-component-props': {
              maxLength: 50,
              placeholder: '-',
            },
            required: false,
            'x-disabled': true,
          }),
          contactMobile: renderFormItemSchema({
            title: I18N.supplyChainCarbonManagement.cellPhone,
            required: false,
            'x-disabled': true,
            'x-component': 'NumberPicker',
            'x-component-props': {
              maxLength: 11,
              placeholder: '-',
            },
          }),
          uscc: renderFormItemSchema({
            title: I18N.supplyChainCarbonManagement.socialCreditAgency,
            'x-component': 'Input',
            'x-component-props': {
              maxLength: 18,
              placeholder: '-',
            },
            required: false,
            'x-disabled': true,
          }),
          emptyTwo: renderEmptySchema(),
          remark: renderFormItemSchema({
            title: I18N.dashborad.remarks,
            required: false,
            'x-disabled': true,
            'x-decorator-props': {
              gridSpan: 2,
            },
            'x-component': 'TextArea',
            'x-component-props': {
              placeholder: '-',
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
