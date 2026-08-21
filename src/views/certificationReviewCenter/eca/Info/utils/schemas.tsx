import { ISchema } from '@formily/react';
import I18N from '@src/lang/I18N';
import { TreeProps } from 'antd';
import { TreeNodeNormal } from 'antd/lib/tree/Tree';

import {
  renderEmptySchema,
  renderFormilyTableAction,
  renderFormItemSchema,
} from '@/components/formily/utils';
import { CertifiCatioinReviewCenterMaps } from '@/router/utils/certificationReviewCenterEmums';
import {
  PAGE_TYPE_VAR,
  PageTypeInfo,
  virtualLinkTransform,
} from '@/router/utils/enums';
import { LCARouteMaps } from '@/router/utils/lcaEnums';
import { shakingObj } from '@/utils';
// import { publishYear } from '@/views/Factors/utils';
import { InputTextLength50, RegPhone } from '@/views/eca/util/type';

const { show } = PageTypeInfo;

/** CBAM表格信息 */
export const cbamSchema = (id?: string, pageTypeInfo?: string): ISchema => {
  return {
    type: 'object',
    properties: {
      layout: {
        type: 'void',
        'x-component': 'FormLayout',
        'x-component-props': {
          layout: 'vertical',
        },
        properties: {
          grid: {
            type: 'void',
            'x-component': 'FormGrid',
            'x-component-props': {
              rowGap: 2,
              maxColumns: 1,
              minColumns: 1,
            },
            properties: {
              cbamList: {
                type: 'array',
                'x-decorator-props': { gridSpan: 24 },
                'x-decorator': 'FormItem',
                'x-component': 'ArrayTable',
                'x-component-props': {
                  pagination: false,
                  scroll: { x: 1200 },
                  className: 'centerTable',
                },
                items: {
                  properties: shakingObj({
                    columns1: {
                      type: 'void',
                      'x-component': 'ArrayTable.Column',
                      'x-component-props': {
                        title: I18N.cbam.reportName,
                      },
                      properties: {
                        reportName: renderEmptySchema(
                          { type: 'string' },
                          {
                            showVal: row => `${row?.reportName || '-'}`,
                          },
                        ),
                      },
                    },
                    columns2: {
                      type: 'void',
                      'x-component': 'ArrayTable.Column',
                      'x-component-props': {
                        title: I18N.carbonData.affiliatedOrganization,
                      },
                      properties: {
                        orgName: renderEmptySchema(
                          { type: 'string' },
                          {
                            showVal: row => `${row?.orgName || '-'}`,
                          },
                        ),
                      },
                    },
                    columns3: {
                      type: 'void',
                      'x-component': 'ArrayTable.Column',
                      'x-component-props': {
                        title: I18N.cbam.factoryName,
                      },
                      properties: {
                        factoryName: renderEmptySchema(
                          { type: 'string' },
                          {
                            showVal: row => `${row?.factoryName || '-'}`,
                          },
                        ),
                      },
                    },
                    // columns4: {
                    //   type: 'void',
                    //   'x-component': 'ArrayTable.Column',
                    //   'x-component-props': {
                    //     title: I18N.cbam.factoryNameInEnglish,
                    //   },
                    //   properties: {
                    //     factoryNameEn: renderEmptySchema(
                    //       { type: 'string' },
                    //       {
                    //         showVal: row => `${row?.factoryNameEn || '-'}`,
                    //       },
                    //     ),
                    //   },
                    // },
                    columns5: {
                      type: 'void',
                      'x-component': 'ArrayTable.Column',
                      'x-component-props': {
                        title: I18N.cbam.reportCycle,
                      },
                      properties: {
                        collectDate: renderEmptySchema(
                          { type: 'string' },
                          {
                            showVal: row => `${row?.collectDate || '-'}`,
                          },
                        ),
                      },
                    },
                    column8: renderFormilyTableAction({
                      actionBtns: ({ row }) => [
                        {
                          label: I18N.Factors.check,
                          key: 'del',
                          'x-component': 'ArrayTable.Remove',
                          onClick: async () => {
                            /** 是否是原始数据 是则直接查询cbam模块 否则查副本（与boss端一样） */
                            const isPendingSubmit = row.check;

                            if (row?.id) {
                              if (
                                isPendingSubmit ||
                                pageTypeInfo === PageTypeInfo.add
                              ) {
                                const url = virtualLinkTransform(
                                  CertifiCatioinReviewCenterMaps.certificationReviewCenterCbamInfoOriginCbam,
                                  [PAGE_TYPE_VAR, ':id'],
                                  [show, id],
                                );
                                window.open(`${url}?id=${row?.id}`);
                              } else {
                                const url = virtualLinkTransform(
                                  CertifiCatioinReviewCenterMaps.certificationReviewCenterCbamInfoCbam,
                                  [PAGE_TYPE_VAR, ':id'],
                                  [show, id],
                                );
                                window.open(
                                  `${url}?id=${row?.id}&authNo=${row?.authNo}`,
                                );
                              }
                            }
                          },
                        },
                      ],
                      wrapperProps: {
                        'x-component-props': {
                          width: 120,
                          fixed: 'right',
                        },
                      },
                    }),
                  }),
                },
              },
            },
          },
        },
      },
    },
  };
};

export type CheckInfo<T extends TreeNodeNormal = any> = Parameters<
  NonNullable<TreeProps<T>['onCheck']>
>[1];

// 减排信息
export const schema = (
  navigate: any,
  pageTypeInfo: string | number | undefined,
  id: string | undefined,
): ISchema => {
  return {
    type: 'object',
    properties: {
      layout: {
        type: 'void',
        'x-component': 'FormLayout',
        'x-component-props': {
          layout: 'vertical',
        },
        properties: {
          grid: {
            type: 'void',
            'x-component': 'FormGrid',
            'x-component-props': {
              rowGap: 2,
              maxColumns: 1,
              minColumns: 1,
            },
            properties: {
              carbonList: {
                type: 'array',
                'x-decorator-props': { gridSpan: 24 },
                'x-decorator': 'FormItem',
                'x-component': 'ArrayTable',
                'x-component-props': {
                  pagination: false,
                  scroll: { x: 1200 },
                  className: 'centerTable',
                },
                items: {
                  properties: shakingObj({
                    columns1: {
                      type: 'void',
                      'x-component': 'ArrayTable.Column',
                      'x-component-props': {
                        title: I18N.eca.accountingName,
                      },
                      properties: {
                        computationName: renderEmptySchema(
                          { type: 'string' },
                          {
                            showVal: row => `${row?.computationName || '-'}`,
                          },
                        ),
                      },
                    },
                    columns2: {
                      type: 'void',
                      'x-component': 'ArrayTable.Column',
                      'x-component-props': {
                        title: I18N.eca.accountingOrganization,
                      },
                      properties: {
                        orgName: renderEmptySchema(
                          { type: 'string' },
                          {
                            showVal: row => `${row?.orgName || '-'}`,
                          },
                        ),
                      },
                    },
                    columns3: {
                      type: 'void',
                      'x-component': 'ArrayTable.Column',
                      'x-component-props': {
                        title: I18N.components.accountingYear,
                      },
                      properties: {
                        year: renderEmptySchema(
                          { type: 'string' },
                          {
                            showVal: row => `${row?.year || '-'}`,
                          },
                        ),
                      },
                    },
                    columns4: {
                      type: 'void',
                      'x-component': 'ArrayTable.Column',
                      'x-component-props': {
                        title: I18N.eca.totalEmissionsT,
                      },
                      properties: {
                        carbonEmission: renderEmptySchema(
                          { type: 'string' },
                          {
                            showVal: row => `${row?.carbonEmission || '-'}`,
                          },
                        ),
                      },
                    },
                    columns5: {
                      type: 'void',
                      'x-component': 'ArrayTable.Column',
                      'x-component-props': {
                        title: I18N.eca.dataCollectionWeek,
                      },
                      properties: {
                        dataPeriod_name: renderEmptySchema(
                          { type: 'string' },
                          {
                            showVal: row => `${row?.dataPeriod_name || '-'}`,
                          },
                        ),
                      },
                    },
                    columns6: {
                      type: 'void',
                      'x-component': 'ArrayTable.Column',
                      'x-component-props': {
                        title: I18N.supplyChainCarbonManagement.gwpVersion,
                      },
                      properties: {
                        gwpVersion: renderEmptySchema(
                          { type: 'string' },
                          {
                            showVal: row => {
                              return `${row?.gwpVersion_name || '-'}`;
                            },
                          },
                        ),
                      },
                    },
                    columns7: {
                      type: 'void',
                      'x-component': 'ArrayTable.Column',
                      'x-component-props': {
                        title: I18N.Factors.updateTime,
                      },
                      properties: {
                        updateTime: renderEmptySchema(
                          { type: 'string' },
                          {
                            showVal: row => `${row?.updateTime || '-'}`,
                          },
                        ),
                      },
                    },
                    column8: renderFormilyTableAction({
                      actionBtns: ({ row }) => [
                        {
                          label: I18N.Factors.check,
                          key: 'del',
                          'x-component': 'ArrayTable.Remove',
                          onClick: async () => {
                            if (pageTypeInfo === PageTypeInfo.add) {
                              const url = virtualLinkTransform(
                                CertifiCatioinReviewCenterMaps.certificationReviewCenterEcaInfoChooseCarbonMissionInfo,
                                [
                                  PAGE_TYPE_VAR,
                                  ':id',
                                  ':CarbonMissionPageInfo',
                                  ':CarbonMissionId',
                                ],
                                [
                                  pageTypeInfo || PageTypeInfo.show,
                                  id || 0,
                                  PageTypeInfo.show,
                                  row.id,
                                ],
                              );
                              window.open(url);
                              return;
                            }
                            if (row.authAuditStatus !== 0) {
                              // 0 是待提交
                              const url = virtualLinkTransform(
                                CertifiCatioinReviewCenterMaps.certificationReviewCenterEcaCarbonMissionInfo,
                                [
                                  PAGE_TYPE_VAR,
                                  ':id',
                                  ':CarbonMissionPageTypeInfo',
                                  ':CarbonMissionPageTypeInfoType',
                                  ':authNo',
                                  ':computationDataId',
                                ],
                                [
                                  pageTypeInfo,
                                  id,
                                  PageTypeInfo.show,
                                  1,
                                  row.authNo,
                                  row.computationId,
                                ],
                              );
                              window.open(url);
                            } else {
                              // 待提交

                              window.open(
                                virtualLinkTransform(
                                  CertifiCatioinReviewCenterMaps.certificationReviewCenterEcaCarbonMissionInfo,
                                  [
                                    PAGE_TYPE_VAR,
                                    ':id',
                                    ':CarbonMissionPageTypeInfo',
                                    ':CarbonMissionPageTypeInfoType',
                                    ':authNo',
                                    ':computationDataId',
                                  ],
                                  [
                                    pageTypeInfo,
                                    id,
                                    PageTypeInfo.show,
                                    0,
                                    0,
                                    row.computationId,
                                  ],
                                ),
                              );
                            }

                            // array?.field?.remove(index);
                          },
                        },
                      ],
                      wrapperProps: {
                        'x-component-props': {
                          width: 120,
                          fixed: 'right',
                        },
                      },
                    }),
                  }),
                },
              },
            },
          },
        },
      },
    },
  };
};
export const footerSchema = (): ISchema => {
  return {
    type: 'object',
    properties: {
      layout: {
        type: 'void',
        'x-component': 'FormLayout',
        'x-component-props': {
          layout: 'vertical',
        },
        properties: {
          grid: {
            type: 'void',
            'x-component': 'FormGrid',
            'x-component-props': {
              rowGap: 2,
              maxColumns: 1,
              minColumns: 1,
            },
            properties: {
              footerList: {
                type: 'array',
                'x-decorator-props': { gridSpan: 24 },
                'x-decorator': 'FormItem',
                'x-component': 'ArrayTable',
                'x-component-props': {
                  pagination: false,
                  scroll: { x: 1200 },
                  className: 'centerTable',
                },
                items: {
                  properties: shakingObj({
                    columns1: {
                      type: 'void',
                      'x-component': 'ArrayTable.Column',
                      'x-component-props': {
                        title: I18N.carbonFootPrintLCA.modelName,
                      },
                      properties: {
                        modelName: renderEmptySchema(
                          { type: 'string' },
                          {
                            showVal: row => `${row?.modelName || '-'}`,
                          },
                        ),
                      },
                    },
                    columns2: {
                      type: 'void',
                      'x-component': 'ArrayTable.Column',
                      'x-component-props': {
                        title: I18N.certificationReviewCenter.modelCoding,
                      },
                      properties: {
                        modelCode: renderEmptySchema(
                          { type: 'string' },
                          {
                            showVal: row => `${row?.modelCode || '-'}`,
                          },
                        ),
                      },
                    },
                    columns3: {
                      type: 'void',
                      'x-component': 'ArrayTable.Column',
                      'x-component-props': {
                        title: I18N.carbonFootPrintLCA.functionalUnits,
                      },
                      properties: {
                        funcUnit: renderEmptySchema(
                          { type: 'string' },
                          {
                            showVal: row => `${row?.funcUnit || '-'}`,
                          },
                        ),
                      },
                    },
                    columns4: {
                      type: 'void',
                      'x-component': 'ArrayTable.Column',
                      'x-component-props': {
                        title: I18N.certificationReviewCenter.planName,
                      },
                      properties: {
                        planName: renderEmptySchema(
                          { type: 'string' },
                          {
                            showVal: row => `${row?.planName || '-'}`,
                          },
                        ),
                      },
                    },
                    columns5: {
                      type: 'void',
                      'x-component': 'ArrayTable.Column',
                      'x-component-props': {
                        title: I18N.certificationReviewCenter.evaluationMethods,
                      },
                      properties: {
                        assessmentMethodName: renderEmptySchema(
                          { type: 'string' },
                          {
                            showVal: row =>
                              `${row?.assessmentMethodName || '-'}`,
                          },
                        ),
                      },
                    },
                    columns6: {
                      type: 'void',
                      'x-component': 'ArrayTable.Column',
                      'x-component-props': {
                        title:
                          I18N.certificationReviewCenter.evaluatingIndicator,
                      },
                      properties: {
                        assessmentTargetNames: renderEmptySchema(
                          { type: 'string' },
                          {
                            showVal: row => {
                              return `${row?.assessmentTargetNames || '-'}`;
                            },
                          },
                        ),
                      },
                    },
                    columns7: {
                      type: 'void',
                      'x-component': 'ArrayTable.Column',
                      'x-component-props': {
                        title: I18N.carbonData.affiliatedOrganization,
                      },
                      properties: {
                        orgName: renderEmptySchema(
                          { type: 'string' },
                          {
                            showVal: row => `${row?.orgName || '-'}`,
                          },
                        ),
                      },
                    },
                    columns9: {
                      type: 'void',
                      'x-component': 'ArrayTable.Column',
                      'x-component-props': {
                        title: I18N.Factors.productName,
                      },
                      properties: {
                        productName: renderEmptySchema(
                          { type: 'string' },
                          {
                            showVal: row => `${row?.productName || '-'}`,
                          },
                        ),
                      },
                    },
                    columns10: {
                      type: 'void',
                      'x-component': 'ArrayTable.Column',
                      'x-component-props': {
                        title: I18N.Factors.updateTime,
                      },
                      properties: {
                        updateTime: renderEmptySchema(
                          { type: 'string' },
                          {
                            showVal: row => `${row?.updateTime || '-'}`,
                          },
                        ),
                      },
                    },
                    column8: renderFormilyTableAction({
                      actionBtns: ({ row }) => [
                        {
                          label: I18N.Factors.check,
                          key: 'del',
                          'x-component': 'ArrayTable.Remove',
                          onClick: async () => {
                            if (row.modelId) {
                              window.open(
                                `${LCARouteMaps.lcaModelInfo.replace(
                                  ':pageTypeInfo',
                                  `show`,
                                )}?id=${row.modelId}`,
                              );
                            }
                            // array?.field?.remove(index);
                          },
                        },
                      ],
                      wrapperProps: {
                        'x-component-props': {
                          width: 120,
                          fixed: 'right',
                        },
                      },
                    }),
                  }),
                },
              },
            },
          },
        },
      },
    },
  };
};
// 核算信息
export const accountInformationSchema = (
  pageTypeInfo?: PageTypeInfo,
  changauthNameFn?: (value: string) => void,
): ISchema => {
  return {
    type: 'object',
    properties: {
      layout: {
        type: 'void',
        'x-component': 'FormLayout',
        'x-component-props': {
          layout: 'vertical',
        },
        properties: {
          grid: {
            type: 'void',
            'x-component': 'FormGrid',
            'x-component-props': {
              rowGap: 2,
              columnGap: 24,
              maxColumns: 3,
              minColumns: 3,
            },
            properties: {
              authNo: {
                type: 'string',
                title: I18N.certificationReviewCenter.auditDocumentNumber,
                'x-validator': [
                  { required: true, message: I18N.eca.pleaseEnterTheReport },
                ],
                'x-decorator': 'FormItem',
                'x-component': 'Input',
                'x-component-props': {
                  placeholder: I18N.base.pleaseEnter,
                  maxLength: InputTextLength50,
                  style: { maxWidth: 400 },
                  disabled: true,
                },
              },
              authType: {
                type: 'string',
                title: I18N.certificationReviewCenter.documentType,
                'x-validator': [
                  {
                    required: true,
                    message: I18N.Factors.pleaseSelect,
                  },
                ],
                'x-decorator': 'FormItem',
                'x-component': 'Select',
                'x-component-props': {
                  onChange: (value: string) => {
                    changauthNameFn?.(value);
                  },
                  disabled: pageTypeInfo !== PageTypeInfo.add,
                  placeholder: I18N.Factors.pleaseSelect,
                  showSearch: true,
                  filterOption: (input: string, option: any) =>
                    (option?.label ?? '')
                      .toLowerCase()
                      .includes(input.toLowerCase()),
                },
              },
              authName: {
                type: 'string',
                title: I18N.certificationReviewCenter.documentName,
                'x-validator': [
                  { required: true, message: I18N.base.pleaseEnter },
                ],
                'x-decorator': 'FormItem',
                'x-component': 'Input',
                'x-component-props': {
                  placeholder: I18N.base.pleaseEnter,
                  maxLength: InputTextLength50,
                  style: { maxWidth: 400 },
                },
              },
            },
          },
        },
      },
    },
  };
};
// 报告负责人信息
export const reportInformationSchema = (authType: number): ISchema => {
  return {
    type: 'object',
    properties: {
      layout: {
        type: 'void',
        'x-component': 'FormLayout',
        'x-component-props': {
          layout: 'vertical',
        },
        properties: {
          grid: {
            type: 'void',
            'x-component': 'FormGrid',
            'x-component-props': {
              rowGap: 2,
              columnGap: 24,
              maxColumns: 3,
              minColumns: 3,
            },

            properties: {
              companyName: renderFormItemSchema({
                type: 'string',
                required: false,
                title:
                  I18N.supplyChainCarbonManagement.carbonAccountingEnterprises,
                'x-decorator': 'FormItem',
                'x-component': 'Input',
                'x-component-props': {
                  placeholder: I18N.base.pleaseEnter,
                  maxLength: InputTextLength50,
                  style: { maxWidth: 400 },
                  disabled: true,
                },
                'x-reactions': {
                  dependencies: ['authType'],
                  fulfill: {
                    schema: {
                      'x-visible': `{{($deps[0] === 1)}}`,
                    },
                  },
                },
              }),
              year: {
                type: 'string',
                title: I18N.components.accountingYear,
                required: false,
                'x-validator': RegPhone,
                'x-decorator': 'FormItem',
                'x-component': 'Input',
                'x-component-props': {
                  placeholder: I18N.base.pleaseEnter,
                  disabled: true,
                },
                'x-reactions': {
                  dependencies: ['authType'],
                  fulfill: {
                    schema: {
                      'x-visible': `{{($deps[0] === 1)}}`,
                    },
                  },
                },
              },

              productName: renderFormItemSchema({
                type: 'string',
                required: false,
                title: I18N.Factors.productName,
                'x-decorator': 'FormItem',
                'x-component': 'Input',
                'x-component-props': {
                  placeholder: I18N.base.pleaseEnter,
                  maxLength: InputTextLength50,
                  style: { maxWidth: 400 },
                  disabled: true,
                },
                'x-reactions': {
                  dependencies: ['authType'],
                  fulfill: {
                    schema: {
                      'x-visible': `{{($deps[0] === 2)}}`,
                    },
                  },
                },
              }),
              baselineUnitName: {
                type: 'string',
                title: I18N.carbonFootPrint.accountingUnit,
                required: false,
                'x-decorator': 'FormItem',
                'x-component': 'Input',
                'x-component-props': {
                  placeholder: I18N.base.pleaseEnter,
                  disabled: true,
                },
                'x-reactions': {
                  dependencies: ['authType'],
                  fulfill: {
                    schema: {
                      'x-visible': `{{($deps[0] === 2)}}`,
                    },
                  },
                },
              },
              specification: {
                type: 'string',
                title: I18N.carbonFootPrintLCA.specificationAndModel,
                required: false,
                'x-decorator': 'FormItem',
                'x-component': 'Input',
                'x-component-props': {
                  placeholder: I18N.base.pleaseEnter,
                  disabled: true,
                },
                'x-reactions': {
                  dependencies: ['authType'],
                  fulfill: {
                    schema: {
                      'x-visible': `{{($deps[0] === 2)}}`,
                    },
                  },
                },
              },
              reportId: {
                type: 'string',
                title: I18N.eca.accountingReport,
                required: true,
                'x-validator': [
                  {
                    required: true,
                    message: I18N.Factors.pleaseSelect,
                  },
                ],
                'x-decorator-props': {
                  gridSpan: 1,
                  tooltip: authType === 1 && (
                    <div>
                      {I18N.certificationReviewCenter.accountingReportsSuchAs}
                    </div>
                  ),
                },
                'x-decorator': 'FormItem',
                'x-component': 'Select',
                'x-component-props': {
                  placeholder: I18N.Factors.pleaseSelect,
                  maxLength: 100,
                },
                'x-reactions': {
                  dependencies: ['authType'],
                  fulfill: {
                    schema: {
                      'x-visible': `{{($deps[0] !== 3)}}`,
                    },
                  },
                },
              },
            },
          },
        },
      },
    },
  };
};
// 证明材料
export const uploadMaterialSchema = (): ISchema => {
  return {
    type: 'object',
    properties: {
      layout: {
        type: 'void',
        'x-component': 'FormLayout',
        'x-component-props': {
          layout: 'vertical',
        },
        properties: {
          grid: {
            type: 'void',
            'x-component': 'FormGrid',
            'x-component-props': {
              rowGap: 2,
              columnGap: 24,
              maxColumns: 2,
              minColumns: 1,
            },
            properties: {
              supportFile: {
                type: 'string',
                title: I18N.carbonFootPrint.uploadFiles,
                'x-decorator': 'FormItem',
                'x-component': 'FormilyFileUpload',
                'x-decorator-props': {
                  gridSpan: 3,
                },
                'x-component-props': {
                  maxCount: 10,
                  isEdit: true,
                },
              },
            },
          },
        },
      },
    },
  };
};
