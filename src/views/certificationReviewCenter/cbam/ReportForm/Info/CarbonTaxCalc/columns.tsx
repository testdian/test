import type { ProColumns } from '@ant-design/pro-components';
import I18N from '@src/lang/I18N';
import { InputNumber } from 'antd';
import { compact } from 'lodash-es';

import { Dicts } from '@/utils';
import { CbamEnumResp } from '@/views/cbam/hook/type';

import { CarbonTaxResp } from '../../type';

export const columns = ({
  taxTypeEnum,
  currencyTypeEnum,
  offsetMethodEnum,
}: {
  /** 碳税类型枚举 */
  taxTypeEnum: CbamEnumResp[];
  /** 货币类型枚举 */
  currencyTypeEnum: Dicts[];
  /** 碳税折抵方式枚举 */
  offsetMethodEnum: CbamEnumResp[];
}): ProColumns<CarbonTaxResp>[] => {
  /** 根据当前货币类型获取对应货币单位 */
  const getCurrencyUnit = (currencyType?: string) => {
    if (!currencyType) return '-';
    const currencyUnit = currencyTypeEnum?.find(
      item => item.dictValue === currencyType,
    )?.relatedValue;
    return currencyUnit || '-';
  };

  return compact([
    {
      title: I18N.Factors.productName,
      dataIndex: 'saleProductName',
      readonly: true,
      fixed: 'left',
      ellipsis: true,
    },
    {
      title: I18N.carbonData.emissionIntensity,
      dataIndex: 'emission',
      readonly: true,
      renderText(_, record) {
        const { emission, activityUnit } = record || {};
        if (emission) {
          return `${emission}tCO₂e/${activityUnit || '-'}`;
        }
        return '-';
      },
    },
    {
      title: I18N.cbam.carbonTaxType,
      dataIndex: 'taxType',
      valueType: 'select',
      fieldProps: {
        options: taxTypeEnum,
        fieldNames: {
          label: 'name',
          value: 'code',
        },
      },
    },
    {
      title: I18N.cbam.carbonTaxCoverage,
      dataIndex: 'emissionPer',
      valueType: 'percent',
      fieldProps: {
        min: 0,
        max: 100,
        precision: 6,
        addonAfter: '%',
      },
    },
    {
      title: I18N.cbam.currencyType,
      dataIndex: 'currencyType',
      valueType: 'select',
      hideInTable: true,
      fieldProps: {
        options: currencyTypeEnum,
        fieldNames: {
          label: 'dictLabel',
          value: 'dictValue',
        },
      },
    },
    {
      title: I18N.cbam.carbonTaxPricing,
      dataIndex: 'taxValue',
      valueType: 'digit',
      renderFormItem: (_, config) => {
        const { activityUnit = '-', currencyType } = config?.record || {};
        /** 货币单位 */
        const currencyUnit = getCurrencyUnit(currencyType);
        return (
          <InputNumber
            min={0}
            max={999999999.999999}
            precision={6}
            addonAfter={
              <span>
                {currencyType ? `${currencyUnit}/${activityUnit}` : '-'}
              </span>
            }
          />
        );
      },
      render(_, row) {
        const { taxValue, activityUnit = '-', currencyType } = row || {};
        /** 货币单位 */
        const currencyUnit = getCurrencyUnit(currencyType);
        const unit = currencyUnit ? `${currencyUnit}/${activityUnit}` : '-';
        if (taxValue || taxValue === 0) {
          return `${taxValue}${unit}`;
        }
        return `-`;
      },
    },
    {
      title: I18N.cbam.carbonTaxDeductionMethod,
      dataIndex: 'offsetMethod',
      tooltip: I18N.cbam.theDiscountedPriceIs,
      valueType: 'select',
      fieldProps: {
        options: offsetMethodEnum,
        fieldNames: {
          label: 'name',
          value: 'code',
        },
      },
    },
    {
      title: I18N.cbam.offsetRatio,
      dataIndex: 'offsetPer',
      valueType: 'percent',
      fieldProps: {
        min: 0,
        max: 100,
        precision: 6,
        addonAfter: '%',
      },
    },
    {
      title: I18N.cbam.discountedPrice,
      dataIndex: 'offsetPrice',
      tooltip: I18N.cbam.theDiscountedPriceIs,
      valueType: 'digit',
      renderFormItem: (_, config) => {
        const { activityUnit = '-', currencyType } = config?.record || {};
        /** 货币单位 */
        const currencyUnit = getCurrencyUnit(currencyType);
        return (
          <InputNumber
            min={0}
            max={999999999.999999}
            precision={6}
            addonAfter={
              <span>
                {currencyType ? `${currencyUnit}/${activityUnit}` : '-'}
              </span>
            }
          />
        );
      },
      render(_, row) {
        const { offsetPrice, activityUnit = '-', currencyType } = row || {};
        /** 货币单位 */
        const currencyUnit = getCurrencyUnit(currencyType);
        const unit = currencyUnit ? `${currencyUnit}/${activityUnit}` : '-';
        if (offsetPrice || offsetPrice === 0) {
          return `${offsetPrice}${unit}`;
        }
        return `-`;
      },
    },
    {
      title: I18N.cbam.carbonTaxNeedsToBePaid,
      dataIndex: 'payTax',
      readonly: true,
      editable: false,
      render: (_, row) => {
        const { payTax, currencyType } = row || {};
        /** 货币单位 */
        const currencyUnit = getCurrencyUnit(currencyType);
        if (payTax || payTax === 0) {
          return `${payTax}${currencyUnit}`;
        }
        return '-';
      },
    },
  ]);
};
