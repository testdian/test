import I18N from '@src/lang/I18N';
import moment, { Moment } from 'moment';

import {
  renderFormItemSchema,
  renderSchemaWithLayout,
  renderFromGridSchema,
  renderEmptySchema,
} from '@/components/formily/utils';

import { impactAssessmentColumns } from './columns';

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
              placeholder: '-',
              maxLength: 100,
            },
            'x-disabled': true,
          }),
          productName: renderFormItemSchema({
            title: I18N.supplyChainCarbonManagement.purchaseProductName,
            required: false,
            'x-component': 'Input',
            'x-component-props': {
              placeholder: '-',
              maxLength: 50,
            },
            'x-disabled': true,
          }),
          productUnit: renderFormItemSchema({
            title: I18N.carbonFootPrint.accountingUnit,
            required: false,
            'x-component': 'Cascader',
            'x-component-props': {
              placeholder: '-',
            },
            'x-disabled': true,
          }),
          materialNo: renderFormItemSchema({
            title: I18N.supplyChainCarbonManagement.materialNumber,
            required: false,
            'x-component': 'Input',
            'x-component-props': {
              placeholder: '-',
              maxLength: 100,
            },
            'x-disabled': true,
          }),
          supplierMaterialNo: renderFormItemSchema({
            title: I18N.supplyChainCarbonManagement.supplierMaterials,
            required: false,
            'x-component': 'Input',
            'x-component-props': {
              placeholder: '-',
              maxLength: 100,
            },
            'x-disabled': true,
          }),
          sourceSystem_name: renderFormItemSchema({
            title: I18N.supplyChainCarbonManagement.sourceSystem,
            required: false,
            'x-component': 'Input',
            'x-component-props': {
              placeholder: '-',
            },
            'x-disabled': true,
          }),
          productModel: renderFormItemSchema({
            title: I18N.carbonFootPrintLCA.specificationAndModel,
            required: false,
            'x-component': 'Input',
            'x-component-props': {
              placeholder: '-',
              maxLength: 50,
            },
            'x-disabled': true,
          }),
          dataCode: renderFormItemSchema({
            title: I18N.supplyChainCarbonManagement.supplierData,
            required: false,
            'x-component': 'Input',
            'x-disabled': true,
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
          assessmentMethod: renderFormItemSchema({
            title: I18N.certificationReviewCenter.evaluationMethods,
            required: true,
            'x-component': 'Select',
          }),
          applyType: renderFormItemSchema({
            title: I18N.supplyChainCarbonManagement.dataRequestClass,
            'x-component': 'Radio.Group',
          }),
          systemBoundaryType: renderFormItemSchema({
            title: I18N.supplyChainCarbonManagement.theSystemBoundaryNeedsTo,
            'x-component': 'Radio.Group',
          }),
          assessmentTargetList: renderFormItemSchema({
            title: I18N.certificationReviewCenter.evaluatingIndicator,
            type: 'array',
            'x-component': 'FormilySelectableTable',
            'x-component-props': {
              columns: impactAssessmentColumns(),
              pagination: false,
              scroll: { y: '160px' },
              bordered: true,
              rowKey: 'value',
            },
          }),
          empty1: renderEmptySchema({
            'x-decorator-props': {
              gridSpan: 2,
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
          title: {
            type: 'void',
            'x-decorator': 'FormItem',
            'x-component': 'FormilyCustomTitle',
            'x-decorator-props': {
              gridSpan: 3,
            },
            'x-component-props': {
              title: I18N.certificationReviewCenter.proofMaterials,
              level: 5,
              classNames: 'classFormilyCustomTitle',
            },
          },
          supportFile: {
            type: 'array',
            required: false,
            'x-decorator': 'FormItem',
            'x-decorator-props': {
              gridSpan: 2,
            },
            'x-component': 'FormilyFileUpload',
          },
        },
      },
    },
  );
