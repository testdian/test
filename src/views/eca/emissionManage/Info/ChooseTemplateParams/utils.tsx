import { SearchOutlined } from '@ant-design/icons';
import { ProColumns } from '@ant-design/pro-components';
import I18N from '@src/lang/I18N';
import { Button, Typography } from 'antd';

import { Factor } from '@/sdks/systemV2ApiDocs';
import { renderFormComponent } from '@/views/eca/util/paramsUtil/valueTypeColumns/index';

import { EmissionSourceFactorResp, EmissionSourceParam } from '../../type';

const { Text } = Typography;

/**  动态列生成方法 */
export const generateDynamicColumns = (
  paramCodes: string[],
  templateParamsList: EmissionSourceParam[],
  onBlurChange: (value: string, param: EmissionSourceParam) => void,
): ProColumns<any, 'text'>[] => {
  return paramCodes
    .map(code => {
      const param = templateParamsList?.find?.(p => p.paramCode === code);
      return param
        ? ({
            title: param.paramName,
            dataIndex: `paramCode_${param?.paramCode}`,
            valueType: renderFormComponent(Number(param.paramType)),
            editable: true,
            fieldProps: {
              onBlur: e => {
                onBlurChange(e.target.value, param);
              },
            },
            formItemProps: {
              rules: [
                {
                  required: true,
                  message: I18N.template(I18N.eca.pleaseEnterPa, {
                    val1: param.paramName,
                  }),
                },
              ],
            },
          } as ProColumns<EmissionSourceFactorResp>)
        : null;
    })
    .filter(Boolean) as ProColumns<EmissionSourceFactorResp>[];
};

/** 固定列配置 */
export const FIXED_COLUMNS = (
  itemEmissionSource: EmissionSourceFactorResp,
  factorDetail: Factor[],
  onSelectEmissionFactor: (
    item: EmissionSourceFactorResp,
    index: number,
  ) => void,
  handleDelete: (item: EmissionSourceFactorResp) => void,
): ProColumns<any, 'text'>[] => [
  {
    title: I18N.Factors.emissionFactors,
    dataIndex: 'factorValue',
    renderFormItem: (item, { type, defaultRender, ...rest }) => {
      const factorDetailInfo = factorDetail[Number(item.index)];
      return (
        <Button
          type='link'
          icon={<SearchOutlined />}
          onClick={() =>
            onSelectEmissionFactor(itemEmissionSource, Number(item.index))
          }
          {...rest}
        >
          <Text
            style={{ width: 220, textAlign: 'left' }}
            ellipsis={{
              tooltip: `${factorDetailInfo?.name} ${factorDetailInfo?.factorValue} ${factorDetailInfo?.unit}`,
            }}
          >
            {factorDetailInfo
              ? `${factorDetailInfo?.name}  ${factorDetailInfo?.factorValue} ${factorDetailInfo?.unit}`
              : I18N.carbonFootPrintLCA.selectionFactor}
          </Text>
        </Button>
      );
    },
    render: (text, record, index) => {
      const factorDetailInfo = factorDetail[Number(index)];
      return (
        <Button
          type='link'
          icon={<SearchOutlined />}
          onClick={() =>
            onSelectEmissionFactor(itemEmissionSource, Number(index))
          }
        >
          <Text
            style={{ width: 220, textAlign: 'left' }}
            ellipsis={{
              tooltip: `${factorDetailInfo?.name} ${factorDetailInfo?.factorValue} ${factorDetailInfo?.unit}`,
            }}
          >
            {factorDetailInfo
              ? `${factorDetailInfo?.name}  ${factorDetailInfo?.factorValue} ${factorDetailInfo?.unit}`
              : I18N.carbonFootPrintLCA.selectionFactor}
          </Text>
        </Button>
      );
    },
  },
  {
    title: I18N.Factors.operation,
    valueType: 'option',
    width: 120,
    render: (_: any, record: any) => [
      <div onClick={() => handleDelete(record)}>{I18N.Factors.delete}</div>,
    ],
  },
];

export const generateColumns = (
  item: EmissionSourceFactorResp,
  templateParamsList: EmissionSourceParam[],
  factorDetail: Factor[],
  onSelectEmissionFactor: (
    item: EmissionSourceFactorResp,
    index: number,
  ) => void,
  handleDelete: (item: EmissionSourceFactorResp) => void,
  /** 输入框失去焦点 */
  onBlurChange: (value: string, param: EmissionSourceParam) => void,
) => {
  // 动态生成参数列
  const paramCodes = item.associatedParamCodes?.split(',') || [];
  const dynamicColumns = generateDynamicColumns(
    paramCodes,
    templateParamsList,
    onBlurChange,
  );
  // 合并列配置
  return [
    ...dynamicColumns,
    ...FIXED_COLUMNS(item, factorDetail, onSelectEmissionFactor, handleDelete),
  ] as ProColumns<EmissionSourceFactorResp>[];
};
