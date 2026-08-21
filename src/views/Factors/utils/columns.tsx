import I18N from '@src/lang/I18N';
import { compact } from 'lodash-es';
import { NavigateFunction } from 'react-router-dom';
import { TableContext, TableRenderProps } from 'table-render/dist/src/types';

import { TableActions } from '@/components/Table/TableActions';
import { checkAuth } from '@/layout/utills';
import { EcaRouteMaps } from '@/router/utils/ecaEmums';
import { CustomTag } from '@/views/components/CustomTag';

import {
  PageTypeInfo,
  PAGE_TYPE_VAR,
  virtualLinkTransform,
} from '@/router/utils/enums';
import {
  DictEnumResp,
  Factor,
  postSystemFactorStatus,
} from '@/sdks/systemV2ApiDocs';
import { modal } from '@/store/module/notification';
import { modalText, returnNoIconModalStyle, Toast } from '@/utils';

/** 状态。0 启用 1 禁用 */
export const status = {
  0: I18N.Factors.enable,
  1: I18N.Factors.disabled,
};

export const columns = ({
  refresh,
  navigate,
  handelCheckDetail,
}: {
  navigate: NavigateFunction;
  refresh: TableContext['refresh'];
  handelCheckDetail: (id: string) => void;
  firstClassify?: DictEnumResp[];
  secondClassify?: DictEnumResp[];
}): TableRenderProps<Factor>['columns'] => [
  {
    title: I18N.Factors.factorName,
    dataIndex: 'name',
    fixed: 'left',
  },
  {
    title: I18N.Factors.factorValue1,
    dataIndex: 'factorValue',
    // render: value => {
    //   return formatNumber(value);
    // },
  },
  {
    title: I18N.Factors.unit,
    dataIndex: 'unit',
  },
  {
    title: I18N.Factors.yearOfPublication,
    dataIndex: 'year',
  },
  {
    title: I18N.Factors.publishingInstitution,
    dataIndex: 'institution',
  },
  {
    title: I18N.Factors.applicableScenarios,
    dataIndex: 'description',
  },
  {
    title: I18N.Factors.emissionSourceName,
    dataIndex: 'emissionSourceNames',
  },
  {
    title: I18N.Factors.state,
    dataIndex: 'status_name',
    render: (value, record) => {
      /** 0 - 启用 1 - 禁用 */
      const statusOptions = {
        0: 'green',
        1: 'red',
      };
      return (
        <CustomTag
          color={statusOptions[Number(record.status) as keyof typeof status]}
          text={(value as string) || '-'}
        />
      );
    },
  },
  {
    title: I18N.Factors.geographicalRepresentativeness,
    dataIndex: 'areaRepresent',
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
    dataIndex: 'content',
    fixed: 'right',
    width: 180,
    render(_, row) {
      return (
        <TableActions
          menus={compact([
            checkAuth('/factor/edit', {
              label: I18N.Factors.edit,
              key: I18N.Factors.edit,
              onClick: async () => {
                navigate(
                  virtualLinkTransform(
                    EcaRouteMaps.factorInfo,
                    [PAGE_TYPE_VAR, ':id'],
                    [PageTypeInfo.edit, row.id],
                  ),
                );
              },
            }),
            checkAuth('/factor/disabled', {
              label:
                Number(row.status) !== 0
                  ? I18N.Factors.enable
                  : I18N.Factors.disabled,
              key: I18N.Factors.disabled,
              onClick: async () => {
                modal.confirm({
                  title: I18N.Factors.prompt,
                  ...returnNoIconModalStyle,
                  icon: '',
                  content: (
                    <span>
                      {I18N.Factors.areYouSureYouWantTo}
                      {Number(row.status) !== 0
                        ? I18N.Factors.enable
                        : I18N.Factors.disabled}
                      {I18N.Factors.thisEmissionFactor}
                      <span className={modalText}>{row.name}？</span>
                    </span>
                  ),
                  onOk: () => {
                    return postSystemFactorStatus({
                      req: {
                        id: row.id,
                        status: Number(row.status) === 0 ? '1' : '0',
                      },
                    }).then(({ data }) => {
                      if (data.code === 200) {
                        Toast(
                          'success',
                          I18N.template(I18N.Factors.number, {
                            val1:
                              Number(row.status) !== 0
                                ? I18N.Factors.enable
                                : I18N.Factors.disabled,
                          }),
                        );
                        refresh?.();
                      }
                    });
                  },
                  okText: I18N.utils.ok,
                  cancelText: I18N.Factors.cancel,
                });
              },
            }),
            checkAuth('/factor/show', {
              label: I18N.Factors.check,
              key: I18N.Factors.check,
              onClick: async () => {
                handelCheckDetail(`${row.id}`);
              },
            }),
          ])}
        />
      );
    },
  },
];
