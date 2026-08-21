/*
 * @@description: 选择减排场景
 */

import I18N from '@src/lang/I18N';
import { compact } from 'lodash-es';
import { SearchProps, TableRenderProps } from 'table-render/dist/src/types';

import { TableActions } from '@/components/Table/TableActions';
import { xRenderSeachSchema } from '@/components/x-render/TableRender/utils/xRender';
import { checkAuth } from '@/layout/utills';
import { ReductionScene } from '@/sdks/computation/computationV2ApiDocs';
import { useOrganizationSelect } from '@/views/eca/hooks/useOrganizationSelect';

export const chooseReductionColumns = (
  checkDetail: (id: string) => void,
): TableRenderProps<ReductionScene>['columns'] => [
  {
    title: I18N.carbonData.affiliatedOrganization,
    dataIndex: 'orgName',
    ellipsis: true,
  },
  {
    title: I18N.eca.emissionReductionScenarioName,
    dataIndex: 'sceneName',
    ellipsis: true,
  },
  {
    title: I18N.eca.totalEmissionReduction,
    dataIndex: 'totalCarbonEmission',
    ellipsis: true,
  },
  {
    title: I18N.eca.unitEmissionReduction,
    dataIndex: 'unitCarbonEmission',
    ellipsis: true,
  },
  {
    title: I18N.Factors.updatedBy,
    dataIndex: 'updateByName',
    ellipsis: true,
  },
  {
    title: I18N.Factors.updateTime,
    dataIndex: 'updateTime',
    ellipsis: true,
  },
  {
    title: I18N.Factors.operation,
    width: 100,
    dataIndex: 'id',
    fixed: 'right',
    render(_, record) {
      return (
        <TableActions
          menus={compact([
            checkAuth('', {
              label: I18N.Factors.check,
              key: I18N.Factors.check,
              onClick: async () => {
                if (!record?.id) return;
                checkDetail(record?.id as unknown as string);
              },
            }),
          ])}
        />
      );
    },
  },
];
export const SearchSchema = (): SearchProps<any>['schema'] => {
  const { getSearchSchema } = useOrganizationSelect();
  return {
    type: 'object',
    properties: {
      likeSceneName: xRenderSeachSchema({
        type: 'string',
        placeholder: I18N.eca.emissionReductionScenarioName,
      }),
      orgId: xRenderSeachSchema({
        type: 'string',
        placeholder: I18N.carbonData.affiliatedOrganization,
        ...getSearchSchema(),
      }),
    },
  };
};
