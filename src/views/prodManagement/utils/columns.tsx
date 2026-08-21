/*
 * @@description:运营指标colums
 */

import I18N from '@src/lang/I18N';
import { compact } from 'lodash-es';
import {
  SearchProps,
  TableContext,
  TableRenderProps,
} from 'table-render/dist/src/types';

import { CustomTag } from '@/views/components/CustomTag';
import { TableActions } from '@/components/Table/TableActions';
import { xRenderSeachSchema } from '@/components/x-render/TableRender/utils/xRender';
import { checkAuth } from '@/layout/utills';
import { OrgPojo } from '@/sdks/systemV2ApiDocs';
import {
  OperationMetrics,
  postComputationOperationMetricsDelete,
  postComputationOperationMetricsStatus,
} from '@/sdks_v2/new/computationV2ApiDocs';
import { modal } from '@/store/module/notification';
import { Toast, returnDelModalStyle, returnNoIconModalStyle } from '@/utils';
import { publishYear } from '@/views/Factors/utils';

import { TypeChangeProManage } from '../type';

export const columns = ({
  refresh,
  editRecordFn,
}: {
  refresh: TableContext['refresh'];
  editRecordFn: (record: OperationMetrics) => void;
}): TableRenderProps<OperationMetrics>['columns'] => [
  {
    title: I18N.prodManagement.operationalIndicators,
    dataIndex: 'metricsName',
  },
  {
    title: I18N.Factors.unit,
    dataIndex: 'metricsUnitName',
  },
  {
    title: I18N.Factors.state,
    dataIndex: 'metricsStatus',
    render: metricsStatus => {
      // return Number(metricsStatus) ? '禁用' : '启用';
      return (
        <CustomTag
          color={Number(metricsStatus) ? 'red' : 'green'}
          text={
            Number(metricsStatus) ? I18N.Factors.disabled : I18N.Factors.enable
          }
        />
      );
    },
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
    title: I18N.prodManagement.operation,
    width: 200,
    dataIndex: 'id',
    render(id, record) {
      const metricsStatusObj: { [key: string]: string } = {
        0: I18N.Factors.disabled,
        1: I18N.Factors.enable,
      };
      return (
        <TableActions
          menus={compact([
            record?.presetType &&
              checkAuth('prodManagementDataOperationalIndicators/edit', {
                label: I18N.Factors.edit,
                key: I18N.Factors.edit,
                onClick: async () => {
                  editRecordFn(record);
                },
              }),
            checkAuth('prodManagementDataOperationalIndicators/enable', {
              label: metricsStatusObj[Number(record.metricsStatus)],
              key: metricsStatusObj[Number(record.metricsStatus)],
              onClick: async () => {
                modal.confirm({
                  title: I18N.Factors.prompt,
                  ...returnNoIconModalStyle,
                  content: (
                    <span>
                      {I18N.base.confirm}
                      {Number(record.metricsStatus) === 0
                        ? I18N.Factors.disabled
                        : I18N.Factors.enable}
                      ：
                      <span className='modal_text'>{record?.metricsName}</span>
                      <span>？</span>
                    </span>
                  ),
                  onOk: async () => {
                    const { data } =
                      await postComputationOperationMetricsStatus({
                        req: {
                          id,
                          status: Number(record.metricsStatus) === 0 ? 1 : 0,
                        },
                      });
                    if (data.code === 200) {
                      refresh?.(
                        {
                          stay: false,
                          tab: 0,
                        },
                        {
                          currentTab: TypeChangeProManage[1],
                        },
                      );
                    }
                  },
                  okText: I18N.base.confirm,
                  cancelText: I18N.Factors.cancel,
                });
              },
            }),
            record?.presetType &&
              checkAuth('prodManagementDataOperationalIndicators/del', {
                label: I18N.Factors.delete,
                key: I18N.Factors.delete,
                disabled: !record.deleteBtnFlag,
                onClick: async () => {
                  modal.confirm({
                    title: I18N.Factors.prompt,
                    ...returnNoIconModalStyle,
                    ...returnDelModalStyle,
                    content: (
                      <span>
                        {I18N.prodManagement.confirmDeletionOfShipment}
                        <span className='modal_text'>
                          {record?.metricsName}
                        </span>
                        <span>？</span>
                      </span>
                    ),
                    onOk: async () => {
                      const { data } =
                        await postComputationOperationMetricsDelete({
                          req: { id },
                        });
                      if (data.code === 200) {
                        Toast('success', I18N.Factors.deleteSuccessful);
                        refresh?.(
                          {
                            stay: false,
                            tab: 0,
                          },
                          {
                            currentTab: TypeChangeProManage[1],
                          },
                        );
                      }
                    },
                    okText: I18N.base.confirm,
                    cancelText: I18N.Factors.cancel,
                  });
                },
              }),
          ])}
        />
      );
    },
  },
];

export const SearchSchema = (orgs: OrgPojo[]): SearchProps<any>['schema'] => {
  return {
    type: 'object',
    properties: {
      orgId: xRenderSeachSchema({
        required: false,
        type: 'string',
        placeholder: I18N.carbonData.affiliatedOrganization,
        widget: 'select',
        enum: orgs?.map(org => `${org?.id}` as string),
        enumNames: orgs?.map(org => org?.orgName as string),
        props: {
          allowClear: true,
          showSearch: true,
          filterOption: (input: string, option: any) =>
            (option?.label ?? '').toLowerCase().includes(input.toLowerCase()),
        },
      }),
      year: xRenderSeachSchema({
        type: 'number',
        placeholder: I18N.prodManagement.year,
        enum: publishYear(2000),
        widget: 'select',
      }),
    },
  };
};
export const opeSearchSchema = (): SearchProps<any>['schema'] => {
  return {
    type: 'object',
    properties: {
      likeMetricsName: xRenderSeachSchema({
        required: false,
        type: 'string',
        placeholder: I18N.prodManagement.operationalIndicators,
        widget: 'Input',
      }),
    },
  };
};
