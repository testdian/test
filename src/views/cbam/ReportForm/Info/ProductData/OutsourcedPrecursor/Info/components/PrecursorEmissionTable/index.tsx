/**
 * @description formily 前体排放数据
 */
import {
  EditableFormInstance,
  EditableProTable,
  ProColumns,
} from '@ant-design/pro-components';
import { onFieldValueChange } from '@formily/core';
import { connect, mapProps, useField, useForm } from '@formily/react';
import { InputNumber, Select, TableProps } from 'antd';
import { compact, isArray, isNumber } from 'lodash-es';
import { FC, useEffect, useRef, useState } from 'react';

import I18N from '@/lang/I18N';
import { getCNList } from '@/views/cbam/ReportForm/service';
import { ConfigCNResp, ProductAttribution } from '@/views/cbam/ReportForm/type';
import { useCbamEnums } from '@/views/cbam/hook';
import { useAllEnumsBatch } from '@/views/dashborad/Dicts/hooks';

import {
  DefaultSelect,
  EmissionSourceSelect,
  ImpliedEmissionInput,
  SelectWithCN,
} from './components';
import { generateUnit, numberPropsData, sharedOnCell } from './until';
import { DEFAULT_ENUM } from '../../../../constant';
import {
  FACTORY_LEVEL_ENUM,
  FACTORY_LEVEL_NAME,
  SOURCE_ENUM,
  USE_DEFAULT_ENUM,
} from '../../constant';

const { DEFAULT } = SOURCE_ENUM;

export interface UpdatePrecursorTotalEmissionProps {
  emission?: number | string;
  row: ProductAttribution;
}

export interface UpdatePrecursorSourceProps {
  emissionSource: number | string;
  row: ProductAttribution;
}

const { NOT } = DEFAULT_ENUM;

const {
  IMPLIED_EMISSION_DIRECT,
  EL_USAGE,
  EL_EMISSION_COEFFICIENT,
  IMPLIED_EMISSION_INDIRECT,
  REASON_USE_DEFAULT,
} = FACTORY_LEVEL_ENUM;

type PrecursorEmissionTableProps = TableProps<Record<string, any>> & {
  value: ProductAttribution[];
  onChange: (value: ProductAttribution[]) => void;
  /** 报表id */
  cbamId?: number;
};

const PrecursorEmissionTable: FC<PrecursorEmissionTableProps> = props => {
  const { value, onChange, cbamId } = props;

  const editableFormRef = useRef<EditableFormInstance<ConfigCNResp>>();

  const form = useForm();

  const field = useField();

  /** 来源枚举 */
  const sourceOption = useCbamEnums('EleSource');

  /** 使用默认值的原因枚举 */
  const defaultReasonOption = useCbamEnums('DefaultReason');

  const enumOptions = useAllEnumsBatch('CBAMElecsource');
  /** 来源枚举-电力排放系数 */
  const elSourceOption =
    enumOptions?.CBAMElecsource?.map(item => ({
      name: item.dictLabel,
      code: item.dictValue,
    })) || [];

  /** 是否是详情 */
  const isDetail = field.readPretty || field.disabled;

  /** 公共单位 */
  const unit = form.getValuesIn('unit') || I18N.Factors.unit;

  /** 产品类别 */
  const productCategoryId = form.getValuesIn('productCategoryId');

  /** 产品类别对应的CN option */
  const [cnOption, setCnOption] = useState<ConfigCNResp[]>([]);

  /** 当前是否使用默认值计算 */
  const [currentIsDefault, setCurrentIsDefault] = useState<number>();

  /** 初始dataSource */
  const initProductAttributionList = [
    {
      emissionElement: IMPLIED_EMISSION_DIRECT,
      cbamId,
      isProcess: NOT,
    },
    {
      emissionElement: EL_USAGE,
      cbamId,
      isProcess: NOT,
    },
    {
      emissionElement: EL_EMISSION_COEFFICIENT,
      cbamId,
      isProcess: NOT,
    },
    {
      emissionElement: IMPLIED_EMISSION_INDIRECT,
      cbamId,
      isProcess: NOT,
    },
    {
      emissionElement: REASON_USE_DEFAULT,
      cbamId,
      isProcess: NOT,
    },
  ];

  /** 表格数据 */
  const [dataSource, setDataSource] = useState<ProductAttribution[]>(
    initProductAttributionList,
  );

  /** 上一次的值 */
  const [preValue, setPreValue] = useState(value);
  if (isArray(value) && value?.length && value !== preValue) {
    setPreValue(value);
    setDataSource(value);
  }

  /** 表格编辑态key */
  const [editableKeys, setEditableRowKeys] = useState<React.Key[]>([]);

  /** 控制表格编辑态 */
  useEffect(() => {
    if (isDetail) {
      setEditableRowKeys([]);
    } else {
      setEditableRowKeys(
        compact(dataSource?.map(item => item.emissionElement)),
      );

      /** 监听表单 */
      form.addEffects('isDefault', () => {
        onFieldValueChange('isDefault', isDefaultField => {
          const isDefault = isDefaultField.value;
          setCurrentIsDefault(isDefault);
        });
      });
    }

    return () => {
      form.removeEffects('isDefault');
    };
  }, [isDetail]);

  /** 获取CN选择框枚举 */
  useEffect(() => {
    getCNList({
      pageNum: 1,
      pageSize: 10000,
      productCategoryId,
    }).then(({ data }) => {
      const { records = [] } = data?.data || {};
      const options = records?.map(item => ({
        ...item,
        label: `${item.defaultCode || ''}${item.defaultName || ''}`,
        value: item.defaultCode,
      }));
      setCnOption(options);
    });
  }, [productCategoryId]);

  const columns = (): ProColumns<ProductAttribution>[] => {
    return compact([
      {
        title: I18N.cbam.numberOfFactoryLevels,
        dataIndex: 'emissionElement_name',
        readonly: true,
        width: 100,
        renderText(_, record) {
          const { emissionElement } = record || {};
          return emissionElement
            ? FACTORY_LEVEL_NAME?.[emissionElement] || '-'
            : '-';
        },
      },
      {
        title: I18N.cbam.carbonDioxideEmissions,
        dataIndex: 'emission',
        ellipsis: true,
        width: 150,
        valueType: 'digit',
        renderFormItem: (_, config) => {
          const { emissionElement, cnCode } = config?.record || {};
          /** 如果使用默认值计算，则隐含排放（直接）增加CN选择框 ，数值填写框不可编辑根据选择的CN代码对应的默认直接排放系数 */
          if (emissionElement === IMPLIED_EMISSION_DIRECT) {
            const isDefault = currentIsDefault === USE_DEFAULT_ENUM.USE_DEFAULT;

            return (
              <SelectWithCN
                cnCode={cnCode}
                disabled={isDefault}
                cnOption={cnOption}
                onChangeCnCode={currentCnCode => {
                  const newData = value?.map(item => {
                    if (item.emissionElement === IMPLIED_EMISSION_DIRECT) {
                      return {
                        ...item,
                        cnCode: currentCnCode,
                      };
                    }
                    return { ...item };
                  });
                  setDataSource(newData);
                  onChange(newData);
                }}
              />
            );
          }

          if (emissionElement === IMPLIED_EMISSION_INDIRECT) {
            /** 电力使用 */
            const elUsage = value?.find(
              item => item.emissionElement === EL_USAGE,
            )?.emission;

            /** 电力排放系数 */
            const elEmissionCoefficient = value?.find(
              item => item.emissionElement === EL_EMISSION_COEFFICIENT,
            )?.emission;

            /** 隐含排放 */
            const impliedEmission =
              isNumber(elUsage) && isNumber(elEmissionCoefficient)
                ? elUsage * elEmissionCoefficient
                : undefined;

            return <ImpliedEmissionInput impliedEmission={impliedEmission} />;
          }

          return (
            <InputNumber
              {...numberPropsData}
              placeholder={I18N.base.pleaseEnter}
            />
          );
        },
        onCell: sharedOnCell,
      },
      {
        title: I18N.Factors.unit,
        dataIndex: 'unit',
        readonly: true,
        width: 130,
        renderText: (_, record) => {
          const { emissionElement } = record || {};
          return generateUnit(unit, emissionElement);
        },
        onCell: sharedOnCell,
      },
      {
        title: I18N.cbam.source,
        dataIndex: 'emissionSource',
        ellipsis: true,
        width: 130,
        valueType: 'select',
        fieldProps: (_, { entity }) => {
          const { emissionElement } = entity || {};

          let options = sourceOption;
          if (emissionElement === EL_EMISSION_COEFFICIENT) {
            options = elSourceOption;
          }
          if (emissionElement === REASON_USE_DEFAULT) {
            options = defaultReasonOption;
          }

          return {
            options,
            fieldNames: {
              label: 'name',
              value: 'code',
            },
          };
        },
        renderFormItem(_, config) {
          const { emissionElement } = config?.record || {};

          let options = sourceOption;
          if (emissionElement === EL_EMISSION_COEFFICIENT) {
            options = elSourceOption;
          }
          if (emissionElement === REASON_USE_DEFAULT) {
            /** 检查默认值原因-若电力使用或隐含排放（直接）中任意来源均未选择为默认值，则置灰不可编辑 */
            const disabledDefaultReason = () => {
              // 隐含排放（直接）的来源
              const directEmissionSource = value?.find(
                item => item.emissionElement === IMPLIED_EMISSION_DIRECT,
              )?.emissionSource;
              // 电力使用的来源
              const elUsageSource = value?.find(
                item => item.emissionElement === EL_USAGE,
              )?.emissionSource;

              return !(
                directEmissionSource === DEFAULT || elUsageSource === DEFAULT
              );
            };

            return (
              <DefaultSelect
                disabled={disabledDefaultReason()}
                options={defaultReasonOption}
              />
            );
          }

          if (emissionElement === IMPLIED_EMISSION_DIRECT) {
            return (
              <EmissionSourceSelect
                disabled={currentIsDefault === USE_DEFAULT_ENUM.USE_DEFAULT}
                options={sourceOption}
              />
            );
          }

          return (
            <Select
              options={options}
              fieldNames={{
                label: 'name',
                value: 'code',
              }}
              placeholder={I18N.Factors.pleaseSelect}
            />
          );
        },
        onCell: (_, index) => {
          if (index === 3) {
            return {
              rowSpan: 0,
            };
          }
          return {
            colSpan: (index as number) < 4 ? 1 : 3,
          };
        },
      },
    ]);
  };

  return (
    <EditableProTable<ProductAttribution>
      key={`precursorEmission${cbamId}`}
      columns={columns()}
      editableFormRef={editableFormRef}
      rowKey='emissionElement'
      value={value}
      bordered
      recordCreatorProps={false}
      toolBarRender={false}
      editable={{
        type: 'multiple',
        editableKeys,
        onValuesChange: (_record, recordList) => {
          setDataSource(recordList);
          onChange(recordList);
        },
      }}
    />
  );
};

export const FormilyPrecursorEmissionTable = connect(
  PrecursorEmissionTable,
  mapProps({ dataSource: true }, props => {
    return {
      ...props,
    };
  }),
);
