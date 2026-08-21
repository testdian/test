import { ProColumns } from '@ant-design/pro-components';
import I18N from '@src/lang/I18N';
import { compact } from 'lodash-es';

import { TableActions } from '@/components/Table/TableActions';
import { checkAuth } from '@/layout/utills';
import { EmissionSourceList } from '@/views/eca/accountingModel/Info/type';

import { ColumnsActionType } from '../../config';
import { ComputationSourceRequest } from '../../type';
import { getCarbonTaskActions } from '../../utils/renderActionsButton';

const { VIEW } = ColumnsActionType;

/** 碳排放核算/清单样式 */
export const listStyleColumns = (
  handleActionClick: (
    actionType: ColumnsActionType,
    record: ComputationSourceRequest,
  ) => void,
  emissionUnit = '',
): ProColumns<EmissionSourceList, 'text'>[] => [
  {
    title: I18N.eca.emissionSourceName,
    dataIndex: 'sourceName',
    ellipsis: true,
  },
  {
    title: '核算组织',
    dataIndex: 'orgName',
    ellipsis: true,
  },
  {
    title: I18N.eca.emissionFacilityActivity,
    dataIndex: 'facility',
    ellipsis: true,
  },
  {
    title: `排放量${emissionUnit}`,
    dataIndex: 'carbonEmission',
  },
  {
    title: I18N.Factors.operation,
    dataIndex: 'action',
    render: (_, record) => {
      const actions = getCarbonTaskActions(
        record as unknown as ComputationSourceRequest,
      );
      return (
        <TableActions
          menus={compact(
            actions.map(({ type, config }) => {
              /** 只展示查看按钮 */
              if (type !== VIEW) {
                return null;
              }
              const labelText =
                typeof config.label === 'function'
                  ? (config.label as () => string)()
                  : config.label;
              return checkAuth(config.auth, {
                label: labelText, // 显示中文
                key: labelText,
                onClick: () =>
                  handleActionClick(
                    type as ColumnsActionType,
                    record as unknown as ComputationSourceRequest,
                  ),
              });
            }),
          )}
        />
      );
    },
  },
];
