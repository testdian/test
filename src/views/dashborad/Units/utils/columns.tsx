/*
 * @@description:
 * @Author: qifeng qifeng@carbonstop.net
 * @Date: 2023-01-09 19:44:27
 * @LastEditors: ljh255 jinhai@carbonstop.net
 * @LastEditTime: 2023-03-27 14:17:54
 */

import I18N from '@src/lang/I18N';
import { compact } from 'lodash-es';
import { TableRenderProps } from 'table-render/dist/src/types';

import { TableActions } from '@/components/Table/TableActions';
import { checkAuth } from '@/layout/utills';
import { LibUnitConversion } from '@/sdks/systemV2ApiDocs';

import { DictMap } from '../../Dicts/hooks';

export const columns = (
  units: DictMap,
  onDel: (row: LibUnitConversion) => void,
  onEdit: (row: LibUnitConversion) => void,
): TableRenderProps<LibUnitConversion>['columns'] => {
  const enumMap = units.enums.reduce((pre, next) => {
    if (next.dictValue) return { ...pre, [next.dictValue]: next.dictLabel };
    return pre;
  }, {} as Record<any, any>);
  const typeMap = units.type.reduce((pre, next) => {
    if (next.dictValue) return { ...pre, [next.dictValue]: next.dictLabel };
    return pre;
  }, {} as Record<any, any>);
  return [
    {
      title: I18N.dashborad.unit3,
      dataIndex: 'unitFromName',
      // copyable: true,
      enum: enumMap,
    },
    {
      title: I18N.dashborad.unit2,
      dataIndex: 'unitToName',
      enum: enumMap,
    },
    {
      title: I18N.dashborad.unitType,
      dataIndex: 'unitClassName',
      enum: typeMap,
    },
    {
      title: I18N.dashborad.unit,
      dataIndex: 'unitValue',
    },
    {
      title: I18N.Factors.updatedBy,
      dataIndex: 'updateByName',
    },
    {
      title: I18N.Factors.updateTime,
      dataIndex: 'updateTime',
      width: 200,
    },
    {
      title: I18N.Factors.operation,
      dataIndex: 'id',
      render(id, row) {
        return (
          <TableActions
            menus={compact([
              checkAuth('/sys/units/edit', {
                label: I18N.Factors.edit,
                key: I18N.Factors.edit,
                onClick: async () => onEdit(row),
              }),
              checkAuth('/sys/units/del', {
                key: I18N.Factors.delete,
                label: I18N.Factors.delete,
                onClick: async () => {
                  return onDel(row);
                },
              }),
            ])}
          />
        );
      },
    },
  ];
};
