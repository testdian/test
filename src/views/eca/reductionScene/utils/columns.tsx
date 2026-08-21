/*
 * @@description:
 * @Date: 2023-01-09 19:44:27
 * @LastEditors: ljh255 jinhai@carbonstop.net
 * @LastEditTime: 2023-04-21 18:26:25
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
// import {
//   POST635fbc82fb3023a78974b0d031d469b6,
//   Role,
// } from '@/sdks/systemV2ApiDocs';
import { checkAuth } from '@/layout/utills';
import { EcaRouteMaps } from '@/router/utils/ecaEmums';
import {
  PAGE_TYPE_VAR,
  PageTypeInfo,
  virtualLinkTransform,
} from '@/router/utils/enums';
import {
  ReductionScene,
  postComputationReductionSceneDelete,
} from '@/sdks/computation/computationV2ApiDocs';
import { modal } from '@/store/module/notification';
import { Toast, returnDelModalStyle, returnNoIconModalStyle } from '@/utils';

import { useOrganizationSelect } from '../../hooks/useOrganizationSelect';

export const columns = ({
  pageTypeInfo,
  refresh,
  navigate,
  reportId,
  chooseType,
}: {
  pageTypeInfo?: PageTypeInfo;
  navigate: NavigateFunction;
  refresh: TableContext['refresh'];
  chooseScreen?: string;
  reportId?: string;
  chooseType?: string;
}): TableRenderProps<ReductionScene>['columns'] => [
  {
    title: I18N.carbonData.affiliatedOrganization,
    dataIndex: 'orgName',
    fixed: 'left',
  },
  {
    title: I18N.eca.emissionReductionScenarioName,
    dataIndex: 'sceneName',
  },
  {
    title: I18N.eca.totalEmissionReduction,
    dataIndex: 'totalCarbonEmission',
  },
  {
    title: I18N.eca.unitEmissionReduction,
    dataIndex: 'unitCarbonEmission',
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
    fixed: 'right',
    render(id, record) {
      return (
        <TableActions
          menus={compact([
            window.location.pathname.indexOf('/ecaReport/reductionScene') >=
              0 &&
              checkAuth('/reductionScene/edit', {
                label: I18N.Factors.edit,
                key: I18N.Factors.edit,
                onClick: async () => {
                  navigate(
                    virtualLinkTransform(
                      EcaRouteMaps.reductionSceneInfo,
                      [PAGE_TYPE_VAR, ':id'],
                      [PageTypeInfo.edit, id],
                    ),
                  );
                },
              }),

            window.location.pathname.indexOf('/ecaReport/reductionScene') >=
              0 &&
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
                        {I18N.eca.confirmDeletionOfThis9}
                        <span className='modal_text'>{record?.sceneName}</span>
                      </span>
                    ),
                    onOk: () => {
                      return postComputationReductionSceneDelete({
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
                if (
                  window.location.pathname.indexOf(
                    '/carbonAccounting/accountingReport/',
                  ) >= 0
                ) {
                  navigate(
                    virtualLinkTransform(
                      EcaRouteMaps.accountingReportInfoChooseScreenDetail,
                      [
                        PAGE_TYPE_VAR,
                        ':chooseType',
                        ':id',
                        ':serenPageTypeInfo',
                        ':sercenId',
                      ],
                      [
                        pageTypeInfo,
                        chooseType,
                        reportId,
                        PageTypeInfo.show,
                        record?.id,
                      ],
                    ),
                  );
                  return;
                }
                navigate(
                  virtualLinkTransform(
                    EcaRouteMaps.reductionSceneInfo,
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
