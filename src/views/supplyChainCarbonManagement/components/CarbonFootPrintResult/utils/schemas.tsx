/* eslint-disable @typescript-eslint/no-loss-of-precision */

/*
 * @@description:
 * @Author: liuxinxin xinxin@carbonstop.net
 * @Date: 2023-05-25 15:31:36
 * @LastEditors: liuxinxin xinxin@carbonstop.net
 * @LastEditTime: 2023-06-20 17:20:22
 */
import I18N from '@src/lang/I18N';

import {
  renderFormItemSchema,
  renderSchemaWithLayout,
  renderFromGridSchema,
  renderEmptySchema,
} from '@/components/formily/utils';
import { RegValue } from '@/views/supplyChainCarbonManagement/utils';

export const validatorStageValue = (value: number) =>
  RegValue(
    value,
    9999999999.999999,
    -9999999999.999999,
    6,
    I18N.supplyChainCarbonManagement.valueRange2,
  );

export const schema = () => {
  return renderSchemaWithLayout(
    {},
    {
      grid: {
        ...renderFromGridSchema(),
        properties: {
          supplierName: renderFormItemSchema({
            title: I18N.carbonFootPrint.supplierName,
            required: false,
            'x-component': 'Input',
            'x-disabled': true,
            // 'x-visible': currentModalType === 'supplierSelect',
          }),
          productName: renderFormItemSchema({
            title: I18N.Factors.productName,
            required: false,
            'x-component': 'Input',
            'x-disabled': true,
          }),
          productUnit: renderFormItemSchema({
            title: I18N.carbonFootPrint.accountingUnit,
            required: false,
            'x-component': 'Input',
            'x-disabled': true,
          }),
          productModel: renderFormItemSchema({
            title: I18N.carbonFootPrintLCA.specificationAndModel,
            required: false,
            'x-component': 'Input',
            'x-disabled': true,
          }),
          dataRequestType: renderFormItemSchema({
            title: I18N.supplyChainCarbonManagement.dataRequestClass,
            required: false,
            'x-component': 'Input',
            'x-disabled': true,
          }),
          productionCycle: renderFormItemSchema({
            title: I18N.carbonFootPrintLCA.productionCycle,
            required: false,
            'x-component': 'Input',
            'x-disabled': true,
          }),
          auditStatus: renderFormItemSchema({
            title: I18N.supplyChainCarbonManagement.reviewStatus,
            required: false,
            'x-component': 'Input',
            'x-disabled': true,
          }),
          empty1: renderEmptySchema({
            'x-decorator-props': {
              gridSpan: 2,
            },
          }),
          systemBoundaryRequirements: renderFormItemSchema({
            title: I18N.supplyChainCarbonManagement.theSystemBoundaryNeedsTo,
            required: false,
            'x-component': 'Input',
            'x-disabled': true,

            'x-decorator-props': {
              gridSpan: 3,
            },
          }),
          evaluationMethod: renderFormItemSchema({
            title: I18N.certificationReviewCenter.evaluationMethods,
            required: false,
            'x-component': 'Input',
            'x-disabled': true,
          }),
          functionalUnit: renderFormItemSchema({
            title: I18N.carbonFootPrintLCA.functionalUnits,
            required: false,
            'x-component': 'Input',
            'x-disabled': true,
          }),
          empty3: renderEmptySchema({
            'x-decorator-props': {
              gridSpan: 2,
            },
          }),
          planeImg: {
            type: 'string',
            title: I18N.certificationReviewCenter.proofMaterials,
            'x-decorator': 'FormItem',
            'x-decorator-props': {
              gridSpan: 3,
            },
            'x-component': 'FormilyFileUpload',
            'x-component-props': {
              maxCount: 5,
              isEdit: true,
              listType: 'text',
            },
          },
          // gasList: {
          //   title: I18N.components.emissionFactors2,
          //   type: 'array',
          //   'x-component': 'ArrayTable',
          //   'x-decorator-props': {
          //     gridSpan: 3,
          //   },
          //   'x-decorator': 'FormItem',
          //   'x-component-props': {
          //     pagination: false,
          //   },
          //   items: {
          //     properties: {
          //       columns0: {
          //         type: 'void',
          //         'x-component': 'ArrayTable.Column',
          //         'x-component-props': {
          //           title: '序号',
          //         },
          //         properties: {
          //           gasType: renderEmptySchema(
          //             { type: 'string' },
          //             {
          //               showVal: (_, index) => `${index}`,
          //             },
          //           ),
          //         },
          //       },
          //       columns1: {
          //         type: 'void',
          //         'x-component': 'ArrayTable.Column',
          //         'x-component-props': {
          //           title: '评价指标',
          //         },
          //         properties: {
          //           gasType: renderEmptySchema(
          //             { type: 'string' },
          //             {
          //               showVal: (_, index) => `${index}`,
          //             },
          //           ),
          //         },
          //       },
          //       columns2: {
          //         type: 'void',
          //         'x-component': 'ArrayTable.Column',
          //         'x-component-props': {
          //           title: '单位',
          //         },
          //         properties: {
          //           gasType: renderEmptySchema(
          //             { type: 'string' },
          //             {
          //               showVal: (_, index) => `${index}`,
          //             },
          //           ),
          //         },
          //       },
          //       columns3: {
          //         type: 'void',
          //         'x-component': 'ArrayTable.Column',
          //         'x-component-props': {
          //           title: '单位产品环境影响评价结果',
          //         },
          //         properties: {
          //           gasType: renderEmptySchema(
          //             { type: 'string' },
          //             {
          //               showVal: (_, index) => `${index}`,
          //             },
          //           ),
          //         },
          //       },
          //     },
          //   },
          // },
        },
      },
    },
  );
};
