import I18N from '@src/lang/I18N';

import {
  renderFormItemSchema,
  renderSchemaWithLayout,
  renderFromGridSchema,
  renderEmptySchema,
} from '@/components/formily/utils';

/** 产品碳足迹数据请求的schemas */
export const productInfoSchema = (isFill?: boolean) => {
  return renderSchemaWithLayout(
    {},
    {
      grid: {
        ...renderFromGridSchema(),
        properties: {
          companyName: renderFormItemSchema({
            title: I18N.supplyChainCarbonManagement.customerName,
            required: false,
            'x-component': 'Input',
            'x-visible': isFill,
          }),
          supplierName: renderFormItemSchema({
            title: I18N.carbonFootPrint.supplierName,
            required: false,
            'x-component': 'Input',
            'x-visible': !isFill,
          }),
          productName: renderFormItemSchema({
            title: I18N.supplyChainCarbonManagement.purchaseProductName,
            required: false,
            'x-component': 'Input',
          }),
          productUnit: renderFormItemSchema({
            title: I18N.carbonFootPrint.accountingUnit,
            required: false,
            'x-component': 'Cascader',
            'x-component-props': {
              showSearch: true,
            },
          }),
          materialNo: renderFormItemSchema({
            title: I18N.supplyChainCarbonManagement.materialNumber,
            required: false,
            'x-component': 'Input',
            'x-visible': !isFill,
          }),
          supplierMaterialNo: renderFormItemSchema({
            title: I18N.supplyChainCarbonManagement.supplierMaterials,
            required: false,
            'x-component': 'Input',
          }),
          sourceSystem_name: renderFormItemSchema({
            title: I18N.supplyChainCarbonManagement.sourceSystem,
            required: false,
            'x-component': 'Input',
          }),
          productModel: renderFormItemSchema({
            title: I18N.carbonFootPrintLCA.specificationAndModel,
            required: false,
            'x-component': 'Input',
          }),
          dataCode: renderFormItemSchema({
            title: I18N.supplyChainCarbonManagement.supplierData,
            required: false,
            'x-component': 'Input',
            'x-visible': !isFill,
          }),
          deadline: renderFormItemSchema({
            title: I18N.supplyChainCarbonManagement.deadline,
            required: false,
            'x-component': 'Input',
          }),
          applyType_name: renderFormItemSchema({
            title: I18N.supplyChainCarbonManagement.dataRequestClass,
            required: false,
            'x-component': 'Input',
          }),
          assessmentMethodName: renderFormItemSchema({
            title: I18N.certificationReviewCenter.evaluationMethods,
            required: false,
            'x-component': 'Input',
          }),
          assessmentTargetNames: renderFormItemSchema({
            title: I18N.certificationReviewCenter.evaluatingIndicator,
            required: false,
            'x-component': 'Input',
          }),
          systemBoundaryType_name: renderFormItemSchema({
            title: I18N.supplyChainCarbonManagement.theSystemBoundaryNeedsTo,
            required: false,
            'x-component': 'Input',
          }),
          applyRealName: renderFormItemSchema({
            title: I18N.supplyChainCarbonManagement.applicant,
            'x-component': 'Input',
          }),
          applyMobile: renderFormItemSchema({
            title: I18N.supplyChainCarbonManagement.applicantContact,
            'x-component': 'Input',
          }),
          applyTime: renderFormItemSchema({
            title: I18N.supplyChainCarbonManagement.applicationTime,
            'x-component': 'Input',
          }),
          empty: renderEmptySchema({
            'x-decorator-props': {
              gridSpan: 3,
            },
          }),
          remark: renderFormItemSchema({
            title: I18N.dashborad.remarks,
            required: false,
            'x-component': 'TextArea',
            'x-decorator-props': {
              gridSpan: 3,
            },
          }),
          supportFile: {
            required: false,
            type: 'array',
            title: I18N.certificationReviewCenter.proofMaterials,
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
};
