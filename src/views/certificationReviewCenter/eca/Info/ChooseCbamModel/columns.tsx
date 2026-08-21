import { compact } from 'lodash-es';
import { TableRenderProps } from 'table-render';

import { TableActions } from '@/components/Table/TableActions';
import I18N from '@/lang/I18N';
import { checkAuth } from '@/layout/utills';
import { CBAMRouteMaps } from '@/router/utils/cbam';
import { PageTypeInfo } from '@/router/utils/enums';
import { GeneralInfoProps } from '@/views/cbam/ReportForm/type';

const { show } = PageTypeInfo;

export const columns = (): TableRenderProps<GeneralInfoProps>['columns'] => [
  {
    title: I18N.cbam.reportName,
    dataIndex: 'reportName',
    fixed: 'left',
  },
  {
    title: I18N.carbonData.affiliatedOrganization,
    dataIndex: 'orgName',
  },
  {
    title: I18N.cbam.factoryName,
    dataIndex: 'factoryName',
  },
  {
    title: I18N.cbam.reportCycle,
    dataIndex: 'collectDate',
    width: 200,
  },
  {
    title: I18N.Factors.updatedBy,
    dataIndex: 'updateByName',
  },
  {
    title: I18N.Factors.updateTime,
    dataIndex: 'updateTime',
  },
  {
    title: I18N.Factors.operation,
    dataIndex: 'action',
    key: 'action',
    fixed: 'right',
    width: 88,
    render(_, row) {
      const { id } = row || {};
      return (
        <TableActions
          menus={compact([
            checkAuth('/cbam/report/detail', {
              label: I18N.Factors.check,
              key: I18N.Factors.check,
              onClick: () => {
                if (id) {
                  window.open(
                    `${CBAMRouteMaps.cbamReportInfo.replace(
                      ':pageTypeInfo',
                      `${show}`,
                    )}?id=${id}`,
                  );
                }
              },
            }),
          ])}
        />
      );
    },
  },
];
