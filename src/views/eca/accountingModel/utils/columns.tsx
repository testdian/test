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
import { PageTypeInfo, virtualLinkTransform } from '@/router/utils/enums';
import {
  Model,
  postComputationModelDelete,
} from '@/sdks/computation/computationV2ApiDocs';
import { modal } from '@/store/module/notification';
import { Toast } from '@/utils';

import { UseOrgs } from '../../hooks';

export const columns = ({
  refresh,
  navigate,
  editFn,
  copyFn,
}: {
  navigate: NavigateFunction;
  refresh: TableContext['refresh'];
  editFn?: (record: Model) => void;
  copyFn?: (record: Model) => void;
  showFn?: (record: Model) => void;
}): TableRenderProps<Model>['columns'] => [
  {
    title: I18N.carbonFootPrintLCA.modelName,
    dataIndex: 'modelName',
    // copyable: true,
  },
  {
    title: I18N.carbonData.affiliatedOrganization,
    dataIndex: 'orgName',
  },
  {
    title: I18N.eca.modelIntroduction2,
    dataIndex: 'intro',
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
    width: 360,
    dataIndex: 'id',
    render(id, record) {
      return (
        <TableActions
          menus={compact([
            checkAuth('/accountingModel/SourceInfo', {
              label: I18N.eca.emissionSourceManagement,
              key: I18N.eca.emissionSourceManagement,
              onClick: async () => {
                navigate(
                  virtualLinkTransform(
                    EcaRouteMaps.accountingModelEmissionSource,
                    [':pageTypeInfo', ':id'],
                    [PageTypeInfo.add, id],
                  ),
                );
              },
            }),

            checkAuth('/accountingModel/edit', {
              label: I18N.Factors.edit,
              key: I18N.Factors.edit,
              onClick: async () => {
                editFn?.(record);
              },
            }),
            checkAuth('/accountingModel/Copy', {
              label: I18N.carbonFootPrintLCA.copy,
              key: I18N.carbonFootPrintLCA.copy,
              onClick: async () => {
                copyFn?.(record);
              },
            }),
            checkAuth('/accountingModel/Del', {
              label: I18N.Factors.delete,
              key: I18N.Factors.delete,
              onClick: async () => {
                modal.confirm({
                  centered: true,
                  title: I18N.Factors.prompt,
                  okType: 'default',
                  okButtonProps: {
                    style: { background: '#ff6900', color: '#fff' },
                  },
                  closable: true,
                  okText: I18N.base.confirm,
                  cancelText: I18N.Factors.cancel,
                  content: (
                    <span>
                      {I18N.eca.confirmDeletionOfThis}
                      <span className='modal_text'>{record?.modelName}</span>
                    </span>
                  ),
                  onOk: () => {
                    return postComputationModelDelete({
                      req: { id },
                    }).then(({ data }) => {
                      if (data.code === 200) {
                        Toast('success', I18N.Factors.deleteSuccessful);
                        refresh?.();
                      }
                    });
                  },
                });
              },
            }),
            checkAuth('/accountingModel/show', {
              label: I18N.Factors.check,
              key: I18N.Factors.check,
              onClick: async () => {
                navigate(
                  virtualLinkTransform(
                    EcaRouteMaps.accountingModelEmissionSource,
                    [':pageTypeInfo', ':id'],
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
      likeModelName: xRenderSeachSchema({
        type: 'string',
        placeholder: I18N.carbonFootPrintLCA.modelName,
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
    },
  };
};
