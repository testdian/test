import I18N from '@src/lang/I18N';

import {
  renderFormItemSchema,
  renderSchemaWithLayout,
  renderFromGridSchema,
} from '@/components/formily/utils';
import { RegEmail } from '@/views/supplyChainCarbonManagement/utils';

import { SUPPLIER_TYPE, SUPPLIER_WAY } from '../constant';

export const infoSchema = () =>
  renderSchemaWithLayout(
    {},
    {
      grid: {
        ...renderFromGridSchema(),

        properties: {
          supplierName: renderFormItemSchema({
            title: I18N.supplyChainCarbonManagement.merchantName,
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
          // }),
          supplierType: renderFormItemSchema({
            title: I18N.supplyChainCarbonManagement.merchantType,
            'x-component': 'Radio.Group',
            default: SUPPLIER_TYPE.SUPPLIER,
          }),
          createSupplierType: renderFormItemSchema({
            title: I18N.supplyChainCarbonManagement.createSupplierType,
            'x-component': 'Radio.Group',
            default: SUPPLIER_WAY.NEW_SUPPLIER,
          }),
          uniqueCode: renderFormItemSchema({
            title:
              I18N.supplyChainCarbonManagement
                .theSoleRepresentativeOfTheEnterprise,
            'x-component': 'Input',
            'x-disabled': true,
            required: false,
          }),
          contactEmail: renderFormItemSchema({
            title: I18N.supplyChainCarbonManagement.contactEmail,
            'x-component': 'Input',
            'x-component-props': {
              maxLength: 50,
            },
            'x-validator': (value: string) => {
              if (!value) return '';
              if (RegEmail(value)) return '';
              return I18N.supplyChainCarbonManagement.pleaseInputCorrectly2;
            },
          }),
          supplierCode: renderFormItemSchema({
            title: I18N.supplyChainCarbonManagement.merchantCode,
            'x-component': 'Input',
            'x-component-props': {
              maxLength: 50,
            },
          }),
          contactName: renderFormItemSchema({
            title: I18N.supplyChainCarbonManagement.contactName,
            required: false,
            'x-component': 'Input',
            'x-component-props': {
              maxLength: 50,
            },
          }),
          contactMobile: renderFormItemSchema({
            title: I18N.supplyChainCarbonManagement.cellPhone,
            required: false,
            'x-component': 'NumberPicker',
            'x-component-props': {
              maxLength: 11,
            },
            'x-reactions': {
              fulfill: {
                state: {
                  selfErrors: `{{onCheckMobile($self.value)}}`,
                },
              },
            },
          }),
          uscc: renderFormItemSchema({
            title: I18N.supplyChainCarbonManagement.socialCreditAgency,
            'x-component': 'Input',
            'x-component-props': {
              maxLength: 18,
            },
            required: false,
            'x-reactions': {
              fulfill: {
                state: {
                  selfErrors: `{{onCheckUscc($self.value)}}`,
                },
              },
            },
          }),
          remark: renderFormItemSchema({
            title: I18N.dashborad.remarks,
            required: false,
            'x-decorator-props': {
              gridSpan: 3,
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
