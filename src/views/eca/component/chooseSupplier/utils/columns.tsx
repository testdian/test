/*
 * @@description:
 * @Author: liuxinxin xinxin@carbonstop.net
 * @Date: 2023-03-14 22:25:48
 * @LastEditors: liuxinxin xinxin@carbonstop.net
 * @LastEditTime: 2023-06-19 14:47:34
 */

import I18N from '@src/lang/I18N';
import { compact } from 'lodash-es';
import { TableRenderProps } from 'table-render/dist/src/types';

import { TableActions } from '@/components/Table/TableActions';
import { ProductDto } from '@/sdks_v2/new/computationV2ApiDocs';

/** 选择供应商数据-表头 */
export const columns = ({
  onDetail,
}: {
  onDetail?: (data: ProductDto) => void;
}): TableRenderProps<ProductDto>['columns'] => [
  {
    title: I18N.carbonFootPrint.supplierName,
    dataIndex: 'supplierName',
    fixed: 'left',
  },
  {
    title: I18N.Factors.productName,
    dataIndex: 'productName',
  },
  {
    title: I18N.carbonFootPrint.accountingUnit,
    dataIndex: 'productUnit',
  },
  {
    title: I18N.Factors.systemBoundary,
    dataIndex: 'periodType_name',
  },
  {
    title: I18N.carbonFootPrint.unitProductScheduling,
    dataIndex: 'dischargeRate',
  },
  {
    title: I18N.carbonFootPrint.accountingCycle,
    dataIndex: 'beginDate',
    render: (value, record) => {
      const { endTime } = record;
      return value && endTime
        ? I18N.template(I18N.carbonFootPrint.value, {
            val1: value,
            val2: endTime,
          })
        : '-';
    },
  },
  {
    title: I18N.carbonFootPrint.getTime,
    dataIndex: 'submitTime',
  },
  {
    title: I18N.Factors.operation,
    dataIndex: 'action',
    width: 100,
    fixed: 'right',
    render: (_, row) => {
      return (
        <TableActions
          menus={compact([
            {
              label: I18N.Factors.check,
              key: I18N.Factors.check,
              onClick: async () => {
                onDetail?.(row);
              },
            },
          ])}
        />
      );
    },
  },
];
