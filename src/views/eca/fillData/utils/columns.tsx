/*
 * @@description:
 */
import I18N from '@src/lang/I18N';
import { compact } from 'lodash-es';
import { NavigateFunction } from 'react-router-dom';
import {
  SearchProps,
  TableContext,
  TableRenderProps,
} from 'table-render/dist/src/types';

import { CustomTag, fillDataColor } from '@/components/CustomTag';
import { TableActions } from '@/components/Table/TableActions';
import { xRenderSeachSchema } from '@/components/x-render/TableRender/utils/xRender';
import { checkAuth } from '@/layout/utills';
import { EcaRouteMaps } from '@/router/utils/ecaEmums';
import {
  PAGE_TYPE_VAR,
  PageTypeInfo,
  virtualLinkTransform,
} from '@/router/utils/enums';
import {
  ComputationData,
  postComputationDataRollback,
  postComputationDataSubmit,
} from '@/sdks/Newcomputation/computationV2ApiDocs';
import { modal } from '@/store/module/notification';
import { Toast, returnNoIconModalStyle } from '@/utils';
import { publishYear } from '@/views/Factors/utils';
import AuditConfigTable from '@/views/components/AuditConfigTable';
import { ADUDIT_REQUIRED_TYPE } from '@/views/dashborad/Approval/Info/constant';

import { ComputationEnums, UseOrgs } from '../../hooks';
import { getAuditConfig } from '../service';

const { NOT_REQUIRED } = ADUDIT_REQUIRED_TYPE;

export const columns = ({
  refresh,
  navigate,
}: {
  navigate: NavigateFunction;
  refresh: TableContext['refresh'];
}): TableRenderProps<
  ComputationData & { dataStatus_name: string; rollbackBtnFlag: boolean }
>['columns'] => {
  return [
    {
      title: I18N.eca.accountingName,
      dataIndex: 'computationName',
      width: 180,
    },
    {
      title: I18N.carbonData.affiliatedOrganization,
      dataIndex: 'orgName',
      width: 180,
    },
    {
      title: I18N.carbonData.accountingYear,
      dataIndex: 'year',
      width: 160,
    },

    {
      title: I18N.eca.dataCollection,
      dataIndex: 'dateRange',
      width: 180,

      render: text => {
        return text || '-';
      },
    },
    {
      title: I18N.carbonData.emissionsTC,
      dataIndex: 'carbonEmission',
      width: 120,

      // render: text => {
      //   return text ? formatNumber(text) : '-';
      // },
    },
    {
      title: I18N.supplyChainCarbonManagement.gwpVersion,
      dataIndex: 'gwpVersion_name',
      width: 120,

      // render: text => {
      //   return text ? formatNumber(text) : '-';
      // },
    },
    {
      title: I18N.Factors.state,
      dataIndex: 'dataStatus',
      width: 180,
      render: (
        value: keyof typeof fillDataColor,
        record: { dataStatus_name: string },
      ) => {
        return (
          <CustomTag
            color={fillDataColor[value]}
            text={record?.dataStatus_name || '-'}
          />
        );
      },
    },
    {
      title: I18N.Factors.updatedBy,
      dataIndex: 'updateByName',
      width: 180,
    },
    {
      title: I18N.Factors.updateTime,
      dataIndex: 'updateTime',
      width: 180,
    },
    // {
    //   title: I18N.eca.submissionTime,
    //   dataIndex: 'submitTime',
    //   width: 180,
    // },
    {
      title: I18N.Factors.operation,
      width: 260,
      dataIndex: 'computationId',
      render(id, record) {
        // 0 待填报 1 填报中 2 已填报 3 已撤回 4 审核中 5 审核通过 6 审核不通过
        // 填报 【0 ，1，2，3，6】
        // 提交 【2，3，6】
        // 撤回 【4，5】
        return (
          <TableActions
            menus={compact([
              [0, 1, 2, 3, 7].includes(Number(record.dataStatus)) &&
                checkAuth('/fillDataInfo/Add', {
                  label: I18N.eca.fillInTheReport,
                  key: I18N.eca.fillInTheReport,
                  onClick: async () => {
                    navigate(
                      virtualLinkTransform(
                        EcaRouteMaps.fillDataInfo,
                        [PAGE_TYPE_VAR, ':id', ':approvalId'],
                        [PageTypeInfo.edit, record?.computationId, record?.id],
                      ),
                    );
                  },
                }),

              [2, 3, 7].includes(Number(record.dataStatus)) &&
                checkAuth('/fillDataInfo/Submit', {
                  label: I18N.dashborad.submit,
                  key: I18N.dashborad.submit,
                  onClick: async () => {
                    /** 查询审批配置 */
                    const { data } = await getAuditConfig({
                      orgId: Number(record?.orgId || 0),
                    });
                    const { auditRequired, nodeList } = data?.data || {};
                    modal.confirm({
                      title: I18N.Factors.prompt,
                      icon: '',
                      content:
                        /** 不需要审批 则展示弹窗提示 否则展示审批路程 */
                        auditRequired === NOT_REQUIRED ? (
                          <span>
                            {I18N.eca.confirmSubmissionOfThis}
                            {record?.orgName}：
                            <span className='modal_text'>
                              {record?.dateRange}？
                            </span>
                          </span>
                        ) : (
                          <AuditConfigTable dataSource={nodeList} />
                        ),
                      ...returnNoIconModalStyle,
                      onOk: () => {
                        return postComputationDataSubmit({
                          req: { id: Number(record?.id || 0) },
                        }).then(() => {
                          Toast('success', I18N.eca.submittedSuccessfully);
                          refresh?.();
                        });
                      },
                      okText: I18N.utils.ok,
                      cancelText: I18N.Factors.cancel,
                    });
                  },
                }),

              [4, 6, 5, 8].includes(Number(record.dataStatus)) &&
                checkAuth('/fillDataInfo/Reject', {
                  label: I18N.eca.withdraw,
                  key: I18N.eca.withdraw,
                  onClick: async () => {
                    modal.confirm({
                      title: I18N.Factors.prompt,
                      ...returnNoIconModalStyle,
                      content: I18N.eca.confirmWithdrawalOfThe,
                      onOk: () => {
                        return postComputationDataRollback({
                          req: { id: Number(record?.id || 0) },
                        }).then(({ data }) => {
                          if (data.code === 200) {
                            Toast('success', I18N.eca.recallSuccessful);
                            refresh?.();
                          }
                        });
                      },
                      okText: I18N.utils.ok,
                      cancelText: I18N.Factors.cancel,
                    });
                  },
                }),
              checkAuth('/fillDataInfo/Show', {
                label: I18N.Factors.check,
                key: I18N.Factors.check,
                onClick: async () => {
                  navigate(
                    virtualLinkTransform(
                      EcaRouteMaps.fillDataInfo,
                      [PAGE_TYPE_VAR, ':id', ':approvalId'],
                      [PageTypeInfo.show, id, record?.id],
                    ),
                  );
                },
              }),
            ])}
          />
        );
      },
    },
  ];
};

export const SearchSchema = (): SearchProps<any>['schema'] => {
  const orgs = UseOrgs();
  const DataStatusArr = ComputationEnums('DataStatus');
  return {
    type: 'object',
    properties: {
      computationName: xRenderSeachSchema({
        required: false,
        type: 'string',
        placeholder: I18N.eca.accountingName,
        widget: 'input',
      }),
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
        type: 'string',
        placeholder: I18N.carbonData.accountingYear,
        enum: publishYear().map(item => `${item}`),
        widget: 'select',
        props: {
          allowClear: true,
        },
      }),
      dataStatus: xRenderSeachSchema({
        type: 'string',
        placeholder: I18N.Factors.state,
        enum: DataStatusArr?.map(org => `${org?.value}` as string),
        enumNames: DataStatusArr?.map(org => org?.label as string),
        widget: 'select',
        props: {
          allowClear: true,
        },
        // props: {
        //   showSearch: true,
        //   filterOption: (input: string, option: any) =>
        //     (option?.label ?? '').toLowerCase().includes(input.toLowerCase()),
        // },
      }),
    },
  };
};
