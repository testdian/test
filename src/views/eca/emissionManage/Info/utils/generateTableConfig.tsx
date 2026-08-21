import I18N from '@src/lang/I18N';
import { TableColumnType, Typography } from 'antd';

import { EmissionSourceParam } from '@/views/eca/fillData/type';
import { COMMON_PARAM_TYPE } from '@/views/eca/util/constant';

const { Text } = Typography;

const { TEXT, NUMBER, SELECT, TIME, ADDRESS } = COMMON_PARAM_TYPE;

const lenText = I18N.eca.textLength;
const decimalPlaceText = I18N.eca.decimalPlaces;
const correctRangeText = I18N.eca.correctValueRange;
const errorRangeText = I18N.eca.errorValueRange;
const warningRangeText = I18N.eca.warningValueRange;
const enumValuesText = I18N.eca.enum;

/** 参数类型的格式化文案 */
export const generateParamFormatText = (param: EmissionSourceParam) => {
  switch (param.paramType) {
    case TEXT: // 文本
      return param.len ? `${lenText}${param.len}` : '-';

    case NUMBER: // 数值
      return [
        `${decimalPlaceText}${param.len || '-'}`,
        `${correctRangeText}${param.correctRange || '-'}`,
        `${errorRangeText}${param.errorRange || '-'}`,
        `${warningRangeText}${param.warningRange || '-'}`,
      ].join(' | ');

    case SELECT: // 选项
    case ADDRESS: // 地址
      return param.dictEnum
        ? `${enumValuesText} (${param?.dictName})${param.dictEnum}`
        : '-';

    case TIME: // 时间
      return param.timeType_name || '-';

    default:
      return '-';
  }
};

/** 生成参数类型的格式化组件（带tooltip）  */
export const generateParamFormatComponent = (param: EmissionSourceParam) => {
  const formatText = generateParamFormatText(param);
  switch (param.paramType) {
    case NUMBER:
      return (
        <Text
          style={{ width: 200 }}
          ellipsis={{
            tooltip: (
              <div style={{ fontSize: 13 }}>
                {formatText?.split(' | ').map((line: string) => (
                  <div>{line}</div>
                ))}
              </div>
            ),
          }}
        >
          {formatText}
        </Text>
      );
    default:
      return (
        <Text style={{ width: 200 }} ellipsis={{ tooltip: formatText }}>
          {formatText}
        </Text>
      );
  }
};

/**
 * 生成表格列和数据
 * @param paramList 参数列表
 * @returns 表格列和数据源
 */
export const generateTableConfig = (
  paramList: EmissionSourceParam[],
): {
  columns: TableColumnType<EmissionSourceParam>[];
  dataSource: EmissionSourceParam[];
} => {
  const columns = paramList?.map?.((param, index) => {
    const { paramName = '', unit1Name, unit2Name } = param || {};

    const title = unit1Name
      ? `${paramName}(${unit1Name}${unit2Name ? `/${unit2Name}` : ''})`
      : paramName;

    const column: TableColumnType<EmissionSourceParam> = {
      title,
      dataIndex: param.paramCode || '',
      key: param.paramCode || '',
      fixed: index === 0 ? 'left' : undefined,
      /** 如果小于7个长度，就用固定宽度 */
      width:
        Number(param?.paramName?.length) < 8
          ? 150
          : Number(param?.paramName?.length) * 16,
      render: (_, record) => {
        const target = record[param.paramCode as keyof EmissionSourceParam];
        return generateParamFormatComponent(target);
      },
    };
    return column;
  });
  const dataSource = [
    paramList.reduce((acc, param) => {
      acc[param.paramCode || ''] = param;
      return acc;
    }, {} as { [key: string]: EmissionSourceParam }),
  ];

  return { columns, dataSource };
};
