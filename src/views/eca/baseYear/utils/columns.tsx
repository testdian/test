/*
 * @@description:
 * @Date: 2023-01-09 19:44:27
 * @LastEditors: ljh255 jinhai@carbonstop.net
 * @LastEditTime: 2023-04-18 15:22:46
 */

import I18N from '@src/lang/I18N';
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
import {
  PAGE_TYPE_VAR,
  PageTypeInfo,
  virtualLinkTransform,
} from '@/router/utils/enums';
import {
  EmissionStandard,
  postComputationEmissionStandardDelete,
} from '@/sdks/computation/computationV2ApiDocs';
import { modal } from '@/store/module/notification';
import { Toast, returnDelModalStyle, returnNoIconModalStyle } from '@/utils';

import { UseOrgs } from '../../hooks';

export const columns = ({
  refresh,
  navigate,
}: {
  navigate: NavigateFunction;
  refresh: TableContext['refresh'];
}): TableRenderProps<EmissionStandard>['columns'] => [
  {
    title: I18N.eca.baseYear3,
    dataIndex: 'startYear',
    render: (value, record) => {
      return Number(record?.settingType) === 1
        ? value.toString()
        : `${value}-${record.endYear}`;
    },
  },
  {
    title: I18N.eca.benchmarkEmissions,
    dataIndex: 'standardEmission',
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
    width: 240,
    dataIndex: 'id',
    render(id, record) {
      return (
        <TableActions
          menus={compact([
            checkAuth('/baseYear/edit', {
              label: I18N.Factors.edit,
              key: I18N.Factors.edit,
              onClick: async () => {
                navigate(
                  virtualLinkTransform(
                    EcaRouteMaps.baseYearInfo,
                    [PAGE_TYPE_VAR, ':id'],
                    [PageTypeInfo.edit, id],
                  ),
                );
              },
            }),

            checkAuth('/reductionScene/delete', {
              label: I18N.Factors.delete,
              key: I18N.Factors.delete,
              onClick: async () => {
                modal.confirm({
                  title: I18N.Factors.prompt,
                  ...returnNoIconModalStyle,
                  ...returnDelModalStyle,
                  content: (
                    <span>
                      {I18N.eca.confirmDeletionOfThis3}
                      <span className='modal_text'>{record?.orgName}</span>
                    </span>
                  ),
                  onOk: () => {
                    return postComputationEmissionStandardDelete({
                      req: { id },
                    }).then(({ data }) => {
                      if (data.code === 200) {
                        Toast('success', I18N.Factors.deleteSuccessful);
                        refresh?.();
                      }
                    });
                  },
                  okText: I18N.base.confirm,
                  cancelText: I18N.Factors.cancel,
                });
              },
            }),
            checkAuth('/reductionScene/show', {
              label: I18N.Factors.check,
              key: I18N.Factors.check,
              onClick: async () => {
                navigate(
                  virtualLinkTransform(
                    EcaRouteMaps.baseYearInfo,
                    [PAGE_TYPE_VAR, ':id'],
                    [PageTypeInfo.show, id],
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
export const SearchSchema = (): SearchProps<any>['schema'] => {
  const orgs = UseOrgs();
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
    },
  };
};
