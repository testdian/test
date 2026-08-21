/*
 * @@description:
 * @Author: qifeng qifeng@carbonstop.net
 * @Date: 2023-01-09 19:44:27
 * @LastEditors: ljh255 jinhai@carbonstop.net
 * @LastEditTime: 2023-04-13 10:26:18
 */

import I18N from '@src/lang/I18N';
import { Button, Switch } from 'antd';
import { compact } from 'lodash-es';
import { NavigateFunction } from 'react-router-dom';
import {
  SearchProps,
  TableContext,
  TableRenderProps,
} from 'table-render/dist/src/types';

// import { postDeleteComputationDeleteApi } from '@/api/compution';
import { getUpdateMainComputation } from '@/api/compution';
import { TableActions } from '@/components/Table/TableActions';
import { xRenderSeachSchema } from '@/components/x-render/TableRender/utils/xRender';
import { checkAuth } from '@/layout/utills';
import { CertifiCatioinReviewCenterMaps } from '@/router/utils/certificationReviewCenterEmums';
import { EcaRouteMaps } from '@/router/utils/ecaEmums';
import {
  PAGE_TYPE_VAR,
  PageTypeInfo,
  virtualLinkTransform,
} from '@/router/utils/enums';
import { Computation } from '@/sdks/Newcomputation/computationV2ApiDocs';
// import { postComputationComputationVerify } from '@/sdks_v2/new/computationV2ApiDocs';
import { publishYear } from '@/views/Factors/utils';

import { GwpListFn } from '../../emissionManage/hooks';
import { UseOrgs } from '../../hooks';

export const columns = ({
  navigate,
  showEmissionListFn,
  deleteModalFn,
  refresh,
  locale,
}: {
  navigate: NavigateFunction;
  showEmissionListFn: (record: Computation) => void;
  deleteModalFn: (id: string, record: Computation) => void;
  refresh: TableContext['refresh'];
  locale: 'en-US' | 'zh-CN';
}): TableRenderProps<Computation>['columns'] => {
  const controlWidth = {
    operation: {
      'en-US': 380,
      'zh-CN': 280,
    },
  };
  return [
    {
      title: I18N.eca.accountingName,
      dataIndex: 'computationName',
      fixed: 'left',
      width: 160,
    },
    {
      title: I18N.eca.accountingOrganization,
      dataIndex: 'orgName',
      fixed: 'left',
      width: 120,
    },
    {
      title: I18N.carbonData.accountingYear,
      dataIndex: 'year',
      width: 120,
    },
    {
      title: I18N.eca.totalEmissionsT,
      dataIndex: 'carbonEmission',
      width: 180,
      render: (text, record) => {
        return text ? (
          <Button
            type='link'
            onClick={() => {
              showEmissionListFn(record);
            }}
          >
            {text}
          </Button>
        ) : (
          '-'
        );
      },
    },
    {
      title: I18N.eca.dataCollectionWeek,
      dataIndex: 'dataPeriod_name',
      width: 120,
    },
    {
      title: I18N.supplyChainCarbonManagement.gwpVersion,
      dataIndex: 'gwpVersion_name',
      width: 120,
    },
    {
      title: I18N.Factors.updatedBy,
      dataIndex: 'updateByName',
      width: 120,
    },
    {
      title: I18N.Factors.updateTime,
      dataIndex: 'updateTime',
      width: 200,
    },
    {
      title: I18N.Factors.operation,
      dataIndex: 'computationId',
      fixed: 'right',
      width: controlWidth?.operation?.[locale || 'zh-CN'],
      render(id, record) {
        return (
          <TableActions
            menus={compact([
              checkAuth('/carbonMissionAccounting/InfoSource', {
                label: I18N.eca.emissionSourceManagement,
                key: I18N.eca.emissionSourceManagement,
                onClick: async () => {
                  navigate(
                    virtualLinkTransform(
                      EcaRouteMaps.carbonMissionAccountingSourceInfo,
                      [PAGE_TYPE_VAR, ':id'],
                      [PageTypeInfo.add, record.id],
                    ),
                  );
                },
              }),
              checkAuth('/carbonMissionAccountingInfo/Edit', {
                label: I18N.Factors.edit,
                key: I18N.Factors.edit,
                onClick: async () => {
                  navigate(
                    virtualLinkTransform(
                      EcaRouteMaps.carbonMissionAccountingInfo,
                      [PAGE_TYPE_VAR, ':id'],
                      [PageTypeInfo.edit, record.id],
                    ),
                  );
                },
              }),

              checkAuth('/carbonMissionAccountingInfo/Del', {
                label: I18N.Factors.delete,
                key: I18N.Factors.delete,
                onClick: async () => {
                  /** 校验是否被核算报告引用 */
                  deleteModalFn(id, record);
                },
              }),
              checkAuth('/carbonMissionAccountingInfo/Show', {
                label: I18N.Factors.check,
                key: I18N.Factors.check,
                onClick: async () => {
                  navigate(
                    virtualLinkTransform(
                      EcaRouteMaps.carbonMissionAccountingInfo,
                      [PAGE_TYPE_VAR, ':id'],
                      [PageTypeInfo.show, record.id],
                    ),
                  );
                },
              }),
            ])}
          />
        );
      },
    },
    {
      title: I18N.eca.Datadashboarddisplay,
      dataIndex: 'mainComputation',
      width: 120,
      fixed: 'right',
      render: (value, row) => {
        console.log(Number(value) === 1, '1212', value);
        return (
          <Switch
            checked={Number(value) === 1}
            onChange={async checked => {
              console.log(checked, row);
              if (checked) {
                await getUpdateMainComputation({ id: Number(row.id) });
                refresh?.();
              }
            }}
          />
        );
      },
    },
  ];
};
export const chooseCarbonMissionColumns = ({
  showEmissionListFn,
  pageTypeInfo,
  id,
}: {
  navigate?: NavigateFunction;
  showEmissionListFn: (record: Computation) => void;
  pageTypeInfo?: string;
  id?: string;
}): TableRenderProps<Computation>['columns'] => [
  {
    title: I18N.eca.accountingOrganization,
    dataIndex: 'orgName',
    fixed: 'left',
  },
  {
    title: I18N.carbonData.accountingYear,
    dataIndex: 'year',
  },
  {
    title: I18N.eca.totalEmissionsT,
    dataIndex: 'carbonEmission',
    render: (text, record) => {
      return text ? (
        <Button
          type='link'
          onClick={() => {
            showEmissionListFn(record);
          }}
        >
          {text}
        </Button>
      ) : (
        '-'
      );
    },
  },
  {
    title: I18N.eca.dataCollectionWeek,
    dataIndex: 'dataPeriod_name',
  },
  {
    title: I18N.supplyChainCarbonManagement.gwpVersion,
    dataIndex: 'gwpVersion_name',
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
    fixed: 'right',
    width: 180,
    render(CarbonMissionId) {
      return (
        <TableActions
          menus={compact([
            checkAuth('/carbonMissionAccountingInfo/Show', {
              label: I18N.Factors.check,
              key: I18N.Factors.check,
              onClick: async () => {
                const url = virtualLinkTransform(
                  CertifiCatioinReviewCenterMaps.certificationReviewCenterEcaInfoChooseCarbonMissionInfo,
                  [
                    PAGE_TYPE_VAR,
                    ':id',
                    ':CarbonMissionPageInfo',
                    ':CarbonMissionId',
                  ],
                  [
                    pageTypeInfo || PageTypeInfo.show,
                    id || 0,
                    PageTypeInfo.show,
                    CarbonMissionId,
                  ],
                );
                window.open(url);
              },
            }),
          ])}
        />
      );
    },
  },
];
export const SearchSchema = (): SearchProps<any>['schema'] => {
  const orgs = UseOrgs();
  const gwpDataSource = GwpListFn();

  return {
    type: 'object',
    properties: {
      computationName: xRenderSeachSchema({
        required: false,
        type: 'string',
        placeholder: I18N.eca.accountingName,
        widget: 'Input',
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
      gwpVersion: xRenderSeachSchema({
        required: false,
        type: 'string',
        placeholder: I18N.supplyChainCarbonManagement.gwpVersion,
        widget: 'select',
        enum: gwpDataSource?.map(
          (org: { dictValue: string }) => `${org?.dictValue}` as string,
        ),
        enumNames: gwpDataSource?.map(
          (org: { dictLabel: string }) => org?.dictLabel as string,
        ),
        props: {
          allowClear: true,
          showSearch: true,
          filterOption: (input: string, option: any) =>
            (option?.label ?? '').toLowerCase().includes(input.toLowerCase()),
        },
      }),
    },
  };
};
