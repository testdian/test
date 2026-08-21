import I18N from '@src/lang/I18N';
import { message, Space } from 'antd';
import { compact } from 'lodash-es';
import { NavigateFunction } from 'react-router-dom';
import {
  SearchProps,
  TableContext,
  TableRenderProps,
} from 'table-render/dist/src/types';

import { TableActions } from '@/components/Table/TableActions';
import { xRenderSeachSchema } from '@/components/x-render/TableRender/utils/xRender';
import { checkAuth } from '@/layout/utills';
import { EcaRouteMaps } from '@/router/utils/ecaEmums';
import { PageTypeInfo, virtualLinkTransform } from '@/router/utils/enums';
import {
  ControlPlan,
  postComputationControlPlanDelete,
} from '@/sdks/computation/computationV2ApiDocs';
import { modal } from '@/store/module/notification';
import { returnDelModalStyle, returnNoIconModalStyle } from '@/utils';

import { useOrganizationSelect } from '../../hooks/useOrganizationSelect';

export const columns = ({
  navigage,
  copyDataFn,
  refresh,
}: {
  navigage?: NavigateFunction;
  editFn?: (record: ControlPlan) => void;
  copyDataFn: (record: ControlPlan) => void;
  delFn?: (record: ControlPlan) => void;
  refresh?: TableContext['refresh'];
}): TableRenderProps<any>['columns'] => [
  {
    title: I18N.carbonData.affiliatedOrganization,
    dataIndex: 'orgName',
    width: 180,
    fixed: 'left',
  },
  {
    title: I18N.eca.versionNumber,
    dataIndex: 'version',
    width: 180,
  },
  {
    title: I18N.eca.withinTheFormulationAndRevision,
    dataIndex: 'planContent',
    width: 160,
  },
  {
    title: I18N.eca.whenFormulatingRevisions,
    dataIndex: 'planDate',
    width: 160,
  },
  {
    title: I18N.dashborad.remarks,
    dataIndex: 'remark',
    width: 96,
  },
  {
    title: I18N.Factors.updatedBy,
    dataIndex: 'updateByName',
    width: 120,
  },
  {
    title: I18N.Factors.updateTime,
    dataIndex: 'updateTime',
    width: 180,
  },
  {
    title: I18N.Factors.operation,
    dataIndex: 'operation',
    width: 220,
    fixed: 'right',
    render: (_, record) => {
      return (
        <Space>
          <TableActions
            menus={compact([
              checkAuth('/dataQualityManage/edit', {
                label: I18N.Factors.edit,
                key: '/dataQualityManage/edit',
                onClick: () => {
                  navigage?.(
                    virtualLinkTransform(
                      EcaRouteMaps.editDataQualityManage,
                      [':pageTypeInfo', ':id'],
                      [PageTypeInfo.edit, record.id],
                    ),
                  );
                },
              }),
              checkAuth('/dataQualityManage/copy', {
                label: I18N.carbonFootPrintLCA.copy,
                key: '/dataQualityManage/copy',
                onClick: () => {
                  copyDataFn?.(record);
                },
              }),
              checkAuth('/dataQualityManage/delete', {
                label: I18N.Factors.delete,
                key: '/dataQualityManage/delete',
                onClick: (ev: Event) => {
                  ev?.stopPropagation();
                  modal.confirm({
                    title: I18N.Factors.prompt,
                    ...returnNoIconModalStyle,
                    ...returnDelModalStyle,
                    okText: I18N.base.confirm,
                    cancelText: I18N.Factors.cancel,
                    content: (
                      <span>
                        {I18N.eca.confirmDeletionOfThis6}
                        <span className='modal_text'>
                          {I18N.eca.versionNumber}
                          {`${record.version}？`}
                        </span>
                      </span>
                    ),
                    onOk: async () => {
                      await postComputationControlPlanDelete({
                        req: { id: record.id },
                      }).then(({ data }) => {
                        if (data.code === 200) {
                          message.success(I18N.Factors.deleteSuccessful);
                          refresh?.({ stay: true, tab: 1 });
                        }
                      });
                    },
                  });

                  return null;
                },
              }),
              checkAuth('/dataQualityManage/show', {
                label: I18N.Factors.check,
                key: '/dataQualityManage/show',
                onClick: () => {
                  navigage?.(
                    virtualLinkTransform(
                      EcaRouteMaps.editDataQualityManage,
                      [':pageTypeInfo', ':id'],
                      [PageTypeInfo.show, record.id],
                    ),
                  );
                },
              }),
            ])}
          />
        </Space>
      );
    },
  },
];

export const SearchSchema = (): SearchProps<any>['schema'] => {
  const { getSearchSchema } = useOrganizationSelect();
  return {
    type: 'object',
    properties: {
      orgId: xRenderSeachSchema({
        required: false,
        type: 'string',
        ...getSearchSchema(),
      }),
      likeVersion: xRenderSeachSchema({
        type: 'string',
        placeholder: I18N.eca.versionNumber,
      }),
    },
  };
};
