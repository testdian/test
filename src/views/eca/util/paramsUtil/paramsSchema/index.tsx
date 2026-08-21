/*
 * @@description:数据字段抽屉schemas
 */
import { InfoCircleFilled } from '@ant-design/icons';
import I18N from '@src/lang/I18N';
import { Tooltip } from 'antd';

import {
  renderFormItemSchema,
  renderFromGridSchema,
  renderSchemaWithLayout,
} from '@/components/formily/utils';

import {
  DEFAULT_SELECT,
  DEFAULT_VALUE,
  DEFAULT_VALUE_OPTIONS,
  INPUT_TYPE_OPTIONS,
  PARAMETER_TYPE,
  PARAMETER_TYPE_OPTIONS,
  UNIT_TYPE,
  UNIT_TYPE_OPTION,
} from './constant';
import style from './index.module.less';
import { COMMON_PARAM_TYPE } from '../../constant';
import {
  correctRangeClassConfig,
  correctRangeOptions,
  correctRangeOptionsMax,
  warningRangeClassConfig,
  warningRangeOptionsMax,
  warningRangeOptionsMin,
} from '../correctParams';

const { MONOMER_UNIT, COMPOUND_UNIT, NO_UNIT } = UNIT_TYPE;

const { TEXT, NUMBER, SELECT, ADDRESS } = COMMON_PARAM_TYPE;

const { GLOBAL_PARAMETER, DISTANCE_PARAMETER } = PARAMETER_TYPE;

const { YES } = DEFAULT_VALUE;

/** 参数管理、排放源库的参数共用schemas  */
export const initParamsSchema = () =>
  renderSchemaWithLayout(
    {},
    {
      grid: {
        ...renderFromGridSchema({
          columns: 2,
        }),
        properties: {
          paramName: renderFormItemSchema({
            title: I18N.eca.parameter,
            'x-component': 'Input',
            'x-component-props': {
              maxLength: 100,
            },
            /** 校验规则只能输入中英文 */
            'x-validator': [
              {
                pattern: /^[a-zA-Z\u4e00-\u9fa5]+$/,
                message: I18N.eca.parameterName,
              },
            ],
          }),
          // paramNameEn: renderFormItemSchema({
          //   title: I18N.eca.parameterNameEn,
          //   'x-component': 'Input',
          //   'x-component-props': {
          //     maxLength: 100,
          //   },
          //   /** 校验规则只能输入中英文，允许字符中间有空格 */
          //   'x-validator': [
          //     {
          //       pattern: /^[a-zA-Z\u4e00-\u9fa5\s]+$/,
          //       message: I18N.eca.parameterName,
          //     },
          //   ],
          // }),
          /** 参数类型 */
          paramScope: renderFormItemSchema({
            title: I18N.eca.type,
            'x-component': 'Radio.Group',
            enum: PARAMETER_TYPE_OPTIONS,
            default: GLOBAL_PARAMETER,
            'x-decorator-props': {
              gridSpan: 2,
            },
          }),
          paramCode: renderFormItemSchema({
            title: I18N.eca.parameterId,
            'x-component': 'Input',
            'x-component-props': {
              maxLength: 100,
            },
            'x-validator': [
              {
                pattern: /^(?!\d+$)[^ \u4e00-\u9fa5]+$/,
                message: I18N.eca.cannotInputPure,
              },
            ],
          }),
          paramAlias: renderFormItemSchema({
            title: I18N.eca.parameterAlias,
            required: false,
            'x-component': 'Input',
            'x-component-props': {
              maxLength: 100,
            },
          }),
          paramType: renderFormItemSchema({
            title: I18N.eca.parameterFormat,
            'x-decorator-props': {
              gridSpan: 2,
            },
            'x-component': 'Radio.Group',
            enum: INPUT_TYPE_OPTIONS,
            default: TEXT,
            'x-reactions': [
              {
                dependencies: ['paramScope'],
                fulfill: {
                  schema: {
                    'x-disabled': `{{$deps[0] === ${DISTANCE_PARAMETER} || $form.readPretty }}`,
                  },
                  state: {
                    value: `{{$deps[0] === ${DISTANCE_PARAMETER}? ${NUMBER} : $self.value}}`,
                  },
                },
              },
            ],
          }),
          /** textType/timeType 文本类型:textType字段/时间类型：timeType字段 */
          textType: renderFormItemSchema({
            validateTitle: I18N.eca.parameterFormat,
            'x-decorator-props': {
              gridSpan: 2,
            },
            'x-component': 'FormliySelectButton',
            default: DEFAULT_SELECT,
          }),
          len: renderFormItemSchema({
            title: I18N.eca.maximumCharacterLength,
            'x-component': 'NumberPicker',
            'x-component-props': {
              placeholder: I18N.base.pleaseEnter,
              formatter: (v: string | number) => `${v}`,
              precision: 0,
              min: 1,
              max: 5000,
            },
            'x-reactions': {
              dependencies: ['paramType'],
              fulfill: {
                schema: {
                  'x-visible': `{{$deps[0] === ${TEXT}}}`,
                },
              },
            },
          }),
          decimal_place: renderFormItemSchema({
            title: I18N.eca.maximumSizeDigit,
            'x-component': 'NumberPicker',
            'x-decorator-props': {
              gridSpan: 2,
            },
            'x-component-props': {
              placeholder: I18N.base.pleaseEnter,
              formatter: (v: string | number) => `${v}`,
              precision: 0,
              min: 0,
              max: 10,
            },
            'x-reactions': {
              dependencies: ['paramType'],
              fulfill: {
                schema: {
                  'x-visible': `{{$deps[0] === ${NUMBER}}}`,
                },
              },
            },
          }),
          /** 数值正确区间 */
          correctRangeClass: {
            type: 'void',
            title: (
              <Tooltip title={I18N.eca.correctNumericalValues}>
                {I18N.eca.numericalAccuracyZone}{' '}
                <InfoCircleFilled
                  style={{
                    color: '#002855',
                  }}
                />
              </Tooltip>
            ),
            'x-decorator': 'FormItem',
            'x-decorator-props': {
              gridSpan: 2,
            },
            'x-component': 'FormGrid',
            properties: {
              /** 最小值值 */
              correctRangeClassMinNum: {
                type: 'number',
                'x-decorator': 'FormItem',
                'x-component': 'NumberPicker',
                'x-reactions': correctRangeClassConfig,
              },
              /** 最小值选项 */
              correctRangeClassMinSymbol: {
                type: 'number',
                enum: correctRangeOptions,
                'x-decorator': 'FormItem',
                'x-decorator-props': {
                  addonAfter: I18N.eca.intervalValue,
                },
                'x-component': 'Select',
                'x-component-props': {
                  allowClear: true,
                },
              },
              /** 最大值选项 */
              correctRangeClassMaxSymbol: {
                enum: correctRangeOptionsMax,
                type: 'number',
                'x-decorator': 'FormItem',
                'x-component': 'Select',
                'x-component-props': {
                  allowClear: true,
                },
              },
              /** 最大值值 */
              correctRangeClassMaxNum: {
                type: 'number',
                'x-decorator': 'FormItem',
                'x-component': 'NumberPicker',
                'x-reactions': correctRangeClassConfig,
              },
            },
            'x-reactions': [
              {
                dependencies: ['paramType'],
                fulfill: {
                  schema: {
                    'x-visible': `{{$deps[0] === ${NUMBER}}}`,
                  },
                },
              },
            ],
          },
          /** 数值警告区间 */
          warningRangeClass: {
            type: 'void',
            title: (
              <Tooltip title={I18N.eca.warningOfNumericalValues}>
                {I18N.eca.numericalWarningZone}{' '}
                <InfoCircleFilled
                  style={{
                    color: '#002855',
                  }}
                />
              </Tooltip>
            ),
            'x-decorator': 'FormItem',
            'x-decorator-props': {
              gridSpan: 2,
            },
            'x-component': 'FormGrid',
            properties: {
              /** 最小值值 */
              warningRangeClassMinNum: {
                type: 'number',
                'x-decorator': 'FormItem',
                'x-component': 'NumberPicker',
                'x-reactions': warningRangeClassConfig,
              },
              /** 最小值选项 */
              warningRangeClassMinSymbol: {
                type: 'number',
                enum: warningRangeOptionsMin,
                'x-decorator': 'FormItem',
                'x-decorator-props': {
                  addonAfter: I18N.eca.intervalValue,
                },
                'x-component': 'Select',
                'x-component-props': {
                  allowClear: true,
                },
              },
              /** 最大值选项 */
              warningRangeClassMaxSymbol: {
                type: 'number',
                enum: warningRangeOptionsMax,
                'x-decorator': 'FormItem',
                'x-component': 'Select',
                'x-component-props': {
                  allowClear: true,
                },
              },
              /** 最大值值 */
              warningRangeClassMaxNum: {
                type: 'number',
                'x-decorator': 'FormItem',
                'x-component': 'NumberPicker',
                'x-reactions': warningRangeClassConfig,
              },
            },
            'x-reactions': [
              {
                dependencies: ['paramType'],
                fulfill: {
                  schema: {
                    'x-visible': `{{$deps[0] === ${NUMBER}}}`,
                  },
                },
              },
            ],
          },
          /** 数值错误区间 */
          errorRangeClass: {
            type: 'string',
            title: (
              <Tooltip title={I18N.eca.whenThereIsAWarning}>
                {I18N.eca.numericalErrorZone}{' '}
                <InfoCircleFilled
                  style={{
                    color: '#002855',
                  }}
                />
              </Tooltip>
            ),
            'x-decorator': 'FormItem',
            'x-decorator-props': {
              gridSpan: 2,
            },
            'x-component': 'Input',
            'x-disabled': true,
            'x-reactions': [
              {
                dependencies: [
                  'paramType',
                  'warningRangeClassMinNum',
                  'warningRangeClassMinSymbol',
                  'warningRangeClassMaxNum',
                  'warningRangeClassMaxSymbol',
                  'correctRangeClassMinNum',
                  'correctRangeClassMinSymbol',
                  'correctRangeClassMaxNum',
                  'correctRangeClassMaxSymbol',
                ],
                fulfill: {
                  schema: {
                    'x-visible': `{{$deps[0] === ${NUMBER}}}`,
                    'x-value': `{{ calculateErrorRange({
            paramType: $deps[0],
            warningMin: $deps[1],
            warningMinSymbol: $deps[2],
            warningMax: $deps[3],
            warningMaxSymbol: $deps[4],
            correctMin: $deps[5],
            correctMinSymbol: $deps[6],
            correctMax: $deps[7],
            correctMaxSymbol: $deps[8],
          }) }}`,
                  },
                },
              },
            ],
          },
          /** ==========参数格式为选项的数据============== */
          dictEnum: renderFormItemSchema({
            title: I18N.dashborad.enum,
            'x-component': 'Select',
            'x-component-props': {
              allowClear: true,
              showSearch: true,
              optionFilterProp: 'label',
            },
            'x-reactions': [
              {
                dependencies: ['paramType'],
                fulfill: {
                  schema: {
                    'x-visible': `{{$deps[0] === ${SELECT} || $deps[0] === ${ADDRESS}}}`,
                  },
                },
              },
            ],
          }),
          defaultFlag: renderFormItemSchema({
            title: I18N.eca.isThereADefaultValueAvailable,
            'x-component': 'Radio.Group',
            enum: DEFAULT_VALUE_OPTIONS,
            default: YES,
            'x-reactions': [
              {
                dependencies: ['paramType'],
                fulfill: {
                  schema: {
                    'x-visible': `{{$deps[0] === ${SELECT} || $deps[0] === ${ADDRESS}}}`,
                  },
                },
              },
            ],
          }),
          defaultValue: renderFormItemSchema({
            title: I18N.eca.defaultValue,
            'x-component': 'Select',
            'x-reactions': [
              {
                dependencies: ['paramType', 'defaultFlag'],
                fulfill: {
                  schema: {
                    'x-visible': `{{($deps[0] === ${SELECT} || $deps[0] === ${ADDRESS}) && $deps[1] === ${YES}}}`,
                  },
                },
              },
            ],
          }),
          /** ==========参数格式为选项的数据end============== */

          unitType: renderFormItemSchema({
            title: I18N.dashborad.unitType,
            'x-component': 'Radio.Group',
            enum: UNIT_TYPE_OPTION,
            default: MONOMER_UNIT,
            'x-reactions': {
              dependencies: ['paramType'],
              fulfill: {
                schema: {
                  'x-visible': `{{$deps[0] === ${NUMBER} || $deps[0] === ${SELECT}}}`,
                },
              },
            },
          }),
          compoundUnit: {
            type: 'void',
            title: I18N.Factors.unit,
            'x-decorator': 'FormItem',
            'x-component': 'FormGrid',
            'x-component-props': {
              className: style.gridWrapper,
            },
            'x-reactions': [
              {
                fulfill: {
                  schema: {
                    'x-decorator-props': {
                      asterisk: `{{!$form.readPretty}}`,
                    },
                  },
                },
              },
              {
                dependencies: ['paramType', 'unitType'],
                fulfill: {
                  schema: {
                    'x-visible': `{{($deps[0] === ${NUMBER} || $deps[0] === ${SELECT}) && $deps[1] !== ${NO_UNIT}}}`,
                  },
                },
              },
            ],
            properties: {
              unit1: renderFormItemSchema({
                'x-component': 'Cascader',
                'x-component-props': {
                  placeholder: I18N.Factors.pleaseSelect,
                  displayRender: (label: string[]) => {
                    if (!label) return '';
                    return label.slice(-1);
                  },
                  showSearch: true,
                },
              }),
              unit2: renderFormItemSchema({
                'x-decorator-props': {
                  addonBefore: '',
                },
                'x-component': 'Cascader',
                'x-component-props': {
                  placeholder: I18N.Factors.pleaseSelect,
                  displayRender: (label: string[]) => {
                    if (!label) return '';
                    return label.slice(-1);
                  },
                  showSearch: true,
                },
                'x-reactions': [
                  {
                    dependencies: ['paramType', 'unitType'],
                    fulfill: {
                      schema: {
                        'x-visible': `{{($deps[0] === ${NUMBER} || $deps[0] === ${SELECT}) && $deps[1] === ${COMPOUND_UNIT}}}`,
                      },
                    },
                  },
                ],
              }),
            },
          },

          /** ==========参数格式为距离的数据============== */
          transModeParamCode: renderFormItemSchema({
            title: I18N.eca.modeOfTransport,
            required: false,
            'x-component': 'Select',
            'x-reactions': [
              {
                dependencies: ['paramScope'],
                fulfill: {
                  schema: {
                    'x-visible': `{{$deps[0] === ${DISTANCE_PARAMETER}}}`,
                  },
                },
              },
            ],
          }),
          originParamCode: renderFormItemSchema({
            title: I18N.eca.placeOfShipment,
            required: false,
            'x-component': 'Select',
            'x-reactions': [
              {
                dependencies: ['paramScope'],
                fulfill: {
                  schema: {
                    'x-visible': `{{$deps[0] === ${DISTANCE_PARAMETER}}}`,
                  },
                },
              },
            ],
          }),
          destinationParamCode: renderFormItemSchema({
            title: I18N.dashborad.destination,
            required: false,
            'x-component': 'Select',
            'x-reactions': [
              {
                dependencies: ['paramScope'],
                fulfill: {
                  schema: {
                    'x-visible': `{{$deps[0] === ${DISTANCE_PARAMETER}}}`,
                  },
                },
              },
            ],
          }),
          /** ==========参数格式为距离的数据end============== */
          paramDesc: renderFormItemSchema({
            title: I18N.eca.fieldDescription,
            'x-component': 'Input.TextArea',
            'x-component-props': {
              maxLength: 1000,
            },
            required: false,
          }),
        },
      },
    },
  );
