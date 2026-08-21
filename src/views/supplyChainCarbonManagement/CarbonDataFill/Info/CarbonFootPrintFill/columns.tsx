import I18N from '@src/lang/I18N';
import { InputNumber, Tooltip } from 'antd';
import type { ColumnsType } from 'antd/es/table';
import { compact } from 'lodash-es';

import { TargetTable } from './type';

export type InputCellProps = {
  value?: string | null;
  row: TargetTable;
  dataIndex: string;
};

const min = '0';
const max = '99999999999.9999999999999999999999999';
const precision = 25;
const width = 160;

export const columns = ({
  isAllCycle,
  onInputData,
  isDisabled,
}: {
  isAllCycle?: boolean;
  onInputData?: ({ value, row, dataIndex }: InputCellProps) => void;
  isDisabled?: boolean;
}): ColumnsType<TargetTable> => {
  const placeholderText = isDisabled ? '-' : I18N.eca.pleaseFillIn;

  const commonInfo = {
    disabled: isDisabled,
    style: { width: 150 },
    placeholder: placeholderText,
    min,
    max,
    precision,
    controls: false,
    stringMode: true,
  };

  // 半生命周期
  if (!isAllCycle) {
    return compact([
      {
        title: I18N.carbonFootPrintLCA.number,
        dataIndex: 'index',
        fixed: 'left',
        width: 48,
        render: (_, __, index) => index + 1,
      },
      {
        title: I18N.certificationReviewCenter.evaluatingIndicator,
        dataIndex: 'assessmentTargetName',
        fixed: 'left',
        width,
      },
      {
        title: I18N.Factors.unit,
        dataIndex: 'unit',
        fixed: 'left',
        width: 140,
      },
      {
        title: (
          <Tooltip
            title={I18N.supplyChainCarbonManagement.unitProductEnvironment}
          >
            {!isDisabled && (
              <span className='ant-formily-item-asterisk'>*</span>
            )}
            {I18N.supplyChainCarbonManagement.unitProductEnvironment}
          </Tooltip>
        ),
        dataIndex: 'resultData',
        fixed: 'left',
        width,
        render: (value, row) => {
          return (
            <InputNumber<string>
              {...commonInfo}
              key={`${row.assessmentTarget}resultData`}
              value={value}
              status={!value && value !== 0 ? 'error' : undefined}
              formatter={v => (v ? `${v}` : '')}
              onChange={v => {
                onInputData?.({
                  value: v,
                  row,
                  dataIndex: 'resultData',
                });
              }}
            />
          );
        },
      },
      {
        title: I18N.supplyChainCarbonManagement.rawMaterialStage,
        dataIndex: 'rawMaterialStage',
        width,
        render: (value, row) => {
          return (
            <InputNumber<string>
              {...commonInfo}
              key={`${row.assessmentTarget}rawMaterialStage`}
              value={value}
              formatter={v => (v ? `${v}` : '')}
              onChange={v => {
                onInputData?.({
                  value: v,
                  row,
                  dataIndex: 'rawMaterialStage',
                });
              }}
            />
          );
        },
      },
      {
        title: I18N.supplyChainCarbonManagement.packagingMaterialLevel,
        dataIndex: 'packagingMaterialStage',
        width,
        render: (value, row) => {
          return (
            <InputNumber<string>
              {...commonInfo}
              key={`${row.assessmentTarget}packagingMaterialStage`}
              value={value}
              formatter={v => (v ? `${v}` : '')}
              onChange={v => {
                onInputData?.({
                  value: v,
                  row,
                  dataIndex: 'packagingMaterialStage',
                });
              }}
            />
          );
        },
      },
      {
        title: I18N.supplyChainCarbonManagement.entryTransportationStage,
        dataIndex: 'entranceTransportationStage',
        width,
        render: (value, row) => {
          return (
            <InputNumber<string>
              {...commonInfo}
              key={`${row.assessmentTarget}entranceTransportationStage`}
              value={value}
              formatter={v => (v ? `${v}` : '')}
              onChange={v => {
                onInputData?.({
                  value: v,
                  row,
                  dataIndex: 'entranceTransportationStage',
                });
              }}
            />
          );
        },
      },
      {
        title: I18N.carbonFootPrintLCA.productionAndManufacturing,
        dataIndex: 'productionManufacturing',
        width,
        render: (value, row) => {
          return (
            <InputNumber<string>
              {...commonInfo}
              key={`${row.assessmentTarget}productionManufacturing`}
              value={value}
              formatter={v => (v ? `${v}` : '')}
              onChange={v => {
                onInputData?.({
                  value: v,
                  row,
                  dataIndex: 'productionManufacturing',
                });
              }}
            />
          );
        },
      },
      {
        title: I18N.supplyChainCarbonManagement.wasteStage,
        dataIndex: 'wasteStage',
        width,
        render: (value, row) => {
          return (
            <InputNumber<string>
              {...commonInfo}
              key={`${row.assessmentTarget}wasteStage`}
              value={value}
              formatter={v => (v ? `${v}` : '')}
              onChange={v => {
                onInputData?.({
                  value: v,
                  row,
                  dataIndex: 'wasteStage',
                });
              }}
            />
          );
        },
      },
    ]);
  }

  // 全生命周期
  return compact([
    {
      title: I18N.carbonFootPrintLCA.number,
      dataIndex: 'index',
      fixed: 'left',
      width: 48,
      render: (_, __, index) => index + 1,
    },
    {
      title: I18N.certificationReviewCenter.evaluatingIndicator,
      dataIndex: 'assessmentTargetName',
      fixed: 'left',
      width,
    },
    {
      title: I18N.Factors.unit,
      dataIndex: 'unit',
      fixed: 'left',
      width: 140,
    },
    {
      title: (
        <Tooltip
          title={I18N.supplyChainCarbonManagement.unitProductEnvironment}
        >
          {!isDisabled && <span className='ant-formily-item-asterisk'>*</span>}
          {I18N.supplyChainCarbonManagement.unitProductEnvironment}
        </Tooltip>
      ),
      dataIndex: 'resultData',
      fixed: 'left',
      width,
      render: (value, row) => {
        return (
          <InputNumber<string>
            {...commonInfo}
            key={`${row.assessmentTarget}resultData`}
            value={value}
            status={!value && value !== 0 ? 'error' : undefined}
            formatter={v => (v ? `${v}` : '')}
            onChange={v => {
              onInputData?.({
                value: v,
                row,
                dataIndex: 'resultData',
              });
            }}
          />
        );
      },
    },
    {
      title: I18N.carbonFootPrintLCA.productProductionStage,
      dataIndex: 'productProductionStage',
      width,
      render: (value, row) => {
        return (
          <InputNumber<string>
            {...commonInfo}
            key={`${row.assessmentTarget}productProductionStage`}
            value={value}
            formatter={v => (v ? `${v}` : '')}
            onChange={v => {
              onInputData?.({
                value: v,
                row,
                dataIndex: 'productProductionStage',
              });
            }}
          />
        );
      },
    },
    {
      title: I18N.carbonFootPrintLCA.constructionProcessStage,
      dataIndex: 'constructionProductionStage',
      width,
      render: (value, row) => {
        return (
          <InputNumber<string>
            {...commonInfo}
            key={`${row.assessmentTarget}constructionProductionStage`}
            value={value}
            formatter={v => (v ? `${v}` : '')}
            onChange={v => {
              onInputData?.({
                value: v,
                row,
                dataIndex: 'constructionProductionStage',
              });
            }}
          />
        );
      },
    },
    {
      title: I18N.supplyChainCarbonManagement.usageStage,
      dataIndex: 'usageStage',
      width,
      render: (value, row) => {
        return (
          <InputNumber<string>
            {...commonInfo}
            key={`${row.assessmentTarget}usageStage`}
            value={value}
            formatter={v => (v ? `${v}` : '')}
            onChange={v => {
              onInputData?.({
                value: v,
                row,
                dataIndex: 'usageStage',
              });
            }}
          />
        );
      },
    },
    {
      title: I18N.supplyChainCarbonManagement.endOfLifeStage,
      dataIndex: 'endStage',
      width,
      render: (value, row) => {
        return (
          <InputNumber<string>
            {...commonInfo}
            key={`${row.assessmentTarget}endStage`}
            value={value}
            formatter={v => (v ? `${v}` : '')}
            onChange={v => {
              onInputData?.({
                value: v,
                row,
                dataIndex: 'endStage',
              });
            }}
          />
        );
      },
    },
    {
      title: I18N.carbonFootPrintLCA.additionalBenefitsAnd,
      dataIndex: 'additional',
      width,
      render: (value, row) => {
        return (
          <InputNumber<string>
            {...commonInfo}
            key={`${row.assessmentTarget}additional`}
            value={value}
            formatter={v => (v ? `${v}` : '')}
            onChange={v => {
              onInputData?.({
                value: v,
                row,
                dataIndex: 'additional',
              });
            }}
          />
        );
      },
    },
  ]);
};
