/*
 * @@description:
 * @Author: liuxinxin xinxin@carbonstop.net
 * @Date: 2023-05-19 16:57:54
 * @LastEditors: liuxinxin xinxin@carbonstop.net
 * @LastEditTime: 2023-06-20 17:26:36
 */
import I18N from '@src/lang/I18N';

import {
  renderFormItemSchema,
  renderSchemaWithLayout,
  renderFromGridSchema,
} from '@/components/formily/utils';
import { RegValue } from '@/views/supplyChainCarbonManagement/utils';

const validatorValueFn = (value: number) =>
  RegValue(
    value,
    9999999999.999,
    -9999999999.999,
    3,
    I18N.supplyChainCarbonManagement.valueRange3,
  );

export const basicSchema = (hasAction?: boolean) =>
  renderSchemaWithLayout(
    {},
    {
      grid: {
        ...renderFromGridSchema(),
        properties: {
          supplierName: renderFormItemSchema({
            title: I18N.carbonFootPrint.supplierName,
            'x-component': 'Input',
            'x-disabled': true,
            'x-visible': !hasAction,
          }),
          orgName: renderFormItemSchema({
            title: I18N.supplyChainCarbonManagement.carbonAccountingEnterprises,
            required: false,
            'x-component': 'Input',
            'x-disabled': true,
            'x-visible': hasAction,
          }),
          year: renderFormItemSchema({
            title: I18N.components.accountingYear,
            required: false,
            'x-component': 'Input',
            'x-disabled': true,
          }),
          total: renderFormItemSchema({
            title: I18N.eca.totalEmissionsT,
            'x-component': 'NumberPicker',
            'x-validator': (value: number) => validatorValueFn(value),
          }),
        },
      },
    },
  );

export const ghgSchema = (ghgCategoriesCode?: number[]) =>
  renderSchemaWithLayout(
    {},
    {
      grid: {
        ...renderFromGridSchema(),
        properties: {
          scopeOne: renderFormItemSchema({
            title: I18N.supplyChainCarbonManagement.scope1Emissions,
            required: false,
            'x-component': 'NumberPicker',
            'x-visible': ghgCategoriesCode && ghgCategoriesCode.includes(1),
            'x-reactions': {
              target: '.scopeOne',
              when: '{{!!$self.value}}',
              fulfill: {
                state: {
                  required: true,
                  validator: (value: number) => validatorValueFn(value),
                },
              },
              otherwise: {
                state: {
                  required: false,
                },
              },
            },
          }),
          scopeTwo: renderFormItemSchema({
            title: I18N.supplyChainCarbonManagement.scope2Emissions,
            required: false,
            'x-component': 'NumberPicker',
            'x-visible': ghgCategoriesCode && ghgCategoriesCode.includes(2),
            'x-reactions': {
              target: '.scopeTwo',
              when: '{{!!$self.value}}',
              fulfill: {
                state: {
                  required: true,
                  validator: (value: number) => validatorValueFn(value),
                },
              },
              otherwise: {
                state: {
                  required: false,
                },
              },
            },
          }),
          scopeThree: renderFormItemSchema({
            title: I18N.supplyChainCarbonManagement.scopeThreeEmissions,
            required: false,
            'x-component': 'NumberPicker',
            'x-visible': ghgCategoriesCode && ghgCategoriesCode.includes(3),
            'x-reactions': {
              target: '.scopeThree',
              when: '{{!!$self.value}}',
              fulfill: {
                state: {
                  required: true,
                  validator: (value: number) => validatorValueFn(value),
                },
              },
              otherwise: {
                state: {
                  required: false,
                },
              },
            },
          }),
        },
      },
    },
  );

export const isoSchema = (isoCategoriesCode?: number[]) =>
  renderSchemaWithLayout(
    {},
    {
      grid: {
        ...renderFromGridSchema(),
        properties: {
          direct: renderFormItemSchema({
            title: I18N.supplyChainCarbonManagement.directDischargeOr,
            required: false,
            'x-component': 'NumberPicker',
            'x-visible': isoCategoriesCode && isoCategoriesCode.includes(1),
            'x-reactions': {
              target: '.direct',
              when: '{{!!$self.value}}',
              fulfill: {
                state: {
                  required: true,
                  validator: (value: number) => validatorValueFn(value),
                },
              },
              otherwise: {
                state: {
                  required: false,
                },
              },
            },
          }),
          energy: renderFormItemSchema({
            title: I18N.supplyChainCarbonManagement.indirectEnergyEmissions,
            required: false,
            'x-component': 'NumberPicker',
            'x-visible': isoCategoriesCode && isoCategoriesCode.includes(2),
            'x-reactions': {
              target: '.energy',
              when: '{{!!$self.value}}',
              fulfill: {
                state: {
                  required: true,
                  validator: (value: number) => validatorValueFn(value),
                },
              },
              otherwise: {
                state: {
                  required: false,
                },
              },
            },
          }),
          transport: renderFormItemSchema({
            title:
              I18N.supplyChainCarbonManagement.transportationIndirectDischarge,
            required: false,
            'x-component': 'NumberPicker',
            'x-visible': isoCategoriesCode && isoCategoriesCode.includes(3),
            'x-reactions': {
              target: '.transport',
              when: '{{!!$self.value}}',
              fulfill: {
                state: {
                  required: true,
                  validator: (value: number) => validatorValueFn(value),
                },
              },
              otherwise: {
                state: {
                  required: false,
                },
              },
            },
          }),
          outsourcing: renderFormItemSchema({
            title: I18N.supplyChainCarbonManagement.outsourcedProductsOr,
            required: false,
            'x-component': 'NumberPicker',
            'x-visible': isoCategoriesCode && isoCategoriesCode.includes(4),
            'x-reactions': {
              target: '.outsourcing',
              when: '{{!!$self.value}}',
              fulfill: {
                state: {
                  required: true,
                  validator: (value: number) => validatorValueFn(value),
                },
              },
              otherwise: {
                state: {
                  required: false,
                },
              },
            },
          }),
          supplyChain: renderFormItemSchema({
            title: I18N.supplyChainCarbonManagement.downstreamOfSupplyChain,
            required: false,
            'x-component': 'NumberPicker',
            'x-visible': isoCategoriesCode && isoCategoriesCode.includes(5),
            'x-reactions': {
              target: '.supplyChain',
              when: '{{!!$self.value}}',
              fulfill: {
                state: {
                  required: true,
                  validator: (value: number) => validatorValueFn(value),
                },
              },
              otherwise: {
                state: {
                  required: false,
                },
              },
            },
          }),
          rests: renderFormItemSchema({
            title: I18N.supplyChainCarbonManagement.otherIndirectEmissions,
            required: false,
            'x-component': 'NumberPicker',
            'x-visible': isoCategoriesCode && isoCategoriesCode.includes(6),
            'x-reactions': {
              target: '.rests',
              when: '{{!!$self.value}}',
              fulfill: {
                state: {
                  required: true,
                  validator: (value: number) => validatorValueFn(value),
                },
              },
              otherwise: {
                state: {
                  required: false,
                },
              },
            },
          }),
        },
      },
    },
  );
