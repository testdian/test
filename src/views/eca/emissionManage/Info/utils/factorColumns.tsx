import I18N from '@src/lang/I18N';
import { compact } from 'lodash-es';
import { TableRenderProps } from 'table-render/dist/src/types';

import { TableActions } from '@/components/Table/TableActions';
import { Factor } from '@/sdks/systemV2ApiDocs';

/** 状态。0 启用 1 禁用 */
export const status = {
  0: I18N.Factors.enable,
  1: I18N.Factors.disabled,
};

export const columns = ({
  onDetailClick,
}: {
  onDetailClick?: (row: Factor) => void;
}): TableRenderProps<Factor>['columns'] => [
  {
    title: I18N.carbonFootPrintLCA.number,
    dataIndex: 'allIndex',
    fixed: 'left',
    width: 80,
  },
  {
    title: I18N.eca.name,
    dataIndex: 'name',
    // copyable: true,
    fixed: 'left',
  },
  {
    title: I18N.Factors.factorValue,
    dataIndex: 'factorValue',
  },
  {
    title: I18N.Factors.unit,
    dataIndex: 'unit',
  },
  {
    title: I18N.Factors.yearOfPublication,
    dataIndex: 'year',
  },
  {
    title: I18N.Factors.publishingInstitution,
    dataIndex: 'institution',
  },
  {
    title: I18N.Factors.applicableScenarios,
    dataIndex: 'description',
  },
  {
    title: I18N.Factors.geographicalRepresentativeness,
    dataIndex: 'areaRepresent',
  },
  {
    title: I18N.Factors.operation,
    dataIndex: 'content',
    fixed: 'right',
    width: 140,
    render(_, row) {
      return (
        <TableActions
          menus={compact([
            {
              label: I18N.Factors.check,
              key: I18N.Factors.check,
              onClick: async () => {
                onDetailClick?.(row);
              },
            },
          ])}
        />
      );
    },
  },
];
